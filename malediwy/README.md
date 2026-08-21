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
