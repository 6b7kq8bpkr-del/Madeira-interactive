# Raport lotów – procedura codzienna

**Najpierw przeczytaj [MONITORING.md](MONITORING.md).** To nadrzędne zasady kompletności ofert, źródeł, ochrony i pobytu w Buenos Aires (aktualizacja 26.11.2026).

Raport to blok „Raport lotów” na wierzchu sekcji [Loty](https://6b7kq8bpkr-del.github.io/Madeira-interactive/rocznica-2027/uco/#loty).
Odpowiada na jedno pytanie: **czy dziś kupujemy bilety, a jeśli nie – co się zmieniło od wczoraj i co dalej.**
**Od 26.11.2026 obowiązuje profil `waw-jeden-podreczny-v1`: cała trasa z Warszawy na jednym bilecie, podręczny dopuszczony, zakaz API cen. Starych raportów nie przepisywać na nowy profil bez nowego odczytu.**

**Super okazje z kompromisem:** do 8000 zł za parę dopuszczamy ograniczone odstępstwa komfortu według MONITORING.md i `reguly.superOkazje`. Zapisuj pełną ofertę, cenę oraz konkretne odstępstwa. W raporcie wyróżnij ją jako „do rozważenia”, bez werdyktu kupna i bez wpisywania jej ceny do `calosc`. Obecność takiej oferty nie oznacza spełnienia standardowych kryteriów.

Czyta go osoba, która nie śledzi rynku: ma zrozumieć werdykt po pierwszym zdaniu.

Podróż: Warszawa → Mendoza → Buenos Aires → Warszawa, wylot 4.11 po 20:00 albo 5.11.2027, powrót z Buenos Aires 13.11.2027, 2–4 pary.
Cel 4 500 zł (od 26.11.2026; wcześniej 4 000 zł), próg 4 800 zł na osobę za kompletną podróż z podręcznym i wszystkimi odcinkami na jednym bilecie (reguły decyzji: `loty.skala` w `data/program.json`).

## Co wolno zmieniać

Strona ma codziennie odpowiadać obecnej sytuacji w lotach – nie tylko blok raportu, ale każde miejsce, które ją opisuje.

W `../uco/loty.json`:

- `raport` – zastępujesz w całości, codziennie, także gdy nic się nie zmieniło (wtedy piszesz to wprost);
- `status` i `zaktualizowano` – „Stan na DD.MM.RRRR: …”, 4–6 zdań streszczenia raportu, z dzisiejszą datą;
- `sygnaly` – dopisujesz na początku listy wyłącznie nowy fakt z adresem źródła; najpierw sprawdź, czy takiego wpisu już nie ma. Format jak w istniejących wpisach: `data`, `typ`, `kierunek` (`wzrost` / `spadek` / `neutralnie` – wpływ na ceny), `waga` 1–3, `opis`, `url`.
- `rss` – wynik radaru promocji z dzisiejszego uruchomienia `promo_rss.py` (krok 5);
- `serie[].hist` i `historia` - dzienny zapis cen z poziomem weryfikacji.
- `oferty` i `pokrycie` - rzeczywiste oferty i odczyty źródeł według MONITORING.md; bez danych prywatnych.

W `../uco/promocje.json`: `zaktualizowano` (dziś), `nastepny` (jutro), `status` (2–3 zdania: czy jest promocja obejmująca listopad 2027) i `wpisy` – dopisujesz tylko realną ofertę z adresem źródła, w formacie istniejących wpisów; wpisy o ofertach, które wygasły albo przestały istnieć, oznacz `pasuje: "nie"` i dopisz to w `ocena`.

W `data/program.json` – tylko te pola i tylko wtedy, gdy dzisiejsze fakty im przeczą:

- `loty.kalendarz.fazy[]` bieżącej fazy: `decyzja` (pokazuje się na górze strony jako „Teraz” – ma mówić, co robić dziś; najwyżej 330 znaków, bo trafia też do podsumowania dla par), `co`, `automat`;
- `loty.zadania[]`: `od`, `do`, `opis` – gdy zadania nie da się wykonać w terminie z przyczyn zewnętrznych albo zmienił się sposób. Terminu, który po prostu minął, nie przesuwasz: zadanie ma zostać widoczne jako zaległe;
- `decyzje[].ankieta` – wynik ankiety par dla otwartych decyzji (sekcja „Ankieta par”); innych pól decyzji nie zmieniasz;
- `loty.okna.linie[].dni` i `loty.okna.zrodlo` - tylko na podstawie jawnej najpóźniejszej wybieralnej daty w formularzu linii. Brak ceny nie jest dowodem horyzontu. Wyjątek: Iberia i Aerolíneas Argentinas są przypięte w testach – różnicę tylko zgłoś;
- `budzet.kursy.USD`, `EUR`, `data`, `zrodlo` – w każdy poniedziałek według wiersza „KURS NBP” ze skryptu (dwa miejsca po przecinku), a w inny dzień tylko gdy skrypt wypisze „PRZELICZYĆ BUDŻET”. Po zmianie podaj w punkcie „Kursy:”, ile kosztuje teraz wariant polecany.

Po każdej zmianie w `data/` uruchom `python3 -I build.py` – przelicza `../uco/data.js` i `../uco/index.html`; te pliki commitujesz razem ze źródłem. Każdą zmianę na stronie wymień w raporcie w punkcie „Poprawione na stronie:”.

Nie ruszasz: `nastepny`, `skrzynka`, `template.html`, `skrot.html`, testów, workflow ani reszty `data/` (hotele, dni, kwoty budżetu, reguły skali cen, treść decyzji poza polem `ankieta`). Usterki w tych miejscach opisz w raporcie w punkcie „Do poprawienia na stronie:”.

## Kolejność

1. Zacznij od aktualnego `main`.
2. `python3 -I ../uco/tools/raport_fakty.py` – kurs NBP, odchylenie od kursu budżetu, które linie sprzedają dziś nasze daty, faza, terminy. Tych liczb nie licz z pamięci.
3. Przeczytaj w `loty.json`: wczorajszy `raport`, `status`, ostatni wpis `historia`, `sygnaly` z 7 dni, `rss.trafienia`, `skrzynka`; w `promocje.json`: `status` i wpisy z 7 dni.
4. Sprawdź ceny na nasze daty (5–13.11.2027 i 4–13.11.2027), w minimum dwóch rodzinach wyszukiwarek i u linii dla obiecujących ofert; dla 2 dorosłych, bez kończenia po pierwszym źródle:
   - KAYAK: trzy części WAW-MDZ / MDZ-BUE / BUE-WAW, dwie osoby, daty z `loty.monitoring.reguly`. Powtórz dla wylotu 4.11 po 20:00.
   - Google Flights, Skyscanner i dostępne formularze linii: ten sam pełny profil. Nie szukaj osobnych krajowych, osobnych dolotów ani VIE/BER jako oferty do zakupu.
   - Kontrola u linii: jedna chroniona taryfa, stopover, sensowne przesiadki, podręczny na każdym rejsie. Nie dodawaj ryczałtu za rejestrowany. Brak wyniku nie dowodzi zamkniętej sprzedaży.
   - Wyłącznie bezpłatne formularze. Nie wywołuj API cen i nie zmieniaj blokady `serpapi.enabled`.

5. Radar i wiadomości: `python3 -I ../uco/tools/promo_rss.py --days 3 --json "$TMPDIR/rss.json"` i wynik (`sprawdzono`, `kanaly`, `trafienia`) zapisz jako `rss` w `loty.json`; zapisz także świeży częściowy wynik z listą awarii. Jeśli narzędzie nie utworzyło wyniku, zachowaj stary `rss` bez zmiany daty i ujawnij lukę. Osobno przeczytaj fora i komentarze według MONITORING.md. Potem wiadomości z ostatnich 48 godzin (trafienia radaru + wyszukiwarka): promocje i kampanie do Argentyny (Iberia, Air Europa, Aerolíneas, LATAM, ITA, Turkish, Ethiopian, Air France/KLM, Lufthansa), zmiany tras i przewoźników na Europa–Buenos Aires/Mendoza, Ezeiza, strajki, ceny paliwa.
6. Napisz `raport` (układ niżej), `status`, ewentualne `sygnaly`, zaktualizuj `promocje.json`; popraw w `data/program.json` to, co przestało być prawdą, i przebuduj stronę.
7. Sprawdź: `python3 -I ../uco/tools/raport_fakty.py --check` i `python3 -I build.py --check`; jeśli jest Node – testy z `tests/` (README).
8. Commit „Loty: stan na RRRR-MM-DD” i publikacja według instrukcji zadania. Publikacja strony rusza sama po wypchnięciu na `main` i przejściu testów; przyczynę błędu testów pokazują adnotacje przebiegu w GitHub Actions.

## Założenia robocze grupy (od 20.11.2026)

- **Trzy pary.** Wszystkie kwoty „na parę” i cała podróż liczone dla sześciu osób.
- **Wylot w piątek 5.11.2027.** `raport.calosc`, serie cen i werdykt liczysz dla wylotu 5.11. Wylot w czwartek 4.11 (po 20:00) sprawdzasz codziennie obok: jeśli ten sam typ biletu jest w czwartek tańszy o co najmniej 300 zł na osobę, napisz to w punkcie „Ceny na nasze daty:” z obiema cenami i godziną wylotu, a w kroku `teraz` dodaj „do decyzji: czwartek tańszy o X zł”. Mniejszej różnicy nie zgłaszasz. Wylot w czwartek przed 20:00 nie wchodzi w grę.

- **Postój w Buenos Aires.** Obowiązkowy pobyt 12-13.11 w każdym wariancie do zakupu. Reguły, bufory i wymagany profil opisuje MONITORING.md. Nie zakładaj ochrony na podstawie multi-city. Osobne loty krajowe po 650 zł to szacunek, nie oferta porównawcza.

## Historia cen

Wykres trendu, ranking linii i kafelek „Najlepsza kompletna podróż” czytają `serie[].hist` w `loty.json`. Codziennie dopisujesz po jednym punkcie `{"data": "RRRR-MM-DD", "cena": N}` do każdej serii, którą da się dziś wycenić; istniejących punktów nie zmieniasz, a jeśli punkt z dzisiejszą datą już jest – zastępujesz go.

- Nowy punkt ceny musi dotyczyć pełnego jednego biletu WAW-MDZ-BUE-WAW ze stopoverem i podręcznym dla dwóch osób. `raport.profil` ustaw na aktualny profil dopiero po nowej weryfikacji. Nie dopisuj hipotetycznych kwot z ryczałtami do historii pełnego biletu.
- Historyczne serie MAD/VIE/BER i osobnych biletów pozostają archiwum; nie dopisuj im obserwacji jako bieżących ofert do zakupu. Nie przeliczaj wstecz dawnych cen przez usunięcie bagażu.
- Do `historia` dopisz jeden wpis dziennie: `data`, `zrodlo: "raport dzienny"`, `faza`, `najtansza` (`id` serii, `cena`, `opis` – z czego się składa) i `uwaga` (jedno–dwa zdania).
- `raport.calosc` pochodzi wyłącznie z kwalifikującej się oferty według MONITORING.md; inaczej `null`. Szacunek z dodatkami zapisuj w `raport.szacunek`. Plan B VIE/BER nie zastępuje planu z Warszawy.

## Ankieta par

Pary odpowiadają na otwarte decyzje na stronie `skrot.html`; odpowiedzi leżą poza repozytorium. Adres i kod dostępu są w instrukcji zadania, nie tutaj – repozytorium jest publiczne, więc kodu ani imion par nigdy nie zapisujesz w żadnym pliku ani w raporcie.

- Pobierz odpowiedzi (GET z kodem wyłącznie w nagłówku `x-uco-code`, nigdy w adresie). Dla każdej otwartej decyzji, na którą ktoś odpowiedział, wpisz w `decyzje[].ankieta` w `data/program.json` same liczby, np. „3 pary – 2 odpowiedzi, 4 pary – 1 odpowiedź (stan na 20.11)”. Gdy nikt nie odpowiedział, pola nie dodajesz; gdy odpowiedzi zniknęły, usuwasz je.
- Decyzji nie zamykasz i nie zmieniasz budżetu ani planu pod wynik ankiety. Gdy co najmniej dwie pary odpowiedziały i wszystkie odpowiedzi są zgodne, dopisz do pola „– zgodnie” i wymień decyzję w raporcie w kroku `teraz` jako gotową do zamknięcia przez organizatora.
- Jeśli ankiety nie da się odczytać, zostaw pola bez zmian i napisz to w podsumowaniu przebiegu.

## Powiadomienia

Powiadomienia wyłącznie zgodnie z autoryzacją i instrukcją uruchamiającego zadania; sama procedura nie upoważnia do wysyłki. Nigdy nie wysyłaj „KUPOWAĆ” dla szacunku. Gdy `calosc` jest null, podaj „brak potwierdzonej oferty”, ewentualnie jawny szacunek; nie licz spadku null do zera. Nie porównuj szacunku z ceną potwierdzoną jako nowego minimum. W zwykły dzień to jedna linia, najwyżej 120 znaków: „Loty DD.MM: X zł/os. (−Y zł od wczoraj | +Y zł | bez zmian), werdykt w dwóch–trzech słowach” – X to `raport.calosc`, zmiana liczona do `calosc` z poprzedniego raportu. Gdy zachodzi któryś przypadek z listy, zamiast zwykłej linii wysyłasz jego treść (kilka przypadków łączysz w jedną wiadomość):

- werdykt 🎯 albo 🟢 – „KUPOWAĆ: linia, cena za osobę, trasa”;
- nowe minimum: porównuj wyłącznie potwierdzone pełne oferty z tym samym `profil` i zakresem bagażu. Starsze serie, pojedyncze odcinki i szacunki nie są porównywalną bazą. Bez takiej bazy nie ogłaszaj rekordu;
- spadek `raport.calosc` o 300 zł lub więcej od wczoraj, jeśli nie jest to już zgłoszone jako nowe minimum;
- werdykt 🔴 – jedno zdanie, co się stało;
- raportu nie udało się opublikować – „Loty Argentyna: raport z DD.MM nieopublikowany – powód”;
- ankieta: decyzja ma zgodne odpowiedzi co najmniej dwóch par – „Argentyna: decyzja … gotowa do zamknięcia”, raz na decyzję (nie powtarzaj, gdy pole `ankieta` już wczoraj kończyło się na „– zgodnie”).

## Układ raportu

```json
{"data": "RRRR-MM-DD", "werdykt": "…", "profil": "waw-jeden-podreczny-v1", "calosc": null, "stan": "…", "punkty": [["Nagłówek:", "treść"], …], "teraz": ["…"], "zrodla": [{"label": "…", "url": "https://…"}]}
```

**`werdykt`** – jedno krótkie zdanie, najwyżej 140 znaków, zaczyna się od ikony; liczby zostaw na punkt „Ceny na nasze daty”:

| Ikona | Kiedy |
|---|---|
| 🎯 Kupować dziś | kompletna podróż z bagażem ≤ 4 500 zł/os. na nasze daty, potwierdzona u linii |
| 🟢 Kupować, jeśli… | 4 500–4 800 zł/os. i spełniony warunek ze skali (tania klasa się kończy albo jest po 21.05.2027) |
| 🟡 Obserwować | cena do 5 000 zł/os. albo promocja, która może objąć nasze daty |
| ⚪ Jeszcze nie kupujemy | brak cen na nasze daty albo ceny powyżej 5 000 zł/os. |
| 🔴 Uwaga | zdarzenie, które wymaga decyzji grupy: upadłość linii, zamknięcie lotniska, odwołana trasa, zbliżający się twardy termin 31.08.2027 |

**`calosc`** - cena potwierdzonej kompletnej oferty na osobę (do 10 zł), związana przez `ofertaId` z `oferty`; inaczej `null`. `szacunek` i `typCeny` są oddzielne. Suma ceny z wyszukiwarki i ryczałtów nie może wywołać werdyktu kupna.

**`stan`** – 2–3 zdania o tym, czy i za ile da się dziś wycenić nasze daty; strona pokazuje je przy skali cen i w tabeli cen, dopóki monitor nie zapisze kompletnej podróży.

**`tydzien`** – tylko w niedzielę (w pozostałe dni przepisz wartość z poprzedniego raportu bez zmian): podsumowanie tygodnia dla pozostałych par, do wklejenia w grupie. Zwykły tekst, 4–6 krótkich linii, najwyżej 600 znaków: werdykt, jak zmieniła się cena całej podróży od poprzedniej niedzieli (z serii cen), co grupa ma ustalić i do kiedy, adres skrótu https://6b7kq8bpkr-del.github.io/Madeira-interactive/rocznica-2027/uco/skrot.html. Bez żargonu i bez nazw taryf. Pokazuje się na stronie `skrot.html` z przyciskiem kopiowania; nikomu go nie wysyłasz.

**`punkty`** – 4–6 punktów, każdy najwyżej 450 znaków. Strona pokazuje dwa pierwsze, resztę zwija pod „Szczegóły raportu” – dlatego dwa pierwsze muszą wystarczyć komuś, kto nie rozwinie reszty. Kolejność (pomijasz punkty, w których nie ma nic nowego; szczegóły i pełne listy cen idą do `sygnaly`, nie do raportu):

1. `Od wczoraj:` – co się zmieniło względem poprzedniego raportu. Jeśli nic: „bez zmian od DD.MM” i jedno zdanie, co sprawdzono.
2. `Ceny na nasze daty:` – najtańszy pełny bilet zgodny z profilem i odległość od celu. Gdy brak wyceny, nazwij lukę; termin dostępności podaj tylko z potwierdzeniem w źródle.
3. `Sprzedaż na nasze daty:` – które linie sprzedają już wylot i powrót (skrypt + to, co faktycznie widać w wyszukiwarce; rozbieżność nazwij).
4. `Przesiadki i ochrona:` - rozkład najtańszego pełnego biletu z Warszawy, długość przesiadek, stopover i status potwierdzenia u linii. Wcześniejsze terminy oznacz jako test, bez API cen.
5. `Rynek:` – przewoźnicy, trasy, lotniska, paliwo: tylko to, co zmienia cenę albo ryzyko naszej podróży.
6. `Kampanie i promocje:` – co trwa, czy obejmuje listopad 2027, ile brakuje do celu.
7. `Kursy:` – wiersz ze skryptu po polsku. Przy odchyleniu dolara ≥ 3% zmień `budzet.kursy.USD` (zasady wyżej) i napisz, o ile zmienił się koszt na parę i zapas do sufitu.
8. `Poprawione na stronie:` – co dziś zmieniono w fazie, zadaniach, tabeli sprzedaży albo kursie.
9. `Do poprawienia na stronie:` – to, czego nie wolno ci zmienić, a jest nieaktualne.

**`teraz`** – 3–5 kroków z datą, od najbliższego. Wyłącznie dziś i przyszłość; zaległe zadania grupy wymień jako pierwsze („Dziś: …”).

**`zrodla`** – każda liczba i każdy fakt z raportu ma tu adres źródła; 5–10 pozycji.

## Reguły

- Żadnej liczby bez źródła. Cena odczytana dziś – bez dopisku; cena z wcześniejszego odczytu – z datą („monitor 15.11”).
- Cena w jedną stronę nie jest ceną podróży. Podręczny jest wystarczający; potwierdź jego limity na każdym odcinku. Nie dodawaj kosztu rejestrowanego bez wyboru użytkownika.
- Jeśli źródła nie dało się odczytać, napisz to („Kayaka nie udało się dziś odczytać”) – nie przenoś wczorajszej liczby jako dzisiejszej.
- Wiadomość z jednego źródła opisz jako taką („według …”), dopóki nie potwierdzi jej linia albo drugie źródło.
- Liczby dni z kalendarzy linii są niepotwierdzone: gdy wyszukiwarka pokazuje co innego niż skrypt, wierz wyszukiwarce i popraw tabelę (zasady wyżej).
- Język: polski, pełne zdania, bez skrótów branżowych (zamiast „RT” – „w obie strony”, zamiast „OW” – „w jedną stronę”); kwoty jako „4 000 zł”, daty jako „17.11”.
- Niczego nie kupujesz, nie rezerwujesz i nie zakładasz kont.
