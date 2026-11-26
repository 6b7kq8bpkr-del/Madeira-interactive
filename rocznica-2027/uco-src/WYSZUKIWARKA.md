# Wyszukiwarka okazji - tryb bez API

Od decyzji użytkownika 26.11.2026 wyszukujemy wyłącznie pełną trasę z Warszawy na jednym chronionym bilecie, ze stopoverem w Buenos Aires. Podręczny wystarczy. Daty, bufory i pozostałe warunki: [MONITORING.md](MONITORING.md) oraz `data/program.json` -> `loty.monitoring.reguly`.

Przy pełnej cenie do 8000 zł za parę uwzględniaj również „super okazje z kompromisem” zgodnie z [MONITORING.md](MONITORING.md): do dwóch niewielkich odstępstw w czasie przesiadek lub długości podróży. Warszawa, jeden chroniony bilet, podręczny, daty i pobyt w Buenos pozostają wymagane. Plan kopiowany ze strony zawiera obie warstwy kryteriów. Przed odrzuceniem taniej trasy za sam czas sprawdź reguły wyjątków; nie obchodź zakazu API.

## Ochrona limitu

`data/wyszukiwarka.json` zawiera `serpapi.enabled: false`. Brak tego pola także blokuje dostawcę. Blokada obejmuje zwykłe skany i ręczne testy, nawet gdy klucz istnieje i kalendarz jest dostępny. Workflow nie przekazuje klucza, uruchamia `--no-prices` i nie udostępnia testu cen. Nie zmieniaj tych ustawień bez nowej decyzji użytkownika. Otwarcie listopadowych dat nie znosi zakazu.

Wszystkie regresje adaptera używają sztucznych odpowiedzi. Sieć w zestawie Python jest zablokowana. Nie wykonuj testu integracyjnego z rzeczywistym kluczem. Dotychczasowych liczników ani dat odczytu nie zerujemy.

## Działające wyszukiwanie

Dwa plany: WAW-MDZ 5.11 lub 4.11 po 20:00 / MDZ-BUE 12.11 / BUE-WAW 13.11. KAYAK otwiera trzy części dla dwóch dorosłych. W Google wybierz Wiele miast i wpisz odcinki; tekstowy parametr zapytania nie gwarantuje ich ustawienia. Skopiowany plan zawiera aktualne wymagania z programu. Multi-city może zwrócić osobne bilety - taki wynik odrzucamy.

Publiczne kanały RSS są skanowane co 6 godzin. Agent o 09:00 i 18:00 uzupełnia dostępne fora, komentarze i oficjalne formularze linii. Brak kanału, CAPTCHA albo awaria nie oznacza braku promocji; pokazujemy datę i luki. Kilka kanałów jednego portalu nie jest niezależnym potwierdzeniem. Newslettery wymagają wcześniej autoryzowanego odczytu skrzynki; prywatne wiadomości nie trafiają do publicznego pliku.

Kod jest na `main`, publiczny skan w gałęzi `uco-monitor-data`. Strona odczytuje zapisany skan; przy awarii pokazuje oznaczoną kopię z ostatniego wdrożenia. Przycisk odświeżania nie wywołuje dostawcy cen. Plan ręcznych wyszukiwań powstaje z aktualnych reguł podróży i działa także bez skanu. Informacja o wyłączeniu API pochodzi z aktualnej konfiguracji strony. Panel oddziela potwierdzone oferty listopada, wcześniejsze testy z `data/badania-lotow.json`, tropy publikacji oraz archiwum wycen.

Tropy nie są ofertami. Historyczne wyceny zachowują daty i zakres; nie zmieniaj ich na zgodne z nowym profilem. Pełny rekord `loty.json.oferty` jest oceniany przez `flight-rules.js`. Wymagane są finalna cena za dwie osoby, podręczny, wszystkie godziny ze strefami, jeden bilet, ochrona i stopover. Brak czasów przesiadek lub czasu całej części odrzuca wynik parsera. Wynik API z archiwum nie potwierdza biletu ani bagażu.

## Kontrola bez API

```
python3 -I -B ../uco/tools/deal_finder.py --no-prices
python3 -I -B tests/test_deal_finder.py
python3 -I -B tests/test_promo_rss.py
node tests/flight-rules.test.cjs
node tests/finder.test.cjs
node tests/ankieta.test.cjs
python3 -I build.py
python3 -I build.py --check
```

Pierwsza komenda pobiera tylko publiczne RSS. Testy używają atrap i nie mają dostępu do kont. Kalendarz sprzedaży, dostępność lotu i cena są odrębnymi obserwacjami; brak wyniku nie upoważnia do przesuwania horyzontu sprzedaży.

## Ręczne porównanie linii 26.11.2026 - bez API

Sprawdzono wcześniejsze terminy w oficjalnych formularzach KLM, Air France i Iberii. [Pełny zapis porównania](diagnostics/2026-11-26-airlines-no-api.json) zawiera godziny, lotniska, ceny i przyczyny odrzucenia. Zużycie API: 0. To testy na wcześniejsze daty, poza ofertami listopadowymi.

Najniższa pełna wycena z tej serii: **11 629,28 PLN dla dwóch dorosłych**, KLM, 9-18.03.2027. Trasa WAW-CDG-GRU-MDZ / MDZ-AEP / EZE-CDG-WAW, przesiadki 3 h 20 min, 4 h 55 min i 4 h 10 min, stopover 37 h 30 min. Podsumowanie pokazuje podręczny na wszystkich trzech częściach. To wspólna wycena multi-city z warunkami wykorzystania całego biletu; indywidualnego potwierdzenia wspólnej ochrony obejmującej odcinek LATAM nie uzyskano. Nie oznaczać rekordu jako w pełni potwierdzonej oferty na jednym chronionym bilecie.

Air France 2-11.03: pełna wycena 13 988,92 PLN. KLM 6/13/14.04: odrzucony za powrót o 00:20, stopover 12 h 50 min i przesiadkę w CDG 1 h 05 min; 15 i 16.04 powroty były droższe. Iberia 10/17/18.05 i 1/8/9.06: nieodpowiednie bufory lub trzy przesiadki. Historycznych 9490 PLN z Madrytu nie porównujemy jako kompletnej ceny z Warszawy.

## Archiwum wcześniejszych testów

Poniższy zapis dotyczy poprzednich wymagań i zgód. Nie upoważnia do ponownego użycia API. Start z Madrytu i przesiadka 2 h 50 min nie spełniają aktualnego profilu.

## Wynik testu integracji 26.11.2026

Workflow [45813379564](https://github.com/6b7kq8bpkr-del/Madeira-interactive/actions/runs/45813379564) zakończył się sukcesem. Po jawnej zgodzie na cztery zapytania pobrano trzy części i końcową wspólną ofertę Aerolíneas Argentinas za **9490 PLN dla dwóch dorosłych**. Licznik wzrósł z 11 do 15; zapytania listopadowe pozostały zablokowane. Zanonimizowany zapis diagnostyczny: [wynik JSON](diagnostics/2026-11-26-single-mad.json). To wynik testu na maj, nie oferta na listopad ani rekomendacja zakupu.

API wybrało MDZ-AEP 14.05 o 07:30-09:10 (wcześniejszy lot niż w ręcznym sprawdzeniu) i EZE-MAD 15.05 o 23:55. Stopover wynosi **38 h 45 min**. Pozostają ograniczenia: przesiadka w EZE 2 h 50 min, niepotwierdzony bagaż 23 kg oraz brak dolotów z Polski, noclegu buforowego i potwierdzenia terminowego powrotu do WAW. Odczyt `booking_options` potwierdza wspólną ofertę linii w Google Flights, nie wystawiony bilet.

Bezpłatne sprawdzenie formularza KLM dla WAW-MDZ 7.05, MDZ-AEP 14.05 i EZE-WAW 15.05 nie dało trasy spełniającej reguły. Po wybraniu WAW-CDG-GRU-MDZ (28 h 50 min, przesiadki 4 h 35 min i 6 h 05 min) w taryfie Standard oraz krajowego lotu AR formularz pokazał powrót EZE o 00:20 dnia 15.05, co skracało stopover do 15 h 10 min, z przesiadką w CDG 1 h 40 min. Po zmianie powrotu na 16.05 wyświetlił brak dostępnych lotów. Kwot cząstkowych nie traktujemy jako potwierdzonej ceny pełnej trasy. Nie zużyto na to API.
