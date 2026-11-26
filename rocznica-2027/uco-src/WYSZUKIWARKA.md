# Wyszukiwarka okazji - uruchomienie i obsługa

Wyszukiwarka jest częścią istniejącej strony, pod `#wyszukiwarka`. Używa reguł podróży z `data/program.json`, wspólnego modułu `flight-rules.js` i zapisanych, potwierdzonych ofert z `loty.json`. Nie ma dostępu do danych pasażerów, zakupów, płatności ani kont lotniczych.

## Co działa bez konta

- Publiczne RSS: skan co 6 godzin (`.github/workflows/uco-search.yml`), ponowienia po awarii pojedynczego kanału, zachowanie poprzednich tropów i ich prawdziwych dat.
- 21 zapytań trasowych: pełny bilet z postojem, open-jaw, Atlantyk plus krajowe, Madryt, VIE/BER i inne huby. Linki do KAYAK i Google Flights; formularz zawsze sprawdzić przed oceną ceny. Wyszukiwanie tekstowe Google może zmienić interpretację trasy.
- Domyślnie widoczne tropy cenowe; wiadomości lotnicze i podróże w przeciwnym kierunku dostępne w osobnych widokach. Priorytet sprawdzenia artykułu, kierunek podróży, aktualność, wyszukiwanie tekstowe, filtrowanie i lokalna lista zapisanych/ukrytych. Wynik punktowy to heurystyka przydatności wpisu, nie prawdopodobieństwo dostępności.
- Agent o 9:00 i 18:00 uzupełnia odczyty forów, komentarzy, linii i autoryzowanej skrzynki. Treści prywatnych wiadomości nie trafiają do publicznego JSON.

RSS nie obejmuje całego internetu. Forum Fly4free blokowało bezpośredni odczyt HTTP 26.11.2026; indeks wyszukiwarki nie potwierdza przeczytania wszystkich postów. Secret Flying, fora, komentarze i newslettery pozostają osobnymi źródłami agenta. Nie obchodzimy blokad ani logowania.

## Automatyczne ceny - potrzebne konto użytkownika

Przygotowany adapter korzysta z [Google Flights przez SerpApi](https://serpapi.com/google-flights-api). Jest to dostawca wyników porównywarki, nie oficjalny interfejs Google ani potwierdzenie przewoźnika. Wysyłamy tylko lotniska, daty, dwie osoby dorosłe, klasę ekonomiczną, walutę PLN i filtry. Klucz pozostaje w sekretach GitHub Actions; nigdy w HTML, JavaScript, czacie, logach ani publicznym pliku.

1. Użytkownik zakłada konto na [SerpApi](https://serpapi.com/users/sign_up), akceptuje regulamin i ewentualnie potwierdza konto. Na start wystarczy bezpłatny plan. Według [cennika z 26.11.2026](https://serpapi.com/pricing) obejmuje 250 wyszukiwań miesięcznie; Starter to 25 USD/mies. za 1000. Wybór płatnego planu wymaga osobnej decyzji użytkownika. Nie włączaj automatycznego odnawiania limitu.
2. W repozytorium: **Settings → Secrets and variables → Actions → New repository secret**. Nazwa `SERPAPI_API_KEY`; wartość skopiowana samodzielnie z panelu SerpApi. [Bezpośredni ekran sekretów](https://github.com/6b7kq8bpkr-del/Madeira-interactive/settings/secrets/actions). Nie przesyłaj klucza w rozmowie. Jest używany wyłącznie w workflow skanera.
3. **Actions → Valle de Uco - wyszukiwarka okazji → Run workflow** lub oczekiwanie na kolejny przebieg. Sprawdź końcowy status, nową datę w `okazje.json` i pole `ceny`. Samo dodanie sekretu nie potwierdza poprawnego połączenia.
4. Pierwszą rzeczywistą wycenę porównaj w formularzu źródła i u linii: dwie osoby, PLN, cena całego wyboru lub za osobę, bagaż i wszystkie części trasy. Dopóki jednostka i dodatki nie są potwierdzone, `cenaWyniku` pozostaje kwotą z porównywarki, bez automatycznego mnożenia lub dzielenia. Nie przenoś jej do `raport.calosc`.

Domyślne twarde limity tego skanera: 7 zapytań/dzień, 210/miesiąc, 4/przebieg. Licznik zapisuje się przed żądaniem; błędy również liczymy ostrożnie. Konto może być używane w innych aplikacjach - te limity obejmują tylko ten skaner. Jedna trasa z trzema częściami wymaga kilku wywołań, dlatego darmowy tryb sprawdza warianty rotacyjnie. Samo podłączenie klucza nie daje pełnego sprawdzania 21 tras dwa razy dziennie. Zwiększenie pokrycia wymaga większego uzgodnionego limitu i planu dostawcy. Konfiguracja: `data/wyszukiwarka.json`.

API wybiera jedną ścieżkę przez kolejne części podróży, z zachowaniem tokenu wyboru. Odrzuca błędne daty i lotniska, wczesny wylot 4.11, późny przylot do Buenos Aires i powrót po 14.11. Nie obiecuje znalezienia globalnego minimum w całym grafie lotów. Szczegóły ochrony, stref, przejścia między lotniskami i bagażu wymagają potwierdzenia. Dopiero pełny rekord `loty.json.oferty`, spełniający `flight-rules.js`, może trafić do rekomendacji zakupu.

## Publikacja danych i odporność

Kod pozostaje na `main`. Skaner publikuje wyłącznie `okazje.json` w gałęzi `uco-monitor-data`. Nie edytuje codziennego raportu ani planu i nie uruchamia ponownego wdrożenia całej strony co 6 godzin. Strona pobiera [bieżący skan](https://raw.githubusercontent.com/6b7kq8bpkr-del/Madeira-interactive/uco-monitor-data/okazje.json); w razie awarii pokazuje wyraźnie oznaczoną kopię z ostatniego wdrożenia. Plik ma wyłącznie publiczne tropy, kwoty, trasy i liczniki. GitHub może opóźniać zadania harmonogramu i wyłączyć je po dłuższym braku aktywności repozytorium; kontroluj faktyczny czas ostatniego skanu, nie samą definicję harmonogramu.

Przycisk „Pobierz najnowszy skan” odczytuje zapisany wynik. Nie uruchamia zapytań API ani nie może wyczerpać płatnego limitu. GitHub Actions ma pojedynczą kolejkę i zapis kontrolny licznika w cache. W razie niedostępności lub usunięcia cache nie traktuj licznika jako rozliczenia dostawcy. Skaner kończy automatyczne wyszukiwania po 31.08.2027.

Utrata pojedynczego źródła nie zeruje listy tropów. Brak wyników nie oznacza braku promocji, wyprzedania ani zamkniętej sprzedaży. Błędy 401/403/429 zatrzymują dalsze płatne odczyty danego przebiegu. Surowe odpowiedzi z tokenami, klucze i spersonalizowane linki nie są zapisywane w danych publicznych.

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
