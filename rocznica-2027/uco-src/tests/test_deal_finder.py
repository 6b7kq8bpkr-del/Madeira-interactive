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
CONFIG = finder.read(SRC / 'data/wyszukiwarka.json')
PROGRAM = finder.read(SRC / 'data/program.json')
NOW = dt.datetime(2026, 11, 26, 10, tzinfo=finder.WARSAW)
RSS = {'sprawdzono': NOW.isoformat(), 'stan': 'czesciowy', 'kanaly': [{'zrodlo':'Test', 'ok':False}], 'trafienia':[]}


def response(origin, dest, day, price, token=None):
    arrival = '2027-11-06 12:00' if dest=='MDZ' else day + ' 14:00' if origin=='MDZ' else day + ' 23:00'
    departure = day + (' 10:00' if origin=='MDZ' else ' 20:00')
    row = {'price': price, 'flights':[{'departure_airport':{'id':origin, 'time':departure}, 'arrival_airport':{'id':dest, 'time':arrival}, 'airline':'TEST', 'flight_number':'TEST 1'}]}
    if token:
        row['departure_token'] = token
    return {'search_parameters':{'adults':2, 'currency':'PLN'}, 'best_flights':[row]}


class Tests(unittest.TestCase):
    def test_plan_keeps_stopover_and_two_people(self):
        plan = finder.build_plan(PROGRAM)
        self.assertEqual(len({q['id'] for q in plan}), len(plan))
        for q in plan:
            self.assertIn('/2adults', q['kayak'])
            if q['scenariusz'] == 'stopover':
                self.assertEqual([l['data'] for l in q['odcinki']][1:], ['2027-11-12','2027-11-13'])
        self.assertGreaterEqual(len(plan), 20)

    def test_earlier_departure_and_return_times_are_sent(self):
        q = next(q for q in finder.build_plan(PROGRAM) if q['id']=='calosc-2027-11-04')
        p = finder.parameters(q, PROGRAM['loty']['monitoring']['reguly'])
        legs = json.loads(p['multi_city_json'])
        self.assertEqual(legs[0]['times'], '20,23')
        self.assertEqual(legs[1]['times'], '0,23,0,15')
        self.assertEqual(legs[2]['times'], '18,23')
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
        calls=[]
        class Fake:
            def search(self,p): calls.append(dict(p)); return replies.pop(0)
        result=finder.quote(q,PROGRAM['loty']['monitoring']['reguly'],Fake(),NOW)
        self.assertEqual(result['cenaWyniku'],8500)
        self.assertEqual(calls[2]['departure_token'],'second')
        self.assertEqual(len(result['trasy']),3)
        self.assertFalse(result['kompletPodrozy'])
        self.assertFalse(result['potwierdzonaULinii'])

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
        with tempfile.TemporaryDirectory() as d:
            s=finder.collect(Path(d)/'out.json',CONFIG,PROGRAM,old,RSS,'FAKE',NOW,Path(d)/'quota.json',Fake)
            self.assertEqual(s['wyceny'],old['wyceny'])
            self.assertEqual(s['limity']['dzienZapytania'],1)
            self.assertEqual(finder.read(Path(d)/'quota.json')['limity']['dzienZapytania'],1)
            self.assertEqual(s['ceny']['status'],'błąd źródła')

    def test_stop_after_search_deadline(self):
        with tempfile.TemporaryDirectory() as d:
            with patch.object(finder.rss,'scan',side_effect=AssertionError('no request')):
                s=finder.collect(Path(d)/'out.json',CONFIG,PROGRAM,now=NOW.replace(year=2027,month=9,day=1))
            self.assertEqual(s['ceny']['status'],'zakończony')


if __name__=='__main__': unittest.main()
