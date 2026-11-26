#!/usr/bin/env python3
"""Publiczny skaner okazji. RSS bez konta; SerpApi tylko z kluczem w środowisku.
Nie rezerwuje, nie wysyła wiadomości i nigdy nie zmienia loty.json.oferty.
"""
import argparse
import copy
import datetime as dt
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import re
import tempfile
import unicodedata
import urllib.error
import urllib.request
from urllib.parse import urlencode, urlsplit, urlunsplit, parse_qsl
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SRC = ROOT.parent / 'uco-src'
WARSAW = ZoneInfo('Europe/Warsaw')
spec = importlib.util.spec_from_file_location('promo_rss', HERE / 'promo_rss.py')
rss = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rss)


def read(path, default=None):
    if not Path(path).exists():
        return default
    return json.loads(Path(path).read_text())


def atomic(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix='.' + path.name, dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as f:
            json.dump(value, f, ensure_ascii=False, indent=1)
            f.write('\n')
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def stamp(value):
    try:
        d = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
        return d if d.tzinfo else None
    except (TypeError, ValueError, AttributeError):
        return None


def public_url(value):
    """Żadnych kluczy, adresów e-mail ani linków do archiwum zapytań API."""
    if not isinstance(value, str):
        return ''
    try:
        p = urlsplit(value)
        if p.scheme not in ('http', 'https') or not p.hostname or p.username or p.password:
            return ''
        if p.hostname in ('serpapi.com', 'www.serpapi.com', 'localhost') or '@' in p.path:
            return ''
        q = [(k, v) for k, v in parse_qsl(p.query) if not re.search(r'key|token|email|auth|session|signature|utm_|click|subscriber', k, re.I)]
        if any('@' in v for _, v in q):
            return ''
        return urlunsplit((p.scheme, p.netloc, p.path, urlencode(q), ''))
    except ValueError:
        return ''


def ident(value):
    return hashlib.sha256(value.encode()).hexdigest()[:16]


def text(value, limit=240):
    return re.sub(r'\s+', ' ', str(value or '')).strip()[:limit]


def build_plan(program, legacy=False):
    r = program['loty']['monitoring']['reguly']
    plan = []

    def add(key, name, scenario, legs, missing, priority=2):
        query = ' / '.join(f'{a}-{b} {d}' for a, b, d in legs)
        parts = '/'.join(f'{a}-{b}/{d}' for a, b, d in legs)
        plan.append({'id': key, 'nazwa': name, 'scenariusz': scenario, 'odcinki': [dict(z=a, do=b, data=d) for a, b, d in legs],
                     'trasa': query, 'dorosli': 2, 'braki': missing, 'priorytet': priority,
                     'kayak': 'https://www.kayak.pl/flights/' + parts + '/2adults?sort=price_a',
                     'google': 'https://www.google.com/travel/flights?hl=pl&curr=PLN'})

    for day in (r['wylot'], r['wylotAlternatywny']):
        short = day[-2:] + '.11'
        add('calosc-' + day, 'Cała podróż z postojem - ' + short, 'stopover',
            [('WAW', 'MDZ', day), ('MDZ', 'BUE', r['buenosOd']), ('BUE', 'WAW', r['buenosDo'])],
            ['23 kg na każdym odcinku', 'wystawienie jednego chronionego biletu', 'hotel i transfery w Buenos Aires'], 0 if day == r['wylot'] else 1)
        add('calosc-osobne-' + day, 'Cała podróż - osobne bilety - ' + short, 'stopover',
            [('WAW', 'MDZ', day), ('MDZ', 'BUE', r['buenosOd']), ('BUE', 'WAW', r['buenosDo'])],
            ['osobne bilety: brak wspólnej ochrony całej podróży', '23 kg na każdym odcinku', 'hotel i transfery w Buenos Aires'], 1)
        plan[-1]['sposobWyceny'] = 'osobne'
        add('openjaw-' + day, 'Do Mendozy, powrót z Buenos Aires - ' + short, 'openjaw',
            [('WAW', 'MDZ', day), ('EZE', 'WAW', r['buenosDo'])], ['lot MDZ-BUE 12.11', 'bagaż i ochrona', 'porównanie ceny całości'], 1)
        add('eze-' + day, 'Atlantyk z Warszawy - ' + short, 'osobne',
            [('WAW', 'EZE', day), ('EZE', 'WAW', r['buenosDo'])], ['EZE-MDZ 6.11 i MDZ-BUE 12.11', 'bagaż, bufor i koszt całości'], 1)
    add('krajowe', 'Dwa odcinki krajowe', 'osobne',
        [('EZE', 'MDZ', r['mendoza']), ('MDZ', 'BUE', r['buenosOd'])], ['bagaż 23 kg', 'zgodność z lotem przez Atlantyk'], 1)
    add('mdz-bue', 'Mendoza do Buenos Aires 12.11', 'openjaw', [('MDZ', 'BUE', r['buenosOd'])], ['przylot do 15:59', 'bagaż 23 kg'], 1)
    add('mad-stopover', 'Chroniony bilet z Madrytu', 'mad',
        [('MAD', 'MDZ', r['wylot']), ('MDZ', 'BUE', r['buenosOd']), ('BUE', 'MAD', r['buenosDo'])],
        ['doloty WAW-MAD-WAW', 'noc przed Atlantykiem i bufory', 'bagaż i koszt całości'])
    add('mad-doloty', 'Doloty do Madrytu', 'mad', [('WAW', 'MAD', r['wylotAlternatywny']), ('MAD', 'WAW', r['powrot'])],
        ['wylot 4.11 po 20:00', 'noc i minimum 12 h przed Atlantykiem', 'powrót zgodny z przylotem z EZE'])
    for airport in ('MAD', 'VIE', 'BER', 'FCO', 'CDG', 'AMS', 'FRA', 'ZRH', 'IST'):
        scenario = 'mad' if airport == 'MAD' else 'vie' if airport in ('VIE', 'BER') else 'huby'
        add(airport.lower() + '-eze', airport + ' - Buenos Aires', scenario,
            [(airport, 'EZE', r['wylot']), ('EZE', airport, r['buenosDo'])],
            ['dojazd lub doloty z Polski i powrót do 14.11', 'loty krajowe, noclegi buforowe i bagaż', 'koszt całości i osobna decyzja dla planu B'], 3)
    for airport in ('SCL', 'GRU'):
        add(airport.lower() + '-openjaw', 'Przylot przez ' + airport + ', powrót z Buenos Aires', 'huby',
            [('WAW', airport, r['wylot']), ('EZE', 'WAW', r['buenosDo'])],
            [airport + '-MDZ z przylotem 6.11', 'MDZ-BUE 12.11', 'bagaż i odpowiednie bufory'], 3)
    for query in plan:
        if query['id'].startswith('calosc-2027') or query['id'] == 'mad-stopover':
            query['wspolnaOferta'] = True
    # Dawne trasy pozostają wyłącznie w izolowanych testach adaptera.
    if not legacy:
        plan = [q for q in plan if q['id'] in ('calosc-' + r['wylot'], 'calosc-' + r['wylotAlternatywny'])]
        for q in plan:
            q['braki'] = ['bagaż podręczny dla każdej osoby na każdym odcinku', 'jeden chroniony bilet WAW-MDZ-BUE-WAW', 'hotel i transfery w Buenos Aires']
    return plan


def classify(item, now):
    title, desc = text(item.get('tytul'), 180), text(item.get('opis'))
    value = title + ' ' + desc
    why, gaps, points = [], ['daty 4/5-14.11.2027, dwa miejsca, pełna cena i bagaż do weryfikacji'], 0
    if re.search(r'mendoz|\bMDZ\b', value, re.I):
        category, points = 'Mendoza', 55
        why.append('Dotyczy Mendozy')
    elif re.search(r'buenos|\bEZE\b|\bAEP\b|argentin|argentyn', value, re.I):
        category, points = 'Buenos Aires / Argentyna', 45
        why.append('Dotyczy Argentyny lub Buenos Aires')
    elif re.search(r'santiago|\bSCL\b|s[aã]o paulo|\bGRU\b', value, re.I):
        category, points = 'Inne huby', 25
        gaps.append('potrzebny dalszy lot do Mendozy')
    else:
        category, points = 'Doloty / informacje', 15
    if re.search(r'2027', value):
        points += 8
        why.append('Wzmianka o 2027 - zakres dat nadal do kontroli')
    if re.search(r'listopad|november|noviembre', value, re.I):
        points += 8
        why.append('Wzmianka o listopadzie')
    if re.search(r'stopover|multi.?city|multidestino|open.?jaw', value, re.I):
        points += 10
        why.append('Wzmianka o postoju lub trasie złożonej')
    normalized = ''.join(c for c in unicodedata.normalize('NFD', value.lower()) if not unicodedata.combining(c))
    normalized_title = ''.join(c for c in unicodedata.normalize('NFD', title.lower()) if not unicodedata.combining(c))
    arg_origin = r'(?:buenos aires|argentina|argentyny|mendoza|cordoba|rosario|tucuman|ezeiza)'
    europe = r'(?:europ\w*|madrid|madryt\w*|paris|roma|rome|barcelona)'
    reverse = bool(re.search(r'(?:desde|from|z)\s+' + arg_origin + r'\b.{0,70}' + europe, normalized)
                   or re.search(r'(?:a|to)\s+' + europe + r'\b.{0,40}(?:desde|from)\s+' + arg_origin, normalized))
    if reverse:
        points -= 40
        gaps.append('prawdopodobnie podróż w przeciwną stronę; nie porównywać z naszym biletem')
    published = stamp(item.get('data', '') + 'T12:00:00+00:00')
    if not published:
        points -= 15
        gaps.append('brak daty publikacji')
    else:
        age = (now - published).days
        points += 10 if age <= 2 else 4 if age <= 7 else 0
        if age > 14:
            points -= 20
            gaps.append('wpis starszy niż 14 dni')
    priced = bool(re.search(r'(?:€|\$|£|U\$D|USD|EUR|PLN)\s*\d|\d[\d .,]*\s*(?:€|\$|£|PLN|EUR|USD)\b', value, re.I))
    promotion = bool(re.search(r'promoc|discount|oferta|sale\b|deal\b|black friday|cyber monday|tanie loty', normalized_title))
    news = bool(re.search(r'suspend|suspensi|cancel|preocup|desapareci|ultimo vuelo|cerrar|courier|cargas|terminal|pasajeros|frecuencia|area de espera|protesta|refuerza|operaciones aereas', normalized_title))
    kind = 'oferta' if (priced or promotion) and not news else 'informacja'
    if kind == 'oferta':
        points += 35
        why.insert(0, 'Wpis zawiera cenę lub zapowiedź promocji')
    else:
        points = min(points, 30)
        why.insert(0, 'Wiadomość lotnicza - brak potwierdzonej oferty cenowej')
        gaps = ['znaczenie informacji dla planowanego połączenia']
    if reverse:
        points = min(points, 15)
    url = public_url(item.get('url'))
    return {'id': ident(rss.canonical(url)), 'tytul': title, 'opis': desc, 'url': url, 'zrodlo': text(item.get('zrodlo'), 80),
            'data': item.get('data', ''), 'kategoria': category, 'priorytet': max(0, min(99, points)),
            'dlaczego': why, 'braki': gaps, 'status': 'trop', 'rodzaj': kind, 'odwrotny': reverse}


def merge_leads(old, fresh, now, config):
    by_id = {}
    for lead in old:
        if not isinstance(lead, dict) or not public_url(lead.get('url')):
            continue
        first = stamp(lead.get('pierwszyOdczyt'))
        if not first or (now - first).days > config['przechowywanieDni']:
            continue
        updated = classify(lead, now)
        updated.update(pierwszyOdczyt=lead.get('pierwszyOdczyt'), ostatniOdczyt=lead.get('ostatniOdczyt'))
        by_id[updated['id']] = updated
    for source in fresh:
        lead = classify(source, now)
        if not lead['url']:
            continue
        previous = by_id.get(lead['id'], {})
        lead.update(pierwszyOdczyt=previous.get('pierwszyOdczyt', now.isoformat()), ostatniOdczyt=now.isoformat())
        by_id[lead['id']] = lead
    return sorted(by_id.values(), key=lambda x: (x['priorytet'], x['data']), reverse=True)[:config['maxTropy']]


class ProviderError(Exception):
    def __init__(self, message, path_id=None, empty_results=False):
        super().__init__(message)
        self.path_id, self.empty_results = path_id, empty_results


def path_id(routes):
    return ident(json.dumps(routes, sort_keys=True)) if routes else None


class Quota:
    def __init__(self, old, config, now):
        self.config, self.now, self.run = config, now, 0
        month, day = now.strftime('%Y-%m'), now.date().isoformat()
        self.state = {'miesiac': month, 'dzien': day,
                      'miesiacZapytania': old.get('miesiacZapytania', 0) if old.get('miesiac') == month else 0,
                      'dzienZapytania': old.get('dzienZapytania', 0) if old.get('dzien') == day else 0}

    def available(self):
        return min(self.config['limitMiesiac'] - self.state['miesiacZapytania'],
                   self.config['limitDzien'] - self.state['dzienZapytania'], self.config['limitPrzebieg'] - self.run) > 0

    def charge(self):
        if not self.available():
            raise ProviderError('limit zapytań osiągnięty')
        self.run += 1
        self.state['miesiacZapytania'] += 1
        self.state['dzienZapytania'] += 1


class SerpApi:
    def __init__(self, key, quota, checkpoint=lambda: None):
        self.key, self.quota, self.checkpoint = key, quota, checkpoint

    def search(self, params):
        self.quota.charge()  # także błędy liczymy ostrożnie do własnego limitu
        self.checkpoint()   # zapisz zużycie przed połączeniem; wznowienie nie zeruje licznika
        req = urllib.request.Request('https://serpapi.com/search.json?' + urlencode(dict(params, api_key=self.key)),
                                     headers={'User-Agent': 'UcoDealFinder/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=45) as response:
                raw = response.read(8_000_001)
            if len(raw) > 8_000_000:
                raise ProviderError('odpowiedź przekracza limit rozmiaru')
            result = json.loads(raw)
        except urllib.error.HTTPError as e:
            raise ProviderError('źródło zwróciło HTTP ' + str(e.code)) from None
        except (urllib.error.URLError, TimeoutError, ValueError, OSError):
            raise ProviderError('nie udało się odczytać źródła; poprzednie wyniki zachowane') from None
        if result.get('error'):
            # Nie publikujemy surowego błędu: może zawierać URL z kluczem.
            raise ProviderError('źródło nie zwróciło wyników; sprawdź konto, daty i pozostały limit',
                                empty_results=result['error'] == "Google Flights hasn't returned any results for this query.")
        return result


def parameters(query, rules):
    legs = query['odcinki']
    out = {'engine': 'google_flights', 'hl': 'en', 'gl': 'pl', 'currency': 'PLN', 'adults': 2,
           'travel_class': 1, 'stops': 3, 'bags': 2, 'deep_search': 'true', 'show_hidden': 'true', 'sort_by': 2}
    if query.get('linie'):
        out['include_airlines'] = query['linie']
    slices = []
    for leg in legs:
        # API dokumentuje konkretne lotniska lub kgmid, nie miejskie kody IATA.
        airports = lambda code: 'AEP,EZE' if code == 'BUE' else code
        s = {'departure_id': airports(leg['z']), 'arrival_id': airports(leg['do']), 'date': leg['data']}
        if leg['z'] == 'WAW' and leg['data'] == rules['wylotAlternatywny']:
            s['times'] = '20,23'
        if leg['z'] in ('BUE', 'EZE', 'AEP') and leg['data'] == rules['buenosDo']:
            s['times'] = '18,23'
        if leg['z'] == 'MDZ':
            s['times'] = '0,23,0,15'
        slices.append(s)
    if len(slices) == 1:
        out.update(type=2, departure_id=slices[0]['departure_id'], arrival_id=slices[0]['arrival_id'], outbound_date=slices[0]['date'])
        if slices[0].get('times'):
            out['outbound_times'] = slices[0]['times']
    else:
        out.update(type=3, multi_city_json=json.dumps(slices, separators=(',', ':')))
    return out


def choices(response):
    rows = response.get('best_flights', []) + response.get('other_flights', [])
    return sorted((r for r in rows if isinstance(r, dict) and isinstance(r.get('price'), (int, float))
                   and not isinstance(r['price'], bool) and math.isfinite(r['price']) and r['price'] > 0 and r.get('flights')),
                  key=lambda r: r['price'])


def route_from(choice):
    return [{'z': text(f.get('departure_airport', {}).get('id'), 3), 'do': text(f.get('arrival_airport', {}).get('id'), 3),
             'wylotLokalny': text(f.get('departure_airport', {}).get('time'), 30),
             'przylotLokalny': text(f.get('arrival_airport', {}).get('time'), 30),
             'linia': text(f.get('airline'), 70), 'rejs': text(f.get('flight_number'), 20), 'minuty': f.get('duration')}
            for f in choice.get('flights', []) if isinstance(f, dict)]


def usable(choice, expected, rules):
    try:
        legs = choice['flights']
        if not 1 <= len(legs) <= rules['max_przesiadki'] + 1:
            return False
        if any(f.get('travel_class', 'Economy') != 'Economy' for f in legs):
            return False
        departure, arrival = legs[0]['departure_airport'], legs[-1]['arrival_airport']
        begin = dt.datetime.fromisoformat(departure['time'])
        end = dt.datetime.fromisoformat(arrival['time'])
        origins = ('AEP', 'EZE') if expected['z'] == 'BUE' else (expected['z'],)
        destinations = ('AEP', 'EZE') if expected['do'] == 'BUE' else (expected['do'],)
        if departure['id'] not in origins or arrival['id'] not in destinations or begin.date().isoformat() != expected['data']:
            return False
        if expected['z'] == 'WAW' and expected['data'] == rules['wylotAlternatywny'] and begin.hour < 20:
            return False
        if expected['do'] == 'MDZ' and end.date().isoformat() != rules['mendoza']:
            return False
        if expected['z'] == 'MDZ' and (end.date().isoformat() != rules['buenosOd'] or end.hour > rules['buenosPrzylotMax']):
            return False
        if expected['z'] in ('BUE','EZE','AEP') and expected['data'] == rules['buenosDo'] and begin.hour < rules['buenosWylotMin']:
            return False
        if expected['do'] == 'WAW' and end.date().isoformat() > rules['powrot']:
            return False
        connections = choice.get('layovers', [])
        if not isinstance(connections, list) or len(connections) != len(legs) - 1:
            return False
        for index, connection in enumerate(connections):
            if not isinstance(connection, dict) or connection.get('id') != legs[index]['arrival_airport']['id']:
                return False
            minimum = rules['buePrzesiadkaH'] if connection.get('id') in ('AEP', 'EZE') else rules['przesiadkaH']
            minutes = connection.get('duration')
            if not isinstance(minutes, (int, float)) or not minimum * 60 <= minutes <= rules['max_przesiadka_h'] * 60:
                return False
        if any(a['arrival_airport']['id'] != b['departure_airport']['id'] for a, b in zip(legs, legs[1:])):
            return False
        duration = choice.get('total_duration')
        if isinstance(duration, bool) or not isinstance(duration, (int,float)) or not math.isfinite(duration) or not 0 < duration <= rules['max_podroz_h'] * 60:
            return False
        return True
    except (KeyError, IndexError, TypeError, ValueError):
        return False


def separate_ticket(value):
    if value.get('separate_tickets') or value.get('departing') or value.get('returning'):
        return True
    notes = json.dumps([value.get('extensions', []), value.get('ticket_type', '')], ensure_ascii=False)
    return bool(re.search(r'separate.ticket|self.transfer', notes, re.I))


def request_cost(query):
    return len(query['odcinki']) + int(bool(query.get('wspolnaOferta')))


def joint_booking(response, selected):
    """Wspólna oferta bezpośredniej linii dla dokładnie całej wybranej trasy.
    Sam sprzedawca, sojusz ani pole together nie dowodzą wspólnego biletu.
    Nie publikujemy booking_request, post_data ani tokenów.
    """
    def signature(routes):
        return [(leg['z'], leg['do'], leg['wylotLokalny'], leg['przylotLokalny'])
                for route in routes for leg in route]
    returned = [route_from(row) for row in response.get('selected_flights', [])]
    if not returned or signature(returned) != signature(selected):
        raise ProviderError('oferta sprzedaży nie potwierdza wszystkich wybranych lotów')
    available = []
    for option in response.get('booking_options', []):
        together = option.get('together', {})
        price = together.get('price')
        if separate_ticket(option) or separate_ticket(together) or together.get('airline') is not True:
            continue
        if not isinstance(price, (float, int)) or isinstance(price, bool) or not math.isfinite(price) or price <= 0:
            continue
        if not together.get('book_with'):
            continue
        available.append(together)
    if not available:
        raise ProviderError('brak wspólnej oferty linii dla całej trasy; nie oznaczono jej jako jeden bilet')
    best = min(available, key=lambda x: x['price'])
    baggage = best.get('baggage_prices') or response.get('baggage_prices', {}).get('together', [])
    return {'sprzedawca': text(best['book_with'], 80), 'cena': best['price'],
            'bagazZrodla': [text(item, 180) for item in baggage if isinstance(item, str)],
            'wspolnaOfertaLinii': True,
            'uwaga': 'Cała trasa w jednej ofercie linii w Google Flights, bez oznaczenia osobnych biletów. Wystawienie jednego biletu, bagaż 23 kg i ochronę potwierdź przed płatnością.'}


def quote(query, rules, client, now):
    """Podążaj za wyborem kolejnych części. Cena pierwszej części nie jest ceną finalną.
    Brak tokenu, limit lub puste wyniki nigdy nie zamieniają częściowej ścieżki w komplet.
    """
    params, selected, last = parameters(query, rules), [], None
    separate = query.get('sposobWyceny') == 'osobne'
    prices, urls, exceptions = [], [], []
    shared = bool(query.get('wspolnaOferta'))
    booking = None
    url = query['google']
    for index, expected in enumerate(query['odcinki']):
        if separate:
            params = parameters(dict(query, odcinki=[expected]), rules)
        try:
            response = client.search(params)
        except ProviderError as error:
            if shared and error.empty_results:
                error.path_id = path_id(selected)
            raise
        url = public_url(response.get('search_metadata', {}).get('google_flights_url')) or url
        echoed = response.get('search_parameters', {})
        if str(echoed.get('adults')) != '2' or echoed.get('currency') != 'PLN':
            raise ProviderError('źródło nie potwierdziło dwóch dorosłych i waluty PLN')
        available = choices(response)
        # Zachowaj kilka kandydatur tylko na poziomie listy; wybór jednej ścieżki
        # jest ograniczeniem limitu API, nie dowodem najniższej ceny rynku.
        if shared:
            available = [c for c in available if not separate_ticket(c)]
        strict = [c for c in available if usable(c, expected, rules)]
        # Wyłącznie jawny przykład diagnostyczny: pokazuj odstępstwo, nie zmieniaj
        # reguł monitora ani kwalifikacji do zakupu.
        if not strict and query.get('testPolaczenia170Min'):
            diagnostic_rules = dict(rules, buePrzesiadkaH=170 / 60)
            strict = [c for c in available if usable(c, expected, diagnostic_rules)]
            if strict:
                exceptions.append('Przesiadka w EZE 2 h 50 min zamiast wymaganego minimum 3 h. Wariant nie spełnia reguł podróży.')
        available = [c for c in strict if path_id(selected + [route_from(c)]) not in query.get('pominSciezki', [])]
        if not available:
            raise ProviderError(f'część {index + 1}/{len(query["odcinki"])}: {len(choices(response))} wyników źródła, żaden nie spełnia reguł lub pozostałe ścieżki już odrzucono; nie oznacza to wyprzedania', path_id=path_id(selected) if shared else None)
        last = available[0]
        selected.append(route_from(last))
        prices.append(last['price'])
        urls.append(url)
        if not separate and index < len(query['odcinki']) - 1:
            token = last.get('departure_token')
            if not token:
                raise ProviderError('brak danych do wyboru kolejnego odcinka; wycena niekompletna')
            params['departure_token'] = token
    if shared:
        token = last.get('booking_token')
        if not token:
            raise ProviderError('brak danych do potwierdzenia wspólnej oferty linii')
        booking_params = dict(params, booking_token=token)
        booking_params.pop('departure_token', None)
        response = client.search(booking_params)
        echoed = response.get('search_parameters', {})
        if str(echoed.get('adults')) != '2' or echoed.get('currency') != 'PLN':
            raise ProviderError('oferta sprzedaży nie potwierdziła dwóch dorosłych i PLN')
        try:
            booking = joint_booking(response, selected)
        except ProviderError as error:
            error.path_id = path_id(selected)
            raise
        url = public_url(response.get('search_metadata', {}).get('google_flights_url')) or url
    stopover = None
    if len(selected) == 3 and query['odcinki'][1]['z'] == 'MDZ' and query['odcinki'][1]['do'] in ('BUE', 'AEP', 'EZE'):
        zone = ZoneInfo('America/Argentina/Buenos_Aires')
        arrival = dt.datetime.fromisoformat(selected[1][-1]['przylotLokalny']).replace(tzinfo=zone)
        departure = dt.datetime.fromisoformat(selected[2][0]['wylotLokalny']).replace(tzinfo=zone)
        stopover = round((departure - arrival).total_seconds() / 3600, 2)
        if stopover < rules['stop_min_h']:
            raise ProviderError('postój w Buenos Aires jest za krótki')
    return {'id': ident(query['id'] + json.dumps(selected, sort_keys=True)), 'zapytanie': query['id'],
            'nazwa': query['nazwa'], 'scenariusz': query['scenariusz'], 'sprawdzono': now.isoformat(),
            'dorosli': 2, 'waluta': 'PLN', 'cenaWyniku': booking['cena'] if booking else sum(prices) if separate else last['price'],
            'wspolnaOferta': booking, 'odstepstwa': exceptions, 'regulySpelnione': not exceptions,
            'zakresCeny': ('suma trzech osobnych biletów dla 2 dorosłych; dodatki do potwierdzenia' if separate else 'wynik wyszukiwania dla 2 dorosłych; jednostka do kontroli w formularzu'),
            'sposobWyceny': 'wspólna oferta linii' if booking else 'osobne' if separate else 'multi-city',
            'cenyOdcinkow': prices if separate else [], 'linkiOdcinkow': urls if separate else [],
            'stopoverGodziny': stopover, 'bagazPotwierdzony': False,
            'bagaz': 'Wymagane potwierdzenie bagażu podręcznego dla dwóch osób na każdym odcinku. Bagaż rejestrowany jest opcjonalny.',
            'trasy': selected, 'url': url, 'status': 'wariant warunkowy' if exceptions else 'do potwierdzenia', 'braki': exceptions + query['braki'] +
            ['finalna cena u linii dla dwóch osób', 'dwa bagaże podręczne w cenie', 'dokładne strefy czasowe i bufory', 'ochrona całej trasy na jednym bilecie'],
            'kompletPodrozy': False, 'potwierdzonaULinii': False}


def calendar_allows(query, config):
    """Tylko daty potwierdzone w bezpłatnym kalendarzu; brak dowodu blokuje API.
    Nie przesuwamy granicy automatycznie wraz z upływem czasu.
    """
    try:
        until = dt.date.fromisoformat(config['serpapi']['kalendarzPotwierdzonyDo'])
        return all(dt.date.fromisoformat(leg['data']) <= until for leg in query['odcinki'])
    except (KeyError, TypeError, ValueError):
        return False


def test_prices(output, config, program, previous, key, now, state_path, client_factory=SerpApi, route='trip', extra_budget=0, request_budget=0):
    """Ręczny test tego samego adaptera; oddzielny plik, maks. trzy wywołania.
    Wyniki nigdy nie trafiają do listopadowych wycen ani raportu zakupu.
    """
    if config['serpapi'].get('enabled') is not True:
        result = {'test': True, 'status': 'wyłączone', 'opis': 'Zapytania API wyłączone na życzenie użytkownika.', 'zapytaniaTestu': 0,
                  'limity': previous.get('limity', {}), 'sprawdzono': now.isoformat()}
        atomic(output, result)
        return result
    shifted = copy.deepcopy(program)
    rules = shifted['loty']['monitoring']['reguly']
    departure = dt.date(2027, 5, 7) if route == 'single-mad' else dt.date(2027, 3, 5)
    delta = departure - dt.date.fromisoformat(rules['wylot'])
    for field, value in list(rules.items()):
        if isinstance(value, str) and re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
            rules[field] = (dt.date.fromisoformat(value) + delta).isoformat()
    plan = build_plan(shifted, legacy=True)
    query = next(q for q in plan if q['id'] == 'mdz-bue') if route == 'domestic' else next(q for q in plan if q.get('sposobWyceny') == 'osobne') if route == 'split' else plan[0]
    if route == 'single-mad':
        query = next(q for q in plan if q['id'] == 'mad-stopover')
        query.update(linie='AR', testPolaczenia170Min=True)
        query['odcinki'][1]['do'] = 'AEP'
        query['odcinki'][2]['z'] = 'EZE'
    elif route == 'trip':
        # Dawny test trzech wyborów; osobny tryb obejmuje także ofertę sprzedaży.
        query.pop('wspolnaOferta', None)
    query['id'] = 'test-' + departure.isoformat() + '-' + route
    query['nazwa'] = 'TEST połączenia ' + departure.isoformat() + ', nie oferta na rocznicę'
    cost = request_cost(query)
    if extra_budget not in (0, 2, 4):
        raise ValueError('Dodatkowy budżet testowy: 0, 2 lub 4.')
    limits = dict(config['serpapi'], limitPrzebieg=cost,
                  limitDzien=config['serpapi']['limitDzien'] + extra_budget)
    if request_budget not in (0, 4):
        raise ValueError('Budżet jednego zatwierdzonego testu: 0 lub 4.')
    if request_budget:
        consumed = Quota(previous.get('limity', {}), limits, now).state['dzienZapytania']
        limits.update(limitDzien=consumed + request_budget, limitPrzebieg=min(cost, request_budget))
    quota = Quota(previous.get('limity', {}), limits, now)
    result = {'test': True, 'sprawdzono': now.isoformat(), 'odcinki': query['odcinki'],
              'status': 'błąd', 'limity': quota.state, 'dodatkowyBudzetTestu': extra_budget, 'zatwierdzonyBudzetTestu': request_budget,
              'uwaga': 'Rzeczywista cena dla wcześniejszych dat. Nie dotyczy wyjazdu w listopadzie.'}

    def checkpoint():
        atomic(state_path, {'sprawdzono': now.isoformat(), 'limity': quota.state})

    try:
        if not key:
            raise ProviderError('Brak klucza SerpApi.')
        if now.date() >= departure or not calendar_allows(query, config):
            raise ProviderError('Termin testu nie mieści się w potwierdzonym kalendarzu przyszłych lotów.')
        if min(limits['limitDzien'] - quota.state['dzienZapytania'],
               limits['limitMiesiac'] - quota.state['miesiacZapytania']) < cost:
            raise ProviderError('Brak limitu na pełny wybrany test; nie wysłano zapytań.')
        result['wycena'] = quote(query, rules, client_factory(key, quota, checkpoint), now)
        result['status'] = 'pobrano cenę'
    except ProviderError as e:
        result['opis'] = str(e)
    result['zapytaniaTestu'] = quota.run
    atomic(output, result)
    return result


def collect(output, config, program, previous=None, rss_result=None, key=None, now=None, state_path=None, client_factory=SerpApi):
    now = now or dt.datetime.now(WARSAW)
    previous = previous or {}
    plan = build_plan(program)
    rules = program['loty']['monitoring']['reguly']
    quota = Quota(previous.get('limity', {}), config['serpapi'], now)
    state = {'wersja': 1, 'sprawdzono': now.isoformat(), 'plan': plan,
             'tropy': previous.get('tropy', []), 'wyceny': previous.get('wyceny', []),
             'zapytania': previous.get('zapytania', {}), 'limity': quota.state,
             'konfiguracjaLimitow': config['serpapi'], 'zrodlaReczne': config['zrodlaReczne'],
             'rss': previous.get('rss', {}), 'ceny': previous.get('ceny', {}),
             'uwaga': 'Tropy i ceny porównywarki wymagają weryfikacji. Gotowe do zakupu oferty pokazuje osobny panel z pełnymi warunkami.'}
    ended = now.date().isoformat() > config['koniec']
    if ended:
        state['ceny'] = {'status': 'zakończony', 'opis': 'Minął termin poszukiwań. Wymagana decyzja o dalszym monitoringu.'}
        atomic(output, state)
        return state
    result = rss_result if rss_result is not None else rss.scan(config['rssDni'])
    state['rss'] = {k: result[k] for k in ('sprawdzono', 'stan', 'kanaly')}
    state['tropy'] = merge_leads(state['tropy'], result['trafienia'], now, config)
    eligible = [q for q in plan if calendar_allows(q, config)]
    boundary = config['serpapi'].get('kalendarzPotwierdzonyDo', 'brak potwierdzenia')
    waiting = ('Bez zapytań API poza potwierdzonym kalendarzem Google Flights (do ' + boundary + '). '
               'Listopad czeka na potwierdzenie dat w bezpłatnym formularzu. RSS i monitoring portali działają nadal.')
    for query in plan:
        if query not in eligible:
            state['zapytania'][query['id']] = {'status': 'oczekuje na kalendarz', 'opis': waiting}
    last_attempt = stamp(state['ceny'].get('ostatniaProba'))
    if config['serpapi'].get('enabled') is not True:
        state['ceny'] = {'status': 'wyłączone', 'opis': 'API wyłączone na życzenie użytkownika. Sprawdzamy portale, promocje i fora bez płatnych zapytań.'}
        for query in plan:
            state['zapytania'][query['id']] = {'status': 'sprawdzanie ręczne', 'opis': 'Wyszukaj całą trasę w bezpłatnym formularzu linii lub porównywarki.'}
    elif not key:
        state['ceny'] = {'status': 'wymaga podłączenia', 'opis': 'Automatyczne ceny czekają na konto SerpApi i klucz zapisany jako sekret repozytorium. Tropy RSS działają bez konta.'}
    elif not eligible:
        state['ceny'] = dict(state['ceny'], status='oczekuje na kalendarz', opis=waiting)
    elif last_attempt and (now - last_attempt).total_seconds() < config['serpapi']['minPrzerwaMinuty'] * 60:
        state['ceny']['opis'] = 'Zachowano poprzedni odczyt; trwa przerwa ograniczająca zużycie zapytań.'
    else:
        state['ceny'] = dict(state['ceny'], status='aktywny', opis='Wyniki porównywarki wymagają kontroli u linii.', ostatniaProba=now.isoformat())

        def checkpoint():
            atomic(state_path or output, {'sprawdzono': now.isoformat(), 'limity': quota.state}) if state_path else atomic(output, state)

        client = client_factory(key, quota, checkpoint)
        def queue_key(q):
            checked = stamp(state['zapytania'].get(q['id'], {}).get('sprawdzono'))
            cadence = {0:24, 1:48, 2:72, 3:168}[q['priorytet']]
            urgency = (now - checked).total_seconds() / (3600 * cadence) if checked else 1
            return (-urgency, q['priorytet'])
        for query in sorted(eligible, key=queue_key):
            if not quota.available():
                break
            if queue_key(query)[0] > -1:
                continue  # nie zużywaj limitu na dopiero co sprawdzony wariant
            if request_cost(query) > min(config['serpapi']['limitPrzebieg'] - quota.run,
                                          config['serpapi']['limitDzien'] - quota.state['dzienZapytania'],
                                          config['serpapi']['limitMiesiac'] - quota.state['miesiacZapytania']):
                continue
            prior = state['zapytania'].get(query['id'], {})
            rejected = [p for p in prior.get('odrzuconeSciezki', [])
                        if stamp(p.get('data')) and (now - stamp(p['data'])).days < 7][-12:]
            attempt = dict(query, pominSciezki=[p['id'] for p in rejected])
            try:
                candidate = quote(attempt, rules, client, now)
                state['wyceny'] = [x for x in state['wyceny'] if x.get('zapytanie') != query['id']] + [candidate]
                state['zapytania'][query['id']] = {'sprawdzono': now.isoformat(), 'status': 'wynik do weryfikacji', 'odrzuconeSciezki': rejected}
                state['ceny']['ostatniSukces'] = now.isoformat()
            except ProviderError as e:
                if e.path_id and e.path_id not in [p['id'] for p in rejected]:
                    rejected.append({'id': e.path_id, 'data': now.isoformat()})
                state['zapytania'][query['id']] = {'sprawdzono': now.isoformat(), 'status': 'luka', 'opis': str(e), 'odrzuconeSciezki': rejected[-12:]}
                if 'HTTP 401' in str(e) or 'HTTP 403' in str(e) or 'HTTP 429' in str(e):
                    state['ceny'].update(status='błąd źródła', opis=str(e))
                    break
        if not quota.available() and state['ceny']['status'] == 'aktywny':
            state['ceny']['opis'] = 'Wykorzystano limit tego przebiegu, dnia lub miesiąca. Pozostałe warianty czekają w kolejce.'
    state['wyceny'] = [q for q in state['wyceny'] if stamp(q.get('sprawdzono')) and (now - stamp(q['sprawdzono'])).days <= 30]
    atomic(output, state)
    return state


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--output', type=Path, default=ROOT / 'okazje.json')
    ap.add_argument('--state', type=Path, help='Plik licznika zapisywany przed każdym zapytaniem (poza stroną).')
    ap.add_argument('--rss-file', type=Path, help='Gotowy wynik RSS; do testów i ponownego przeliczenia bez sieci.')
    ap.add_argument('--no-prices', action='store_true')
    ap.add_argument('--test-prices', action='store_true', help='Ręczny test 5-13.03.2027; wynik oddzielnie od ofert listopadowych.')
    ap.add_argument('--test-route', choices=['trip', 'domestic', 'split', 'single-mad'], default='trip')
    ap.add_argument('--test-extra-budget', type=int, choices=[0, 2, 4], default=0)
    ap.add_argument('--test-request-budget', type=int, choices=[0, 4], default=0)
    args = ap.parse_args()
    config, program = read(SRC / 'data/wyszukiwarka.json'), read(SRC / 'data/program.json')
    previous = read(args.output, {})
    checkpoint = read(args.state, {}) if args.state else {}
    # Dziennik rezerwuje zapytanie przed HTTP. Nie może cofnąć listy wyników
    # ani ostatniego udanego odczytu przy ponownym uruchomieniu.
    current, reserved = previous.get('limity', {}), checkpoint.get('limity', {})
    if reserved.get('miesiac', '') > current.get('miesiac', ''):
        previous['limity'] = reserved
    elif reserved.get('miesiac') == current.get('miesiac') and reserved:
        merged = dict(current)
        merged['miesiacZapytania'] = max(current.get('miesiacZapytania', 0), reserved.get('miesiacZapytania', 0))
        if reserved.get('dzien', '') > current.get('dzien', ''):
            merged.update(dzien=reserved['dzien'], dzienZapytania=reserved.get('dzienZapytania', 0))
        elif reserved.get('dzien') == current.get('dzien'):
            merged['dzienZapytania'] = max(current.get('dzienZapytania', 0), reserved.get('dzienZapytania', 0))
        previous['limity'] = merged
    if args.test_prices:
        if not args.state or args.no_prices:
            ap.error('Test wymaga --state i nie może używać --no-prices.')
        result = test_prices(args.state.parent / 'price-test.json', config, program, previous,
                             os.environ.get('SERPAPI_API_KEY'), dt.datetime.now(WARSAW), args.state, route=args.test_route, extra_budget=args.test_extra_budget, request_budget=args.test_request_budget)
        print(json.dumps(result, ensure_ascii=False))
        raise SystemExit(0 if result['status'] == 'pobrano cenę' else 1)
    result = collect(args.output, config, program, previous, read(args.rss_file) if args.rss_file else None,
                     None if args.no_prices else os.environ.get('SERPAPI_API_KEY'), state_path=args.state)
    print(json.dumps({'tropy': len(result['tropy']), 'wyceny': len(result['wyceny']),
                      'rss': result['rss'].get('stan'), 'ceny': result['ceny']['status'], 'limity': result['limity']}, ensure_ascii=False))


if __name__ == '__main__':
    main()
