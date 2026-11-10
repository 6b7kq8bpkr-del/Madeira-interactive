# Valle de Uco 2027 – źródła strony

Strona `../uco/` (https://6b7kq8bpkr-del.github.io/Madeira-interactive/rocznica-2027/uco/) jest budowana z tego katalogu.
Pliki `../uco/data.js`, `../uco/index.html` i `../uco/plan.ics` są generowane – zmiany wprowadzaj tutaj.

| Plik | Zawartość |
|---|---|
| `template.html` | szablon strony: HTML, CSS i JS (kopiowany do `../uco/index.html`) |
| `data/program.json` | program dnia po dniu, warianty hoteli, budżet, upgrade’y, loty, Buenos Aires, przygotowania; `budzet` – sufit na parę, cel (`cel`, 4 000 zł/os.) i progi oceny cen lotów (cel i próg nadpisują `cel` i `prog` w `loty.json`); `loty.skala` – skala cen z decyzjami na stronie; `decyzje` – otwarte i zamknięte decyzje (opcje, rekomendacja, termin) w sekcji „Decyzje i terminy”; `rezerwacje[].od/do/k` i `loty.zadania[].do` zasilają oś czasu; `uwagi[].kat` grupuje notatki; `days[].noc` to nocleg w „Planie w pigułce”; `decyzje[].opcje[][3]` to wartość wyboru na karcie (dla `pary` i `hotele` zsynchronizowana z przełącznikami budżetu), `decyzje[].wybor: false` wyłącza wybór; `platnosci` – pozycje „Kiedy płacimy” liczone z budżetu; `budzet.kursy` – kursy EUR/USD dla kalkulatora, cen-wyzwalaczy i całego budżetu (sekcja „Kurs dolara” niżej); `loty.wyzwalacze` – scenariusze z dodatkami, z których strona liczy cenę w wyszukiwarce odpowiadającą celowi i progowi; `loty.okna` – liczba dni, na ile naprzód sprzedaje każda linia, z czego strona liczy daty otwarcia wylotu i powrotu |
| `data/extra.json` | rytm dnia, „wow”, etykiety dojazdu |
| `data/hotele.json` | karty hoteli z badania (ceny, oceny, linki, współrzędne) |
| `data/zdjecia.json` | zdjęcia z wolnymi licencjami: podpis, autor, licencja, źródło i nazwa gotowych plików w `../uco/img/` |
| `build.py` | składa `data.js`, `index.html` i `plan.ics` |
| `tests/smoke.mjs` | testy w przeglądarce (Playwright) |

`../uco/loty.json` i `../uco/promocje.json` nie są generowane – aktualizują je zaplanowani agenci (monitor cen, radar promocji, skrzynka alertów).

## Budowanie

```sh
python3 -I build.py           # zapisuje ../uco/
python3 -I build.py --check   # nic nie zapisuje; błąd, gdy ../uco/ nie zgadza się ze źródłami
```

Wystarczy sam Python 3. `build.py` kończy się błędem, gdy nie znajdzie zdjęcia dla dnia, pasa, mozaiki albo zdjęcia głównego (dobierane po fragmencie podpisu). Nowe zdjęcie: oryginał do `zdjecia/` (poza gitem), wpis w `data/zdjecia.json` – wtedy `build.py` potrzebuje ImageMagicka (`convert`), żeby zrobić wersje 720 i 1800 px.

### Kurs dolara – jedno źródło

Budżet liczy się z `budzet.kursy.USD` w `data/program.json` (kurs średni NBP; `data` i `zrodlo` pokazują się na stronie). Żeby przeliczyć budżet po nowym kursie, wystarczy zmienić `USD` (i `EUR` dla lotów), `data`, `zrodlo` i uruchomić `build.py`:

- noclegi i bus są w danych w USD (`hotels[].model`, `grupa.transport_usd`) – strona mnoży je przez kurs;
- koszty na miejscu zapisane w zł (`days[].cost`, `hotels[].budget.jedzenie` i `wycieczki_bilety`, `upgrade.opcje[].zl`) są po kursie `budzet.kursy.baza_kosztow` – `build.py` skaluje je do aktualnego kursu (zaokrąglenie do 10 zł); tych kwot **nie** zmieniaj przy zmianie kursu;
- kwoty w opisach to znaczniki liczone przez `build.py` tym samym wzorem co tabela budżetu, np. `{suma:0}` (suma wariantu 0 przy trzech parach i lotach w progu, do 10 zł), `{suma:0:4000}` (przy lotach po 4 000 zł/os.), `{razem:0}` (dokładnie), `{nocleg:0}`, `{bilans:0}` („zapas ok. … zł” albo „ok. … zł ponad sufit”), `{zapas:0}`, `{maxlot:0}` (najwyższa cena lotu na osobę mieszcząca się w suficie; `{maxlot:2:-180}` – przy noclegu tańszym o 180 USD), `{bus:3}`, `{busdiff:2:3}`, `{up:pi}`, `{upsum:pi:st}`, `{poup:0:4800:pi:st}`, `{diff:2:0}`, `{usd:660}`, `{koszty}`, `{jedzenie}`, `{wycieczki}`, `{poza}`, `{kurs}`, `{kurs_data}`. Nieznany znacznik zatrzymuje build.

Przy budowaniu wszystkie teksty dostają twarde spacje po jednoliterowych słowach (w, z, i, a, o, u) oraz między liczbą a tysiącami i jednostką. To samo robi `nb()` w szablonie dla tekstów składanych w przeglądarce.

## Testy

```sh
cd tests
npm ci
npx playwright install chromium
node smoke.mjs
```

Sprawdzają `loty.json`, `promocje.json` i `plan.ics`, a w Chromium na szerokościach 320–1920 px w jasnym i ciemnym motywie:
błędy JS, brakujące pliki, poziome przewijanie (każda zakładka pulpitu lotów), powtórzone id, martwe kotwice, zdjęcia bez alt,
tekst mniejszy niż 11 px, kontrast poniżej WCAG AA, sierotki, linki głębokie (`#budzet`, `#kalendarz`…), przeliczanie budżetu z upgrade’ami,
kalkulator (polski zapis liczb, reguła osobnych biletów), odporność na dane od agentów (historia nie po kolei, brakujące pola, wstrzyknięty HTML),
pola do kliknięcia ≥ 44 px na ekranie dotykowym i wymiary zdjęć.
Przy błędzie zrzuty ekranu trafiają do `tests/out/`.

GitHub Actions (`.github/workflows/uco-tests.yml`) uruchamia `build.py --check` i testy przy każdym PR i każdym commicie na `main`, który dotyka strony.
