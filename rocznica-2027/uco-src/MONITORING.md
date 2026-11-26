# Monitoring lotów: pełna podróż i Buenos Aires

Zasady dotyczą kolejnych raportów, radaru i ręcznych odczytów. Przeczytaj przed każdą aktualizacją. Źródłem dat i roboczych buforów jest `data/program.json` → `loty.monitoring.reguly`, a cen `budzet`. Nie zmieniaj reguł w codziennym raporcie.

## Wyniki wyszukiwarki okazji

Na początku odczytaj [bieżący skan](https://raw.githubusercontent.com/6b7kq8bpkr-del/Madeira-interactive/uco-monitor-data/okazje.json) i [zasady skanera](WYSZUKIWARKA.md). Sprawdź datę, awarie źródeł oraz kolejkę nieodczytanych tras. Przejrzyj nowe tropy od ostatniej kontroli i sprawdź obiecujące wyceny u linii. Punktacja tropów nie jest oceną pewności oferty, a `cenaWyniku` bez potwierdzonej jednostki nie jest ceną za osobę. Nie zmieniaj historii na podstawie daty skanu. Zachowaj osobne odczyty forów, komentarzy i skrzynki.

Skaner nie zastępuje kontroli dwóch rodzin wyszukiwarek. Używaj go do szybszego znalezienia kandydatów i luk. Nie przepisuj do raportu tokenów, kluczy ani prywatnych linków.

## Co sprawdzać

Codziennie wyceń sześć scenariuszy z `loty.monitoring.scenariusze`, każdy dla **2 dorosłych**, wylot 5.11 oraz 4.11 po 20:00. Nie przerywaj po pierwszej odpowiadającej wyszukiwarce: minimum dwie rodziny wyszukiwarek (Kayak/Momondo liczą się jako jedna), a obiecujące wyniki potwierdź u sprzedającej linii. Brak dostępu zapisuj jako lukę. Scenariusze spoza Warszawy są planem B do decyzji grupy; nie wygrywają automatycznie z planem podstawowym.

1. Jeden bilet WAW-MDZ / MDZ-BUE / BUE-WAW z nocą 12-13.11.
2. Open-jaw WAW-MDZ / EZE-WAW oraz osobny MDZ-AEP lub EZE 12.11.
3. WAW-EZE-WAW plus EZE-MDZ 6.11 i MDZ-AEP lub EZE 12.11.
4. Osobny dolot WAW-MAD oraz chroniony bilet z Madrytu, również z nocą w BUE; powrót do WAW 14.11, wszystkie dodatki i nocleg buforowy.
5. VIE/BER z dojazdem, parkingiem, hotelem i powrotem do domu do 14.11. Weryfikuj godziny całego dojazdu osobno.
6. Huby SCL/GRU oraz europejskie open-jaw tylko przy rzeczywistej ofercie na komplet odcinków. Nie zakładaj partnerstwa ani sprzedawalności.

Zwykłe WAW-MDZ-WAW bez nocy w Buenos Aires jest wyłącznie punktem odniesienia. Nie można rekomendować go zamiast uzgodnionego planu. Oceniaj cenę **oraz** czas, ochronę, bagaż i czas w mieście. Dla każdej kombinacji podaj, czego brakuje do zakupu, zamiast bezwarunkowego „najtańsza”.

## Portale, promocje, fora i alerty

- Uruchom `python3 -I ../uco/tools/promo_rss.py --days 3 --json /tmp/uco-rss.json`. Po przerwie dłuższej niż 3 dni rozszerz okno do ostatniego udanego przebiegu (maks. 90 dni). Zapisz **świeży częściowy wynik** wraz z awariami. Nie przedstawiaj starego RSS jako dzisiejszego. Nie traktuj HTML, błędu parsowania ani pustego wyniku jako pełnego pokrycia promocji.
- Osobno sprawdź nowe posty **i komentarze** Fly4free, Forum Fly4free, Pepper, Travel-Dealz, Secret Flying oraz oficjalne kampanie linii. RSS artykułów nie dowodzi przeczytania forów. Źródła i frazy w `loty.monitoring`; wyszukiwarka internetowa jest uzupełnieniem, nie dowodem pełnego odczytu forum.
- Kierunki: MDZ/Mendoza, EZE/AEP/BUE/Buenos Aires, Argentyna/Argentina, SCL/Santiago, GRU/São Paulo. Języki PL/EN/ES, frazy listopad/November/noviembre 2027, stopover, multidestino, open-jaw. Sprawdź również promocję bez nazwy Mendoza, jeśli da się dołączyć sensowny krajowy odcinek.
- Z każdego tropu zachowaj URL, datę publikacji i odczytu, kierunek podróży, daty podróży, termin sprzedaży, bagaż, 2 miejsca, warunki i wynik sprawdzenia u linii. Wyprzedaż z Argentyny do Europy ani historyczna promocja nie są naszą ofertą. Nie wyprowadzaj sezonu wyłącznie z tytułu wpisu.
- Czytaj nowe wiadomości w już autoryzowanej skrzynce i Spam od ostatniego odczytu. Nie publikuj danych kont, treści prywatnej korespondencji, spersonalizowanych linków, kodów ani danych par. Nie twórz kont, nie kupuj abonamentów i nie aktywuj zapisów bez upoważnienia. Checkbox na stronie nie jest potwierdzeniem subskrypcji.
- Przy każdej rodzinie źródeł zapisz w `loty.json.pokrycie` obiekt `id` (z katalogu), `sprawdzono` (ISO ze strefą), `status` (`sprawdzone`, `częściowe`, `błąd`, `wymaga logowania`, `poza kalendarzem`), `wynik` i publiczny `url`. Zapisuj ostatni odczyt, bez danych osobowych. Przy braku sprawdzenia nie odświeżaj daty.
- Dedupikuj URL bez parametrów śledzących; artykuł skopiowany w kilku portalach i kilka tagów tego samego portalu nie są niezależnym potwierdzeniem. Daty bez roku i brak daty wymagają kontroli.

## Zabezpieczenie Buenos Aires

Plan jest stały: MDZ 6.11, MDZ-BUE 12.11, BUE-Europa 13.11, WAW do 14.11. Robocze kryterium komfortu: minimum 24 h między lotami w BUE, przylot 12.11 do 15:59, wylot 13.11 od 18:00. Policz z godzin i stref, nie z samej liczby nocy. Plan hotelu, dostępność pokoju, przechowalni i transferów sprawdź przed zakupem. Nie deklaruj rezerwacji, jeśli jej nie ma.

Dopuszczamy AEP przy przylocie i EZE przy wylocie **podczas noclegu**; nie dopuszczamy zmiany lotniska w krótkiej przesiadce. Godziny odpraw i transferów sprawdzaj przed zakupem. Hotele i transport BUE wspólne dla wariantów są już w budżecie pobytu - nie doliczaj ich drugi raz do biletów. Dodatkowy hotel przy pozycjonowaniu do Madrytu jest kosztem tego wariantu.

Jeden koszyk, kod rezerwacji ani multi-city nie dowodzą ochrony. Potwierdź wystawienie wspólnego biletu i zakres odpowiedzialności linii, regułę stopoveru oraz odbiór/nadanie bagażu. Przy osobnych biletach wymagamy minimum 5 h na tym samym lotnisku, a przed kolejnym lotem dalekim 12 h i nocy. Bufory są naszymi założeniami, nie gwarancją. Bez porównywalnej chronionej ceny nie stwierdzaj oszczędności 800 zł/os.

Oficjalne warunki Visit Buenos Aires odczytane 26.11.2026: benefity tylko dla pobytów do 30.04.2027, wymagają ponad 24 h i kwalifikującego biletu. **Listopad 2027 jest poza obecną edycją.** Nową edycję sprawdzaj w regulaminie: https://stopover.visitbue.app/bases-y-condiciones?lang=en. Planowanego pobytu nie uzależniaj od darmowego stopoveru ani benefitów.

Po zmianie rozkładu ponownie policz bufory, pobyt BUE i datę powrotu. Wskaż dostępny alternatywny rejs MDZ-BUE na 12.11 i warunki zmiany - nie gwarantuj przyszłego miejsca. Nie pomijaj odcinków biletu. Niczego nie rezerwuj bez decyzji użytkownika.

## Zapis ofert i uczciwe porównanie

`loty.json.oferty` jest listą **rzeczywistych** kandydatów. Pusta lista jest poprawna. Nie wstawiaj przykładowych ofert do pliku produkcyjnego. Schemat obiektu:

- `id`, `nazwa`, `dorosli: 2`, `sprawdzono` (ISO 8601 ze strefą, np. `+01:00`), `url` (publiczna strona linii bez identyfikatora sesji), `potwierdzonaULinii` (boolean).
- `koszty`: lista `{nazwa, plnPara, status, url}`. Kwoty **za parę** w PLN; status `potwierdzone` albo `szacunek`. Dla walut obcych zachowaj również `waluta`, `kwotaPara`, `kurs`, `kursData`. `kosztyKompletne` tylko po kontroli wszystkich biletów, bagażu, podatków, pozycjonowania, dodatkowego hotelu i transferów. Kwota zero dopuszczalna np. dla bagażu w taryfie, lecz musi mieć potwierdzenie. Nie mnoż ceny dla 1 osoby bez sprawdzenia 2 miejsc.
- `odcinki`: kolejne loty `{z, do, wylot, przylot, linia, rejs, bilet, bagazKg, kabinowy}`. Godziny ISO z prawidłowym offsetem. `bilet` to anonimowy identyfikator grupy odcinków (A/B/C), **nigdy numer biletu lub PNR**. `bagazKg` i `kabinowy` dotyczą każdej osoby. Pełna podróż od WAW do WAW, także osobne doloty. Plan B VIE/BER pozostaje kandydatem do osobnej decyzji.
- `ochronaPotwierdzona`: potwierdzony zakres ochrony wewnątrz każdego wspólnego biletu, nie ochrona między osobnymi biletami. `stopoverWTaryfie`: plan i warunki wszystkich biletów obejmują pobyt 12-13.11. `planBUE`: sprawdzono dostępność hotelu, przechowalni i transferów (to **nie** znaczy zarezerwowano).

Moduł `../uco/flight-rules.js` ocenia te dane wspólnie na stronie i w testach. Brak danych działa na niekorzyść kwalifikacji, nigdy jako automatyczne potwierdzenie. Ważność ceny: 24 h; przed zapłatą ponowna wycena. Dla osobnych biletów moduł wymaga aktualnej chronionej oferty porównawczej z tym samym dniem wylotu i różnicy minimum `budzet.min_oszczednosc`. Ochrona i pełna cena są ważniejsze niż tani nagłówek.

`raport.calosc`: wyłącznie cena zakwalifikowanej oferty, zaokrąglona do 10 zł; inaczej `null`. `raport.ofertaId` wiąże ją z ofertą. `raport.szacunek`: oddzielnie orientacyjna suma z jawnie oznaczonymi ryczałtami. `raport.typCeny`: `potwierdzona` lub `szacunek`. Nigdy nie wydawaj werdyktu kupna z szacunku.

Historia `serie[].hist` zachowuje dawne ceny, daty i statusy. Nowy punkt: `data`, `cena`, `status` (`szacunek` lub `potwierdzona`), `ofertaId` dla potwierdzonego odczytu, `zrodlo`, `uwagi`. Dawny odczyt bez szczegółów nie staje się potwierdzony przez zmianę etykiety. Dla nowego minimum porównuj ten sam produkt: daty, 2 osoby, bagaż, trasy, postój, podział na bilety i poziom weryfikacji. Brak pełnych metadanych wyklucza alert „nowe minimum”; można opisać ruch orientacyjny.

## Weryfikacja

Po zmianie `data/`: `python3 -I build.py` i `python3 -I build.py --check`. Testy bez sieci: `python3 -I tests/test_promo_rss.py`, `node tests/flight-rules.test.cjs`, `node tests/check-offers.cjs`. Potem `node tests/smoke.mjs` według README. Codzienny `raport_fakty.py --check` nadal wymaga dzisiejszego raportu - nie zmieniaj jego daty wyłącznie po to, żeby zaliczyć test. Kalendarze sprzedaży pozostają prognozami, a ich zmianę uzasadnia dopiero dowód z formularza linii.
