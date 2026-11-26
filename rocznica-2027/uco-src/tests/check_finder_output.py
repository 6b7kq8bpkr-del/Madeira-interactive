"""Kontrola danych przeznaczonych do publicznej gałęzi. Bez sieci."""
import json
import os
from pathlib import Path
from urllib.parse import urlsplit, parse_qsl

p=Path(__file__).resolve().parents[2]/'uco/okazje.json'
raw=p.read_text()
data=json.loads(raw)
assert data['wersja']==1 and isinstance(data['plan'],list) and isinstance(data['tropy'],list)
assert isinstance(data['wyceny'],list) and isinstance(data['zapytania'],dict)
secret=os.environ.get('SERPAPI_API_KEY')
assert not secret or secret not in raw, 'Sekret nie może trafić do danych publicznych'
assert not any(word in raw for word in ('api_key=', 'booking_token', 'departure_token', 'json_endpoint')), 'Prywatny parametr w wyniku'
for row in data['wyceny']:
    assert row['dorosli']==2 and row['potwierdzonaULinii'] is False and row['kompletPodrozy'] is False
for row in data['tropy']+data['wyceny']:
    u=urlsplit(row['url'])
    assert u.scheme in ('https','http') and not u.username and not u.password
    assert not any('@' in v for k,v in parse_qsl(u.query))
assert len(data['tropy'])<=150
print('Publiczny wynik wyszukiwarki: poprawny')
