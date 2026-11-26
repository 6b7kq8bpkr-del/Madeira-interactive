# Wyszukiwarka okazji - uruchomienie i obsługa

Wyszukiwarka jest częścią istniejącej strony, pod `#wyszukiwarka`. Używa reguł podróży z `data/program.json`, wspólnego modułu `flight-rules.js` i zapisanych, potwierdzonych ofert z `loty.json`. Nie ma dostępu do danych pasażerów, zakupów, płatności ani kont lotniczych.

## Co działa bez konta

- Publiczne RSS: skan co 6 godzin (`.github/workflows/uco-search.yml`), ponowienia po awarii pojedynczego kanału, zachowanie poprzednich tropów i ich prawdziwych dat.
- 23 zapytania trasowych: pełny bilet z postojem, open-jaw, Atlantyk plus krajowe, Madryt, VIE/BER i inne huby. Gotowe linki do KAYAK dla dwóch dorosłych oraz kopiowanie planu do ręcznego uzupełnienia formularza Google Flights. Kontrola 26.11.2026 potwierdziła, że Google ignoruje tekstowe zapytanie multi-city, dlatego link jest jawnie oznaczony jako formularz do uzupełnienia. Formularz zawsze sprawdzić przed oceną ceny.
- Domyślnie widoczne tropy cenowe; wiadomości lotnicze i podróże w przeciwnym kierunku dostępne w osobnych widokach. Priorytet sprawdzenia artykułu, kierunek podróży, aktualność, wyszukiwanie tekstowe, filtrowanie i lokalna lista zapisanych/ukrytych. Wynik punktowy to heurystyka przydatności wpisu, nie prawdopodobieństwo dostępności.
- Agent o 9:00 i 18:00 uzupełnia odczyty forów, komentarzy, linii i autoryzowanej skrzynki. Treści prywatnych wiadomości nie trafiają do publicznego JSON.

RSS nie obejmuje całego internetu. Forum Fly4free blokowało bezpośredni odczyt HTTP 26.11.2026; indeks wyszukiwarki nie potwierdza przeczytania wszystkich postów. Secret Flying, fora, komentarze i newslettery pozostają osobnymi źródłami agenta. Nie obchodzimy blokad ani logowania.

## Automatyczne ceny - potrzebne konto użytkownika

Przygotowany adapter korzysta z [Google Flights przez SerpApi](https://serpapi.com/google-flights-api). Jest to dostawca wyników porównywarki, nie oficjalny interfejs Google ani potwierdzenie przewoźnika. Wysyłamy tylko lotniska, daty, dwie osoby dorosłe, klasę ekonomiczną, walutę PLN i filtry. Klucz pozostaje w sekretach GitHub Actions; nigdy w HTML, JavaScript, czacie, logach ani publicznym pliku.

1. Użytkownik zakłada konto na [SerpApi](https://serpapi.com/users/sign_up), akceptuje regulamin i ewentualnie potwierdza konto. Na start wystarczy bezpłatny plan. Według [cennika z 26.11.2026](https://serpapi.com/pricing) obejmuje 250 wyszukiwań miesięcznie; Starter to 25 USD/mies. za 1000. Wybór płatnego planu wymaga osobnej decyzji użytkownika. Nie włączaj automatycznego odnawiania limitu.
2. W repozytorium: **Settings → Secrets and variables → Actions → New repository secret**. Nazwa `SERPAPI_API_KEY`; wartość skopiowana samodzielnie z panelu SerpApi. [Bezpośredni ekran sekretów](https://github.com/6b7kq8bpkr-del/Madeira-interactive/settings/secrets/actions). Nie przesyłaj klucza w rozmowie. Jest używany wyłącznie w workflow skanera.
3. **Actions → Valle de Uco - wyszukiwarka okazji → Run workflow** lub oczekiwanie na kolejny przebieg. Sprawdź końcowy status, nową datę w `okazje.json` i pole `ceny`. Samo dodanie sekretu nie potwierdza poprawnego połączenia.
4. Pierwszą rzeczywistą wycenę porównaj w formularzu źródła i u linii: dwie osoby, PLN, cena całego wyboru lub za osobę, bagaż i wszystkie części trasy. Dopóki jednostka i dodatki nie są potwierdzone, `cenaWyniku` pozostaje kwotą z porównywarki, bez automatycznego mnożenia lub dzielenia. Nie przenoś jej do `raport.calosc`.

Domyślne twarde limity tego skanera: 7 zapytań/dzień, 210/miesiąc, 4/przebieg. Licznik zapisuje się przed żądaniem; błędy również liczymy ostrożnie. Konto może być używane w innych aplikacjach - te limity obejmują tylko ten skaner. Jedna trasa z trzema częściami wymaga kilku wywołań, dlatego darmowy tryb sprawdza warianty rotacyjnie. Samo podłączenie klucza nie daje pełnego sprawdzania 23 tras dwa razy dziennie. Zwiększenie pokrycia wymaga większego uzgodnionego limitu i planu dostawcy. Konfiguracja: `data/wyszukiwarka.json`.

API wybiera jedną ścieżkę przez kolejne części podróży, z zachowaniem tokenu wyboru. Odrzuca błędne daty i lotniska, wczesny wylot 4.11, późny przylot do Buenos Aires i powrót po 14.11. Nie obiecuje znalezienia globalnego minimum w całym grafie lotów. Szczegóły ochrony, stref, przejścia między lotniskami i bagażu wymagają potwierdzenia. Dopiero pełny rekord `loty.json.oferty`, spełniający `flight-rules.js`, może trafić do rekomendacji zakupu.

## Publikacja danych i odporność

Kod pozostaje na `main`. Skaner publikuje wyłącznie `okazje.json` w gałęzi `uco-monitor-data`. Nie edytuje codziennego raportu ani planu i nie uruchamia ponownego wdrożenia całej strony co 6 godzin. Strona pobiera [bieżący skan](https://raw.githubusercontent.com/6b7kq8bpkr-del/Madeira-interactive/uco-monitor-data/okazje.json); w razie awarii pokazuje wyraźnie oznaczoną kopię z ostatniego wdrożenia. Plik ma wyłącznie publiczne tropy, kwoty, trasy i liczniki. GitHub może opóźniać zadania harmonogramu i wyłączyć je po dłuższym braku aktywności repozytorium; kontroluj faktyczny czas ostatniego skanu, nie samą definicję harmonogramu.

Przycisk „Pobierz najnowszy skan” odczytuje zapisany wynik. Nie uruchamia zapytań API ani nie może wyczerpać płatnego limitu. GitHub Actions ma pojedynczą kolejkę i zapis kontrolny licznika w cache. W razie niedostępności lub usunięcia cache nie traktuj licznika jako rozliczenia dostawcy. Skaner kończy automatyczne wyszukiwania po 31.08.2027.

Utrata pojedynczego źródła nie zeruje listy tropów. Brak wyników nie oznacza braku promocji, wyprzedania ani zamkniętej sprzedaży. Błędy 401/403/429 zatrzymują dalsze płatne odczyty danego przebiegu. Surowe odpowiedzi z tokenami, klucze i spersonalizowane linki nie są zapisywane w danych publicznych.

## Ochrona limitu i test na wcześniejszym terminie

Klucz został podłączony 26.11.2026. Tego dnia Google Flights jawnie odrzucało listopad jako zbyt odległy, a formularz pozwalał wybrać daty do 21.10.2027. Konfiguracja `serpapi.kalendarzPotwierdzonyDo` przechowuje tę potwierdzoną granicę. Skaner sprawdza wszystkie części zapytania przed wywołaniem API. Daty późniejsze są oznaczane „oczekuje na kalendarz” i zużywają zero zapytań. Brak lub błędna granica również blokuje API. Upływ czasu sam nie odblokowuje zapytań.

Istniejący agent o 9:00 i 18:00 sprawdza granicę w bezpłatnym formularzu Google Flights. Po rzeczywistym potwierdzeniu dostępności późniejszych dat aktualizuje wyłącznie `kalendarzPotwierdzonyDo` oraz `kalendarzSprawdzono` w konfiguracji. Nie wolno przesuwać granicy na podstawie przypuszczenia, liczby dni wyprzedzenia ani pustego wyniku API. RSS, portale i fora działają podczas blokady.

Ręczny workflow z opcją `price_test` uruchamia ten sam adapter i parser dla WAW-MDZ 5.03.2027, MDZ-BUE 12.03 oraz BUE-WAW 13.03. Opcja `test_route=domestic` sprawdza tylko MDZ-BUE 12.03 jednym wywołaniem; `trip` sprawdza całą trasę maksymalnie trzema. Domyślnie oba tryby mieszczą się we wspólnym limicie dziennym i miesięcznym. Ręczny parametr `test_extra_budget=2` zwiększa wyłącznie limit dzienny testu o dwa; nie zeruje licznika, nie zwiększa miesięcznego limitu ani budżetu zwykłego skanu. Buenos Aires jest przekazywane do API jako lista lotnisk `AEP,EZE`, zgodnie z dokumentowanym formatem dostawcy. Test nie uruchamia się z harmonogramu ani przy publikacji kodu. Wynik trafia wyłącznie do osobnego artefaktu `test-cen-marzec-2027` (7 dni) i logu, bez sekretów i tokenów, nigdy do `wyceny` listopadowego monitora. Nieudana próba ma końcowy status błędu. Po teście zwykły skan publikuje aktualny licznik i stan blokady.

## Utrzymanie

```sh
python3 -I -B ../uco/tools/deal_finder.py --no-prices
python3 -I -B tests/test_deal_finder.py
python3 -I -B tests/check_finder_output.py
node tests/finder.test.cjs
python3 -I build.py
python3 -I build.py --check
node tests/smoke.mjs
```

Nie zapisuj prawdziwych wyników jako fikcyjnych ofert testowych. Testy używają wyłącznie syntetycznych odpowiedzi i odcinają wywołania API. Po aktywacji konta potrzebny jest osobny test jednej rzeczywistej trasy. Ceny historyczne i aktualne odczyty muszą zachować oryginalne daty.

Kontrola 26.11.2026: JA3071 MDZ-AEP 12.03.2027 dla dwóch dorosłych kosztował w Google 514 PLN bez bagażu kabinowego, 725 PLN z jednym i 1023 PLN z dwoma. API przy `bags=2` zwróciło 725 PLN. Sam filtr nie dowodzi uwzględnienia bagażu; wyniki są jawnie oznaczane jako wymagające jego potwierdzenia. Wycena stopoveru wymaga wyboru wszystkich trzech części, pokazuje czas postoju w strefie Buenos Aires i odrzuca zbyt krótkie lub długie przesiadki z odpowiedzi dostawcy.

Tryb `split` wyszukuje osobno wszystkie trzy części i sumuje ich ceny dla dwóch dorosłych. Pokazuje ceny składowe, odnośniki i wyliczony stopover; nigdy nie oznacza osobnych biletów jako wspólnie chronionych. Jest dostępny także w stałym planie monitoringu. Ręczny budżet testowy może wynosić 0, 2 lub 4 dodatkowe zapytania ponad zwykły limit dnia, zawsze z zachowaniem limitu miesiąca.

## Wspólna oferta całej trasy

Warianty `calosc-*` i `mad-stopover` wymagają czwartego zapytania: `booking_token` → `booking_options`. Rezerwujemy cały koszt przed rozpoczęciem, więc trzy wolne zapytania nie wystarczą na taki wariant. Parser porównuje wszystkie wybrane loty z `selected_flights`, wymaga oferty bezpośredniej linii w `together` i odrzuca `separate_tickets`, osobne części sprzedaży oraz samodzielne przesiadki. Cena pochodzi z końcowej oferty linii, a nie z pierwszej listy lotów. Jest to dowód wspólnej oferty w porównywarce; nie potwierdza jeszcze wystawienia biletu, ochrony ani 23 kg. Dane żądania rezerwacji i tokeny nigdy nie trafiają do wyników ani logów.

Tryb diagnostyczny `single-mad` sprawdza 7-15.05.2027: MAD-MDZ, MDZ-AEP, EZE-MAD, tylko Aerolíneas Argentinas. W bezpłatnym formularzu 26.11.2026 wybrano wszystkie części i uzyskano wspólną ofertę Aerolíneas za 9490 PLN dla dwóch osób, z kabinowym i płatnym bagażem rejestrowanym. Przykład ma przesiadkę 2 h 50 min w EZE, o 10 minut krótszą od reguły. Wyłącznie ten jawny test dopuszcza jej pobranie jako `wariant warunkowy`, z `regulySpelnione=false`; nie zmienia reguł listopadowego monitora ani ofert zakupu. Stopover z tego przykładu trwa 37 h 35 min. Doloty z Polski, nocleg buforowy, powrót do WAW w wymaganym dniu i pełny koszt pozostają do sprawdzenia.

`test_request_budget=4` jest osobną, domyślnie wyłączoną opcją ręcznego uruchomienia. Pozwala wykonać najwyżej cztery żądania ponad zużycie na początku testu; wspólny licznik nie jest resetowany, limit miesięczny pozostaje wiążący, zwykły skan zachowuje limit 7/dzień. Test nigdy nie trafia do ofert listopadowych.

Źródła: https://serpapi.com/google-flights-booking-options oraz https://www.argentina.travel/novedades/que-hacer-en-mendoza-durante-la-vendimia-2027 . Pierwszy test marcowy przypadł na główny weekend Vendimii; to możliwy czynnik wysokich cen, nie dowód ich konkretnej przyczyny.

Ścieżki, które nie doprowadziły do wspólnej oferty, są pamiętane przez maksymalnie 7 dni jako skróty tras, bez tokenów. Następny planowy odczyt wybiera kolejnego kandydata zamiast ponawiać tę samą ślepą ścieżkę. Nie uruchamia dodatkowej pętli ani dodatkowych zapytań w bieżącym przebiegu. Błędy konta, limitu i sieci nie dyskwalifikują połączenia.
