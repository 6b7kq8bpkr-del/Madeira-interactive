# Valle de Uco 2027 – źródła strony

Strona `../uco/` (https://6b7kq8bpkr-del.github.io/Madeira-interactive/rocznica-2027/uco/) jest budowana z tego katalogu.
Pliki `../uco/data.js`, `../uco/index.html` i `../uco/plan.ics` są generowane – zmiany wprowadzaj tutaj.

| Plik | Zawartość |
|---|---|
| `template.html` | szablon strony: HTML, CSS i JS (kopiowany do `../uco/index.html`) |
| `data/program.json` | program dnia po dniu, warianty hoteli, budżet, upgrade’y, loty, Buenos Aires, przygotowania |
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

Wystarczy sam Python 3. Nowe zdjęcie: oryginał do `zdjecia/` (poza gitem), wpis w `data/zdjecia.json` – wtedy `build.py` potrzebuje ImageMagicka (`convert`), żeby zrobić wersje 720 i 1800 px.

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
tekst mniejszy niż 11 px, kontrast poniżej WCAG AA, sierotki, linki głębokie (`#budzet`, `#kalendarz`…) i przeliczanie budżetu z upgrade’ami.
Przy błędzie zrzuty ekranu trafiają do `tests/out/`.

GitHub Actions (`.github/workflows/uco-tests.yml`) uruchamia `build.py --check` i testy przy każdym PR i każdym commicie na `main`, który dotyka strony.
