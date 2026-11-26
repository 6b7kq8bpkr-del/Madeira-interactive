import copy
import datetime as dt
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SRC = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('finder', SRC.parent / 'uco/tools/deal_finder.py')
finder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(finder)
PRODUCTION_CONFIG = finder.read(SRC / 'data/wyszukiwarka.json')
CONFIG = copy.deepcopy(PRODUCTION_CONFIG)
CONFIG['serpapi']['enabled'] = True  # exclusively for fake providers below
PROGRAM = finder.read(SRC / 'data/program.json')
NOW = dt.datetime(2026, 11, 26, 10, tzinfo=finder.WARSAW)
RSS = {'sprawdzono': NOW.isoformat(), 'stan': 'czesciowy', 'kanaly': [{'zrodlo':'Test', 'ok':False}], 'trafienia':[]}


def response(origin, dest, day, price, token=None):
    arrival = '2027-11-06 12:00' if dest=='MDZ' else day + ' 14:00' if origin=='MDZ' else day + ' 23:00'
    departure = day + (' 10:00' if origin=='MDZ' else ' 20:00')
    row = {'price': price, 'total_duration': 120, 'flights':[{'departure_airport':{'id':origin, 'time':departure}, 'arrival_airport':{'id':dest, 'time':arrival}, 'airline':'TEST', 'flight_number':'TEST 1'}]}
    if token:
        row['departure_token'] = token
    return {'search_parameters':{'adults':2, 'currency':'PLN'}, 'best_flights':[row]}


class Tests(unittest.TestCase):
    def setUp(self):
        no_network = patch.object(finder.urllib.request, 'urlopen', side_effect=AssertionError('Offline suite: network forbidden'))
        no_network.start()
        self.addCleanup(no_network.stop)

    def test_plan_keeps_stopover_and_two_people(self):
        plan = finder.build_plan(PROGRAM)
        self.assertEqual(len({q['id'] for q in plan}), len(plan))
        for q in plan:
            self.assertIn('/2adults', q['kayak'])
            if q['scenariusz'] == 'stopover':
                self.assertEqual([l['data'] for l in q['odcinki']][1:], ['2027-11-12','2027-11-13'])
        self.assertEqual(len(plan), 2)
        self.assertTrue(all(q['wspolnaOferta'] and q['odcinki'][0]['z']=='WAW' and q['odcinki'][-1]['do']=='WAW' for q in plan))

    def test_earlier_departure_and_return_times_are_sent(self):
        q = next(q for q in finder.build_plan(PROGRAM) if q['id']=='calosc-2027-11-04')
        p = finder.parameters(q, PROGRAM['loty']['monitoring']['reguly'])
        legs = json.loads(p['multi_city_json'])
        self.assertEqual(legs[0]['times'], '20,23')
        self.assertEqual(legs[1]['times'], '0,23,0,15')
        self.assertEqual(legs[2]['times'], '18,23')
        self.assertEqual(legs[1]['arrival_id'], 'AEP,EZE')
        self.assertEqual(legs[2]['departure_id'], 'AEP,EZE')
        self.assertEqual(p['adults'], 2)
        self.assertNotIn('outbound_date', p)

    def test_no_credentials_in_public_urls(self):
        self.assertEqual(finder.public_url('javascript:alert(1)'), '')
        self.assertEqual(finder.public_url('https://user:pass@example.com'), '')
        self.assertEqual(finder.public_url('https://serpapi.com/searches/secret.json'), '')
        self.assertEqual(finder.public_url('https://example.com/?api_key=secret&email=x&f=8'), 'https://example.com/?f=8')

    def test_reverse_direction_not_prioritised(self):
        base={'tytul':'Desde Buenos Aires a Madrid - noviembre 2027', 'data':'2026-11-26', 'url':'https://example.com/promo'}
        x=finder.classify(base,NOW)
        self.assertTrue(x['odwrotny'])
        self.assertEqual(x['status'], 'trop')
        self.assertLess(x['priorytet'],40)

    def test_duplicate_and_stale_read_keeps_original_time(self):
        article={'tytul':'Mendoza 2027', 'data':'2026-11-25', 'url':'https://example.com/a?utm_source=one'}
        one=finder.merge_leads([], [article, dict(article,url='https://example.com/a?utm_source=two')], NOW,CONFIG)
        self.assertEqual(len(one),1)
        later=finder.merge_leads(one, [], NOW+dt.timedelta(days=2),CONFIG)
        self.assertEqual(later[0]['ostatniOdczyt'], NOW.isoformat())

    def test_deal_ranks_ahead_of_airport_news(self):
        common={'data':'2026-11-26', 'url':'https://example.com/a'}
        deal=finder.classify(dict(common,tytul='Flights Madrid to Sao Paulo for €587'),NOW)
        news=finder.classify(dict(common,tytul='Ezeiza inauguró una nueva terminal para courier'),NOW)
        self.assertEqual(deal['rodzaj'],'oferta')
        self.assertEqual(news['rodzaj'],'informacja')
        self.assertGreater(deal['priorytet'],news['priorytet'])
        reverse=finder.classify(dict(common,tytul='Black Friday: vuelos a Madrid desde Córdoba por U$D 920'),NOW)
        self.assertTrue(reverse['odwrotny'])
        self.assertLess(reverse['priorytet'],deal['priorytet'])

    def test_provider_error_does_not_expose_key(self):
        quota=finder.Quota({},CONFIG['serpapi'],NOW)
        client=finder.SerpApi('TEST_ONLY_SECRET',quota)
        error=finder.urllib.error.HTTPError('https://serpapi.com/search.json?api_key=TEST_ONLY_SECRET',401,'TEST_ONLY_SECRET',{},None)
        with patch.object(finder.urllib.request,'urlopen',side_effect=error):
            with self.assertRaises(finder.ProviderError) as caught:
                client.search({'engine':'google_flights'})
        self.assertNotIn('TEST_ONLY_SECRET',str(caught.exception))
        self.assertEqual(quota.state['dzienZapytania'],1)

    def test_missing_key_never_calls_price_provider(self):
        with tempfile.TemporaryDirectory() as d:
            with patch.object(finder, 'SerpApi', side_effect=AssertionError('no network')):
                state=finder.collect(Path(d)/'out.json', CONFIG, PROGRAM, rss_result=RSS, now=NOW)
            self.assertEqual(state['ceny']['status'],'wymaga podłączenia')
            self.assertEqual(state['wyceny'],[])
            self.assertEqual(state['limity']['miesiacZapytania'],0)

    def test_daily_monthly_and_run_caps(self):
        q=finder.Quota({},CONFIG['serpapi'],NOW)
        for _ in range(4): q.charge()
        self.assertFalse(q.available())
        with self.assertRaises(finder.ProviderError): q.charge()
        old=dict(q.state,dzienZapytania=7)
        self.assertFalse(finder.Quota(old,CONFIG['serpapi'],NOW).available())
        tomorrow=NOW+dt.timedelta(days=1)
        self.assertTrue(finder.Quota(old,CONFIG['serpapi'],tomorrow).available())
        old['miesiacZapytania']=210
        self.assertFalse(finder.Quota(old,CONFIG['serpapi'],tomorrow).available())

    def test_every_slice_is_selected_and_price_not_multiplied(self):
        q=finder.build_plan(PROGRAM)[0]
        replies=[response('WAW','MDZ','2027-11-05',8000,'first'),response('MDZ','AEP','2027-11-12',8200,'second'),response('EZE','WAW','2027-11-13',8500)]
        selected=[finder.route_from(r['best_flights'][0]) for r in replies]
        replies[-1]['best_flights'][0]['booking_token']='booking-final'
        replies.append({'search_parameters':{'adults':2,'currency':'PLN'},
                        'selected_flights':[r['best_flights'][0] for r in replies],
                        'booking_options':[{'together':{'airline':True,'book_with':'TEST','price':8400}}]})
        calls=[]
        class Fake:
            def search(self,p): calls.append(dict(p)); return replies.pop(0)
        result=finder.quote(q,PROGRAM['loty']['monitoring']['reguly'],Fake(),NOW)
        self.assertEqual(result['cenaWyniku'],8400)
        self.assertEqual(calls[3]['booking_token'],'booking-final')
        self.assertNotIn('departure_token',calls[3])
        self.assertTrue(result['wspolnaOferta']['wspolnaOfertaLinii'])
        self.assertEqual(calls[2]['departure_token'],'second')
        self.assertEqual(len(result['trasy']),3)
        self.assertEqual(result['stopoverGodziny'],30)
        self.assertFalse(result['bagazPotwierdzony'])
        self.assertFalse(result['kompletPodrozy'])
        self.assertFalse(result['potwierdzonaULinii'])

    def test_joint_booking_rejects_partial_separate_and_agency_options(self):
        row=response('MDZ','AEP','2027-11-12',500)['best_flights'][0]
        selected=[finder.route_from(row)]
        response_data={'selected_flights':[row],'booking_options':[]}
        for option in [
            {'separate_tickets':True,'together':{'airline':True,'book_with':'TEST','price':500}},
            {'together':{'book_with':'Agency','price':500}},
            {'departing':{'price':200},'returning':{'price':300}},
            {'together':{'airline':True,'book_with':'TEST','price':500,'extensions':['Self-transfer tickets']}},
        ]:
            with self.subTest(option=option):
                response_data['booking_options']=[option]
                with self.assertRaises(finder.ProviderError): finder.joint_booking(response_data,selected)
        response_data['booking_options']=[{'together':{'airline':True,'book_with':'TEST','price':500}}]
        response_data['selected_flights']=[]
        with self.assertRaises(finder.ProviderError): finder.joint_booking(response_data,selected)

    def test_single_ticket_reserves_booking_request_and_economy_only(self):
        query=finder.build_plan(PROGRAM)[0]
        self.assertEqual(finder.request_cost(query),4)
        row=response('WAW','MDZ','2027-11-05',10000)['best_flights'][0]
        row['flights'][0]['travel_class']='Business'
        self.assertFalse(finder.usable(row,query['odcinki'][0],PROGRAM['loty']['monitoring']['reguly']))
        old={'limity':dict(finder.Quota({},CONFIG['serpapi'],NOW).state,dzienZapytania=4,miesiacZapytania=4)}
        opened=copy.deepcopy(CONFIG)
        opened['serpapi']['kalendarzPotwierdzonyDo']='2027-11-14'
        opened_program=copy.deepcopy(PROGRAM)
        with tempfile.TemporaryDirectory() as d:
            class Fake:
                def __init__(self,*a): pass
                def search(self,params):
                    raise AssertionError('Brak czterech zapytań: nie wolno zaczynać wyceny')
            with patch.object(finder,'build_plan',return_value=[query]):
                state=finder.collect(Path(d)/'out.json',opened,opened_program,old,RSS,'FAKE',NOW,client_factory=Fake)
            self.assertEqual(state['limity']['dzienZapytania'],4)
            self.assertEqual(state['wyceny'],[])

    def test_single_ticket_diagnostic_has_hard_four_request_budget(self):
        class Fake:
            def __init__(self,key,quota,checkpoint): self.quota,self.checkpoint=quota,checkpoint
            def search(self,p):
                self.quota.charge(); self.checkpoint()
                raise finder.ProviderError('syntetyczny brak wyników')
        old={'limity':dict(finder.Quota({},CONFIG['serpapi'],NOW).state,dzienZapytania=11,miesiacZapytania=11)}
        with tempfile.TemporaryDirectory() as d:
            result=finder.test_prices(Path(d)/'out.json',CONFIG,PROGRAM,old,'FAKE',NOW,Path(d)/'quota.json',Fake,route='single-mad',request_budget=4)
            self.assertEqual(result['zapytaniaTestu'],1)
            self.assertEqual(result['limity']['dzienZapytania'],12)
            self.assertEqual(result['odcinki'][0],{'z':'MAD','do':'MDZ','data':'2027-05-07'})
            old['limity']['miesiacZapytania']=208
            blocked=finder.test_prices(Path(d)/'out.json',CONFIG,PROGRAM,old,'FAKE',NOW,Path(d)/'quota.json',lambda *a:self.fail('monthly cap'),route='single-mad',request_budget=4)
            self.assertEqual(blocked['zapytaniaTestu'],0)

    def test_rejected_prefix_selects_next_candidate_without_extra_request(self):
        q=finder.build_plan(PROGRAM)[0]
        cheap=response('WAW','MDZ','2027-11-05',8000,'cheap')['best_flights'][0]
        next_choice=copy.deepcopy(cheap)
        next_choice['flights'][0]['departure_airport']['time']='2027-11-05 21:00'
        next_choice.update(price=8500,departure_token='next')
        q['pominSciezki']=[finder.path_id([finder.route_from(cheap)])]
        calls=[]
        class Fake:
            def search(self,p):
                calls.append(dict(p))
                if len(calls)==1:
                    return {'search_parameters':{'adults':2,'currency':'PLN'},'best_flights':[cheap,next_choice]}
                raise finder.ProviderError('brak wyników',empty_results=True)
        with self.assertRaises(finder.ProviderError) as caught:
            finder.quote(q,PROGRAM['loty']['monitoring']['reguly'],Fake(),NOW)
        self.assertEqual(calls[1]['departure_token'],'next')
        self.assertEqual(caught.exception.path_id,finder.path_id([finder.route_from(next_choice)]))

    def test_missing_token_does_not_create_partial_quote(self):
        class Fake:
            def search(self,p): return response('WAW','MDZ','2027-11-05',8000)
        with self.assertRaises(finder.ProviderError): finder.quote(finder.build_plan(PROGRAM)[0],PROGRAM['loty']['monitoring']['reguly'],Fake(),NOW)

    def test_bad_arrival_and_short_stopover_rejected(self):
        rules=PROGRAM['loty']['monitoring']['reguly']
        plan=finder.build_plan(PROGRAM)[0]
        x=response('WAW','MDZ','2027-11-05',8000)['best_flights'][0]
        x['flights'][0]['arrival_airport']['time']='2027-11-07 12:00'
        self.assertFalse(finder.usable(x,plan['odcinki'][0],rules))
        x=response('MDZ','AEP','2027-11-12',8000)['best_flights'][0]
        x['flights'][0]['arrival_airport']['time']='2027-11-12 23:00'
        self.assertFalse(finder.usable(x,plan['odcinki'][1],rules))

    def test_mismatched_origin_or_passenger_count_rejected(self):
        for origin, adults in [('AEP',2),('WAW',1)]:
            class Fake:
                def search(self,p):
                    x=response(origin,'MDZ','2027-11-05',8000,'token')
                    x['search_parameters']['adults']=adults
                    return x
            with self.assertRaises(finder.ProviderError): finder.quote(finder.build_plan(PROGRAM)[0],PROGRAM['loty']['monitoring']['reguly'],Fake(),NOW)

    def test_failure_keeps_previous_quote_and_counts_requests(self):
        class Fake:
            def __init__(self,key,quota,checkpoint): self.quota,self.checkpoint=quota,checkpoint
            def search(self,p):
                self.quota.charge(); self.checkpoint()
                raise finder.ProviderError('źródło zwróciło HTTP 429')
        old={'wyceny':[{'id':'old','sprawdzono':(NOW-dt.timedelta(days=1)).isoformat()}]}
        opened=copy.deepcopy(CONFIG)
        opened['serpapi']['kalendarzPotwierdzonyDo']='2027-11-14'
        with tempfile.TemporaryDirectory() as d:
            s=finder.collect(Path(d)/'out.json',opened,PROGRAM,old,RSS,'FAKE',NOW,Path(d)/'quota.json',Fake)
            self.assertEqual(s['wyceny'],old['wyceny'])
            self.assertEqual(s['limity']['dzienZapytania'],1)
            self.assertEqual(finder.read(Path(d)/'quota.json')['limity']['dzienZapytania'],1)
            self.assertEqual(s['ceny']['status'],'błąd źródła')

    def test_future_calendar_never_constructs_provider_or_charges(self):
        old={'limity':dict(finder.Quota({},CONFIG['serpapi'],NOW).state,dzienZapytania=4,miesiacZapytania=4)}
        with tempfile.TemporaryDirectory() as d:
            for date in (NOW,NOW+dt.timedelta(days=60)):
                s=finder.collect(Path(d)/'out.json',CONFIG,PROGRAM,old,RSS,'FAKE',date,
                                 client_factory=lambda *a: self.fail('API must stay blocked'))
                self.assertEqual(s['ceny']['status'],'oczekuje na kalendarz')
                self.assertTrue(all(q['status']=='oczekuje na kalendarz' for q in s['zapytania'].values()))
                self.assertNotIn('ostatniaProba',s['ceny'])
                self.assertEqual(s['limity'],finder.Quota(old['limity'],CONFIG['serpapi'],date).state)

    def test_calendar_requires_all_slices_and_explicit_evidence(self):
        q=finder.build_plan(PROGRAM)[0]
        config=copy.deepcopy(CONFIG)
        for boundary,allowed in [('2027-11-05',False),('2027-11-12',False),('2027-11-13',True),('invalid',False)]:
            config['serpapi']['kalendarzPotwierdzonyDo']=boundary
            self.assertEqual(finder.calendar_allows(q,config),allowed)
        del config['serpapi']['kalendarzPotwierdzonyDo']
        self.assertFalse(finder.calendar_allows(q,config))

    def test_real_price_diagnostic_is_isolated_and_counts_three_calls(self):
        calls=[]
        replies=[response('WAW','MDZ','2027-03-05',8000,'first'),response('MDZ','AEP','2027-03-12',8200,'second'),response('EZE','WAW','2027-03-13',8500)]
        replies[0]['best_flights'][0]['flights'][0]['arrival_airport']['time']='2027-03-06 12:00'
        class Fake:
            def __init__(self,key,quota,checkpoint): self.quota,self.checkpoint=quota,checkpoint
            def search(self,p):
                self.quota.charge(); self.checkpoint(); calls.append(dict(p)); return replies.pop(0)
        old={'limity':dict(finder.Quota({},CONFIG['serpapi'],NOW).state,dzienZapytania=4,miesiacZapytania=4),'wyceny':[]}
        with tempfile.TemporaryDirectory() as d:
            result=finder.test_prices(Path(d)/'test.json',CONFIG,PROGRAM,old,'FAKE',NOW,Path(d)/'quota.json',Fake)
            self.assertEqual(result['status'],'pobrano cenę')
            self.assertEqual(result['zapytaniaTestu'],3)
            self.assertEqual(result['wycena']['cenaWyniku'],8500)
            self.assertEqual(result['limity']['dzienZapytania'],7)
            self.assertEqual(finder.read(Path(d)/'quota.json')['limity']['miesiacZapytania'],7)
            self.assertEqual(old['wyceny'],[])
            self.assertEqual(PROGRAM['loty']['monitoring']['reguly']['wylot'],'2027-11-05')
            self.assertTrue(all('2027-03-' in p['multi_city_json'] and '2027-11-' not in p['multi_city_json'] for p in calls))

    def test_diagnostic_does_not_bypass_daily_limit(self):
        old={'limity':dict(finder.Quota({},CONFIG['serpapi'],NOW).state,dzienZapytania=5,miesiacZapytania=5)}
        with tempfile.TemporaryDirectory() as d:
            result=finder.test_prices(Path(d)/'test.json',CONFIG,PROGRAM,old,'FAKE',NOW,Path(d)/'quota.json',
                                     lambda *a: self.fail('No quota for full test'))
            self.assertEqual(result['zapytaniaTestu'],0)
            self.assertEqual(result['status'],'błąd')

    def test_domestic_diagnostic_uses_one_call_and_explicit_airports(self):
        class Fake:
            def __init__(self,key,quota,checkpoint): self.quota,self.checkpoint=quota,checkpoint
            def search(self,p):
                self.quota.charge(); self.checkpoint()
                self.params=p
                assert p['arrival_id']=='AEP,EZE' and p['type']==2
                return response('MDZ','AEP','2027-03-12',550)
        old={'limity':dict(finder.Quota({},CONFIG['serpapi'],NOW).state,dzienZapytania=5,miesiacZapytania=5)}
        with tempfile.TemporaryDirectory() as d:
            result=finder.test_prices(Path(d)/'test.json',CONFIG,PROGRAM,old,'FAKE',NOW,Path(d)/'quota.json',Fake,route='domestic')
            self.assertEqual(result['status'],'pobrano cenę')
            self.assertEqual(result['zapytaniaTestu'],1)
            self.assertEqual(result['wycena']['cenaWyniku'],550)

    def test_split_trip_sums_three_prices_without_selection_tokens(self):
        q=next(q for q in finder.build_plan(PROGRAM, legacy=True) if q.get('sposobWyceny')=='osobne')
        replies=[response('WAW','MDZ','2027-11-05',6000),response('MDZ','AEP','2027-11-12',800),response('EZE','WAW','2027-11-13',3500)]
        calls=[]
        class Fake:
            def search(self,p): calls.append(dict(p)); return replies.pop(0)
        result=finder.quote(q,PROGRAM['loty']['monitoring']['reguly'],Fake(),NOW)
        self.assertEqual(result['cenaWyniku'],10300)
        self.assertEqual(result['cenyOdcinkow'],[6000,800,3500])
        self.assertEqual(result['stopoverGodziny'],30)
        self.assertEqual(result['sposobWyceny'],'osobne')
        self.assertTrue(all(p['type']==2 and 'departure_token' not in p for p in calls))
        self.assertFalse(result['kompletPodrozy'])

    def test_manual_budget_preserves_monthly_cap_and_consumption(self):
        class Fake:
            def __init__(self,key,quota,checkpoint): self.quota,self.checkpoint=quota,checkpoint
            def search(self,p):
                self.quota.charge(); self.checkpoint()
                return response('MDZ','AEP','2027-03-12',550)
        old={'limity':dict(finder.Quota({},CONFIG['serpapi'],NOW).state,dzienZapytania=7,miesiacZapytania=209)}
        with tempfile.TemporaryDirectory() as d:
            result=finder.test_prices(Path(d)/'test.json',CONFIG,PROGRAM,old,'FAKE',NOW,Path(d)/'quota.json',Fake,route='domestic',extra_budget=2)
            self.assertEqual(result['status'],'pobrano cenę')
            self.assertEqual(result['limity']['dzienZapytania'],8)
            self.assertEqual(result['limity']['miesiacZapytania'],210)
            blocked=finder.test_prices(Path(d)/'test.json',CONFIG,PROGRAM,result,'FAKE',NOW,Path(d)/'quota.json',lambda *a:self.fail('Monthly limit'),route='domestic',extra_budget=2)
            self.assertEqual(blocked['zapytaniaTestu'],0)
            self.assertEqual(blocked['status'],'błąd')

    def test_connections_must_fit_travel_rules(self):
        rules=PROGRAM['loty']['monitoring']['reguly']
        q=finder.build_plan(PROGRAM)[0]
        x=response('WAW','MDZ','2027-11-05',8000)['best_flights'][0]
        first=copy.deepcopy(x['flights'][0]); first['arrival_airport']={'id':'GRU','time':'2027-11-06 05:00'}
        second=copy.deepcopy(x['flights'][0]); second['departure_airport']={'id':'GRU','time':'2027-11-06 08:00'}
        x['flights']=[first,second]
        for minutes,accepted in [(70,False),(175,True),(560,False)]:
            x['layovers']=[{'id':'GRU','duration':minutes}]
            self.assertEqual(finder.usable(x,q['odcinki'][0],rules),accepted)

    def test_disabled_api_blocks_normal_and_manual_even_with_key_and_open_calendar(self):
        config=copy.deepcopy(PRODUCTION_CONFIG)
        self.assertIs(config['serpapi']['enabled'],False)
        config['serpapi']['kalendarzPotwierdzonyDo']='2027-12-31'
        old={'limity':dict(finder.Quota({},CONFIG['serpapi'],NOW).state,dzienZapytania=15,miesiacZapytania=15)}
        def forbidden(*args): self.fail('Provider must not even be constructed')
        with tempfile.TemporaryDirectory() as d:
            normal=finder.collect(Path(d)/'out.json',config,PROGRAM,old,RSS,'DUMMY',NOW,client_factory=forbidden)
            self.assertEqual(normal['ceny']['status'],'wyłączone')
            self.assertEqual(normal['limity'],old['limity'])
            for route in ('trip','single-mad','domestic','split'):
                manual=finder.test_prices(Path(d)/'test.json',config,PROGRAM,old,'DUMMY',NOW,Path(d)/'quota.json',forbidden,route=route,request_budget=4)
                self.assertEqual(manual['zapytaniaTestu'],0)
                self.assertEqual(manual['limity'],old['limity'])

    def test_missing_layovers_or_duration_never_pass(self):
        q=finder.build_plan(PROGRAM)[0];rules=PROGRAM['loty']['monitoring']['reguly']
        row=response('WAW','MDZ','2027-11-05',8000)['best_flights'][0]
        row.pop('total_duration')
        self.assertFalse(finder.usable(row,q['odcinki'][0],rules))
        row['total_duration']=1000
        first=copy.deepcopy(row['flights'][0]);first['arrival_airport']={'id':'FRA','time':'2027-11-05 21:00'}
        second=copy.deepcopy(row['flights'][0]);second['departure_airport']={'id':'FRA','time':'2027-11-05 21:10'}
        row['flights']=[first,second]
        for layovers in (None,[],[{'id':'FRA','duration':10}],[{'id':'OTHER','duration':180}]):
            if layovers is not None:row['layovers']=layovers
            self.assertFalse(finder.usable(row,q['odcinki'][0],rules))

    def test_stop_after_search_deadline(self):
        with tempfile.TemporaryDirectory() as d:
            with patch.object(finder.rss,'scan',side_effect=AssertionError('no request')):
                s=finder.collect(Path(d)/'out.json',CONFIG,PROGRAM,now=NOW.replace(year=2027,month=9,day=1))
            self.assertEqual(s['ceny']['status'],'zakończony')


if __name__=='__main__': unittest.main()
