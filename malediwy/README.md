# Malediwy 2027 — planer rocznicowy

Prywatna aplikacja na jeden wyjazd: Meliá Whale Lagoon Maldives,
listopad 2027, 20. rocznica ślubu. Jedna strona, bez backendu,
bez logowania, interfejs po polsku.

## Uruchomienie

Otwórz `index.html` w przeglądarce — nic nie trzeba instalować.
Działa też wystawiona jako statyczna strona (np. pod `/malediwy/`
na tym samym hostingu co plan Madery).

## Trwałość danych

Stan (zadania, budżet, loty, plan dnia, dokumenty, ustawienia) jest
zapisywany w `localStorage` przeglądarki po każdej zmianie — przeżywa
zamknięcie karty i restart telefonu. Uwagi:

- dane są przypisane do przeglądarki i adresu, pod którym otwarto
  aplikację (plik lokalny i wersja hostowana to osobne magazyny);
- tryb prywatny/incognito może kasować dane po zamknięciu okna;
- do przenoszenia między urządzeniami służy eksport/import JSON
  w sekcji „Dane i kopia zapasowa" na Starcie (plik albo schowek).

## Oprawa graficzna

Kolorystyka „zmierzch nad laguną": indygo i fiolet nocnego nieba,
ciepły bursztyn zachodu na akcenty rocznicowe, kremowe tło.

Ilustracje (zachód nad willami nadwodnymi w nagłówku, hydroplan w module
Loty, rekin wielorybi w Planie) są autorskimi rysunkami wektorowymi
wbudowanymi w plik — działają offline, nie wymagają pobierania niczego
z sieci i nie mają obciążeń licencyjnych.

### Własne zdjęcia zamiast rysunków

Każda scena ma gniazdo na fotografię. Żeby je podmienić:

1. wrzuć plik do `malediwy/assets/` — nazwy: `naglowek.jpg` (nagłówek),
   `hydroplan.jpg` (moduł Loty), `rekin.jpg` (Plan dnia);
2. w `index.html` odkomentuj odpowiednie nazwy w stałej `PHOTOS`
   (na początku sekcji „sceny graficzne").

Zdjęcie przykryje rysunek, zachowując kadrowanie i podpisy. Dopóki lista
`PHOTOS` jest pusta, aplikacja nie wysyła żadnych zapytań o obrazy.
Proporcje: nagłówek najlepiej wygląda w kadrze panoramicznym (ok. 3:1),
pasy modułowe jeszcze szerszym (ok. 6:1); w obu wypadkach istotna treść
powinna być blisko środka, bo na telefonie boki są przycinane.

## Moduły

- **Start** — odliczanie do wylotu i rocznicy (10.11.2027), najbliższe
  zadania, fakty wyjazdu, ustawienia, kopia zapasowa;
- **Zadania** — harmonogram przygotowań z terminami; przeterminowane
  wyraźnie na górze;
- **Budżet** — plan vs wydatki w PLN, odchylenie, przelicznik USD/EUR
  z ręcznie wpisywanym kursem, widełki inflacyjne 5–10%;
- **Loty** — odcinki rejsów; aplikacja sama sprawdza, czy przylot do
  Malé mieści się w oknie hydroplanu (lata tylko za dnia) i ostrzega
  przy zbyt późnym przylocie lub zbyt wczesnym powrocie; granice
  godzinowe do zmiany w ustawieniach;
- **Plan** — 7 dni liczonych od pierwszego dnia pobytu; zmiana okna
  podróży przesuwa daty bez utraty wpisów; 10.11 wyróżniony;
- **Dokumenty** — checklista formalności z notatkami (bez skanów).
