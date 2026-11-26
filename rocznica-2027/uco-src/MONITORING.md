# Monitoring lotów: pełna podróż i Buenos Aires

Zasady dotyczą kolejnych raportów, radaru i ręcznych odczytów. Przeczytaj przed każdą aktualizacją. Źródłem dat i roboczych buforów jest `data/program.json` → `loty.monitoring.reguly`, a cen `budzet`. Nie zmieniaj reguł w codziennym raporcie.

## Wyniki wyszukiwarki okazji

Na początku odczytaj [bieżący skan](https://raw.githubusercontent.com/6b7kq8bpkr-del/Madeira-interactive/uco-monitor-data/okazje.json) i [zasady skanera](WYSZUKIWARKA.md). Sprawdź datę, awarie źródeł oraz kolejkę nieodczytanych tras. Przejrzyj nowe tropy od ostatniej kontroli i sprawdź obiecujące wyceny u linii. Punktacja tropów nie jest oceną pewności oferty, a `cenaWyniku` bez potwierdzonej jednostki nie jest ceną za osobę. Nie zmieniaj historii na podstawie daty skanu. Zachowaj osobne odczyty forów i komentarzy; skrzynka nie jest częścią stałego monitoringu.

Skaner nie zastępuje kontroli dwóch rodzin wyszukiwarek. Używaj go do szybszego znalezienia kandydatów i luk. Nie przepisuj do raportu tokenów, kluczy ani prywatnych linków.

## Co sprawdzać

Wyłącznie pełny chroniony bilet WAW-MDZ / MDZ-BUE / BUE-WAW dla dwóch dorosłych. Sprawdź wylot 5.11 i 4.11 po 20:00. Osobny dolot, krajowy, open-jaw wymagający dokupienia odcinka i wylot spoza Warszawy są wykluczone niezależnie od ceny. Porównuj linie i huby w ramach tego samego biletu.

Podręczny na każdym odcinku wystarczy. Potwierdź rodzaj, wymiary i masę; rejestrowany jest opcjonalny i nie podnosi automatycznie ceny o ryczałt. Najwyżej 2 przesiadki i 30 h w stronę, przesiadki 2-8 h, w BUE minimum 3 h. Reguły w `loty.monitoring.reguly` są nadrzędne wobec historycznych opisów.

### Super okazje z niewielkim kompromisem

Od 26.11.2026 użytkownik dopuszcza niewielkie odstępstwa przy pełnej cenie **do 8000 zł za parę** (4000 zł/os., `budzet.super_okazja`). Szukaj także takich wariantów; nie odrzucaj ich przed zapisaniem kompletu danych. Nie podnoś tego progu w zwykłym raporcie.

Dopuszczalne granice w `reguly.superOkazje`: przesiadka od 1 h 45 min, w BUE od 2 h 45 min, do 9 h; podróż do 32 h w stronę. Najwyżej dwa odstępstwa łącznie: każda przesiadka poza standardowym zakresem i każdy kierunek ponad 30 h liczą się osobno. Pozostałe reguły pozostają bez zmian: WAW, wszystkie odcinki na jednym chronionym bilecie, 2 dorosłych, podręczny, daty, najwyżej dwie przesiadki, stopover co najmniej 24 h i godziny pobytu BUE. Krótsza przesiadka musi należeć do potwierdzonej u linii chronionej trasy; nie składaj jej z osobnych biletów.

Zapisz kandydata w `loty.json.oferty`. `UcoFlights.rank` wyznacza `compromise` oraz konkretne `deviations`; nie wpisuj tych etykiet ręcznie i nie ustawiaj `ready`. Pokazuj cenę pary, każde odstępstwo i - tylko gdy istnieje porównywalna bieżąca pełna wycena - oszczędność. Wygodniejsza oferta w tej samej lub niższej cenie wyklucza kategorię super okazji z kompromisem. Przy braku ceny porównawczej nazwij tę lukę. Nie porównuj szacunków ani historycznych testów z aktualną ceną. Oferta z kompromisem jest do rozważenia; nie trafia do `raport.calosc` ani do automatycznego werdyktu „kupować”.

**Zakaz API cen od 26.11.2026:** nie wywołuj SerpApi, nie uruchamiaj rzeczywistych testów, nie podnoś limitów i nie włączaj `serpapi.enabled`. Zakaz dotyczy wszystkich dat i nie wygasa po otwarciu listopada. Dozwolone: bezpłatne formularze, portale, RSS i fora. Testy kodu wyłącznie offline z atrapami dostawców.

Minimum dwie rodziny wyszukiwarek, jeśli dostępne; Kayak/Momondo liczą się jako jedna. Obiecujące wyniki potwierdzaj u linii. Brak dostępu lub wyceny zapisuj jako lukę. Na wcześniejsze daty można sprawdzać działanie formularza, lecz nie traktować ceny jako oferty na rocznicę.

## Portale, promocje, fora i alerty

- Uruchom `python3 -I ../uco/tools/promo_rss.py --days 3 --json /tmp/uco-rss.json`. Po przerwie dłuższej niż 3 dni rozszerz okno do ostatniego udanego przebiegu (maks. 90 dni). Zapisz **świeży częściowy wynik** wraz z awariami. Nie przedstawiaj starego RSS jako dzisiejszego. Nie traktuj HTML, błędu parsowania ani pustego wyniku jako pełnego pokrycia promocji.
- Osobno sprawdź nowe posty **i komentarze** Fly4free, Forum Fly4free, Pepper, Travel-Dealz, Secret Flying oraz oficjalne kampanie linii. RSS artykułów nie dowodzi przeczytania forów. Źródła i frazy w `loty.monitoring`; wyszukiwarka internetowa jest uzupełnieniem, nie dowodem pełnego odczytu forum.
- Kierunki: MDZ/Mendoza, EZE/AEP/BUE/Buenos Aires, Argentyna/Argentina, SCL/Santiago, GRU/São Paulo. Języki PL/EN/ES, frazy listopad/November/noviembre 2027, stopover, multidestino, open-jaw. Sprawdź również promocję bez nazwy Mendoza, jeśli da się dołączyć sensowny krajowy odcinek.
- Z każdego tropu zachowaj URL, datę publikacji i odczytu, kierunek podróży, daty podróży, termin sprzedaży, bagaż, 2 miejsca, warunki i wynik sprawdzenia u linii. Wyprzedaż z Argentyny do Europy ani historyczna promocja nie są naszą ofertą. Nie wyprowadzaj sezonu wyłącznie z tytułu wpisu.
- Stały monitoring korzysta z publicznych źródeł. Zgoda użytkownika z 26.11 obejmuje użycie Gmaila do zapisów KLM, Iberii, Air Europa i alertów Google Flights/KAYAK oraz odczyt ich potwierdzeń aktywacji, również w spamie. Nie rozszerza jej to na regularny odczyt całej poczty ani newsletterów. Nie publikuj adresu, treści prywatnej korespondencji, spersonalizowanych linków, kodów ani danych par. Rejestr stanu to `program.json -> loty.uslugi`; aktualizacja statusu wymaga potwierdzenia w danej usłudze.
- Przy każdej rodzinie źródeł zapisz w `loty.json.pokrycie` obiekt `id` (z katalogu), `sprawdzono` (ISO ze strefą), `status` (`sprawdzone`, `częściowe`, `błąd`, `wymaga logowania`, `poza kalendarzem`), `wynik` i publiczny `url`. Zapisuj ostatni odczyt, bez danych osobowych. Przy braku sprawdzenia nie odświeżaj daty.
- Dedupikuj URL bez parametrów śledzących; artykuł skopiowany w kilku portalach i kilka tagów tego samego portalu nie są niezależnym potwierdzeniem. Daty bez roku i brak daty wymagają kontroli.

## Uruchomione działania - 26.11.2026

Newsletter KLM aktywowany, zapisano Warszawę Chopina jako preferowane lotnisko. Air Europa aktywowana i potwierdzona linkiem z e-maila. Nie ponawiaj zapisów. Newslettera Iberii nie aktywowano: sprawdzone strony ofert nie udostępniły formularza; promocje Iberii nadal czytamy publicznie. Rezygnujemy z zadania zakładania Iberia Club dla każdej pary, ExpertFlyer Premium, płatnych abonamentów portali i masowych zapisów do newsletterów powielających publiczny radar.

Google Flights nie udostępniał naszych listopadowych dat; ponowna kontrola kalendarza w połowie grudnia należy do istniejącego monitoringu. KAYAK nie pokazał przełącznika śledzenia pełnej trasy multi-city. Nie deklaruj aktywnego alertu ani gwarantowanej daty uruchomienia; nie zastępuj całej trasy alertem na osobny bilet. Nie dodawaj tych pozycji jako zaległych zadań użytkownika. Linki do wyszukiwania są już w panelu wyszukiwarki.

## Zabezpieczenie Buenos Aires

Plan jest stały: MDZ 6.11, MDZ-BUE 12.11, BUE-Europa 13.11, WAW do 14.11. Robocze kryterium komfortu: minimum 24 h między lotami w BUE, przylot 12.11 do 15:59, wylot 13.11 od 18:00. Policz z godzin i stref, nie z samej liczby nocy. Plan hotelu, dostępność pokoju, przechowalni i transferów sprawdź przed zakupem. Nie deklaruj rezerwacji, jeśli jej nie ma.

Dopuszczamy AEP przy przylocie i EZE przy wylocie **podczas noclegu**; nie dopuszczamy zmiany lotniska w krótkiej przesiadce. Godziny odpraw i transferów sprawdzaj przed zakupem. Hotele i transport BUE wspólne dla wariantów są już w budżecie pobytu - nie doliczaj ich drugi raz do biletów. Osobne pozycjonowanie do Madrytu jest poza profilem.

Jeden koszyk, kod rezerwacji ani multi-city nie dowodzą ochrony. Potwierdź wystawienie wspólnego biletu i zakres odpowiedzialności linii, regułę stopoveru oraz odbiór/nadanie bagażu. Osobne bilety są wykluczone. Jeden PNR lub koszyk nie zastępuje potwierdzenia jednego biletu.

Oficjalne warunki Visit Buenos Aires odczytane 26.11.2026: benefity tylko dla pobytów do 30.04.2027, wymagają ponad 24 h i kwalifikującego biletu. **Listopad 2027 jest poza obecną edycją.** Nową edycję sprawdzaj w regulaminie: https://stopover.visitbue.app/bases-y-condiciones?lang=en. Planowanego pobytu nie uzależniaj od darmowego stopoveru ani benefitów.

Po zmianie rozkładu ponownie policz bufory, pobyt BUE i datę powrotu. Wskaż dostępny alternatywny rejs MDZ-BUE na 12.11 i warunki zmiany - nie gwarantuj przyszłego miejsca. Nie pomijaj odcinków biletu. Niczego nie rezerwuj bez decyzji użytkownika.

## Zapis ofert i uczciwe porównanie

`loty.json.oferty` jest listą **rzeczywistych** kandydatów. Pusta lista jest poprawna. Nie wstawiaj przykładowych ofert do pliku produkcyjnego. Schemat obiektu:

- `id`, `nazwa`, `dorosli: 2`, `sprawdzono` (ISO 8601 ze strefą, np. `+01:00`), `url` (publiczna strona linii bez identyfikatora sesji), `potwierdzonaULinii` (boolean).
- `koszty`: lista `{nazwa, plnPara, status, url}`. Kwoty **za parę** w PLN; status `potwierdzone` albo `szacunek`. Dla walut obcych zachowaj również `waluta`, `kwotaPara`, `kurs`, `kursData`. `kosztyKompletne` tylko po kontroli wszystkich biletów, bagażu, podatków, pozycjonowania, dodatkowego hotelu i transferów. Kwota zero dopuszczalna np. dla bagażu w taryfie, lecz musi mieć potwierdzenie. Nie mnoż ceny dla 1 osoby bez sprawdzenia 2 miejsc.
- `odcinki`: kolejne loty `{z, do, wylot, przylot, linia, rejs, bilet, bagazKg, kabinowy}`. Godziny ISO z prawidłowym offsetem. `bilet` to anonimowy identyfikator grupy odcinków (A/B/C), **nigdy numer biletu lub PNR**. `bagazKg` i `kabinowy` dotyczą każdej osoby. Pełna podróż od WAW do WAW na jednym bilecie, ten sam anonimowy identyfikator `bilet` dla wszystkich odcinków. `kabinowy: true` wymagane; `bagazKg` opcjonalne, gdy rejestrowany nie jest kupowany.
- `ochronaPotwierdzona`: potwierdzony zakres ochrony jednego biletu obejmującego wszystkie odcinki. `stopoverWTaryfie`: plan i warunki wszystkich biletów obejmują pobyt 12-13.11. `planBUE`: sprawdzono dostępność hotelu, przechowalni i transferów (to **nie** znaczy zarezerwowano).

Moduł `../uco/flight-rules.js` ocenia te dane wspólnie na stronie i w testach. Brak danych działa na niekorzyść kwalifikacji, nigdy jako automatyczne potwierdzenie. Ważność ceny: 24 h; przed zapłatą ponowna wycena. Osobne bilety nie mogą uzyskać statusu gotowego do zakupu. Ochrona i pełna cena są ważniejsze niż tani nagłówek.

`raport.profil` musi odpowiadać `loty.monitoring.reguly.profil` (`waw-jeden-podreczny-v1`). Nie oznaczaj starego raportu nowym profilem bez ponownej weryfikacji. Raporty sprzed zmiany są archiwalne.

`raport.calosc`: wyłącznie cena zakwalifikowanej oferty, zaokrąglona do 10 zł; inaczej `null`. `raport.ofertaId` wiąże ją z ofertą. `raport.szacunek`: oddzielnie orientacyjna suma z jawnie oznaczonymi ryczałtami. `raport.typCeny`: `potwierdzona` lub `szacunek`. Nigdy nie wydawaj werdyktu kupna z szacunku.

Historia `serie[].hist` zachowuje dawne ceny, daty i statusy. Nowy punkt: `data`, `cena`, `status` (`szacunek` lub `potwierdzona`), `ofertaId` dla potwierdzonego odczytu, `zrodlo`, `uwagi`. Dawny odczyt bez szczegółów nie staje się potwierdzony przez zmianę etykiety. Dla nowego minimum porównuj ten sam produkt: daty, 2 osoby, bagaż, trasy, postój, podział na bilety i poziom weryfikacji. Brak pełnych metadanych wyklucza alert „nowe minimum”; można opisać ruch orientacyjny.

## Weryfikacja

Po zmianie `data/`: `python3 -I build.py` i `python3 -I build.py --check`. Testy bez sieci: `python3 -I tests/test_promo_rss.py`, `node tests/flight-rules.test.cjs`, `node tests/check-offers.cjs`. Potem `node tests/smoke.mjs` według README. Codzienny `raport_fakty.py --check` nadal wymaga dzisiejszego raportu - nie zmieniaj jego daty wyłącznie po to, żeby zaliczyć test. Kalendarze sprzedaży pozostają prognozami, a ich zmianę uzasadnia dopiero dowód z formularza linii.

### Czytelny status i badania bez API

Pierwszy panel w Lotach bierze ofertę wyłącznie z `loty.json.oferty`, przez wspólny `UcoFlights.rank`. RSS ani wycena z wcześniejszego terminu nie podnoszą statusu listopada. Błąd odczytu ofert ma status nieznany; błąd RSS nie blokuje ofert ani formularzy ręcznych. Kwoty w skrócie są dla dwóch osób.

Wyniki ręcznych testów u linii zapisujemy także w `data/badania-lotow.json`, z datą badania, terminem podróży, pełną ceną dla pary (lub null), wynikiem, brakami i następnym krokiem. Po zmianie uruchamiamy `build.py`. Dane techniczne pozostają w `diagnostics/`; publiczny rejestr nie zawiera identyfikatorów sesji, danych pasażerów ani sekretów. Testy są historyczne i nie są automatycznie odświeżanymi ofertami.

Priorytet badań: KLM/Air France przez GRU/SCL, Iberia przez MAD, próba pełnej wyceny WAW w Aerolíneas. Każdorazowo cała trasa i 2 dorosłych, oba dopuszczalne wyloty; dokładne godziny, ochrona wszystkich partnerów i podręczny. Nie powtarzać odrzuconej kombinacji bez zmiany daty/rejsu albo nowej przesłanki. Próbę zablokowanego formularza zapisywać jako lukę, nie brak lotów. Nowe źródło nie jest niezależnym potwierdzeniem, jeśli pokazuje tę samą taryfę partnerów. Nie włączać API.
