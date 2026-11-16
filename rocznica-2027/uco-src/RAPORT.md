# Raport lotów – procedura codzienna

Raport to blok „Raport lotów” na wierzchu sekcji [Loty](https://6b7kq8bpkr-del.github.io/Madeira-interactive/rocznica-2027/uco/#loty).
Odpowiada na jedno pytanie: **czy dziś kupujemy bilety, a jeśli nie – co się zmieniło od wczoraj i co dalej.**
Czyta go osoba, która nie śledzi rynku: ma zrozumieć werdykt po pierwszym zdaniu.

Podróż: Warszawa → Mendoza → Buenos Aires → Warszawa, wylot 4.11 po 20:00 albo 5.11.2027, powrót z Buenos Aires 13.11.2027, 2–4 pary.
Cel 4 000 zł, próg 4 800 zł na osobę za kompletną podróż z bagażem i lotem krajowym (reguły decyzji: `loty.skala` w `data/program.json`).

## Co wolno zmieniać

Tylko `../uco/loty.json`:

- `raport` – zastępujesz w całości, codziennie, także gdy nic się nie zmieniło (wtedy piszesz to wprost);
- `sygnaly` – dopisujesz na początku listy wyłącznie nowy fakt z adresem źródła; najpierw sprawdź, czy takiego wpisu już nie ma. Format jak w istniejących wpisach: `data`, `typ`, `kierunek` (`wzrost` / `spadek` / `neutralnie` – wpływ na ceny), `waga` 1–3, `opis`, `url`.

Nie ruszasz: `status`, `zaktualizowano`, `nastepny`, `historia`, `serie` (monitor cen 1. i 15.), `rss` (radar), `skrzynka` (alerty z Gmaila), `promocje.json` ani niczego w `data/`. Jeśli coś tam jest nieaktualne albo błędne – napisz to w raporcie w punkcie „Do poprawienia na stronie:”.

## Kolejność

1. Zacznij od aktualnego `main` (inni agenci zapisują ten sam plik codziennie ok. 10:50).
2. `python3 -I ../uco/tools/raport_fakty.py` – kurs NBP, odchylenie od kursu budżetu, które linie sprzedają dziś nasze daty, faza, terminy. Tych liczb nie licz z pamięci.
3. Przeczytaj w `loty.json`: wczorajszy `raport`, `status`, ostatni wpis `historia`, `sygnaly` z 7 dni, `rss.trafienia`, `skrzynka`; w `promocje.json`: `status` i wpisy z 7 dni.
4. Sprawdź ceny na nasze daty (5–13.11.2027 i 4–13.11.2027), w tej kolejności, do pierwszego źródła, które odpowie:
   - Kayak: `https://www.kayak.pl/flights/WAW-BUE/2027-11-05/2027-11-13?sort=price_a`, to samo dla `MAD-BUE`, a od 18.12.2026 także `WAW-MDZ` i `MAD-MDZ`;
   - Momondo, Skyscanner, strony linii (Iberia, Air Europa, Lufthansa, Air France/KLM, Turkish);
   - Google Flights pokazuje loty najwyżej ok. 330 dni naprzód – nasz powrót zobaczy dopiero ok. 18.12.2026.
   Zapisz dla każdej ceny: linie, liczbę przesiadek, czy jest bagaż rejestrowany, które lotnisko w Buenos Aires. Porównaj z cenami-wyzwalaczami (`loty.wyzwalacze`; na stronie zakładka „Jak szukać”).
5. Sprawdź wiadomości z ostatnich 48 godzin (wyszukiwarka + kanały z `rss.trafienia`): promocje i kampanie do Argentyny (Iberia, Air Europa, Aerolíneas, LATAM, ITA, Turkish, Ethiopian), zmiany tras i przewoźników na Europa–Buenos Aires/Mendoza, Ezeiza, strajki, ceny paliwa.
6. Napisz `raport` (układ niżej), dopisz ewentualne `sygnaly`.
7. Sprawdź: `python3 -I ../uco/tools/raport_fakty.py --check` i `python3 -I build.py --check`; jeśli jest Node – testy z `tests/` (README).
8. Commit „Raport lotów: RRRR-MM-DD”, pull request do `main`, scalenie po zielonych testach. Publikacja strony rusza sama po scaleniu. Jeśli scalenie się nie uda, zostaw otwarty PR i napisz to w podsumowaniu przebiegu.

## Układ raportu

```json
{"data": "RRRR-MM-DD", "werdykt": "…", "punkty": [["Nagłówek:", "treść"], …], "teraz": ["…"], "zrodla": [{"label": "…", "url": "https://…"}]}
```

**`werdykt`** – jedno zdanie, zaczyna się od ikony:

| Ikona | Kiedy |
|---|---|
| 🎯 Kupować dziś | kompletna podróż z bagażem ≤ 4 000 zł/os. na nasze daty, potwierdzona u linii |
| 🟢 Kupować, jeśli… | 4 000–4 800 zł/os. i spełniony warunek ze skali (tania klasa się kończy albo jest po 21.05.2027) |
| 🟡 Obserwować | cena do 5 000 zł/os. albo promocja, która może objąć nasze daty |
| ⚪ Jeszcze nie kupujemy | brak cen na nasze daty albo ceny powyżej 5 000 zł/os. |
| 🔴 Uwaga | zdarzenie, które wymaga decyzji grupy: upadłość linii, zamknięcie lotniska, odwołana trasa, zbliżający się twardy termin 31.08.2027 |

**`punkty`** – 5–8 punktów, każdy do ok. 600 znaków, w tej kolejności (pomijasz tylko te, w których nie ma nic do powiedzenia):

1. `Od wczoraj:` – co się zmieniło względem poprzedniego raportu. Jeśli nic: „bez zmian od DD.MM” i jedno zdanie, co sprawdzono.
2. `Ceny na nasze daty:` – najtańsza kompletna podróż i najtańszy odcinek do Buenos Aires, z odległością od wyzwalacza. Gdy cen nie ma – od kiedy będą.
3. `Sprzedaż na nasze daty:` – które linie sprzedają już wylot i powrót (skrypt + to, co faktycznie widać w wyszukiwarce; rozbieżność nazwij).
4. `Ceny odniesienia (inne daty):` – tylko gdy brak cen na nasze daty; z datą odczytu.
5. `Rynek:` – przewoźnicy, trasy, lotniska, paliwo: tylko to, co zmienia cenę albo ryzyko naszej podróży.
6. `Kampanie i promocje:` – co trwa, czy obejmuje listopad 2027, ile brakuje do celu.
7. `Kursy:` – wiersz ze skryptu po polsku. Przy odchyleniu dolara ≥ 3% dopisz na początku punktu „⚠ Budżet do przeliczenia” – samego budżetu nie zmieniasz.
8. `Do poprawienia na stronie:` – nieaktualne terminy, zadania nie do wykonania, błędne założenia.

**`teraz`** – 3–5 kroków z datą, od najbliższego. Wyłącznie dziś i przyszłość; zaległe zadania grupy wymień jako pierwsze („Dziś: …”).

**`zrodla`** – każda liczba i każdy fakt z raportu ma tu adres źródła; 5–10 pozycji.

## Reguły

- Żadnej liczby bez źródła. Cena odczytana dziś – bez dopisku; cena z wcześniejszego odczytu – z datą („monitor 15.11”).
- Cena w jedną stronę nie jest ceną podróży. Cena bez bagażu rejestrowanego nie jest porównywalna z celem – dolicz bagaż albo napisz, że go nie ma.
- Jeśli źródła nie dało się odczytać, napisz to („Kayaka nie udało się dziś odczytać”) – nie przenoś wczorajszej liczby jako dzisiejszej.
- Wiadomość z jednego źródła opisz jako taką („według …”), dopóki nie potwierdzi jej linia albo drugie źródło.
- Liczby dni z kalendarzy linii są niepotwierdzone: gdy wyszukiwarka pokazuje co innego niż skrypt, wierz wyszukiwarce i zgłoś różnicę w punkcie 8.
- Język: polski, pełne zdania, bez skrótów branżowych (zamiast „RT” – „w obie strony”, zamiast „OW” – „w jedną stronę”); kwoty jako „4 000 zł”, daty jako „17.11”.
- Niczego nie kupujesz, nie rezerwujesz i nie zakładasz kont.
