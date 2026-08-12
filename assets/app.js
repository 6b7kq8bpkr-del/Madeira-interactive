(function () {
  "use strict";

  const IMAGE = "?auto=format&fit=crop&w=1800&q=78";
  const images = {
    berlin: "https://images.unsplash.com/photo-1560969184-10fe8719e047" + IMAGE
  };

  // Autentyczne zdjęcia miejsc z planu — Wikimedia Commons (atrybucja w galerii)
  const commons = {
    arieiro: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/View_from_Miradouro_do_Pico_do_Arieiro_-_Madeira_01.jpg/1920px-View_from_Miradouro_do_Pico_do_Arieiro_-_Madeira_01.jpg",
    picoRuivo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Pico_Ruivo%2C_Madeira%2C_Gipfelbereich.jpg/1920px-Pico_Ruivo%2C_Madeira%2C_Gipfelbereich.jpg",
    fontes: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Madeira-Rabacal-Levada_das_25_Fontes_%28PR6%29-bridge-02ASD.jpg/1920px-Madeira-Rabacal-Levada_das_25_Fontes_%28PR6%29-bridge-02ASD.jpg",
    fanal: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Fanal_%28Madeira%2C_Portugal%29%2C_Lorbeerwald_--_2025_--_1532.jpg/1920px-Fanal_%28Madeira%2C_Portugal%29%2C_Lorbeerwald_--_2025_--_1532.jpg",
    portoMoniz: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Porto_Moniz_%28Madeira%2C_Portugal%29%2C_Piscinas_Naturais_do_Porto_Moniz_--_2025_--_1779.jpg/1920px-Porto_Moniz_%28Madeira%2C_Portugal%29%2C_Piscinas_Naturais_do_Porto_Moniz_--_2025_--_1779.jpg",
    camara: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/C%C3%A2mara_de_Lobos_%28Madeira%2C_Portugal%29%2C_Porto_de_C%C3%A2mara_de_Lobos_--_2025_--_1887.jpg/1920px-C%C3%A2mara_de_Lobos_%28Madeira%2C_Portugal%29%2C_Porto_de_C%C3%A2mara_de_Lobos_--_2025_--_1887.jpg",
    curral: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Vista_de_Curral_das_Freiras%2C_Madeira%2C_Portugal%2C_2019-05-30%2C_DD_100.jpg/1920px-Vista_de_Curral_das_Freiras%2C_Madeira%2C_Portugal%2C_2019-05-30%2C_DD_100.jpg",
    funchal: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Funchal_%28Madeira%2C_Portugal%29%2C_Travessa_das_Torres_4_--_2025_--_0928.jpg/1920px-Funchal_%28Madeira%2C_Portugal%29%2C_Travessa_das_Torres_4_--_2025_--_0928.jpg",
    santana: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Traditional_farmhouse_-_Santana_06.jpg/1920px-Traditional_farmhouse_-_Santana_06.jpg",
    pontaDoSol: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/The_seafront_at_Ponta_do_Sol%2C_Madeira%2C_Portugal.jpg/1920px-The_seafront_at_Ponta_do_Sol%2C_Madeira%2C_Portugal.jpg",
    funchalBay: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A_light_swing_in_the_bay_%2841520001864%29.jpg/1920px-A_light_swing_in_the_bay_%2841520001864%29.jpg",
    lido: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Complexo_Balnear_do_Lido_2019-10.jpg/1920px-Complexo_Balnear_do_Lido_2019-10.jpg",
    monte: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Funchal_%28Madeira%2C_Portugal%29%2C_Telef%C3%A9rico_Funchal-Monte%2C_Talstation_--_2025_--_1192.jpg/1920px-Funchal_%28Madeira%2C_Portugal%29%2C_Telef%C3%A9rico_Funchal-Monte%2C_Talstation_--_2025_--_1192.jpg",
    machico: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Machico_Madeira_January_2014_-_panoramio.jpg/1920px-Machico_Madeira_January_2014_-_panoramio.jpg",
    dolphin: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Golfinho_ao_largo_do_Funchal%2C_fotografia_de_Virg%C3%ADlio_Gomes%2C_27_de_agosto_de_2022_-_Image_215725.jpg/1920px-Golfinho_ao_largo_do_Funchal%2C_fotografia_de_Virg%C3%ADlio_Gomes%2C_27_de_agosto_de_2022_-_Image_215725.jpg",
    espetada: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Espetadagrill_am_Strandfest.JPG/1920px-Espetadagrill_am_Strandfest.JPG"
  };

  const TOUR_COLORS = ["#0b7276", "#d9684f", "#e9ad4b", "#246b51"];

  // Rytm wyjazdu: intensywność dnia -> kropka na kafelku (wzorzec z planu Japonii)
  const INTENSITY = { "Łagodna": "g", "Lekka": "g", "Logistyczna": "g", "Do wyboru": "g", "Umiarkowana": "y", "Aktywna": "r", "Pełna": "r" };
  const INTENSITY_LABEL = { g: "spokojny", y: "umiarkowany", r: "aktywny" };

  // Co jest stałym punktem dnia, a co można odpuścić bez psucia reszty
  const FLEX = {
    "2026-08-19": ["dojazd do Berlina, parking P7/8 i zameldowanie przy terminalu", "wieczorny spacer po centrum"],
    "2026-08-20": ["lot i transfer do hotelu", "Lido — tylko jeśli zostaje energia"],
    "2026-08-21": ["muzeum CR7 i marina", "stare miasto można skrócić"],
    "2026-08-22": ["Curral das Freiras i lunch", "podejście na Eira do Serrado"],
    "2026-08-23": ["nic — to dzień bez zobowiązań", "wszystko poza basenem"],
    "2026-08-24": ["Porto Moniz i Fanal", "Seixal i Cabo Girão"],
    "2026-08-25": ["kolacja z espetadą (rezerwacja!)", "Monte i kolejka — całkiem opcjonalne"],
    "2026-08-26": ["BAM i plaża w Calhecie", "Ponta do Sol, jeśli dzień się przeciągnie"],
    "2026-08-27": ["wejście na Pico Ruivo (PR1.2)", "Ribeiro Frio i Balcões w drodze powrotnej"],
    "2026-08-28": ["rejs na delfiny (rezerwacja)", "popołudnie — tylko odpoczynek"],
    "2026-08-29": ["termin zapasowy rejsu", "wszystko poza nim — to dzień do wyboru"],
    "2026-08-30": ["transfer 08:30 i lot 11:35", "nic — dzień jest sztywny"]
  };

  // Dni, w których pogoda realnie decyduje o przebiegu — dla nich liczymy werdykt
  const WEATHER_CRITICAL = {
    "2026-08-27": "wejście na Pico Ruivo",
    "2026-08-24": "Fanal i baseny w Porto Moniz",
    "2026-08-29": "Levada das 25 Fontes, jeśli wybieramy ten wariant",
    "2026-08-28": "rejs na delfiny (termin zapasowy: 29.08)"
  };

  // Checklista przed wyjazdem — JEDNO źródło: renderuje i stronę główną, i PDF
  const CHECKLIST = [
    ["flights", "Potwierdzone numery i godziny obu lotów"],
    ["trails", "Domknąć wymianę biletu na PR1.2 (slot 11:30) w IFCN i zapisać wszystkie bilety offline w telefonie"],
    ["p8", "Rezerwacja APCOA i sektor P7/8"],
    ["transfer", "Potwierdzić z madeira-in nową godzinę odbioru 30.08 (08:30 zamiast 08:45)"],
    ["cash", "Gotówka: 90 € na transfery + drobne na minibus w Rabaçal; na wycieczki busem po 220 € za dzień"],
    ["cruise", "Rejs z terminem zapasowym 29 sierpnia, łatwym wejściem i miejscem siedzącym"],
    ["health", "Leki, apteczka podróżna i ewentualna asysta lotniskowa"],
    ["insurance", "Ubezpieczenie i EKUZ"],
    ["documents", "Dokumenty, karty płatnicze i ładowarki"],
    ["offline", "Mapy offline i kontakty alarmowe"]
  ];

  // Punkty mapy interaktywnej. Współrzędne z OpenStreetMap (Nominatim).
  const POI_LOGISTYKA = [
    { n: "Hotel Baía Azul — Funchal", lat: 32.636307, lon: -16.939799, d: "Nasza baza 20–30.08. Rua da Quinta Calaça 1, São Martinho · tel. +351 291 700 400. Śniadanie 7:30–10:00, wychodzimy standardowo 10:15." },
    { n: "Parking APCOA P7/8 — BER", lat: 52.366279, lon: 13.510813, d: "Rez. 8320774 · tablica EL2GE01. Wjazd 19.08 16:00 (okno 14:00–18:00), wyjazd 30.08 18:00. 144 € zapłacone." },
    { n: "IntercityHotel Berlin Airport", lat: 52.364206, lon: 13.512595, d: "Nocleg 19→20.08, 2 × Business Twin (4RGPYJYD, 4GMN9X9N). Bez śniadania, City Ticket w cenie. Tel. +49 30 536 531 0." }
  ];
  const POI_ATRAKCJE = [
    { n: "Calheta — plaża i marina", lat: 32.721900, lon: -17.177500, d: "26.08 · Ponad 200 m złotego piasku w osłoniętej zatoce, plac zabaw ze zjeżdżalniami, boiska, prysznice. Z mariny obok wypożycza się kajaki i deski SUP." },
    { n: "Queimadas — Casa das Queimadas", lat: 32.782772, lon: -16.911610, d: "Poza trasą · Leśny park nad strumieniami z autentycznym domem krytym strzechą — znacznie lepszy niż komercyjne domki w Santanie. Wypadł z dnia górskiego przez odległości (z Achada do Teixeira 76 minut). Wstęp wolny, parking płatny." },
    { n: "Homem em Pé — Achada do Teixeira", lat: 32.765326, lon: -16.920852, d: "27.08 · Skalna formacja „Stojący Człowiek” tuż przy parkingu, z którego startuje szlak PR1.2. Widok bez wysiłku, jeszcze przed wejściem — dobre miejsce na rozprostowanie nóg po 95 minutach jazdy." },
    { n: "Mercado dos Lavradores", lat: 32.648689, lon: -16.903511, d: "21.08 i dowolny poranek · Targ owocowo-rybny w Funchal: owoce tropikalne do degustacji, ryby, kwiaty. Najżywszy przed południem; w środku UauCacau (lokal 19)." },
    { n: "Rua de Santa Maria — Stare Miasto", lat: 32.647907, lon: -16.900414, d: "21, 23 i 25.08 · Najstarsza ulica Funchal ze słynnymi malowanymi drzwiami i tasquinhas. Miejsce na pierwszą kolację i na espetadę." },
    { n: "Teleférico do Funchal — stacja dolna", lat: 32.661339, lon: -16.901209, d: "25.08 · Kolejka linowa z nabrzeża do dzielnicy Monte, ok. 15 minut nad dachami i dolinami. Wjazd i zjazd można kupić osobno." },
    { n: "Nossa Senhora do Monte", lat: 32.676001, lon: -16.902472, d: "25.08 · Kościół na szczycie Monte, w którym spoczywa cesarz Karol I Habsburg. Schody przed wejściem są częścią widoku." },
    { n: "Estreito de Câmara de Lobos", lat: 32.671099, lon: -16.979973, d: "25.08 · Miasteczko nad Câmara de Lobos uważane za ojczyznę espetady — tutaj podaje się ją klasycznie, na laurowym patyku." },
    { n: "Paúl da Serra", lat: 32.762940, lon: -17.095891, d: "24 i 27.08 · Jedyny płaskowyż wyspy; przejeżdżamy przez niego w drodze do Fanal i do Rabaçal. Chłodniej i wietrzniej niż na wybrzeżu, często we mgle." },
    { n: "Prazeres — start Caminho Real", lat: 32.753931, lon: -17.202295, d: "29.08 (wariant SW) · Stąd wychodzi wykuta w skale królewska droga schodząca do Paúl do Mar. Zejście jest długie i strome — realnie planować też powrót." },
    { n: "Jardim do Mar", lat: 32.737558, lon: -17.211130, d: "29.08 (wariant SW) · Nadmorska osada obok Paúl do Mar, znana z surfingu i spokojnej promenady." }
  ];
  const POI_OPCJE = [
    { n: "Cabo Girão — szklany taras", lat: 32.656481, lon: -17.004453, d: "<b>W planie 24.08 jako propozycja dla chętnych.</b> Jeden z najwyższych klifów Europy, ze szklaną platformą nad przepaścią. Taras jest w pełni zabezpieczony szkłem i barierkami; z małym dzieckiem po prostu za rękę." },
    { n: "Grutas e Centro do Vulcanismo — São Vicente", lat: 32.797545, lon: -17.042060, d: "<b>Plan B na deszcz, 24.08 — dokładnie na trasie.</b> Tunele lawowe sprzed 890 tys. lat i część muzealna o wulkanicznym pochodzeniu wyspy. Pod ziemią pogoda nie ma znaczenia." },
    { n: "Aquário da Madeira — Porto Moniz", lat: 32.867306, lon: -17.165417, d: "<b>Plan B na deszcz, 24.08 — przy naszym lunchu.</b> Akwarium w XIX-wiecznym forcie São João Baptista. Mała skala, ale ratuje przystanek, gdy kąpiel w basenach odpada." },
    { n: "Parque Temático da Madeira — Santana", lat: 32.802155, lon: -16.885605, d: "<b>Alternatywa dla dzieci — poza obecną trasą.</b> Pawilony o historii wyspy, labirynt, łódki i place zabaw. Rozsądny plan B, gdyby pogoda odcięła wejście na Pico Ruivo." },
    { n: "Monte Palace Tropical Garden", lat: 32.674192, lon: -16.902878, d: "<b>Rozszerzenie 25.08, gdy jedziemy na Monte.</b> Ogród na stromym zboczu: japońskie stawy, kolekcja azulejos, egzotyczne drzewa. Sporo schodów, 1,5–2 h." },
    { n: "Quinta do Palheiro Ferreiro", lat: 32.659838, lon: -16.869544, d: "<b>Cichy zamiennik ogrodu botanicznego.</b> Zabytkowy park krajobrazowy nad Funchal, mniej zatłoczony niż Jardim Botânico." },
    { n: "Praia Formosa", lat: 32.639199, lon: -16.951182, d: "<b>Najbliższa plaża od hotelu — na każdy luźny dzień.</b> Najdłuższy odcinek plaż w Funchal: kamieniste i piaszczyste zatoczki z promenadą i barami." },
    { n: "Forte de São Tiago — Funchal", lat: 32.646722, lon: -16.898751, d: "<b>Plan B na deszcz w Funchal.</b> Żółty fort z 1614 roku na końcu Rua de Santa Maria, z tarasami nad oceanem." },
    { n: "Camacha", lat: 32.679439, lon: -16.844868, d: "<b>Krótki wypad z Funchal.</b> Miasteczko wikliniarskie w górach nad miastem, z warsztatami plecionkarskimi i chłodniejszym klimatem niż wybrzeże." }
  ];
  const POI_FOOD = [
    { n: "Quinta do Furão — Santana", lat: 32.824085, lon: -16.884929, d: "Restauracja na klifie wśród winnic. Lunch 27.08 po Pico Ruivo. Rezerwować z wyprzedzeniem." },
    { n: "Snack Bar Estoril — São Vicente", lat: 32.804239, lon: -17.047015, d: "Prego w bolo do caco, przy kościele. Opcja 24.08. <i>Punkt na ulicy Rua do Cemitério — lokal stoi przy kościele.</i>" },
    { n: "Peixaria no Mercado — Funchal", lat: 32.648524, lon: -16.904085, d: "Świeża ryba przy Mercado dos Lavradores. Czynne 11:00–22:30, mała sala — rezerwować." },
    { n: "BAM — Muzeum Bananów", lat: 32.679627, lon: -17.087463, d: "Lugar de Baixo, przy VE3. Codziennie 9:00–18:00. Na trasie 26.08 między Madaleną do Mar a Ponta do Sol. <i>Punkt orientacyjny — muzeum nie jest w OpenStreetMap.</i>" },
    { n: "Fábrica Santo António — Funchal", lat: 32.649653, lon: -16.907412, d: "Manufaktura z 1893 r. Bolo de mel i biszkopty. Pon.–pt. 9:00–19:00, sob. 9:00–13:00, niedz. nieczynne." },
    { n: "UauCacau — Mercado dos Lavradores", lat: 32.648689, lon: -16.903511, d: "Czekolada z maracui, ponchy i miodu trzcinowego. Lokal 19 na targu." },
    { n: "Engenhos do Norte — Porto da Cruz", lat: 32.773962, lon: -16.828129, d: "Gorzelnia z 1927 r., jedyny w Europie parowy młyn trzcinowy. Wstęp wolny. Poza naszą trasą." }
  ];

  const days = [
    {
      id: "2026-08-19", date: "19 sierpnia · środa", title: "Łódź → Berlin", short: "Spokojny start podróży, parking P7/8 i lekki wieczór w Berlinie.",
      image: images.berlin, alt: "Brama Brandenburska w Berlinie o wieczornej porze", cats: ["podróż", "spokojny"],
      intensity: "Łagodna", duration: "6–7 h przejazdu + 2 h", transport: "Samochód", walking: "Spacer 1–3 km", kids: "Tak, sprawnie chodzą", exposure: "Niska",
      center: [52.5163, 13.3777], route: [[51.7592, 19.4560, "Łódź"], [52.3664, 13.5071, "Parking P7/8 BER"], [52.5163, 13.3777, "Brama Brandenburska"]], google: "https://www.google.com/maps/dir/%C5%81%C3%B3d%C5%BA/Brunolf-Baade-Stra%C3%9Fe+1,+12529+Sch%C3%B6nefeld/Brandenburg+Gate",
      agenda: [["11:00", "Wyjazd z Łodzi", "Sama jazda do BER to około 4,5 godziny — z trzema postojami co ~90 minut robi się z tego 5,5. Start bez pośpiechu, ale bez przeciągania."], ["16:30", "Parking P7/8 przy BER", "Wjazd na rozpoznawanie tablicy EL2GE01 (rez. 8320774, okno 14:00–18:00). Nie wciskamy przycisku po bilet — automat sam wyda „online ticket”. Zabieramy go i robimy zdjęcie miejsca postoju."], ["17:30", "Zameldowanie w hotelu", "IntercityHotel Berlin Airport BER Terminal 1+2, Willy-Brandt-Platz 5. Dwa pokoje Business Twin — potwierdzenia 4RGPYJYD i 4GMN9X9N. Przy zameldowaniu odbieramy City Ticket na komunikację. Hotel stoi przy samym terminalu, więc bagaże zostawiamy w pokoju i wychodzimy bez obciążenia."], ["18:15", "Pociąg do centrum", "FEX albo S-Bahn z dworca pod terminalem — do centrum około 25–30 minut. Przejazd mamy w cenie pokoju (H Rewards City Ticket), więc biletów nie kupujemy."], ["19:00", "Jeden lekki spacer", "Brama Brandenburska i Reichstag z zewnątrz albo kameralne Nikolaiviertel — bez łączenia wszystkiego."], ["20:00", "Kolacja i powrót", "Proste menu, powrót pociągiem do hotelu i wczesny sen — lot następnego ranka wychodzi o 07:00."]],
      tips: ["Nocleg: IntercityHotel Berlin Airport BER Terminal 1+2 (Willy-Brandt-Platz 5, tel. +49 30 536 531 0) — wejście do Terminala 1–2 jest tuż obok, więc rano wystarczy kilka minut na dojście. Dwa pokoje Business Twin, potwierdzenia 4RGPYJYD i 4GMN9X9N; pokój jest zabezpieczony kartą, więc czeka też przy późnym przyjeździe.", "Rachunek za hotel uregulować wieczorem albo skorzystać z ekspresowego wymeldowania — o 4:45 nie chcemy stać w recepcji.", "Śniadania w hotelu nie mamy w rezerwacji — coś do jedzenia bierzemy ze sobą albo kupujemy rano po odprawie na lotnisku.", "Przed wyjazdem pobrać mapę offline Berlina i okolic BER.", "Parking P7/8 stoi przy terminalach (2–4 min pieszo), więc do hotelu idziemy piechotą — komplet danych parkingu i kod QR z nawigacją są w zakładce Praktyczne.", "Po drodze robić postoje najpóźniej co 90 minut; po przyjeździe zaplanować jeden spacer 1–3 km, bez długiego stania.", "Zostawić bagaże lotnicze łatwo dostępne — nie przepakowywać auta wieczorem."],
      planB: "Jeśli trasa się wydłuży, pomijamy centrum Berlina. Kolacja i spokojny nocleg w okolicy BER są pełnoprawnym planem.", gentle: "spacer traktujemy jako bonus, nie punkt obowiązkowy.",
      deepDive: {
        context: "Trasa Łódź–Berlin to najkrótsza droga do lotniska BER bez nocnego pośpiechu. Berlin bywa tu tylko przystankiem, ale Brama Brandenburska i kameralne Nikolaiviertel dają poczucie stolicy nawet przy krótkim, wieczornym spacerze.",
        food: "Na szybki obiad po drodze sprawdzają się przydrożne Autohof z prostą niemiecką kuchnią; wieczorem w Berlinie warto zjeść coś lekkiego z piekarni albo klasyczne curry-wurst zamiast szukać restauracji na godziny.",
        practical: "Parking APCOA P7/8 przy BER obsługuje wjazd rozpoznawaniem tablicy rejestracyjnej, więc nie pobieramy biletu przy szlabanie; potwierdzenie i kod QR z e-maila warto mieć zapisane offline, bo zasięg w garażu bywa słaby. Hotel przy Willy-Brandt-Platz stoi wprost przy wejściu do Terminala 1–2, a pod terminalem jest dworzec, z którego FEX i S-Bahn dowożą do centrum w 25–30 minut."
      }
    },
    {
      id: "2026-08-20", date: "20 sierpnia · czwartek", title: "Berlin BER → Funchal", short: "Lot, prywatny transfer, Hotel Baía Azul i pierwsze spotkanie z oceanem.",
      image: commons.funchalBay, alt: "Zatoka i marina Funchal na Maderze", cats: ["podróż", "spokojny"],
      intensity: "Łagodna", duration: "Dzień logistyczny", transport: "Samolot + transfer", walking: "Mało", kids: "Tak", exposure: "Niska",
      center: [32.6387, -16.9304], route: [[52.3667, 13.5033, "Lotnisko BER"], [32.6979, -16.7745, "Lotnisko FNC"], [32.6384, -16.9353, "Hotel Baía Azul"], [32.6386, -16.9332, "Lido"]], google: "https://www.google.com/maps/dir/Madeira+Airport/Hotel+Baia+Azul,+Funchal/Lido+Bathing+Complex",
      agenda: [["04:45", "Pobudka i wyjście z hotelu", "Hotel stoi przy terminalu, więc do odprawy idziemy kilka minut — nie trzeba wstawać wcześniej ani zamawiać transferu."], ["05:00", "Odprawa na BER", "Terminal 1–2 tuż obok hotelu; bagaże, odprawa i kontrola bez pośpiechu, około 2 h przed wylotem. Śniadanie jemy dopiero po kontroli — w hotelu nie mamy go w rezerwacji."], ["07:00", "Wylot BER → FNC", "Lot EJU5333 (PNR KCXF7QW); blisko 5 godzin nad Atlantykiem."], ["10:55", "Lądowanie w Funchal", "Przylot EJU5333 o 10:55 czasu lokalnego — na Maderze jest o godzinę wcześniej niż w Berlinie."], ["12:00", "Prywatny transfer", "Dzwonimy do Rui (+351 917 260 690) dopiero z kompletem bagaży; podjedzie pod kawiarnię tuż za halą przylotów. Płacimy 90 € gotówką za oba przejazdy."], ["14:00", "Obiad i odpoczynek", "Lekki posiłek, zameldowanie i basen."], ["17:00", "Lido lub promenada", "Krótki spacer tylko jeśli grupa ma energię."]],
      tips: ["Lot potwierdzony przez biuro (rez. 3891149): wylot z BER 07:00, lądowanie w Funchal 10:55. Nocleg w IntercityHotel przy Terminalu 1–2 sprawia, że wystarczy pobudka ~04:45 i kilka minut spaceru.", "Przy dłuższych przejściach i kolejkach można z wyprzedzeniem zamówić bezpłatną asystę lotniskową i potwierdzić ją z przewoźnikiem.", "Numer do kierowcy: +351 917 260 690. Rui ma nasz kontakt (+48 607 452 332), ale to my dzwonimy pierwsi — po odebraniu bagaży.", "Gotówka na transfer musi być przygotowana przed wylotem: 90 € za oba przejazdy, płatne Rui przy przyjeździe — kartą nie zapłacimy.", "Pierwszego dnia nie planować zakupów ani dalszych dojazdów."],
      planB: "Przy opóźnieniu lotu rezygnujemy z Lido. Hotel, posiłek i sen są jedynymi priorytetami.", gentle: "po transferze cały program odbywa się w hotelu.",
      deepDive: {
        context: "Lot z Berlina na Maderę trwa około 4,5 godziny. Madera leży geograficznie bliżej Maroka niż kontynentalnej Portugalii, więc odmienny, łagodniejszy klimat jest odczuwalny już na płycie lotniska.",
        food: "Pierwszego dnia najlepiej sprawdza się coś lekkiego w hotelu albo w prostej kawiarni przy Lido. Na poncha, espetadę i bolo do caco przyjdzie czas w kolejnych dniach, gdy zmęczenie podróżą minie.",
        practical: "Lotnisko Cristiano Ronaldo Madeira (FNC) ma krótki pas częściowo wybudowany na filarach nad oceanem. Odbiór bagażu bywa wolniejszy niż w Berlinie, więc warto z góry poinformować kierowcę transferu o buforze czasowym."
      }
    },
    {
      id: "2026-08-21", date: "21 sierpnia · piątek", title: "Funchal i CR7", short: "Marina, muzeum CR7 i stare miasto Funchal.",
      image: commons.funchal, alt: "Uliczki starego miasta w Funchal", cats: ["aktywny", "spokojny"],
      intensity: "Umiarkowana", duration: "4–5 h", transport: "Autobus / taxi", walking: "2–4 km", kids: "Tak, sprawnie chodzą", exposure: "Niska",
      center: [32.648, -16.913], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6443, -16.9148, "Muzeum CR7"], [32.6454, -16.9096, "Marina"], [32.6484, -16.9033, "Stare miasto"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/CR7+Museum/Funchal+Marina/Mercado+dos+Lavradores",
      agenda: [["08:00", "Śniadanie w hotelu", "Bufet śniadaniowy w hotelu, zwykle 7:30–10:00 (godziny potwierdzić w recepcji)."], ["10:15", "Centrum i marina", "Spokojny start przy nabrzeżu i widok na port."], ["11:00", "Muzeum CR7", "Krótka, konkretna atrakcja; bilety sprawdzić przed wyjściem."], ["12:15", "Stare miasto", "Rua de Santa Maria i lunch w wygodnym miejscu."], ["15:00", "Hotel, basen lub Lido", "Reszta dnia bez sztywnego harmonogramu."]],
      tips: ["Trasa 2–4 km przez marinę, CR7 i wybrany fragment starego miasta jest planem podstawowym.", "Przerwa na siedząco co 45–60 minut; taxi zawsze pozostaje wygodną opcją.", "Kapelusze, woda i przerwa w cieniu w południe.", "Sprawdzić aktualne godziny otwarcia muzeum CR7."],
      planB: "Przy upale lub zmęczeniu: tylko marina i CR7, a lunch oraz popołudnie w hotelu.", gentle: "poruszamy się taxi między hotelem, CR7 i starym miastem.",
      deepDive: {
        context: "Funchal jest stolicą Madery od XV wieku; nazwa nawiązuje do dziko rosnącego tu niegdyś koperku. Stare miasto wokół Rua de Santa Maria znane jest z pomalowanych drzwi — lokalnego projektu artystycznego, który ożywił dawną, zaniedbaną dzielnicę portową.",
        food: "Mercado dos Lavradores przy starym mieście to dobre miejsce na świeże owoce tropikalne i rybę espada; w mieście warto spróbować bolo do caco z masłem czosnkowym jako lekkiej przekąski między atrakcjami.",
        practical: "Muzeum CR7, poświęcone urodzonemu w Funchal Cristianowi Ronaldo, ma osobny cennik biletów i bywa zamykane w niektóre dni poza sezonem — aktualne godziny warto sprawdzić dzień wcześniej."
      }
    },
    {
      id: "2026-08-22", date: "22 sierpnia · sobota", title: "Curral das Freiras", short: "Pół dnia w Dolinie Zakonnic, spokojne widoki i lunch.",
      image: commons.curral, alt: "Dolina Curral das Freiras otoczona górami", cats: ["aktywny", "spokojny"],
      intensity: "Umiarkowana", duration: "5–6 h", transport: "Taxi / wycieczka", walking: "2–4 km", kids: "Tak, sprawnie chodzą", exposure: "Kontrolowana",
      center: [32.7202, -16.9691], route: [[32.6384, -16.9353, "Hotel"], [32.7107, -16.9615, "Eira do Serrado"], [32.7202, -16.9691, "Curral das Freiras"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Funchal/Eira+do+Serrado/Curral+das+Freiras",
      agenda: [["08:15", "Śniadanie w hotelu", "Bufet 7:30–10:00 — zjeść przed wyjazdem o 10:15 (godziny potwierdzić w recepcji)."], ["10:15", "Wyjazd z Funchal", "Trasa w głąb wyspy i spokojne rozpoczęcie aktywnego pół dnia."], ["11:00", "Eira do Serrado", "Krótkie podejście do komfortowego punktu widokowego; kijki i przerwy według potrzeby."], ["12:15", "Curral das Freiras", "Spacer 2–3 km po miejscowości i spokojny lunch."], ["15:30", "Powrót do hotelu", "Popołudnie na basenie lub krótka promenada."]],
      tips: ["Podejście do punktu widokowego jest częścią planu przy suchej nawierzchni; zawrócenie pozostaje prostą opcją.", "Nie trzeba podchodzić do barierek, aby zobaczyć dolinę.", "W razie choroby lokomocyjnej usiąść z przodu i przygotować wodę.", "Dzieci mogą przejść pełny spacer; tempo dopasowujemy do najwolniejszej osoby."] ,
      planB: "Zamiana na ogród w Funchal, Lido lub dzień hotelowy — szczególnie przy niskich chmurach w dolinie.", gentle: "pomijamy każdy punkt, który powoduje dyskomfort; sama miejscowość i lunch wystarczą.",
      deepDive: {
        context: "Curral das Freiras (Dolina Zakonnic) zawdzięcza nazwę zakonnicom, które według legendy schroniły się tu przed piratami w XVI wieku. Miejscowość leży w głębokim kraterze otoczonym szczytami centralnej Madery, przez długi czas dostępnym praktycznie tylko pieszo.",
        food: "Lokalna specjalność to kasztany (castanhas) pod różnymi postaciami — od zupy po likier 'licor de castanha' — oraz domowe ciasto orzechowe 'bolo de nozes', które najlepiej smakuje na miejscu.",
        practical: "Punkt widokowy Eira do Serrado bywa zatłoczony w środku dnia z powodu wycieczek autokarowych; wcześniejszy przyjazd daje spokojniejszy widok na dolinę i lepsze warunki do zdjęć."
      }
    },
    {
      id: "2026-08-23", date: "23 sierpnia · niedziela", title: "Luźny dzień w Funchal", short: "Basen i Lido, a do wyboru snorkeling albo Stare Miasto.",
      image: commons.lido, alt: "Kompleks basenów Lido przy wybrzeżu Funchal", cats: ["odpoczynek", "spokojny"],
      intensity: "Lekka", duration: "Elastyczny", transport: "Pieszo / taxi", walking: "2–3 km lub według chęci", kids: "Idealny", exposure: "Niska",
      center: [32.6386, -16.9332], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6386, -16.9332, "Lido"], [32.6484, -16.9033, "Stare Miasto — opcjonalnie"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/search/?api=1&query=Lido+Bathing+Complex+Funchal",
      agenda: [["rano", "Śniadanie w hotelu bez budzika", "Bufet w hotelu do 10:00 — dziś bez pośpiechu, jeden wolniejszy poranek między aktywnymi dniami."], ["10:15", "Lido i kąpiel", "Baseny oceaniczne; chętni mogą wypożyczyć sprzęt do snorkelingu przy skalistym brzegu."], ["13:00", "Lunch przy oceanie", "Świeża ryba lub lekki posiłek z widokiem na wodę."], ["15:30", "Stare Miasto dla chętnych", "Spacer po Rua de Santa Maria, pomalowane drzwi i kawiarnie — dla tych, którzy nie chcą siedzieć w miejscu."]],
      tips: ["To jedyny w pełni luźny dzień — dobry moment na snorkeling, spacer po Starym Mieście albo popływanie, zależnie od chęci.", "Przy Lido sprawdzić warunki oceanu i komunikaty ratowników.", "Uzupełnić wodę, przekąski i drobiazgi przed aktywną wycieczką następnego dnia."],
      planB: "Przy złej pogodzie zostają basen hotelowy, gry i Stare Miasto pod dachem (targ, sklepy, kawiarnie).", gentle: "pozostajemy przy basenie hotelowym i najbliższej promenadzie.",
      deepDive: {
        context: "Complexo Balnear do Lido to największy kompleks basenów oceanicznych w Funchal, częściowo wykuty w skalistym wybrzeżu. To popularne miejsce zarówno wśród turystów, jak i mieszkańców szukających kąpieli tam, gdzie wyspa nie ma naturalnej piaszczystej plaży.",
        food: "Dzień bez planu to dobra okazja na dłuższy lunch w hotelu albo w pobliskiej knajpce z widokiem na ocean — bez pośpiechu i bez wcześniejszej rezerwacji.",
        practical: "Warunki morza przy Lido bywają zmienne z dnia na dzień; flagi i komunikaty ratowników na miejscu są zawsze bardziej aktualne niż jakakolwiek prognoza sprzed wyjścia z hotelu."
      }
    },
    {
      id: "2026-08-24", date: "24 sierpnia · poniedziałek", title: "Zachód Madery", short: "Nadmorskie wioski, Porto Moniz i zamglony las Fanal.",
      image: commons.portoMoniz, alt: "Naturalne baseny lawowe Porto Moniz na Maderze", cats: ["aktywny", "wycieczka busem"],
      intensity: "Pełna", duration: "10:15–18:00", transport: "Prywatny bus", walking: "Łącznie 3–5 km", kids: "Tak, sprawnie chodzą", exposure: "Niska; Cabo opcjonalne",
      center: [32.8663, -17.1667], route: [[32.6384, -16.9353, "Hotel"], [32.6496, -16.9769, "Câmara de Lobos"], [32.6747, -17.0633, "Ribeira Brava"], [32.8126, -17.1038, "Seixal"], [32.8663, -17.1667, "Porto Moniz"], [32.8097, -17.1436, "Fanal — zamglony las"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/C%C3%A2mara+de+Lobos/Ribeira+Brava/Seixal,+Madeira/Porto+Moniz/Fanal",
      agenda: [["08:15", "Śniadanie w hotelu", "Bufet 7:30–10:00 — zjeść przed wyjazdem o 10:15 (godziny potwierdzić w recepcji)."], ["10:15", "Câmara de Lobos", "Spacer przy porcie rybackim i rodzinne zdjęcie."], ["11:15", "Ribeira Brava", "Kawa, toaleta i krótki przystanek przed północnym wybrzeżem."], ["12:15", "Seixal", "Czarna piaszczysta plaża i punkt widokowy na klifowe wybrzeże."], ["13:15", "Porto Moniz", "Lunch przy naturalnych basenach lawowych; kąpiel przy dobrych warunkach morza."], ["15:15", "Fanal — zamglony las", "Starodawny las laurowy na płaskowyżu Paúl da Serra: sędziwe, poskręcane drzewa ostrokrzewu spowite mgłą. Krótki spacer po miękkiej łące między drzewami — najbardziej klimatyczne miejsce dnia."], ["18:00", "Powrót do hotelu", "Cabo Girão można dołożyć dla chętnych po drodze."]],
      tips: ["Zabrać rano stroje kąpielowe i ręczniki oraz przekąski dla dzieci — lunch wypada w Porto Moniz około 13:15, a decyzja o kąpieli zapada na miejscu.", "Fanal najlepiej wygląda właśnie we mgle — to jego znak rozpoznawczy, a nie zła pogoda; przy deszczu łąka bywa błotnista, więc przydają się nieprzemakalne buty.", "Na płaskowyżu Paúl da Serra jest chłodniej i wietrzniej niż na wybrzeżu — warstwy i kurtka przeciwwiatrowa.", "Cabo Girão (szklany taras nad klifem) traktować jako propozycję dla chętnych — taras jest w pełni zabezpieczony, ale z najmłodszym trzyma się za rękę.", "Kąpiel w Porto Moniz zależy od fal, komunikatów i czasu.", "São Vicente leży na trasie między Ribeirą Bravą a Seixalem: przy tamtejszym kościele działa Snack Bar Estoril z odcinka Makłowicza — prego, czyli kanapka ze stekiem w bolo do caco, jeśli lunch w Porto Moniz miałby się zbytnio oddalić."],
      planB: "Przy ulewie odpuszczamy Fanal i zostajemy dłużej na wybrzeżu — Câmara de Lobos, Ribeira Brava i Porto Moniz.", gentle: "bez Cabo Girão i bez postojów wymagających podejścia do krawędzi.",
      deepDive: {
        context: "Câmara de Lobos, dawna wioska rybacka, zasłynęła dzięki Winstonowi Churchillowi, który malował tu w latach 50. XX wieku; to również miejsce narodzin poncha, tradycyjnego madeirskiego drinka z trzciny cukrowej. Porto Moniz słynie z naturalnych basenów lawowych uformowanych przez wulkaniczne skały i ocean, a Fanal to fragment pierwotnego lasu laurowego (laurisilva) na płaskowyżu Paúl da Serra, znany z charakterystycznej mgły i sędziwych, kilkusetletnich drzew ostrokrzewu.",
        food: "W Câmara de Lobos warto spróbować poncha na miejscu jego powstania; w Porto Moniz popularna jest świeża ryba z grilla serwowana tuż przy basenach, z widokiem na ocean.",
        practical: "Baseny w Porto Moniz bywają zamykane przy dużym falowaniu — decyzję podejmuje obsługa na miejscu. Fanal bywa spowity mgłą nawet w słoneczny dzień na wybrzeżu, co jest częścią jego charakteru, a nie usterką pogody."
      }
    },
    {
      id: "2026-08-25", date: "25 sierpnia · wtorek", title: "Funchal po swojemu", short: "Ogród, zakupy albo Monte, a wieczorem kolacja z espetadą.",
      image: commons.monte, alt: "Kolejka linowa teleférico nad Funchal, dzielnica Monte", cats: ["spokojny", "odpoczynek"],
      intensity: "Umiarkowana", duration: "4–6 h + kolacja", transport: "Autobus / taxi", walking: "3–5 km", kids: "Tak, sprawnie chodzą", exposure: "Wariant bez wysokości",
      center: [32.662, -16.895], route: [[32.6384, -16.9353, "Hotel"], [32.6624, -16.8946, "Ogród botaniczny"], [32.6496, -16.9080, "Centrum Funchal"], [32.6750, -16.9022, "Monte — opcjonalnie"], [32.6484, -16.9033, "Kolacja z espetadą — Stare Miasto"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Madeira+Botanical+Garden/Funchal+Old+Town",
      agenda: [["08:30", "Śniadanie w hotelu", "Bufet śniadaniowy w hotelu, zwykle 7:30–10:00 (godziny potwierdzić w recepcji)."], ["10:15", "Wybór wariantu", "Ogród botaniczny albo centrum, zakupy i spokojna kawiarnia."], ["12:30", "Lunch", "Bez rezerwowania kolejnych atrakcji na siłę."], ["14:30", "Monte tylko dla chętnych", "Kolejka i wysokość są całkowicie opcjonalne."], ["16:00", "Hotel i basen", "Popołudniowa regeneracja przed wieczornym wyjściem."], ["19:30", "Kolacja z espetadą", "Polędwica wołowa ze szpady (espetada madeirense) grillowana na lauru, podawana z bolo do caco i milho frito. Restauracja w Starym Mieście albo w Câmara de Lobos; rodzinny stół, dzieciom zwykle smakuje."]],
      tips: ["Plan podstawowy to ogród botaniczny i centrum: 3–5 km z przerwami; kijki przydają się na pochyłych alejkach.", "Na espetadę w sezonie lepiej zarezerwować stół dla 7 osób z wyprzedzeniem — najlepsze lokale w Starym Mieście i w Câmara de Lobos bywają pełne.", "Espetada zwykle zamawiana jest na wagę lub 'na metr' do dzielenia — dla dzieci wystarczy mniejsza porcja lub wspólny półmisek.", "Szacunkowy koszt kolacji: 4 dorosłych po ok. 16–20 EUR, 3 dzieci po ok. 9–11 EUR, plus dodatki i napoje — razem około 120–150 EUR za grupę.", "Rodziny mogą rozdzielić się na 2–3 godziny w dzień i spotkać dopiero na wspólnej kolacji."],
      planB: "Cały dzień w hotelu i przy Lido; jeśli wieczór wypadnie leniwie, espetadę można przenieść na inny dzień pobytu.", gentle: "bez kolejki i bez Monte; wybieramy ogród dostępny taxi albo centrum, a na kolację najbliższą dobrą espetadę.",
      deepDive: {
        context: "Ogród botaniczny w Funchal założono w połowie XX wieku na terenie dawnej posiadłości rodziny Reid. Monte to historyczna dzielnica nad miastem, znana z bazyliki Nossa Senhora do Monte oraz tradycyjnych wiklinowych sań ('carros de cesto'), którymi dawniej zjeżdżano z góry do centrum.",
        food: "Wieczorna espetada madeirense to duże kawałki wołowiny nadziane na patyk z drzewa laurowego, natarte solą i czosnkiem, grillowane nad żarem i podawane zawieszone pionowo przy stole — dawniej na patyku z lauru, dziś często na metalowej szpadzie. Klasyczne dodatki to bolo do caco z masłem czosnkowym i milho frito (chrupiące kostki smażonej kukurydzy). Miejscem, które rozsławiło tę potrawę, jest Câmara de Lobos i Estreito powyżej niego.",
        practical: "Wjazd do ogrodu botanicznego jest płatny, a kolejka linowa na Monte bywa oblegana w środku dnia. Na kolację z espetadą warto zarezerwować stół — porcje są duże i dobrze dzielą się w rodzinie, więc nie trzeba zamawiać osobnej dla każdego dziecka."
      }
    },
    {
      id: "2026-08-26", date: "26 sierpnia · środa", title: "Banany, młyn i plaża — południowy zachód", short: "Bananowy dzień na słonecznym zachodzie: muzeum, plantacje, młyn trzcinowy i plaża w Calhecie.",
      image: commons.fontes, alt: "Levada das 25 Fontes w rezerwacie Rabaçal", cats: ["spokojny", "wycieczka busem"],
      intensity: "Spokojna", duration: "10:15–18:15", transport: "Prywatny bus + krótkie spacery", walking: "ok. 2–3 km, wszystko płasko", kids: "Tak — dzień pisany pod dzieci", exposure: "Żadna — wybrzeże i płaskie ścieżki",
      center: [32.7400, -17.1500], route: [[32.6384, -16.9353, "Hotel"], [32.6796, -17.0875, "BAM — Muzeum Bananów"], [32.7031, -17.1276, "Bananowce — Madalena do Mar"], [32.7219, -17.1775, "Calheta — młyn i plaża"], [32.6819, -17.1045, "Ponta do Sol"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Raba%C3%A7al,+Madeira/Calheta+Beach/Madalena+do+Mar/Ponta+do+Sol",
      agenda: [["08:15", "Śniadanie w hotelu", "Bufet 7:30–10:00 — spokojne śniadanie przed wyjazdem (godziny potwierdzić w recepcji)."], ["10:15", "Wyjazd z hotelu", "Dzień na słonecznym południowym zachodzie; przejazd wzdłuż wybrzeża, ok. 45 minut drogi."], ["11:15", "BAM — Muzeum Bananów Madery", "Lugar de Baixo: multimedialna wystawa o bananie jako motorze gospodarki wyspy, hologramy, film 4D, a do tego zwiedzanie plantacji doświadczalnej i szklarni z nowoczesnym transportem kiści. Bar serwuje kanapki i koktajle bananowe, także dla dorosłych piwo z maderskich bananów. Czynne codziennie 9:00–18:00."], ["12:45", "Bananowce w Madalena do Mar", "Bananowe zagłębie wyspy: plantacje schodzące tarasami wprost do oceanu. Krótki przystanek, żeby zobaczyć z bliska, jak rosną kiście, i spróbować owoców prosto z krzaka."], ["13:30", "Engenho da Calheta", "Stary młyn trzcinowy przy samej plaży: małe muzeum kolejnych etapów produkcji cukru i rumu, degustacja ponchy i miodu trzcinowego, kawiarnia z bolo de mel i biszkoptami. Wstęp wolny."], ["14:30", "Calheta — plaża i lunch", "Ponad 200 m złotego piasku w osłoniętej zatoce, jedna z niewielu piaszczystych plaż wyspy. Przy plaży plac zabaw ze zjeżdżalniami i huśtawkami oraz boiska; z mariny obok wypożycza się kajaki i deski SUP. Lunch przy oceanie, kąpiel i tyle czasu, ile trzeba."], ["17:00", "Ponta do Sol", "Lody i spacer przy oceanie w najbardziej słonecznym zakątku wyspy, w drodze powrotnej."], ["18:15", "Powrót", "Wieczór w hotelu."]],
      tips: ["BAM otwiera o 9:00 i zamyka o 18:00 — przy naszym tempie mamy zapas, ale zwiedzanie z plantacją zajmuje 1–1,5 h, więc nie warto go skracać.", "Na plaży w Calhecie piasek został sprowadzony i zatoka jest osłonięta falochronami, więc woda jest spokojniejsza niż gdziekolwiek indziej na wyspie — to najlepszy dzień na kąpiel z dzieckiem.", "Stroje kąpielowe, ręczniki i klapki zabrać rano do busa; przy plaży są prysznice i plac zabaw ze zjeżdżalniami.", "Z mariny obok plaży wypożycza się kajaki i deski SUP — do rozważenia na miejscu, jeśli morze będzie spokojne.", "Engenho da Calheta ma wstęp wolny i działa w czwartek 8:00–19:00; degustacja ponchy jest dla dorosłych, ale kawiarnia serwuje też bolo de mel i biszkopty.", "To najsłoneczniejsza część wyspy — krem z filtrem i czapki są tu potrzebne bardziej niż gdziekolwiek indziej."],
      planB: "Ten dzień działa w każdą pogodę — muzeum, młyn i kawiarnie są pod dachem, a przy deszczu po prostu wydłużamy BAM i Engenho zamiast plaży.", gentle: "zostajemy dłużej na plaży w Calhecie i skracamy postoje po drodze — dzień i tak nie wymaga wysiłku.",
      deepDive: {
        context: "Banan przypłynął na Maderę w XV wieku i przez stulecia był po trzcinie cukrowej drugim filarem gospodarki wyspy — maderska odmiana jest mniejsza i słodsza od tej, którą znamy ze sklepów, bo dojrzewa wolniej w łagodnym klimacie. Plantacje schodzą tarasami wprost do oceanu, a w Madalena do Mar i Lugar de Baixo zajmują niemal każdy skrawek zbocza. Calheta poniżej ma jedną z niewielu piaszczystych plaż wyspy — piasek sprowadzono, a zatokę osłonięto falochronami. Sam Engenho da Calheta to jeden z ostatnich czynnych młynów trzcinowych, gdzie od ponad pół wieku powstaje rum i miód z trzciny.",
        food: "Dzień kręci się wokół tego, co tu rośnie: banany prosto z plantacji, koktajle bananowe w barze przy muzeum, a w Engenho poncha, miód trzcinowy i bolo de mel prosto z pieca. Lunch najlepiej zjeść przy plaży w Calhecie, a w Ponta do Sol zostawić miejsce na lody.",
        practical: "BAM leży przy drodze VE3 w Lugar de Baixo, kilka kilometrów od Madalena do Mar — to najkrótszy możliwy przejazd między dwoma bananowymi przystankami dnia. Calheta ma parking przy marinie, prysznice i toalety przy plaży oraz kilka restauracji na promenadzie. Ponta do Sol nazywana jest najsłoneczniejszym miejscem Madery i rzeczywiście chmury schodzą tu rzadziej niż gdzie indziej."
      }
    },
    {
      id: "2026-08-27", date: "27 sierpnia · czwartek", title: "Pico Ruivo i wschód wyspy", short: "Wejście na najwyższy szczyt Madery (PR1.2), pstrąg w Ribeiro Frio i levada na Balcões.",
      image: commons.picoRuivo, alt: "Szczyt Pico Ruivo — najwyższy punkt Madery", cats: ["aktywny", "wycieczka busem"],
      intensity: "Aktywna", duration: "09:45–18:35", transport: "Prywatny bus + PR1.2", walking: "PR1.2 6 km + Balcões 1,5 km", kids: "Tak, dobrze chodzą po górach", exposure: "Umiarkowana; PR1.2, bez grani PR1",
      center: [32.757, -16.925], route: [[32.6384, -16.9353, "Hotel"], [32.7573, -16.9110, "Achada do Teixeira — start PR1.2"], [32.7583, -16.9419, "Pico Ruivo (1862 m)"], [32.7353, -16.8865, "Ribeiro Frio"], [32.7419, -16.8905, "Balcões"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Achada+do+Teixeira/Ribeiro+Frio/Bal%C3%A7%C3%B5es",
      agenda: [["08:00", "Śniadanie w hotelu", "Bufet od 7:30 — dziś jemy na początku, bo wyjeżdżamy wcześniej niż zwykle. Zabrać prowiant na szlak: kanapki, owoce, batony."], ["09:45", "Wyjazd z hotelu", "Wyjątkowo przed 10:15 — slot na szlak mamy o 11:30, a do Achada do Teixeira jedzie się około 95 minut: autostradą do Santany, potem wąską, krętą ER218 wysoko w góry."], ["11:20", "Achada do Teixeira", "Parking na ~1590 m z zapasem kwadransa. Przy nim skalna formacja 'Homem em Pé'. Kurtki, buty, toaleta — spokojnie, okno wejścia trwa do 12:00."], ["11:35", "PR1.2 na Pico Ruivo", "Wejście w oknie 11:30–12:00 zgodnie z biletem. Najłatwiejsza droga na najwyższy szczyt wyspy (1862 m): 2,8 km w jedną stronę szeroką, kamienną ścieżką ze schodami. Z dziećmi i przerwami liczymy 3 h w obie strony — bez pośpiechu, prowiant zjadamy na szczycie."], ["14:45", "Zjazd do Ribeiro Frio", "Około godziny drogi w dół — ta sama wąska droga, tylko w drugą stronę."], ["15:50", "Obiad w Ribeiro Frio", "Pstrąg z górskiej hodowli tuż przy szlaku; miejsce proste, ciepłe i dokładnie tam, gdzie trzeba. Ponad godzina bez patrzenia na zegarek."], ["17:00", "Vereda dos Balcões", "Wejście zgodnie z biletem na 17:00 (okno do 17:30). Płaska, szeroka levada do tarasu widokowego — 1,5 km w obie strony, 45–60 minut. Idealna nagroda po szczycie: zero wysiłku, wielki widok."], ["18:00", "Powrót do Funchal", "Około 35 minut drogi w dół."], ["18:35", "Hotel", "Wieczór bez planów — po takim dniu nikt nie będzie chciał nigdzie wychodzić."]],
      tips: ["<strong>Dojazd jest tu głównym ograniczeniem.</strong> Hotel → Achada do Teixeira to około 95 minut, a z powrotem w dół do Ribeiro Frio kolejne 65. Dlatego dzień ma tylko dwa przystanki po zejściu, a nie cztery — kierowca madeira-in zwrócił uwagę, że wcześniejsza wersja była nierealna.", "Bilety na oba szlaki mieć zapisane offline — zrzut ekranu albo PDF. Na Achada do Teixeira i w Ribeiro Frio zasięgu praktycznie nie ma.", "Bufory są wszędzie: na Achada jesteśmy kwadrans przed slotem, okno wejścia trwa do 12:00, a na szlak mamy ponad 3 h. Gdyby zejście się przeciągnęło, bilet na Balcões też ma okno do 17:30 — nic w tym dniu nie wisi na pięciu minutach.", "Prowiant zabrać z hotelu. Przy Achada do Teixeira nie ma sklepu ani kawiarni, a obiad wypada dopiero o 15:50 w Ribeiro Frio.", "Na wysokości 1600–1860 m bywa znacznie chłodniej i wietrzniej niż na wybrzeżu — warstwy, kurtka przeciwwiatrowa i czapka, nawet przy 26°C w Funchal.", "Blisko szczytu są krótkie odsłonięte fragmenty — dzieci prowadzimy od strony ściany i idziemy spokojnie.", "Kijki trekkingowe przydają się bardziej na zejściu niż na podejściu."],
      planB: "Przy mgle, deszczu lub silnym wietrze na szczycie rezygnujemy z wejścia i zostajemy niżej: Ribeiro Frio, pstrąg i łatwa levada na Balcões — bilet na Balcões zachowuje ważność niezależnie od tego, czy weszliśmy na szczyt. Wtedy dzień zaczyna się spokojniej i można dorzucić Queimadas albo Santanę.", gentle: "zamiast pełnego wejścia krótki odcinek PR1.2 od Achada do Teixeira i powrót do parkingu — sam widok z Homem em Pé wart jest przyjazdu — a potem spokojnie Ribeiro Frio i Balcões.",
      deepDive: {
        context: "Pico Ruivo (1862 m) to najwyższy szczyt Madery i trzeci co do wysokości w całej Portugalii. Trasa PR1.2 z Achada do Teixeira to najłatwiejsze podejście — szeroka, kamienna ścieżka przez wrzosowiska i relikty lasu laurowego. Sąsiednia grań PR1 z Pico do Arieiro jest znacznie trudniejsza i bardziej odsłonięta; po pożarach z 2024 r. była zamykana i odbudowywana.",
        food: "W Ribeiro Frio warto spróbować świeżego pstrąga z górskiej hodowli, a lunch w Quinta do Furão to kuchnia maderska bez przebrania za międzynarodową: espetada, dorsz, stek i wino z winnic wokół restauracji.",
        practical: "Na wysokości 1600–1860 m bywa znacznie chłodniej i wietrzniej niż na wybrzeżu, a mgła potrafi ograniczyć widoczność w kilka minut — warstwy i kurtka przeciwwiatrowa są potrzebne nawet w sierpniu. Parking przy Achada do Teixeira jest niewielki, więc wcześniejszy przyjazd pomaga."
      }
    },
    {
      id: "2026-08-28", date: "28 sierpnia · piątek", title: "Rejs: delfiny i wieloryby", short: "Główny punkt dnia: rodzinny rejs obserwacyjny z odpoczynkiem po powrocie.",
      image: commons.dolphin, alt: "Delfin u wybrzeży Funchal na Maderze", cats: ["aktywny", "spokojny"],
      intensity: "Łagodna", duration: "Rejs 2–3 h + odpoczynek", transport: "Taxi + stabilna łódź", walking: "Minimum", kids: "Tak, po potwierdzeniu wieku", exposure: "Zależna od morza",
      center: [32.6386, -16.9332], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6454, -16.9096, "Marina w Funchal"], [32.6200, -17.0300, "Obszar obserwacji na oceanie"], [32.6454, -16.9096, "Powrót do mariny"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Funchal+Marina",
      agenda: [["08:00", "Śniadanie w hotelu", "Bufet 7:30–10:00 — lekki posiłek i nawodnienie przed rejsem (godziny potwierdzić w recepcji)."], ["10:15", "Taxi do mariny", "Bez długiego dojścia; przybycie z zapasem na spokojne wejście na pokład."], ["11:00", "Rejs na delfiny i wieloryby", "Zaplanowany główny punkt dnia. Wybieramy stabilniejszą jednostkę z siedzeniami, cieniem, toaletą i możliwie łatwym wejściem."], ["14:00", "Lekki lunch i odpoczynek", "Po rejsie wracamy do hotelu; bez dokładania kolejnej atrakcji."], ["wieczór", "Wspólna kolacja", "Spokojne zakończenie dnia."]],
      tips: ["Rejs bierzemy na slot ok. 11:00 — pasuje do wyjścia po 10:15, a późnym przedpołudniem morze bywa jeszcze spokojne i szansa na delfiny oraz grindwale większa niż po południu.", "Zarezerwować rejs z możliwością bezpłatnej zmiany na 29 sierpnia przy złym stanie morza.", "Przy rezerwacji potwierdzić sposób wejścia na pokład, stabilne siedzenia, toaletę oraz pomoc załogi.", "Na wodzie wieje i mocno operuje słońce — kurtki przeciwwiatrowe, nakrycia głowy i krem są potrzebne nawet przy upale w mieście.", "Rejs jest zaplanowany, ale wypłynięcie zależy od decyzji operatora i bezpiecznych warunków; obserwacji zwierząt nie da się zagwarantować.", "Przy chorobie morskiej wcześniej ustalić bezpieczne postępowanie z lekarzem lub farmaceutą."],
      planB: "Jeśli operator odwoła rejs z powodu morza, przenosimy go na 29 sierpnia. Tego dnia zostają basen, Lido i odpoczynek; bezpieczeństwo ma pierwszeństwo przed wypłynięciem.", gentle: "rejs pozostaje w planie, ale wybieramy stabilną jednostkę, taxi pod marinę, miejsce siedzące i pomoc przy wejściu.",
      deepDive: {
        context: "Wody wokół Madery leżą blisko brzegu nad głębokim szelfem oceanicznym, co sprzyja obserwacji waleni przez cały rok. Najczęściej spotykane są delfiny butlonose i zwyczajne oraz oresy krótkopłetwe; sezonowo pojawiają się też większe gatunki wielorybów.",
        food: "Przed rejsem lepiej sprawdza się lekki, niskotłuszczowy posiłek niż ciężkie śniadanie; na statku zwykle dostępna jest woda, czasem lekka przekąska — warto dopytać operatora przy rezerwacji.",
        practical: "Operatorzy rejsów obserwacyjnych w Funchal zwykle oferują gwarancję ponownego wyjścia lub zwrot, jeśli zwierzęta nie zostaną zaobserwowane — warto to potwierdzić od razu, razem z zasadami wejścia na pokład."
      }
    },
    {
      id: "2026-08-29", date: "29 sierpnia · sobota", title: "Dzień rezerwowy", short: "Pięć gotowych pakietów do wyboru — od rejsu z terminu zapasowego po spokojny Funchal. Decyzja zapada rano.",
      image: commons.machico, alt: "Zatoka i plaża w Machico na Maderze", cats: ["spokojny", "odpoczynek"],
      intensity: "Do wyboru", duration: "zależnie od pakietu", transport: "Autobus / taxi / bus", walking: "zależnie od pakietu", kids: "Tak, sprawnie chodzą", exposure: "Nisko; Caminho Real dla chętnych",
      center: [32.7163, -16.7653], route: [[32.6384, -16.9353, "Hotel Baía Azul"]], google: "https://www.google.com/maps/dir/Funchal/Machico",
      agenda: [["08:00", "Śniadanie w hotelu", "Bufet śniadaniowy w hotelu, zwykle 7:30–10:00 (godziny potwierdzić w recepcji)."], ["przy śniadaniu", "Wybieramy pakiet dnia", "To jedyny dzień bez ustalonego planu. Cztery gotowe pakiety poniżej — każdy z własną trasą, czasem i mapą. Decyzja zapada rano, po prognozie i po tym, na co grupa ma ochotę."], ["cały dzień", "Realizujemy wybrany pakiet", "Szczegóły i mapa pojawiają się po wybraniu wariantu."], ["17:00", "Pakowanie", "Przygotować dokumenty, bagaże i ubrania na powrót; wieczorem tylko kolacja i wczesny sen."]],
      tips: ["29 sierpnia jest terminem zapasowym rejsu — nie rezerwować na rano innej bezzwrotnej atrakcji.", "Jeśli rejs odbył się wcześniej, planujemy 2–5 km spaceru w Machico albo Funchal; kijki według nawierzchni.", "Caminho Real do Paúl do Mar (PR19) to opcja tylko przy dobrej pogodzie, suchej nawierzchni i chęciach — pełny zjazd jest stromy i miejscami odsłonięty, więc bezpieczną wersją dla wszystkich jest sam górny punkt widokowy. Dojazd na SW to ~1 h w jedną stronę, a bus odbiera schodzących na dole.", "Machico daje aktywny, nisko położony wariant bez górskiej ekspozycji.", "Wieczorem zakończyć pakowanie i potwierdzić transfer."],
      packages: [
        {
          id: "rejs", nazwa: "Termin zapasowy rejsu", ikona: "🐬",
          meta: ["2–3 h na wodzie", "ma pierwszeństwo", "rezerwacja z 28.08"],
          opis: "Jeżeli rejs z 28 sierpnia odwołano z powodu stanu morza, dziś ma pierwszeństwo przed wszystkim innym — to ostatnia szansa w tym wyjeździe. Reszta dnia układa się wtedy sama: powrót do hotelu, basen i spokojne pakowanie.",
          route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6446, -16.9111, "Marina w Funchal"], [32.6100, -16.9200, "Obszar obserwacji"], [32.6446, -16.9111, "Powrót do mariny"], [32.6384, -16.9353, "Hotel"]],
          punkty: [["09:30", "Taxi do mariny"], ["10:00", "Rejs na delfiny i wieloryby"], ["13:00", "Powrót i lekki lunch"]]
        },
        {
          id: "levada", nazwa: "Levada das 25 Fontes", ikona: "🥾",
          meta: ["11 km od parkingu", "3–4 h marszu", "bilet PR6 wymagany"],
          opis: "Dla chętnych na jeszcze jedną porządną trasę: las laurowy UNESCO i laguna zasilana dwudziestoma pięcioma źródłami, w większości płasko. Wymaga biletu SIMplifica kupionego wcześniej na tę datę i drobnych na minibus w dół do Rabaçal House. Uwaga na jutro — 30 sierpnia zaczyna się transferem o 8:30 i kończy jazdą z Berlina do Łodzi.",
          route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.7586, -17.1313, "Rabaçal — start levady"], [32.7520, -17.1420, "Laguna 25 Fontes"], [32.6384, -16.9353, "Hotel"]],
          punkty: [["09:00", "Wyjazd — Rabaçal jest daleko"], ["10:30", "Minibus w dół i start levady"], ["14:30", "Powrót"], ["16:30", "Hotel"]]
        },
        {
          id: "machico", nazwa: "Machico i wschód", ikona: "🏖️",
          meta: ["ok. 2 km spacerem", "pół dnia", "plaża i promenada"],
          opis: "Najspokojniejszy z aktywnych wariantów: piaszczysta plaża w Machico, płaska promenada wzdłuż zatoki i lunch w miasteczku. Blisko lotniska, więc dobrze wpisuje się w dzień przed powrotem.",
          route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.7163, -16.7653, "Machico — plaża"], [32.6979, -16.7745, "Santa Cruz (opcjonalnie)"], [32.6384, -16.9353, "Hotel"]],
          punkty: [["10:15", "Wyjazd z hotelu"], ["11:00", "Plaża i promenada w Machico"], ["13:30", "Lunch"], ["15:30", "Powrót"]]
        },
        {
          id: "funchal", nazwa: "Funchal na spokojnie", ikona: "🛍️",
          meta: ["wszystko pieszo", "bez dojazdów", "zakupy i kawiarnie"],
          opis: "Bez wsiadania do niczego: ostatnie zakupy, targ, kawiarnia i to jedno miejsce, które wcześniej się nie zmieściło. Najlepszy wybór, jeśli grupa ma dość jeżdżenia albo pogoda jest niepewna.",
          route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6487, -16.9035, "Mercado dos Lavradores"], [32.6479, -16.9004, "Rua de Santa Maria"], [32.6446, -16.9111, "Marina i promenada"], [32.6384, -16.9353, "Hotel"]],
          punkty: [["10:15", "Wyjście z hotelu"], ["11:00", "Targ i stare miasto"], ["13:30", "Lunch przy marinie"], ["16:00", "Powrót"]]
        },
        {
          id: "caminho", nazwa: "Caminho Real do Paúl do Mar", ikona: "⛰️",
          meta: ["zejście ok. 500 m", "1,5 h w dół", "potrzebny odbiór busem"],
          opis: "Historyczna droga królewska wykuta w pionowym klifie. Bezpieczna wersja dla wszystkich to sam górny punkt widokowy w Prazeres z widokiem na zygzak schodzący do oceanu. Pełne zejście tylko dla chętnych, przy suchej nawierzchni — i pod warunkiem, że bus odbiera na dole w Paúl do Mar, bo podejście z powrotem to zupełnie inna historia.",
          route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.7539, -17.2023, "Prazeres — punkt widokowy"], [32.7622, -17.2261, "Paúl do Mar (odbiór busem)"], [32.6384, -16.9353, "Hotel"]],
          punkty: [["10:15", "Wyjazd z hotelu"], ["11:30", "Prazeres — punkt widokowy"], ["12:00", "Zejście dla chętnych"], ["16:00", "Powrót"]]
        }
      ],
      planB: "Hotel i Funchal. Najważniejszym zadaniem dnia jest spokojne przygotowanie powrotu.", gentle: "wybieramy najbliższy, nisko położony wariant (bez pełnego zjazdu Caminho Real) i kończymy dzień wcześnie.",
      deepDive: {
        context: "Machico było pierwszą stolicą Madery po odkryciu wyspy przez João Gonçalvesa Zarco w 1419 roku. Dziś to spokojne miasteczko z częściowo dosypywaną, piaszczystą plażą i płaską nadmorską promenadą. Na przeciwległym, południowo-zachodnim krańcu wyspy dawne caminhos reais — królewskie drogi — łączyły wioski przed powstaniem dzisiejszych dróg; najbardziej znany z nich, Caminho Real do Paúl do Mar, jest wykuty w pionowym klifie.",
        food: "W Machico warto spróbować lokalnej espetady — szaszłyka wołowego z liściem laurowym, tradycyjnie serwowanego na metalowym haku zamiast talerza — to jedna z najbardziej charakterystycznych madeirskich potraw.",
        practical: "Ten dzień celowo nie ma sztywnego planu — to bufor na rejs, pogodę albo zwykłe zmęczenie przed podróżą powrotną, więc żadna z opcji nie wymaga wcześniejszej rezerwacji. Caminho Real do Paúl do Mar (PR19): ~1,8 km i ok. 500 m zejścia z Prazeres do Paúl do Mar — wymagający zjazd, ale można poprzestać na górnym punkcie widokowym; jeśli grupa schodzi na dół, warto z góry umówić odbiór busa w porcie."
      }
    },
    {
      id: "2026-08-30", date: "30 sierpnia · niedziela", title: "Powrót do Łodzi", short: "Hotel, FNC, lot do Berlina, odbiór auta i ostatni odcinek.",
      image: commons.funchalBay, alt: "Zatoka Funchal i wybrzeże Madery", cats: ["podróż"],
      intensity: "Logistyczna", duration: "Cały dzień", transport: "Transfer + samolot + auto", walking: "Mało", kids: "Tak, z przerwami", exposure: "Niska",
      center: [32.6942, -16.7745], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6979, -16.7745, "Lotnisko FNC"], [52.3667, 13.5033, "Lotnisko BER"], [52.3664, 13.5071, "Parking P7/8"], [51.7592, 19.4560, "Łódź"]], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Madeira+Airport",
      agenda: [["rano", "Checklista hotelowa", "Dokumenty, ładowarki, leki, stroje kąpielowe i sejf."], ["07:30", "Śniadanie w hotelu", "Bufet rusza o 7:30 — zjeść przed transferem ok. 8:30."], ["08:30", "Prywatny transfer", "Transfer z madeira-in na lotnisko FNC; odbiór z hotelu ok. 08:30 pod wylot 11:35."], ["11:35", "Wylot FNC → BER", "Lot EJU5334 (PNR KD15T58); lądowanie w Berlinie o 17:10."], ["17:10", "Lądowanie w Berlinie (BER)", "Odbiór auta z P7/8 — parking jest 2–4 min od terminala. Wyjazd mamy opłacony do 18:00; jeśli bagaże pójdą wolno, różnicę dopłaca się w automacie (potrzebny bilet z wjazdu)."], ["wieczór", "Berlin → Łódź", "Ostatni odcinek autem; regularne przerwy i zmiana kierowcy, jeśli to możliwe — do Łodzi docieramy późnym wieczorem."]],
      tips: ["Loty potwierdzone przez biuro (rez. 3891149): wylot z FNC 11:35, lądowanie w Berlinie 17:10 — do Łodzi (~6 h autem z BER) dotrzecie późnym wieczorem, więc rozłóżcie jazdę na przerwy co ~90 minut.", "Rezerwacja parkingu kończy się o 18:00, czyli 50 minut po lądowaniu — to mało na bagaże i dojście. Nadwyżkę dopłaca się w automacie przy wyjeździe (trzeba mieć bilet pobrany przy wjeździe), więc nie ma powodu do nerwów.", "Odbiór z hotelu ok. 08:30 potwierdzić z madeira-in; przy silnym bocznym wietrze na FNC lot może się opóźnić.", "Potwierdzić asystę na FNC i BER, jeśli została zamówiona.", "Przed wymeldowaniem sprawdzić sejf, szafki, łazienkę i gniazdka.", "Zostawić zapas na bagaż i kolejki na lotnisku w Funchal."],
      planB: "Przy opóźnieniu po lądowaniu rozważyć dodatkowy odpoczynek lub nocleg; nie prowadzić zmęczonym.", gentle: "bezpieczeństwo i przerwy mają pierwszeństwo przed godziną dojazdu do Łodzi.",
      deepDive: {
        context: "Lotnisko w Funchal bywa wrażliwe na silny boczny wiatr ze względu na ukształtowanie terenu, co czasem wydłuża czas oczekiwania na start — warto mieć to na uwadze przy planowaniu ostatnich godzin w hotelu.",
        food: "Na lotnisku FNC wybór gastronomii jest ograniczony — lekki prowiant na drogę (owoce, kanapki) kupiony wcześniej w Funchal bywa wygodniejszym rozwiązaniem niż szukanie jedzenia już po odprawie.",
        practical: "Po długim dniu podróży (transfer, dwa loty, dojazd autem) lepiej z góry założyć bufor czasowy niż planować cokolwiek wieczorem w Łodzi poza samym dojazdem do domu."
      }
    }
  ];

  const stateKey = "madeira-premium-plan-v2";
  const readState = () => {
    try { return JSON.parse(localStorage.getItem(stateKey)) || {}; } catch (_) { return {}; }
  };
  const state = Object.assign({ checklist: {} }, readState());
  const save = () => localStorage.setItem(stateKey, JSON.stringify(state));
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
  const todayISO = () => { const n = new Date(), p = (x) => String(x).padStart(2, "0"); return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`; };
  let routeMapInstance = null;
  let overviewMapInstance = null;

  function imageMarkup(day, eager, className) {
    return `<img${className ? ` class="${className}"` : ""} src="${day.image}" alt="${escapeHtml(day.alt)}" ${eager ? "fetchpriority=\"high\"" : "loading=\"lazy\""} decoding="async" onerror="this.parentElement.classList.add('image-fallback');this.remove()">`;
  }

  function renderIndex() {
    const grid = document.querySelector("#day-grid");
    if (!grid) return;
    grid.innerHTML = days.map((day, i) => {
      const lvl = INTENSITY[day.intensity] || "y";
      const zamek = LOCKED[day.id] ? `<span class="day-lock" title="${escapeHtml(LOCKED[day.id])}" aria-hidden="true">🔒</span>` : "";
      return `<a class="day-card" data-day-id="${day.id}" href="days/${day.id}.html">${zamek}<span class="day-num">Dzień ${i + 1}</span><span class="idot ${lvl}" title="Dzień ${INTENSITY_LABEL[lvl]}"></span>${imageMarkup(day, false)}<div class="day-card-content"><small>${day.date}</small><h3>${day.title}</h3><p>${day.short}</p></div></a>`;
    }).join("");

    renderHighlights();
    setupChecklist();
    renderOverviewLegend();
    setupOverviewMap();
  }

  function setupChecklist() {
    const box = document.querySelector("#checklist");
    if (box) box.innerHTML = CHECKLIST.map(([key, label]) => `<label class="check-row"><input type="checkbox" data-check="${key}"> ${label}</label>`).join("");
    document.querySelectorAll("[data-check]").forEach((input) => {
      input.checked = Boolean(state.checklist[input.dataset.check]);
      input.addEventListener("change", () => { state.checklist[input.dataset.check] = input.checked; save(); });
    });
    const reset = document.querySelector("#reset-plan");
    if (reset) reset.addEventListener("click", () => {
      if (!window.confirm("Odznaczyć wszystkie pozycje checklisty?")) return;
      localStorage.removeItem(stateKey);
      window.location.reload();
    });
  }

  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (!document.querySelector('link[data-leaflet]')) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      stylesheet.dataset.leaflet = "true";
      document.head.appendChild(stylesheet);
    }
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-leaflet]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.L), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
      script.dataset.leaflet = "true";
      script.addEventListener("load", () => resolve(window.L), { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  function setMapInteractions(instance, active) {
    if (!instance) return;
    ["dragging", "touchZoom", "doubleClickZoom", "boxZoom", "keyboard", "scrollWheelZoom"].forEach((handler) => {
      if (instance[handler]) instance[handler][active ? "enable" : "disable"]();
    });
    if (active) instance.invalidateSize();
  }

  async function initRouteMap(day) {
    const element = document.querySelector("#route-map");
    const shell = document.querySelector(".map-shell");
    if (!element || !shell) return;
    try {
      const L = await loadLeaflet();
      routeMapInstance = L.map(element, {
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(routeMapInstance);
      if (day.packages && day.route.length < 2) {
        // dzień oparty na pakietach — mapa czeka na wybór wariantu
        routeMapInstance.setView([day.route[0][0], day.route[0][1]], 11);
        if (!document.querySelector(".map-wait")) {
          const info = document.createElement("p");
          info.className = "map-wait";
          info.textContent = "Wybierz pakiet powyżej, aby zobaczyć trasę.";
          element.parentElement.appendChild(info);
        }
        setMapInteractions(routeMapInstance, shell.classList.contains("is-active"));
        return;
      }
      const coordinates = day.route.map((stop) => [stop[0], stop[1]]);
      L.polyline(coordinates, { color: "#d9684f", weight: 5, opacity: .9, lineJoin: "round" }).addTo(routeMapInstance);
      day.route.forEach((stop, index) => {
        const icon = L.divIcon({
          className: "route-marker",
          html: `<span>${index + 1}</span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        L.marker([stop[0], stop[1]], { icon, title: stop[2] }).addTo(routeMapInstance).bindPopup(`<strong>${index + 1}. ${escapeHtml(stop[2])}</strong>`);
      });
      routeMapInstance.fitBounds(L.latLngBounds(coordinates), { padding: [28, 28], maxZoom: 12 });
      setMapInteractions(routeMapInstance, shell.classList.contains("is-active"));
    } catch (_) {
      element.innerHTML = '<p class="map-error">Mapa nie załadowała się. Skorzystaj z listy punktów lub otwórz trasę w Google Maps.</p>';
    }
  }

  function renderOverviewLegend() {
    const legend = document.querySelector("#overview-legend");
    if (!legend) return;
    const tourDays = days.filter((day) => day.cats.includes("wycieczka busem"));
    legend.innerHTML = tourDays.map((day, index) => `<li><span class="legend-dot" style="background:${TOUR_COLORS[index % TOUR_COLORS.length]}"></span><a href="days/${day.id}.html">${day.date.split(" · ")[0]} — ${day.title}</a></li>`).join("");
  }

  async function initOverviewMap() {
    const element = document.querySelector("#overview-map");
    const shell = document.querySelector("#overview-map-shell");
    if (!element || !shell) return;
    try {
      const L = await loadLeaflet();
      overviewMapInstance = L.map(element, {
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(overviewMapInstance);
      const tourDays = days.filter((day) => day.cats.includes("wycieczka busem"));
      const allCoordinates = [];
      tourDays.forEach((day, tourIndex) => {
        const color = TOUR_COLORS[tourIndex % TOUR_COLORS.length];
        const coordinates = day.route.map((stop) => [stop[0], stop[1]]);
        allCoordinates.push(...coordinates);
        L.polyline(coordinates, { color, weight: 5, opacity: .85, lineJoin: "round" }).addTo(overviewMapInstance);
        day.route.forEach((stop, stopIndex) => {
          const icon = L.divIcon({
            className: "route-marker",
            html: `<span style="background:${color}">${stopIndex + 1}</span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });
          L.marker([stop[0], stop[1]], { icon, title: `${day.title}: ${stop[2]}` }).addTo(overviewMapInstance).bindPopup(`<strong>${escapeHtml(day.title)}</strong><br>${stopIndex + 1}. ${escapeHtml(stop[2])}`);
        });
      });
      if (allCoordinates.length) overviewMapInstance.fitBounds(L.latLngBounds(allCoordinates), { padding: [28, 28], maxZoom: 12 });
      setMapInteractions(overviewMapInstance, shell.classList.contains("is-active"));
    } catch (_) {
      element.innerHTML = '<p class="map-error">Mapa nie załadowała się. Skorzystaj z legendy lub otwórz trasy dni w Google Maps.</p>';
    }
  }

  function setupOverviewMap() {
    const shell = document.querySelector("#overview-map-shell");
    const activate = document.querySelector("#overview-map-activate");
    const deactivate = document.querySelector("#overview-map-deactivate");
    if (!shell || !activate || !deactivate) return;
    activate.addEventListener("click", () => { shell.classList.add("is-active"); activate.textContent = "Mapa aktywna"; setMapInteractions(overviewMapInstance, true); });
    deactivate.addEventListener("click", () => { shell.classList.remove("is-active"); activate.textContent = "Aktywuj mapę"; setMapInteractions(overviewMapInstance, false); });
    initOverviewMap();
  }

  // ── Pakiety dnia (dzień bez ustalonego planu) ─────────────────────────
  let wybranyPakiet = null;

  function packagesHTML(day) {
    if (!day.packages) return "";
    return `
      <section class="section card day-packages" aria-labelledby="pak-title">
        <div class="card-body">
          <h2 id="pak-title">Pakiety na ten dzień</h2>
          <p class="section-copy">Wybierz jeden — agenda, trasa i mapa poniżej dopasują się do niego. Bez wyboru mapa zostaje pusta, bo warianty prowadzą w przeciwne końce wyspy.</p>
          <div class="pak-grid" role="radiogroup" aria-label="Wybór pakietu dnia">
            ${day.packages.map((p) => `
              <button class="pak-card" type="button" role="radio" aria-checked="false" data-pak="${p.id}">
                <span class="pak-ico" aria-hidden="true">${p.ikona}</span>
                <span class="pak-nazwa">${p.nazwa}</span>
                <span class="pak-meta">${p.meta.map((m) => `<em>${m}</em>`).join("")}</span>
              </button>`).join("")}
          </div>
          <div class="pak-szczegol" id="pak-szczegol" hidden></div>
        </div>
      </section>`;
  }

  function pokazPakiet(day, id) {
    const p = day.packages.find((x) => x.id === id);
    const box = document.querySelector("#pak-szczegol");
    if (!p || !box) return;
    wybranyPakiet = id;
    try { localStorage.setItem("madera-pakiet-" + day.id, id); } catch (e) {}
    document.querySelectorAll(".pak-card").forEach((b) => {
      const on = b.dataset.pak === id;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-checked", on ? "true" : "false");
    });
    const czekaj = document.querySelector(".map-wait");
    if (czekaj) czekaj.remove();
    box.hidden = false;
    box.innerHTML = `
      <h3>${p.ikona} ${p.nazwa}</h3>
      <p class="pak-opis">${p.opis}</p>
      <div class="pak-plan">${p.punkty.map(([t, co]) => `<div class="pak-slot"><span>${t}</span><strong>${co}</strong></div>`).join("")}</div>`;
    // mapa przeładowuje się na trasę pakietu
    przeladujMape(p.route, p.nazwa);
    const stops = document.querySelector(".route-stop-list");
    if (stops) stops.innerHTML = p.route.map((s, k) => `<li><span>${k + 1}</span>${escapeHtml(s[2])}</li>`).join("");
  }

  async function przeladujMape(route, tytul) {
    const element = document.querySelector("#route-map");
    if (!element) return;
    if (routeMapInstance) { routeMapInstance.remove(); routeMapInstance = null; }
    element.innerHTML = "";
    const shell = document.querySelector(".map-shell");
    try {
      const L = await loadLeaflet();
      routeMapInstance = L.map(element, {
        dragging: false, touchZoom: false, doubleClickZoom: false,
        boxZoom: false, keyboard: false, scrollWheelZoom: false,
        zoomControl: true, attributionControl: true
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(routeMapInstance);
      const wsp = route.map((s) => [s[0], s[1]]);
      if (wsp.length > 1) L.polyline(wsp, { color: "#d9684f", weight: 5, opacity: .9, lineJoin: "round" }).addTo(routeMapInstance);
      route.forEach((s, k) => {
        const icon = L.divIcon({ className: "route-marker", html: `<span>${k + 1}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] });
        L.marker([s[0], s[1]], { icon, title: s[2] }).addTo(routeMapInstance).bindPopup(`<strong>${k + 1}. ${escapeHtml(s[2])}</strong>`);
      });
      routeMapInstance.fitBounds(L.latLngBounds(wsp), { padding: [28, 28], maxZoom: 13 });
      setMapInteractions(routeMapInstance, shell && shell.classList.contains("is-active"));
    } catch (_) {
      element.innerHTML = '<p class="map-error">Mapa nie załadowała się. Skorzystaj z listy punktów poniżej.</p>';
    }
  }

  function setupPackages(day) {
    if (!day.packages) return;
    document.querySelectorAll(".pak-card").forEach((b) => {
      b.addEventListener("click", () => pokazPakiet(day, b.dataset.pak));
    });
    let zapisany = null;
    try { zapisany = localStorage.getItem("madera-pakiet-" + day.id); } catch (e) {}
    if (zapisany && day.packages.some((p) => p.id === zapisany)) pokazPakiet(day, zapisany);
  }

  function groupsHTML(day) {
    const g = day.groups;
    if (!g) return "";
    return `
      <section class="section card day-groups" aria-labelledby="groups-title">
        <div class="card-body">
          <h2 id="groups-title">${g.naglowek}</h2>
          <p class="section-copy">${g.wstep}</p>
          <div class="dg-grid">
            ${g.listy.map((l) => `
              <article class="dg-track dg-${l.kod.toLowerCase()}">
                <header class="dg-head">
                  <span class="dg-kod" aria-hidden="true">${l.kod}</span>
                  <div><h3>${l.nazwa}</h3><p class="dg-sklad">${l.sklad}</p></div>
                </header>
                <ul class="dg-meta">${l.meta.map((m) => `<li>${m}</li>`).join("")}</ul>
                <div class="dg-timeline">${l.punkty.map((p) => `<div class="dg-slot"><span class="dg-time">${p[0]}</span><div><strong>${p[1]}</strong><p>${p[2]}</p></div></div>`).join("")}</div>
              </article>`).join("")}
          </div>
          <p class="dg-foot">${g.stopka}</p>
        </div>
      </section>`;
  }

  function renderDay() {
    const root = document.querySelector("#day-root");
    if (!root) return;
    const day = days.find((item) => item.id === document.body.dataset.day);
    if (!day) { root.innerHTML = "<main><p>Nie znaleziono dnia.</p></main>"; return; }
    const index = days.indexOf(day);
    const prev = days[index - 1];
    const next = days[index + 1];
    document.title = `${day.date} — ${day.title} | Madera 2026`;
    document.querySelector('meta[name="description"]').setAttribute("content", day.short);
    const metrics = [["Intensywność", day.intensity], ["Czas", day.duration], ["Transport", day.transport], ["Chodzenie", day.walking], ["Dla dzieci", day.kids], ["Ekspozycja", day.exposure]];
    root.innerHTML = `
      <header class="hero">${imageMarkup(day, true, "hero-media")}<div class="hero-inner"><p class="eyebrow">${day.date} · dzień ${index + 1} z ${days.length}</p><h1>${day.title}</h1><p class="lead">${day.short}</p><div class="chips"><span class="chip"><span class="idot ${INTENSITY[day.intensity] || "y"}"></span> ${day.intensity}</span><span class="chip">${day.transport}</span><span class="chip">${day.walking}</span></div></div></header>
      <main id="main-content">
        <nav class="day-rail" aria-label="Przejdź do innego dnia">${days.map((d, i) => `<a class="day-rail-item${d.id === day.id ? " is-current" : ""}" href="${d.id}.html"${d.id === day.id ? ' aria-current="page"' : ""}><span class="drn">${i + 1}</span><span class="drd">${d.date.split(" · ")[0]}</span></a>`).join("")}</nav>
        <div id="day-trail-alert"></div>
        <div class="grid">
          <section class="card" aria-labelledby="agenda-title"><div class="card-body"><h2 id="agenda-title">Plan dnia</h2><div class="timeline">${day.agenda.map((slot) => `<article class="slot"><span class="time">${slot[0]}</span><span class="dot" aria-hidden="true"></span><div><h3>${slot[1]}</h3><p>${slot[2]}</p></div></article>`).join("")}</div></div></section>
          <aside class="card"><div class="card-body"><h2>W skrócie</h2><div class="info">${metrics.map((metric) => `<div class="metric"><strong>${metric[1]}</strong><span>${metric[0]}</span></div>`).join("")}</div><div class="badges"><span class="badge">Dzieci chodzą po górach</span><span class="badge">Spokojne tempo</span><span class="badge">Niska ekspozycja</span>${day.cats.includes("odpoczynek") ? "<span class=\"badge optional\">Elastyczny plan</span>" : ""}${day.cats.includes("wycieczka busem") || day.id === "2026-08-28" ? "<span class=\"badge weather\">Pogoda ma znaczenie</span>" : ""}</div><div class="variant-note"><strong>Wariant łagodniejszy:</strong> ${day.gentle}</div>${FLEX[day.id] ? `<div class="flex"><span class="fxlock"><b>🔒 Nie ruszać:</b> ${FLEX[day.id][0]}</span><span class="fxcut"><b>✂️ Można odpuścić:</b> ${FLEX[day.id][1]}</span></div>` : ""}</div></aside>
        </div>
        ${groupsHTML(day)}
        ${packagesHTML(day)}
        <section class="section" id="day-weather" aria-label="Pogoda w rejonie tego dnia"><div class="card"><div class="card-body"><p class="dw-loading">Ładowanie pogody na żywo…</p></div></div></section>
        <section class="section grid" aria-label="Mapa i wskazówki">
          <div class="card"><div class="map-shell"><button class="map-activate" type="button">Aktywuj mapę</button><div class="route-map" id="route-map" role="application" aria-label="Mapa OpenStreetMap z trasą: ${day.title}"></div></div><div class="route-summary"><p><strong>Orientacyjna trasa dnia</strong> — linia łączy główne punkty; dokładny przebieg dróg sprawdź w Google Maps.</p><ol class="route-stop-list">${day.route.map((stop, stopIndex) => `<li><span>${stopIndex + 1}</span>${stop[2]}</li>`).join("")}</ol></div><div class="map-actions"><a class="button" href="${day.google}" target="_blank" rel="noopener">Otwórz trasę w Google Maps ↗</a><button class="button secondary" type="button" data-deactivate-map>Wyłącz mapę</button></div></div>
          <div class="card"><div class="card-body"><h2>Wskazówki praktyczne</h2><ul class="tips">${day.tips.map((tip) => `<li>${tip}</li>`).join("")}</ul></div></div>
        </section>
        <section class="section card deep-dive" aria-labelledby="deep-dive-title"><div class="card-body"><h2 id="deep-dive-title">Więcej o tym dniu</h2><div class="deep-grid"><div><h3>Kontekst i historia</h3><p>${day.deepDive.context}</p></div><div><h3>Jedzenie i lokalne smaki</h3><p>${day.deepDive.food}</p></div><div><h3>Praktyczne detale</h3><p>${day.deepDive.practical}</p></div></div></div></section>
        <section class="section card plan-b"><h2>Plan B</h2><p class="section-copy">${day.planB}</p></section>
        <nav class="nav-days" aria-label="Nawigacja między dniami">${prev ? `<a href="${prev.id}.html">← ${prev.date.split(" · ")[0]}</a>` : "<span></span>"}<a class="home" href="../index.html">Strona główna</a>${next ? `<a class="next" href="${next.id}.html">${next.date.split(" · ")[0]} →</a>` : "<span></span>"}</nav>
        <p class="day-actions"><button class="button secondary" type="button" id="share-day">Udostępnij dzień</button></p>
        <footer class="footer">Plan rodzinny 19–30 sierpnia 2026. Godziny lotów, rezerwacje, warunki pogodowe i dostępność atrakcji wymagają potwierdzenia przed wyjazdem.${creditFor(day.image) ? `<br>Zdjęcie dnia: ${creditFor(day.image)}` : ""}</footer>
      </main>`;

    renderDayTrailAlert(day);
    setupPackages(day);

    const mapShell = document.querySelector(".map-shell");
    const activate = document.querySelector(".map-activate");
    const deactivate = document.querySelector("[data-deactivate-map]");
    activate.addEventListener("click", () => { mapShell.classList.add("is-active"); activate.textContent = "Mapa aktywna"; setMapInteractions(routeMapInstance, true); });
    deactivate.addEventListener("click", () => { mapShell.classList.remove("is-active"); activate.textContent = "Aktywuj mapę"; setMapInteractions(routeMapInstance, false); });
    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (document.body.classList.contains("lb-open")) return;
      if (event.target.matches("input, select, textarea")) return;
      if (event.key === "ArrowLeft" && prev) window.location.href = `${prev.id}.html`;
      if (event.key === "ArrowRight" && next) window.location.href = `${next.id}.html`;
    });
    const heroImg = document.querySelector(".hero-media");
    if (heroImg) {
      heroImg.classList.add("zoomable");
      heroImg.addEventListener("click", () => lightbox.open([{ src: day.image, caption: day.alt, credit: creditFor(day.image) }], 0));
    }
    const rail = document.querySelector(".day-rail");
    const currentRail = rail && rail.querySelector(".is-current");
    if (rail && currentRail) {
      const itemRect = currentRail.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();
      rail.scrollLeft += (itemRect.left + itemRect.width / 2) - (railRect.left + railRect.width / 2);
    }
    initRouteMap(day);
    renderDayWeather(day);
    markNow(day);
    setupShare(day);
  }

  // Bieżący punkt agendy — działa tylko w dniu, którego dotyczy strona
  function markNow(day) {
    if (day.id !== todayISO()) return;
    const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    const slots = [...document.querySelectorAll(".slot")];
    let cur = -1;
    day.agenda.forEach((sl, i) => {
      const m = /^(\d{2}):(\d{2})/.exec(sl[0]);
      if (m && (+m[1] * 60 + +m[2]) <= mins) cur = i;
    });
    slots.forEach((el, i) => {
      if (i < cur) el.classList.add("is-past");
      if (i === cur) {
        el.classList.add("is-now");
        const h = el.querySelector("h3");
        if (h) h.insertAdjacentHTML("afterbegin", '<span class="now-tag">teraz</span> ');
      }
    });
    const el = document.querySelector(".slot.is-now");
    if (el) window.setTimeout(() => el.scrollIntoView({ block: "center", behavior: "smooth" }), 600);
  }

  // Udostępnianie dnia (natywne na telefonie, kopiowanie linku w przeglądarce)
  function setupShare(day) {
    const btn = document.querySelector("#share-day");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const data = { title: `${day.date} — ${day.title}`, text: day.short, url: location.href };
      try {
        if (navigator.share) { await navigator.share(data); return; }
        await navigator.clipboard.writeText(location.href);
        btn.textContent = "Skopiowano link ✓";
        window.setTimeout(() => { btn.textContent = "Udostępnij dzień"; }, 2000);
      } catch (e) { /* użytkownik anulował */ }
    });
  }

  function renderPrint() {
    const root = document.querySelector("#print-root");
    if (!root) return;
    const checklistItems = CHECKLIST.map(([, label]) => label);
    root.innerHTML = `
      <header class="print-head">
        <h1>Madera 2026 — plan podróży</h1>
        <p class="print-sub">19–30 sierpnia 2026 · dwie rodziny (4 dorosłych + dzieci 6, 10 i 12 lat) · Hotel Baía Azul, Funchal</p>
        <ul class="print-facts">
          <li><strong>Lot tam:</strong> 20.08, EJU5333 Berlin BER → Funchal, 07:00 → 10:55 (PNR KCXF7QW)</li>
          <li><strong>Lot powrotny:</strong> 30.08, EJU5334 Funchal → Berlin BER, 11:35 → 17:10 (PNR KD15T58); odbiór z hotelu ok. 08:30</li>
          <li><strong>Transfery lotniskowe:</strong> madeira-in (Rui Nóbrega), Mercedes Sprinter, 45 EUR w jedną stronę — <strong>90 EUR razem, PŁATNE GOTÓWKĄ przy przyjeździe</strong>; tel. kierowcy +351 917 260 690, mail transfers.madeira@gmail.com. Po wylądowaniu dzwonimy do Rui z kompletem bagaży, odbiór przy kawiarni obok hali przylotów</li>
          <li><strong>Wycieczki busem:</strong> ad hoc z madeira-in, 220 EUR/dzień — orientacyjnie 22, 24 i 27.08</li>
          <li><strong>Gotówka:</strong> 90 € transfery (Rui, przy przyjeździe) · 220 €/dzień za wycieczki busem, jeśli je zamówimy · ok. 8 €/os. na minibus w Rabaçal przy wariancie z levadą. Reszta wyspy na kartę.</li>
            <li><strong>Szlaki 27.08:</strong> PR1.2 Pico Ruivo slot 11:30 (wymiana w toku — rez. 2234556/2026), Balcões 17:00 SIM4330277 i SIM4330279. 5 dorosłych + 2 dzieci zwolnione. Wyjazd z hotelu wyjątkowo 9:45. Mieć PDF offline. PR6 25 Fontes tylko jako wariant 29.08 (wtedy minibus z ER105, ok. 8 €/os. gotówką)</li>
            <li><strong>Auto:</strong> parking APCOA P7/8 BER (Terminal T1&amp;T2), rez. 8320774, tablica EL2GE01, wjazd 19.08 16:00 → wyjazd 30.08 18:00, 144 € zapłacone; Brunolf-Baade-Straße 1/2</li>
          <li><strong>Nocleg 19.08:</strong> IntercityHotel Berlin Airport BER Terminal 1+2, Willy-Brandt-Platz 5, tel. +49 30 536 531 0 — 2 × Business Twin, potwierdzenia 4RGPYJYD i 4GMN9X9N, 166,78 € bez śniadania, City Ticket w cenie; zameldowanie od 15:00, wymeldowanie do 12:00</li>
          <li><strong>Rytm dnia:</strong> z hotelu wychodzimy standardowo o 10:15; wcześniej tylko pod samolot (20.08 i 30.08)</li>
        </ul>
        <p class="print-note">Godziny lotów potwierdzone przez biuro podróży (rezerwacja 3891149, stan 24.07.2026).</p>
        <div class="print-actions no-print">
          <button class="button" type="button" onclick="window.print()">Drukuj / zapisz jako PDF</button>
          <a class="button secondary" href="index.html">← Wróć do planu online</a>
        </div>
      </header>
      ${days.map((day, index) => `
      <section class="print-day">
        <h2>Dzień ${index + 1} · ${day.date} — ${day.title}</h2>
        <p class="print-short">${day.short}</p>
        <table class="print-agenda">
          <tbody>${day.agenda.map((slot) => `<tr><th scope="row">${slot[0]}</th><td><strong>${slot[1]}.</strong> ${slot[2]}</td></tr>`).join("")}</tbody>
        </table>
        <p class="print-block"><strong>Wskazówki:</strong> ${day.tips.join(" ")}</p>
        <p class="print-block"><strong>Plan B:</strong> ${day.planB}</p>
        <p class="print-block"><strong>Wariant łagodniejszy:</strong> ${day.gentle}</p>
        ${FLEX[day.id] ? `<p class="print-block"><strong>Nie ruszać:</strong> ${FLEX[day.id][0]} · <strong>Można odpuścić:</strong> ${FLEX[day.id][1]}</p>` : ""}
      </section>`).join("")}
      <section class="print-day">
        <h2>Checklista przed wyjazdem</h2>
        <ul class="print-check">${checklistItems.map((item) => `<li>☐ ${item}</li>`).join("")}</ul>
      </section>
      <footer class="print-foot">Godziny lotów, rezerwacje, warunki pogodowe i dostępność atrakcji wymagają potwierdzenia przed wyjazdem. Wygenerowano ze strony planu — wersja online zawiera mapy tras.</footer>`;
  }

  function renderTopNav() {
    const host = document.querySelector("#top-actions");
    if (!host) return;
    const page = document.body.dataset.page;
    const prefix = page === "day" ? "../" : "";
    const t = todayISO();
    const trip = days.find((d) => d.id === t);
    const items = [
      { key: "home", label: "Plan", href: "index.html" },
      { key: "practical", label: "Praktyczne", href: "praktyczne.html" },
      { key: "map", label: "Mapa", href: "mapa.html" },
      { key: "food", label: "Gdzie zjeść", href: "gdzie-zjesc.html" },
      { key: "print", label: "PDF", href: "print.html" }
    ];
    if (trip) items.splice(1, 0, { key: "today", label: "Dziś", href: `days/${trip.id}.html`, accent: true });
    host.innerHTML = items.map((item) => {
      const current = item.key === page;
      const sectionActive = item.key === "home" && page === "day";
      const highlight = current || sectionActive;
      return `<a class="nav-link${highlight ? " is-current" : ""}${item.accent ? " is-today" : ""}" href="${prefix}${item.href}"${current ? ' aria-current="page"' : ""}>${item.label}</a>`;
    }).join("");
  }

  const highlights = [
    { dayId: "2026-08-27", image: commons.picoRuivo, title: "Pico Ruivo — dach wyspy", desc: "Wejście na najwyższy szczyt Madery (1862 m) najłatwiejszą trasą PR1.2 z Achada do Teixeira." },
    { dayId: "2026-08-26", image: commons.fontes, title: "Bananowy zachód wyspy", desc: "Muzeum bananów z plantacją doświadczalną, młyn trzcinowy i piaszczysta plaża w Calhecie." },
    { dayId: "2026-08-24", image: commons.fanal, title: "Zamglony las Fanal", desc: "Sędziwe, poskręcane drzewa laurowe spowite mgłą na płaskowyżu Paúl da Serra." },
    { dayId: "2026-08-28", image: commons.dolphin, title: "Delfiny i wieloryby", desc: "Rodzinny rejs po spokojniejszych, porannych wodach u wybrzeży Funchal." },
    { dayId: "2026-08-24", image: commons.portoMoniz, title: "Baseny lawowe Porto Moniz", desc: "Naturalne baseny wykute przez lawę i ocean na północno-zachodnim krańcu wyspy." },
    { dayId: "2026-08-25", image: commons.espetada, title: "Kolacja z espetadą", desc: "Wołowina ze szpady grillowana na lauru, z bolo do caco — wieczór w Funchal." }
  ];

  function renderHighlights() {
    const grid = document.querySelector("#highlights-grid");
    if (!grid) return;
    grid.innerHTML = highlights.map((h) => {
      const day = days.find((d) => d.id === h.dayId);
      const n = days.indexOf(day) + 1;
      return `<a class="hl-card" href="days/${h.dayId}.html"><img src="${h.image}" alt="" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('image-fallback');this.remove()"><div class="hl-body"><span class="hl-day">Dzień ${n} · ${day.date.split(" · ")[0]}</span><h3>${h.title}</h3><p>${h.desc}</p></div></a>`;
    }).join("");
  }

  const packing = [
    { emoji: "🧥", title: "Ubrania i warstwy", items: ["Lekkie ubrania na dzień (23–26°C) i coś cieplejszego na wieczór.", "Polar lub bluza — w górach i we mgle bywa wyraźnie chłodniej.", "Kurtka przeciwdeszczowa lub wiatrówka zawsze w plecaku, nawet przy słonecznej prognozie."] },
    { emoji: "🥾", title: "Na levadę i góry", items: ["Buty trekkingowe na Levadę das 25 Fontes — bywa mokro, wąsko i wysoko.", "Wygodne sneakersy na miasto i spacery po wybrzeżu.", "Mały plecak, woda i przekąski; kijki trekkingowe dla chętnych."] },
    { emoji: "🏖️", title: "Plaża i woda", items: ["Stroje kąpielowe i ręczniki (Lido, Porto Moniz, Calheta).", "Klapki lub buty do wody na kamieniste wejścia.", "Okulary i rurka do snorkelingu dla chętnych."] },
    { emoji: "☀️", title: "Słońce i zdrowie", items: ["Krem z wysokim filtrem — na Maderze absolutnie nieodzowny.", "Czapki, kapelusze i okulary przeciwsłoneczne.", "Tabletki na chorobę morską na rejs (28.08), apteczka i leki na receptę z zapasem.", "EKUZ i ubezpieczenie turystyczne."] },
    { emoji: "🔌", title: "Elektronika", items: ["Ładowarki — gniazdka jak w Polsce, przejściówka niepotrzebna.", "Power bank na całodniowe wycieczki.", "Telefon z pobranymi mapami offline i aparatem."] },
    { emoji: "🧒", title: "Dla dzieci", items: ["Przekąski i woda na dni z późniejszym lunchem.", "Coś do zajęcia w busie na dłuższych trasach.", "Zmiana ubrań i drobna gra na luźniejszy dzień."] }
  ];

  const practicalInfo = [
    { emoji: "🍳", title: "Śniadania w hotelu", points: ["Bufet śniadaniowy w Hotelu Baía Azul jest w cenie i serwowany zwykle w godzinach 7:30–10:00.", "Dla wychodzących wcześnie na wycieczkę zwykle dostępne jest śniadanie kontynentalne już od ok. 6:00.", "Dokładne godziny warto potwierdzić w recepcji po zameldowaniu — bywają sezonowe różnice."] },
    { emoji: "💶", title: "Waluta i płatności", points: ["Obowiązuje euro (EUR).", "Karty płatnicze akceptowane niemal wszędzie; bankomaty (Multibanco) są powszechne w Funchal.", "Gotówka przydaje się na targu, w małych wioskach i przy straganach z poncha."] },
    { emoji: "🗣️", title: "Język", points: ["Językiem urzędowym jest portugalski.", "W Funchal i miejscach turystycznych powszechny jest angielski, często również niemiecki.", "Mile widziane proste zwroty: bom dia (dzień dobry), obrigado / obrigada (dziękuję — forma zależna od płci mówiącego), por favor (proszę)."] },
    { emoji: "🔌", title: "Prąd i gniazdka", points: ["Napięcie 230 V, gniazdka typu F — takie same jak w Polsce.", "Przejściówka nie jest potrzebna.", "Warto zabrać listwę lub ładowarkę z kilkoma portami USB dla całej rodziny."] },
    { emoji: "🕐", title: "Czas", points: ["Madera latem jest o jedną godzinę wcześniej niż Polska.", "Gdy w Łodzi jest 12:00, na Maderze jest 11:00.", "Zegarki i budziki cofamy o godzinę po przylocie, a przestawiamy z powrotem w drodze powrotnej."] },
    { emoji: "📶", title: "Telefon i internet", points: ["Polski numer działa w roamingu UE bez dodatkowych opłat (roam like at home).", "Zasięg jest dobry na wybrzeżu, słabszy w górach, długich tunelach i głębokich dolinach.", "Warto pobrać mapy offline całej wyspy przed wyjazdem."] },
    { emoji: "🌦️", title: "Pogoda i mikroklimaty", points: ["Południe wyspy (Funchal) jest cieplejsze i bardziej słoneczne, północ chłodniejsza i wilgotniejsza.", "W górach bywa znacznie zimniej i mgliście nawet przy upale na wybrzeżu — warstwy ubrań i kurtka przeciwwiatrowa są potrzebne latem.", "Ocean bywa chłodny; kąpiel najlepiej na strzeżonych plażach i przy basenach."] },
    { emoji: "🚕", title: "Transport", points: ["W Funchal jest dużo taksówek; działają też aplikacje typu Bolt.", "Autobusy miejskie (Horários do Funchal) i regionalne obsługują wybrzeże, ale w góry wygodniej jechać prywatnym busem lub taxi.", "Drogi są kręte i strome, z licznymi tunelami — osoby wrażliwe na chorobę lokomocyjną najlepiej sadzać z przodu."] },
    { emoji: "💧", title: "Woda i zdrowie", points: ["Woda z kranu jest zdatna do picia.", "Zabrać EKUZ (Europejska Karta Ubezpieczenia Zdrowotnego) oraz ubezpieczenie turystyczne.", "Apteki (farmácia) w Funchal są liczne; leki na receptę warto mieć z zapasem i w bagażu podręcznym."] },
    { emoji: "💶", title: "Ile gotówki mieć przy sobie", points: [
      "<strong>90 € — transfery lotniskowe.</strong> Rui rozlicza się gotówką przy przyjeździe, nie kartą i nie przelewem. Banknoty przygotować jeszcze w Polsce.",
      "<strong>Do 660 € — wycieczki busem.</strong> Trzy dni po 220 € rezerwujemy ad hoc na miejscu; płatność za każdy dzień osobno, też gotówką. Jeśli wyjdzie mniej dni, odpowiednio mniej.",
      "<strong>ok. 8 € od osoby — minibus w Rabaçal</strong>, tylko jeśli wybierzemy levadę 25 Fontes 29.08. Płatny wyłącznie gotówką, więc drobne muszą być tego dnia w kieszeni, nie w hotelu.",
      "<strong>Bilety na szlaki płacimy kartą</strong> — SIMplifica przyjmuje tylko płatność online, gotówki tam nie potrzeba.",
      "Reszta wyspy działa normalnie na kartę: restauracje, sklepy, muzea, taksówki. Gotówka jest potrzebna głównie do tych trzech rzeczy powyżej i na drobne w małych barach.",
      "Bankomaty (multibanco) są w Funchal na każdym kroku, ale w górach i małych miejscowościach już nie — wypłacać w mieście, nie w drodze."
    ] },
    { emoji: "🎟️", title: "Szlaki są płatne i na rezerwację", points: ["Wejście na sklasyfikowane szlaki PR wymaga <strong>biletu kupionego online</strong> na <a href=\"https://simplifica.madeira.gov.pt/\" target=\"_blank\" rel=\"noopener\">simplifica.madeira.gov.pt</a> — rezerwuje się 30-minutowe okno wejścia.", "Nas dotyczą dwa: <strong>PR1.2 Vereda do Pico Ruivo</strong> (27.08) i — opcjonalnie — <strong>PR6 Levada das 25 Fontes</strong> (29.08), po 4,50 € od osoby. Levada dos Balcões jest bezpłatna i bez rezerwacji.", "Dzieci poniżej 12 lat nie płacą, ale muszą być zgłoszone w rezerwacji — przy dwunastolatku dopytać przy zakupie.", "Bilet trzeba okazać przy wejściu; w Rabaçal i na Achada do Teixeira bywają kontrole, a mandat sięga 250 €.", "W górach zasięg znika — zapisać bilety offline (zrzut ekranu albo PDF w telefonie), nie liczyć na wczytanie maila na miejscu.", "Sierpniowe poranne sloty na 25 Fontes potrafią zniknąć na kilka dni przed terminem; ceny i zasady potwierdzić na portalu, bo zmieniały się już kilka razy."] },
    { emoji: "🗺️", title: "Mapa w telefonie", points: ["Zakładka <strong>Mapa</strong> pokazuje wszystko na jednym ekranie: przystanki każdego dnia, atrakcje, opcje na zapas i gastronomię — warstwy włącza się osobno.", "Import: <a href=\"https://www.google.com/mymaps\" target=\"_blank\" rel=\"noopener\">google.com/mymaps</a> → Utwórz nową mapę → Importuj → wskaż pobrany plik. Mapa jest wtedy prywatna, widoczna tylko dla Ciebie.", "Warstwy: siedem dni planu, atrakcje po drodze, opcje na zapas (plan B na deszcz) i gastronomia. W terenie można zostawić włączoną tylko tę jedną, która jest akurat potrzebna.", "Google Maps pozwala pobrać obszar Madery offline; w górach i na levadach zasięg bywa zerowy."] },
    { emoji: "🆘", title: "Numery alarmowe i bezpieczeństwo", points: ["Ogólny numer alarmowy to 112 (obsługa również po angielsku).", "Madera jest bardzo bezpieczna, z niską przestępczością.", "Największą ostrożność zachować przy słońcu, prądach morskich i śliskich skałach nad wodą."] },
    { emoji: "💛", title: "Napiwki i drobne zwyczaje", points: ["Napiwki nie są obowiązkowe — mile widziane zaokrąglenie rachunku lub 5–10% przy dobrej obsłudze.", "W restauracjach couvert (pieczywo, oliwki, pasty na start) bywa płatny — można go odmówić.", "Sjesta nie obowiązuje, ale kolacje jada się później niż w Polsce, zwykle po 19:00."] }
  ];

  const foodDishes = [
    { emoji: "🥩", name: "Espetada madeirense", desc: "Duże kawałki wołowiny natarte solą i czosnkiem, nadziane na patyk z drzewa laurowego (dziś często na metalowej szpadzie) i grillowane nad żarem. Podawane pionowo przy stole. Zaplanowana w agendzie na 25 sierpnia." },
    { emoji: "🍞", name: "Bolo do caco", desc: "Okrągły, miękki placek pieczony na gorącym kamieniu, podawany na ciepło z masłem czosnkowym. Klasyczny dodatek do espetady i ulubieniec dzieci." },
    { emoji: "🐟", name: "Peixe-espada preta com banana", desc: "Filet z czarnej szabli (głębinowej ryby wyławianej u wybrzeży Madery) smażony i podawany z bananem — nietypowe, ale bardzo lokalne połączenie słodkiego z rybnym." },
    { emoji: "🌽", name: "Milho frito", desc: "Chrupiące kostki smażonej kukurydzy (rodzaj polenty) — częsty dodatek do dań głównych, który dzieci zwykle lubią." },
    { emoji: "🐚", name: "Lapas", desc: "Grillowane skałoczepy (małże przyklejone do skał) z czosnkiem i cytryną, serwowane na gorącej patelni — przekąska dla odważniejszych podniebień." },
    { emoji: "🍯", name: "Bolo de mel", desc: "Ciemne, korzenne ciasto z melasy trzcinowej (nie z miodu pszczelego), tradycyjnie łamane rękami. Trwały deser, który dobrze znosi drogę do domu." },
    { emoji: "🍹", name: "Poncha i nikita", desc: "Poncha to lokalny drink z rumu trzcinowego, miodu i cytryny (dla dorosłych). Dla dzieci dobrą alternatywą jest nikita — mrożony napój na bazie owoców — oraz świeże soki z owoców tropikalnych." },
    { emoji: "🍌", name: "Owoce tropikalne", desc: "Maderskie banany (mniejsze i słodsze), maracuja, anona (czerymoja), guawa i awokado. Najlepiej próbować ich na targu Mercado dos Lavradores w Funchal." }
  ];

  // Miejsca z trzech odcinków "Makłowicz w podróży" o Maderze (odc. 160-162, XII 2023 - I 2024).
  // Każde zderzone z naszą trasą — dopasowanie do dnia jest nasze, nie jego.
  const maklowicz = [
    { emoji: "🍷", name: "Quinta do Furão", where: "Santana", day: "poza trasą — osobny wyjazd", desc: "Restauracja na skraju klifu w Achada do Gramacho, wśród własnych winnic, z tarasem nad dzikim północnym wybrzeżem. Kuchnia maderska bez przebrania za międzynarodową: espetada, dorsz, stek. Wypadła z dnia górskiego, bo z Achada do Teixeira jedzie się tam 70 minut — zostaje jako pomysł na osobny wyjazd na północ, np. w dniu rezerwowym." },
    { emoji: "🥪", name: "Snack Bar Estoril", where: "São Vicente, Rua do Cemitério 22", day: "24.08 — po drodze przez São Vicente", desc: "Przeciwieństwo Quinty: zwykły przydrożny bar przy kościele, gdzie je się prego — kanapkę ze stekiem w bolo do caco z masłem czosnkowym. Tanio, szybko i dokładnie tak, jak jedzą tu miejscowi. Dobry przystanek, gdy dzień na zachodzie się rozciąga." },
    { emoji: "🐟", name: "Peixaria no Mercado", where: "Funchal, Rua Brigadeiro Oudinot 24", day: "dowolny wieczór w Funchal", desc: "Lokal przy samym Mercado dos Lavradores — rybę wybiera się praktycznie z sąsiedniej lady. Tempura z czarnej szabli, lapas, tuńczyk. Czynne 11:00–22:30; na kolację lepiej zarezerwować, bo sala jest mała." },
    { emoji: "🍌", name: "BAM — Muzeum Bananów Madery", where: "Lugar de Baixo, Ponta do Sol", day: "26.08 — dokładnie na naszej trasie", desc: "Leży między Madaleną do Mar a Ponta do Sol, czyli między dwoma naszymi przystankami. Multimedialna wystawa o bananie jako motorze gospodarki wyspy, zwiedzanie plantacji doświadczalnej i szklarni, film 4D. Bar serwuje kanapki i koktajle bananowe. Otwarte codziennie 9:00–18:00 — trzeba tylko wyjść z Rabaçal bez zwłoki." },
    { emoji: "🍬", name: "Fábrica Santo António", where: "Funchal, Travessa do Forno 27–29", day: "Funchal — pamiątki jadalne", desc: "Manufaktura z 1893 roku, piąte pokolenie tej samej rodziny, oryginalne angielskie maszyny do biszkoptów i sklep, w którym od dekad nie zmieniono lad. Stąd bierze się bolo de mel, który przetrwa drogę do Polski. Pon.–pt. 9:00–19:00, sob. 9:00–13:00, niedziela nieczynne." },
    { emoji: "🍫", name: "UauCacau", where: "Funchal — m.in. Mercado dos Lavradores, lokal 19", day: "przy okazji targu", desc: "Rzemieślnicza czekolada z maderskich składników: maracuja, banan, poncha, miód trzcinowy, wino Madeira. Ponad czterdzieści smaków, a bombonierka z marakui ma złoty medal krajowego konkursu. Pewny sposób na przekupienie dzieci po targu." },
    { emoji: "🥃", name: "North Mills / Engenhos do Norte", where: "Porto da Cruz", day: "poza trasą — do rozważenia z kierowcą", desc: "Gorzelnia z 1927 roku i jedyny w Europie młyn trzcinowy nadal napędzany parą. Rum agricole tłoczony z soku ze świeżej trzciny, nie z melasy — czyli źródło prawdziwej ponchy. Wstęp wolny, pon.–pt. 9:00–18:00, sob.–niedz. 10:00–17:00. Maszyny pracują tylko w sezonie zbiorów (marzec–maj), poza nim zostaje film i degustacja." }
  ];

  const foodPlaces = [
    { emoji: "🏛️", name: "Funchal — Stare Miasto (Zona Velha)", desc: "Rua de Santa Maria i okoliczne uliczki pełne są restauracji i małych tasquinhas z domową kuchnią. Dobre miejsce na pierwszą kolację i na espetadę." },
    { emoji: "🧺", name: "Funchal — Mercado dos Lavradores", desc: "Targ z owocami, warzywami i rybami; świetny na degustację owoców tropikalnych, przekąski i zakup lokalnych przetworów. Najżywszy przed południem." },
    { emoji: "⛵", name: "Câmara de Lobos", desc: "Dawna wioska rybacka, uważana za miejsce narodzin poncha, i jeden z najlepszych adresów na autentyczną espetadę. Po drodze na wycieczkę zachodnią (24.08)." },
    { emoji: "🌊", name: "Porto Moniz", desc: "Restauracje przy naturalnych basenach serwują świeżą rybę z grilla z widokiem na ocean. Wygodny przystanek na lunch w dniu wycieczki zachodniej (24.08)." },
    { emoji: "☀️", name: "Ponta do Sol i Calheta", desc: "Najbardziej słoneczny zakątek wyspy; kawiarnie nad oceanem i przyjazne rodzinom lokale przy piaszczystej plaży w Calhecie. Na trasie dnia 27.08." },
    { emoji: "🏖️", name: "Machico", desc: "Spokojne miasteczko z plażą i promenadą, dobre na lokalną kuchnię i kolejną espetadę w luźniejszym dniu (29.08)." }
  ];

  function renderPractical() {
    const root = document.querySelector("#guide-root");
    if (!root || document.body.dataset.page !== "practical") return;
    root.innerHTML = `
      <header class="guide-hero">
        <p class="eyebrow">Przewodnik · Madera 2026</p>
        <h1>Informacje praktyczne</h1>
        <p class="lead">Krótkie ściągi, które najbardziej przydają się na miejscu — od waluty i gniazdek po pogodę, transport i numery alarmowe.</p>
      </header>
      <main id="main-content" class="guide-main">
        <section class="guide-section" aria-labelledby="onsite-title">
          <h2 id="onsite-title">Na miejscu</h2>
          <div class="guide-info-grid">
            ${practicalInfo.map((card) => `<article class="card info-card"><div class="card-body"><h3><span class="info-emoji" aria-hidden="true">${card.emoji}</span>${card.title}</h3><ul class="info-list">${card.points.map((p) => `<li>${p}</li>`).join("")}</ul></div></article>`).join("")}
          </div>
        </section>
        <section class="guide-section" aria-labelledby="packing-title">
          <h2 id="packing-title">Co spakować</h2>
          <p class="section-copy">Sierpień na Maderze to 23–26°C i słońce, ale w górach i we mgle bywa chłodno, a pogoda zmienia się szybko — dlatego warstwy i kurtka w plecaku to podstawa.</p>
          <div class="guide-info-grid">
            ${packing.map((card) => `<article class="card info-card"><div class="card-body"><h3><span class="info-emoji" aria-hidden="true">${card.emoji}</span>${card.title}</h3><ul class="info-list">${card.items.map((i) => `<li>${i}</li>`).join("")}</ul></div></article>`).join("")}
          </div>
        </section>
        <section class="guide-section" aria-labelledby="rezerwacje-title">
          <h2 id="rezerwacje-title">Rezerwacje: hotel w Berlinie i transfer na Maderze</h2>
          <p class="section-copy">Dwie rzeczy, których nie da się załatwić na miejscu bez numerów: nocleg przed porannym lotem i odbiór z lotniska w Funchal.</p>
          <div class="cash-alert">
            <strong>Gotówka na transfer: 90 € (2 × 45 €).</strong> Rui bierze płatność <strong>gotówką przy przyjeździe</strong> — nie kartą, nie przelewem. Banknoty przygotować jeszcze w Polsce; bankomat na FNC to niepotrzebna komplikacja z siedmioosobową grupą i bagażami.
          </div>
          <div class="parking-box">
            <div class="parking-facts">
              <h3>🚐 Transfer FNC ↔ hotel — madeira-in</h3>
              <dl>
                <dt>Firma</dt><dd>madeira-in.com unipessoal Lda. · Rui Nóbrega<br><span>Estrada Francisco Álvares de Nóbrega 38, 9200-209 Água de Pena</span></dd>
                <dt>Kontakt</dt><dd><a href="tel:+351917260690">+351 917 260 690</a> · <a href="mailto:transfers.madeira@gmail.com">transfers.madeira@gmail.com</a></dd>
                <dt>Cena</dt><dd>45 € za stronę, <strong>90 € razem — gotówką przy przyjeździe</strong></dd>
                <dt>Pojazd</dt><dd>Mercedes Sprinter, 9 miejsc <span>— ten sam kierowca na transfery i ewentualne wycieczki, mówi też po niemiecku</span></dd>
                <dt>Przylot 20.08</dt><dd>EJU5333, lądowanie 10:55</dd>
                <dt>Powrót 30.08</dt><dd>odbiór z Baía Azul <span>— potwierdzone na 08:45, my planujemy 08:30 pod przesunięty wylot 11:35 (do potwierdzenia z Rui)</span></dd>
              </dl>
              <ul class="info-list">
                <li><strong>Po wylądowaniu dzwonimy do Rui</strong> — dopiero gdy mamy już wszystkie bagaże. Podjedzie pod kawiarnię tuż za halą przylotów.</li>
                <li>Rui ma nasz numer: +48 607 452 332.</li>
                <li>Wycieczki busem (220 €/dzień) ustalamy na miejscu — madeira-in potwierdził taką możliwość na piśmie.</li>
              </ul>
            </div>
            <div class="parking-facts">
              <h3>🏨 Nocleg 19.08 — IntercityHotel Berlin Airport</h3>
              <dl>
                <dt>Hotel</dt><dd>IntercityHotel Berlin Airport BER Terminal 1+2<br><span>Willy-Brandt-Platz 5, 12529 Schönefeld · <a href="tel:+493053653100">+49 30 536 531 0</a></span></dd>
                <dt>Pobyt</dt><dd>19.08 → 20.08, 1 noc <span>— zameldowanie od 15:00, wymeldowanie do 12:00</span></dd>
                <dt>Pokoje</dt><dd>2 × Business Twin<br><span>nr potwierdzeń: <strong>4RGPYJYD</strong> i <strong>4GMN9X9N</strong> · prośba o pokoje blisko siebie zapisana w rezerwacji</span></dd>
                <dt>Cena</dt><dd>2 × 83,39 € = <strong>166,78 €</strong> <span>— taryfa Loyalty Smart Special, <strong>bez śniadania</strong></span></dd>
                <dt>W cenie</dt><dd>nocleg, WiFi i <strong>H Rewards City Ticket</strong> <span>— darmowy bilet komunikacji miejskiej, wystarczy na wieczorny wypad do centrum</span></dd>
                <dt>H Rewards</dt><dd>6527600000860526 (status STAR) <span>— bez aktywnego członkostwa hotel naliczy pełną taryfę Flex</span></dd>
              </dl>
              <ul class="info-list">
                <li>Pokój jest zabezpieczony kartą i trzymany także przy późnym przyjeździe — korek na A2 nie kosztuje nas noclegu.</li>
                <li>Rachunek uregulować wieczorem albo skorzystać z ekspresowego wymeldowania — o 4:45 nie chcemy stać w recepcji.</li>
              </ul>
            </div>
          </div>
        </section>
        <section class="guide-section" aria-labelledby="parking-title">
          <h2 id="parking-title">Parking na BER</h2>
          <p class="section-copy">Rezerwacja APCOA opłacona z góry (144 €). Wjazd i wyjazd działają na rozpoznawanie tablic — kod QR jest zapasem, gdyby kamera nie odczytała numeru.</p>
          <div class="parking-box">
            <div class="parking-facts">
              <dl>
                <dt>Parking</dt><dd>P7/8 BER Terminal T1 &amp; T2 · taryfa Comfort<br><span>2–4 min pieszo do terminali (T1: 4 min, T2: 2 min)</span></dd>
                <dt>Adres</dt><dd>Brunolf-Baade-Straße 1/2, 12529 Schönefeld<br><span>Zjazd z A113, wyjazd nr 8 „Flughafen Berlin Brandenburg", potem znaki „Parkhaus P7/8"</span></dd>
                <dt>Numer rezerwacji</dt><dd>8320774</dd>
                <dt>Tablica rejestracyjna</dt><dd>EL2GE01 <span>— to ona otwiera szlaban</span></dd>
                <dt>Wjazd</dt><dd>19.08.2026, 16:00 <span>— można wjechać w oknie 14:00–18:00</span></dd>
                <dt>Wyjazd</dt><dd>30.08.2026, 18:00 <span>— po tej godzinie dopłata w automacie</span></dd>
                <dt>Opłata</dt><dd>144 € — <strong>zapłacone z góry</strong></dd>
                <dt>Obsługa APCOA</dt><dd><a href="tel:+4971130570305">+49 711 305 70 305</a> · <a href="mailto:Reservierung.BER@apcoa.de">Reservierung.BER@apcoa.de</a></dd>
              </dl>
              <ul class="info-list">
                <li><strong>Nie ciągnij biletu przy szlabanie.</strong> Kamera odczyta tablicę i sama wyda „online ticket" — dopiero jego pobranie podnosi szlaban.</li>
                <li><strong>Zachowaj ten bilet.</strong> Jest potrzebny, gdyby trzeba było dopłacić za przekroczony czas.</li>
                <li>Gdyby tablica nie została rozpoznana, pokaż kod QR z maila APCOA (miej go w telefonie lub portfelu Apple/Google).</li>
                <li>Wyjazd w opłaconym terminie też idzie na tablicę — biletu nie trzeba nigdzie wkładać, o ile mieścimy się w czasie.</li>
                <li>Rezerwacja uprawnia do <strong>jednego wjazdu i jednego wyjazdu</strong>; miejsce nie jest przypisane — parkujemy, gdzie wolne.</li>
                <li>Bilet trzymaj z dala od telefonu i słońca (magnes i ciepło potrafią go rozmagnesować). Zgubionego biletu APCOA nie wydaje ponownie.</li>
                <li>Problem przy szlabanie: przycisk „call help" — obsługa działa całą dobę.</li>
              </ul>
            </div>
            <figure class="parking-qr">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" width="132" height="132" shape-rendering="crispEdges" role="img" aria-label="Kod QR z nawigacją do parkingu P7/8 na BER"><rect width="33" height="33" fill="#fff"/><path fill="#111" d="M2 2h7v1h-7zM10 2h2v1h-2zM14 2h1v1h-1zM17 2h1v1h-1zM20 2h1v1h-1zM24 2h7v1h-7zM2 3h1v1h-1zM8 3h1v1h-1zM10 3h2v1h-2zM14 3h3v1h-3zM18 3h1v1h-1zM21 3h1v1h-1zM24 3h1v1h-1zM30 3h1v1h-1zM2 4h1v1h-1zM4 4h3v1h-3zM8 4h1v1h-1zM10 4h2v1h-2zM15 4h3v1h-3zM20 4h1v1h-1zM22 4h1v1h-1zM24 4h1v1h-1zM26 4h3v1h-3zM30 4h1v1h-1zM2 5h1v1h-1zM4 5h3v1h-3zM8 5h1v1h-1zM11 5h1v1h-1zM15 5h1v1h-1zM18 5h3v1h-3zM22 5h1v1h-1zM24 5h1v1h-1zM26 5h3v1h-3zM30 5h1v1h-1zM2 6h1v1h-1zM4 6h3v1h-3zM8 6h1v1h-1zM10 6h2v1h-2zM13 6h1v1h-1zM18 6h1v1h-1zM20 6h2v1h-2zM24 6h1v1h-1zM26 6h3v1h-3zM30 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM13 7h1v1h-1zM16 7h1v1h-1zM18 7h1v1h-1zM24 7h1v1h-1zM30 7h1v1h-1zM2 8h7v1h-7zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h7v1h-7zM12 9h4v1h-4zM17 9h1v1h-1zM2 10h1v1h-1zM5 10h8v1h-8zM15 10h2v1h-2zM18 10h1v1h-1zM23 10h1v1h-1zM26 10h1v1h-1zM28 10h3v1h-3zM2 11h2v1h-2zM5 11h1v1h-1zM7 11h1v1h-1zM9 11h1v1h-1zM12 11h1v1h-1zM17 11h1v1h-1zM19 11h4v1h-4zM26 11h1v1h-1zM28 11h2v1h-2zM2 12h1v1h-1zM5 12h2v1h-2zM8 12h1v1h-1zM11 12h2v1h-2zM14 12h6v1h-6zM24 12h1v1h-1zM28 12h1v1h-1zM2 13h1v1h-1zM4 13h3v1h-3zM9 13h1v1h-1zM11 13h2v1h-2zM16 13h1v1h-1zM19 13h1v1h-1zM21 13h2v1h-2zM25 13h3v1h-3zM30 13h1v1h-1zM3 14h3v1h-3zM8 14h2v1h-2zM11 14h1v1h-1zM13 14h3v1h-3zM17 14h1v1h-1zM19 14h1v1h-1zM22 14h1v1h-1zM24 14h1v1h-1zM30 14h1v1h-1zM2 15h1v1h-1zM5 15h3v1h-3zM9 15h1v1h-1zM11 15h4v1h-4zM16 15h2v1h-2zM24 15h7v1h-7zM2 16h3v1h-3zM6 16h1v1h-1zM8 16h7v1h-7zM17 16h1v1h-1zM21 16h4v1h-4zM26 16h1v1h-1zM28 16h1v1h-1zM30 16h1v1h-1zM2 17h2v1h-2zM5 17h1v1h-1zM7 17h1v1h-1zM9 17h1v1h-1zM11 17h2v1h-2zM14 17h1v1h-1zM18 17h1v1h-1zM20 17h2v1h-2zM23 17h2v1h-2zM26 17h1v1h-1zM28 17h1v1h-1zM30 17h1v1h-1zM2 18h1v1h-1zM4 18h2v1h-2zM7 18h2v1h-2zM10 18h1v1h-1zM14 18h5v1h-5zM21 18h2v1h-2zM27 18h1v1h-1zM2 19h1v1h-1zM4 19h2v1h-2zM7 19h1v1h-1zM9 19h1v1h-1zM11 19h1v1h-1zM14 19h1v1h-1zM16 19h3v1h-3zM20 19h4v1h-4zM26 19h1v1h-1zM28 19h2v1h-2zM2 20h3v1h-3zM6 20h6v1h-6zM13 20h2v1h-2zM17 20h2v1h-2zM21 20h1v1h-1zM23 20h2v1h-2zM26 20h2v1h-2zM30 20h1v1h-1zM2 21h2v1h-2zM7 21h1v1h-1zM9 21h2v1h-2zM12 21h4v1h-4zM17 21h1v1h-1zM20 21h1v1h-1zM26 21h3v1h-3zM2 22h3v1h-3zM8 22h1v1h-1zM10 22h2v1h-2zM13 22h1v1h-1zM15 22h1v1h-1zM17 22h1v1h-1zM21 22h9v1h-9zM10 23h1v1h-1zM15 23h2v1h-2zM19 23h2v1h-2zM22 23h1v1h-1zM26 23h2v1h-2zM2 24h7v1h-7zM10 24h2v1h-2zM14 24h2v1h-2zM17 24h6v1h-6zM24 24h1v1h-1zM26 24h2v1h-2zM2 25h1v1h-1zM8 25h1v1h-1zM10 25h2v1h-2zM13 25h1v1h-1zM15 25h1v1h-1zM17 25h1v1h-1zM19 25h4v1h-4zM26 25h1v1h-1zM29 25h2v1h-2zM2 26h1v1h-1zM4 26h3v1h-3zM8 26h1v1h-1zM10 26h1v1h-1zM12 26h2v1h-2zM15 26h1v1h-1zM18 26h1v1h-1zM21 26h7v1h-7zM29 26h1v1h-1zM2 27h1v1h-1zM4 27h3v1h-3zM8 27h1v1h-1zM10 27h1v1h-1zM15 27h4v1h-4zM21 27h1v1h-1zM23 27h1v1h-1zM30 27h1v1h-1zM2 28h1v1h-1zM4 28h3v1h-3zM8 28h1v1h-1zM11 28h1v1h-1zM15 28h1v1h-1zM17 28h1v1h-1zM19 28h1v1h-1zM22 28h1v1h-1zM25 28h2v1h-2zM28 28h3v1h-3zM2 29h1v1h-1zM8 29h1v1h-1zM11 29h2v1h-2zM15 29h1v1h-1zM24 29h5v1h-5zM30 29h1v1h-1zM2 30h7v1h-7zM10 30h1v1h-1zM12 30h1v1h-1zM15 30h2v1h-2zM19 30h1v1h-1zM22 30h2v1h-2z"/></svg>
              <figcaption>Zeskanuj, aby otworzyć <a href="https://maps.app.goo.gl/MTnHwMoR15jeYuSK7" target="_blank" rel="noopener">nawigację do parkingu</a>.<br><strong>Uwaga:</strong> to kod do nawigacji. Kod QR uprawniający do wjazdu jest w mailu od APCOA — jego nie da się odtworzyć tutaj.</figcaption>
            </figure>
          </div>
        </section>
        <nav class="guide-nav" aria-label="Nawigacja przewodników">
          <a class="button secondary" href="index.html">← Wróć do planu</a>
          <a class="button" href="gdzie-zjesc.html">Gdzie zjeść →</a>
        </nav>
        <footer class="footer">Informacje ogólne, aktualne przed sezonem 2026 — szczegóły (godziny, ceny, rozkłady) warto potwierdzić na miejscu.</footer>
      </main>`;
  }

  function renderFood() {
    const root = document.querySelector("#guide-root");
    if (!root || document.body.dataset.page !== "food") return;
    root.innerHTML = `
      <header class="guide-hero">
        <p class="eyebrow">Przewodnik · Madera 2026</p>
        <h1>Gdzie zjeść</h1>
        <p class="lead">Lokalne potrawy, których warto spróbować, i dzielnice oraz miejscowości, w których najłatwiej je znaleźć — z odniesieniem do dni z planu.</p>
      </header>
      <main id="main-content" class="guide-main">
        <section class="guide-section" aria-labelledby="dishes-title">
          <h2 id="dishes-title">Czego spróbować</h2>
          <div class="guide-info-grid">
            ${foodDishes.map((dish) => `<article class="card info-card"><div class="card-body"><h3><span class="info-emoji" aria-hidden="true">${dish.emoji}</span>${dish.name}</h3><p>${dish.desc}</p></div></article>`).join("")}
          </div>
        </section>
        <section class="guide-section" aria-labelledby="places-title">
          <h2 id="places-title">Gdzie szukać</h2>
          <div class="guide-info-grid">
            ${foodPlaces.map((place) => `<article class="card info-card"><div class="card-body"><h3><span class="info-emoji" aria-hidden="true">${place.emoji}</span>${place.name}</h3><p>${place.desc}</p></div></article>`).join("")}
          </div>
        </section>
        <section class="guide-section" aria-labelledby="maklowicz-title">
          <h2 id="maklowicz-title">Śladami Makłowicza</h2>
          <p class="section-copy">Robert Makłowicz nakręcił na Maderze trzy odcinki (nr 160–162). Poniżej te z odwiedzonych przez niego miejsc, które da się pogodzić z naszym planem — z dopisaną informacją, kiedy realnie jesteśmy w pobliżu.</p>
          <div class="guide-info-grid">
            ${maklowicz.map((p) => `<article class="card info-card mk-card"><div class="card-body"><h3><span class="info-emoji" aria-hidden="true">${p.emoji}</span>${p.name}</h3><p class="mk-meta"><span class="mk-where">${p.where}</span><span class="mk-day">${p.day}</span></p><p>${p.desc}</p></div></article>`).join("")}
          </div>
          <p class="notice">Godziny i dostępność stolików potwierdzić przed wyjazdem — w sierpniu na Maderze bywa tłoczno, a Quinta do Furão i Peixaria no Mercado potrafią być pełne.</p>
        </section>
        <nav class="guide-nav" aria-label="Nawigacja przewodników">
          <a class="button secondary" href="index.html">← Wróć do planu</a>
          <a class="button" href="praktyczne.html">Informacje praktyczne →</a>
        </nav>
        <footer class="footer">Opisy potraw i miejscowości mają charakter orientacyjny — godziny otwarcia i dostępność dań warto potwierdzić na miejscu.</footer>
      </main>`;
  }

  // Odliczanie do wyjazdu (wzorzec z planu Japonii)
  // Krocząca karta: przed wyjazdem najbliższy dzień, w trakcie — dzisiejszy
  function renderFocusDay() {
    const host = document.querySelector("#focus-day");
    if (!host) return;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const idx = days.findIndex((d) => d.id >= todayStr);
    if (idx < 0) { host.hidden = true; return; }
    const day = days[idx];
    const diff = Math.round((new Date(day.id + "T00:00:00") - now) / 86400000);
    const kicker = diff === 0 ? "Dziś" : diff === 1 ? "Jutro" : `Za ${diff} dni`;
    const lvl = INTENSITY[day.intensity] || "y";
    const punkty = day.agenda.slice(0, 3).map((sl) => `<li><b>${sl[0]}</b> ${sl[1]}</li>`).join("");
    const fx = FLEX[day.id];
    host.hidden = false;
    host.innerHTML = `<a class="fd-card" href="days/${day.id}.html">
      <div class="fd-main">
        <p class="fd-kicker"><span class="idot ${lvl}"></span> ${kicker} · dzień ${idx + 1} z ${days.length} · ${day.date}</p>
        <h2>${day.title}</h2>
        <p class="fd-short">${day.short}</p>
        <ul class="fd-list">${punkty}</ul>
        ${fx ? `<p class="fd-flex"><b>🔒 Nie ruszać:</b> ${fx[0]}</p>` : ""}
        <span class="fd-cta">Otwórz plan dnia →</span>
      </div>
      <div class="fd-side"><div class="fd-wx" id="fd-wx"><span class="fd-wxload">pogoda…</span></div></div>
    </a>`;
    focusWeather(day);
  }

  // pogoda dla dnia z kroczącej karty
  async function focusWeather(day) {
    const box = document.querySelector("#fd-wx");
    if (!box) return;
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${day.center[0]}&longitude=${day.center[1]}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Atlantic%2FMadeira&forecast_days=16`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("wx");
      const d = await res.json();
      const i = d.daily.time.indexOf(day.id);
      if (i >= 0) {
        box.innerHTML = `<span class="fd-ico">${wxEmoji(d.daily.weather_code[i])}</span><strong>${Math.round(d.daily.temperature_2m_max[i])}° / ${Math.round(d.daily.temperature_2m_min[i])}°</strong><span class="fd-wxlab">prognoza na ten dzień · 💧 ${d.daily.precipitation_probability_max[i] ?? 0}%</span>`;
      } else {
        box.innerHTML = `<span class="fd-ico">${wxEmoji(d.current.weather_code)}</span><strong>${Math.round(d.current.temperature_2m)}°C</strong><span class="fd-wxlab">teraz w tym rejonie · prognoza na ten dzień pojawi się bliżej terminu</span>`;
      }
    } catch (e) { box.innerHTML = '<span class="fd-wxlab">Pogoda niedostępna — sprawdź sekcję poniżej.</span>'; }
  }

  // ── Mapa interaktywna (mapa.html) ─────────────────────────────────────
  const MAP_GRUPY = [
    { id: "logi",  label: "Nocleg i logistyka", kolor: "#c0392b", ikona: "🏨", typ: "poi",  dane: () => POI_LOGISTYKA, domyslnie: true },
    { id: "dni",   label: "Przystanki dni planu", kolor: "#0b7276", ikona: "📍", typ: "dni", domyslnie: true },
    { id: "atr",   label: "Atrakcje w planie", kolor: "#2f8b57", ikona: "⭐", typ: "poi", dane: () => POI_ATRAKCJE, domyslnie: true },
    { id: "opcje", label: "Potencjalne i plan B", kolor: "#8e44ad", ikona: "🎲", typ: "poi", dane: () => POI_OPCJE, domyslnie: false },
    { id: "food",  label: "Gdzie zjeść", kolor: "#1f6feb", ikona: "🍽️", typ: "poi", dane: () => POI_FOOD, domyslnie: false }
  ];
  const MAP_DNI_KOLORY = ["#0b7276","#2f8b57","#d4a017","#cc6600","#1e88e5","#b35c00","#607d8b","#8e44ad","#e2725b"];

  // ── Szlaki wymagające rezerwacji (SIMplifica) ─────────────────────────
  // Od 2024 wejście na sklasyfikowane szlaki PR jest płatne i wymaga rezerwacji
  // slotu online. Ceny i zasady weryfikować na simplifica.madeira.gov.pt.
  const SIMPLIFICA = "https://simplifica.madeira.gov.pt/";
  const TRAILS = [
    {
      dayId: "2026-08-27", kod: "PR1.2", nazwa: "Vereda do Pico Ruivo",
      start: "Achada do Teixeira", cena: 4.5, wymaga: true, platnych: 5, kupiony: true,
      bilety: { godzina: "11:30–12:00", czas: "3 h", osoby: "5 dorosłych + 2 dzieci zwolnione z opłaty" },
      uwaga: "Idzie cała siódemka. Wyjeżdżamy wyjątkowo o 9:45, na Achada do Teixeira jesteśmy ~11:20 — kwadrans przed slotem, a okno trwa do 12:00."
    },
    {
      dayId: "2026-08-29", kod: "PR6", nazwa: "Levada das 25 Fontes",
      start: "Rabaçal", cena: 4.5, wymaga: true, platnych: 5, warunkowy: true,
      uwaga: "Wariant dnia rezerwowego — dla chętnych. Bilet kupuje się na konkretną datę, więc jeśli rejs przeniesie się z 28 na 29 sierpnia, przepada 4,50 € od osoby. Poranne sloty schodzą w sierpniu na kilka dni przed terminem."
    },
    {
      dayId: "2026-08-27", kod: "PR11", nazwa: "Vereda dos Balcões",
      start: "Ribeiro Frio", cena: 4.5, wymaga: true, platnych: 5, kupiony: true,
      bilety: { numery: ["SIM4330277", "SIM4330279"], ref: "2234556/2026", godzina: "17:00", czas: "1 h 30 min", osoby: "5 dorosłych + 2 dzieci zwolnione z opłaty" },
      uwaga: "Wejście 17:00, okno do 17:30 — czyli nawet przy wolniejszym zejściu ze szczytu zdążymy."
    }
  ];
  const TRAILS_PLATNE = TRAILS.filter((t) => t.wymaga);

  // ── Przestawianie dni ─────────────────────────────────────────────────
  // Treść dnia da się przenieść na inną datę. Wyjątkiem są dni przypięte
  // do lotu, rezerwacji albo biletu kupionego na konkretny termin.
  const LOCKED = {
    "2026-08-19": "dojazd do Berlina — data stała",
    "2026-08-20": "lot EJU5333 o 07:00",
    "2026-08-27": "bilet na PR1.2 kupiony na tę datę",
    "2026-08-28": "rezerwacja rejsu",
    "2026-08-29": "termin zapasowy rejsu",
    "2026-08-30": "lot powrotny EJU5334"
  };
  const SWAP_KEY = "madera-uklad-dni-v1";

  function wczytajUklad() {
    try {
      const s = JSON.parse(localStorage.getItem(SWAP_KEY));
      return s && typeof s === "object" ? s : {};
    } catch (e) { return {}; }
  }

  function zapiszUklad(u) {
    try { localStorage.setItem(SWAP_KEY, JSON.stringify(u)); } catch (e) {}
  }

  // Zamienia treść dwóch dni, zostawiając na miejscu datę i identyfikator.
  function przeniesTresc(a, b) {
    const stale = ["id", "date"];
    const tmp = {};
    Object.keys(a).forEach((k) => { if (!stale.includes(k)) { tmp[k] = a[k]; delete a[k]; } });
    Object.keys(b).forEach((k) => { if (!stale.includes(k)) { a[k] = b[k]; delete b[k]; } });
    Object.keys(tmp).forEach((k) => { b[k] = tmp[k]; });
  }

  function zamienDni(idA, idB, zapisz) {
    const a = days.find((d) => d.id === idA);
    const b = days.find((d) => d.id === idB);
    if (!a || !b || LOCKED[idA] || LOCKED[idB]) return false;
    przeniesTresc(a, b);
    // struktury kluczowane datą jadą razem z treścią
    [FLEX, WEATHER_CRITICAL].forEach((m) => {
      const t = m[idA]; 
      if (m[idB] === undefined) delete m[idA]; else m[idA] = m[idB];
      if (t === undefined) delete m[idB]; else m[idB] = t;
    });
    [...highlights, ...TRAILS].forEach((x) => {
      if (x.dayId === idA) x.dayId = idB;
      else if (x.dayId === idB) x.dayId = idA;
    });
    if (zapisz) {
      const u = wczytajUklad();
      u.pary = (u.pary || []).concat([[idA, idB]]);
      zapiszUklad(u);
    }
    return true;
  }

  function zastosujZapisanyUklad() {
    const u = wczytajUklad();
    (u.pary || []).forEach(([a, b]) => zamienDni(a, b, false));
    return (u.pary || []).length;
  }

  function resetUkladu() {
    try { localStorage.removeItem(SWAP_KEY); } catch (e) {}
    window.location.reload();
  }

  function setupSwap() {
    const host = document.querySelector("#swap-bar");
    if (!host) return;
    const zmian = (wczytajUklad().pary || []).length;
    host.innerHTML = `
      <button class="button secondary" type="button" id="swap-toggle">⇄ Przestaw dni</button>
      ${zmian ? `<span class="swap-info">Kolejność zmieniona ręcznie (${zmian}×) <button class="swap-reset" type="button" id="swap-reset">przywróć pierwotną</button></span>` : ""}`;
    const reset = document.querySelector("#swap-reset");
    if (reset) reset.addEventListener("click", resetUkladu);

    let tryb = false, pierwszy = null;
    const grid = document.querySelector("#day-grid");
    document.querySelector("#swap-toggle").addEventListener("click", () => {
      tryb = !tryb; pierwszy = null;
      document.body.classList.toggle("swap-mode", tryb);
      document.querySelector("#swap-toggle").textContent = tryb ? "✕ Zakończ przestawianie" : "⇄ Przestaw dni";
      grid.querySelectorAll(".day-card").forEach((c) => {
        const id = c.dataset.dayId;
        c.classList.remove("is-picked");
        if (LOCKED[id]) { c.classList.toggle("is-locked", tryb); c.title = tryb ? "Nie do przestawienia: " + LOCKED[id] : ""; }
      });
      if (!tryb) return;
      const info = document.querySelector(".swap-hint");
      if (!info) {
        const p = document.createElement("p");
        p.className = "swap-hint";
        p.innerHTML = "Kliknij dwa dni, żeby zamienić je miejscami. Dni z kłódką są przypięte do lotu, rezerwacji albo biletu i nie da się ich ruszyć.";
        grid.parentElement.insertBefore(p, grid);
      }
    });

    grid.addEventListener("click", (e) => {
      if (!tryb) return;
      const karta = e.target.closest(".day-card");
      if (!karta) return;
      e.preventDefault();
      const id = karta.dataset.dayId;
      if (LOCKED[id]) return;
      if (!pierwszy) { pierwszy = id; karta.classList.add("is-picked"); return; }
      if (pierwszy === id) { pierwszy = null; karta.classList.remove("is-picked"); return; }
      if (zamienDni(pierwszy, id, true)) window.location.reload();
    });
  }


  function trailsKoszt() {
    // dzieci poniżej 12 lat bezpłatnie, ale muszą być zgłoszone w rezerwacji
    return TRAILS_PLATNE.reduce((s, t) => s + t.cena * (t.platnych || 5), 0);
  }

  function trailsKosztPewny() {
    return TRAILS_PLATNE.filter((t) => !t.warunkowy).reduce((s, t) => s + t.cena * (t.platnych || 5), 0);
  }

  function dniDoWyjazdu() {
    const start = new Date("2026-08-19T00:00:00");
    const dzis = new Date(); dzis.setHours(0, 0, 0, 0);
    return Math.round((start - dzis) / 86400000);
  }

  function trailAlertHTML(waga) {
    const dni = dniDoWyjazdu();
    const pilne = dni <= 30;
    const lista = TRAILS_PLATNE.map((t) =>
      `<li><strong>${t.kod} ${t.nazwa}</strong> — ${(days.find((d) => d.id === t.dayId) || {}).date || t.dayId}${t.kupiony ? " · <span class=\"tb-ok\">bilety kupione</span>" : `, ${t.cena.toFixed(2).replace(".", ",")} € od osoby`}. ${t.uwaga}${t.rozbieznosc ? ` <span class="tb-warn">⚠️ ${t.rozbieznosc}</span>` : ""}</li>`).join("");
    const doKupienia = TRAILS_PLATNE.filter((t) => !t.kupiony && !t.warunkowy).length;
    const naglowek = doKupienia === 0
      ? "Bilety na dzień górski są kupione — miejcie je offline w telefonie"
      : (dni > 0
        ? (pilne ? `Zostało ${dni} ${dni === 1 ? "dzień" : "dni"} — rezerwujcie teraz` : "Do zarezerwowania przed wyjazdem")
        : "Bilety miejcie w telefonie przed wejściem na szlak");
    return `
      <aside class="trail-alert${pilne ? " is-urgent" : ""}${waga === "day" ? " is-day" : ""}" role="note">
        <p class="ta-head"><span class="ta-ico" aria-hidden="true">🎟️</span><strong>Szlaki trzeba zarezerwować online.</strong> ${naglowek}.</p>
        <ul class="ta-list">${lista}</ul>
        <p class="ta-note">Rezerwacja obejmuje 30-minutowe okno wejścia i wykupuje się ją na portalu SIMplifica. Dzieci poniżej 12 lat nie płacą, ale <strong>muszą być zgłoszone w rezerwacji</strong> — przy dwunastolatku dopytać przy zakupie. Kontrole na szlaku są, a mandat sięga 250 €. Pico Ruivo to <strong>${trailsKosztPewny().toFixed(0)} €</strong> za całą grupę. Levada 25 Fontes jest wariantem dnia rezerwowego — bilety kupujemy tylko wtedy, gdy decydujemy się na nią 29 sierpnia (kolejne ${(trailsKoszt() - trailsKosztPewny()).toFixed(0)} €).</p>
        <p class="ta-actions"><a class="button" href="${SIMPLIFICA}" target="_blank" rel="noopener">Zarezerwuj na SIMplifica ↗</a></p>
      </aside>`;
  }

  function renderTrailAlert() {
    const host = document.querySelector("#trail-alert");
    if (!host) return;
    host.innerHTML = trailAlertHTML("home");
  }

  function biletyHTML(t) {
    if (!t.bilety) return "";
    return `<div class="ta-bilet">
      <p class="tb-head">✅ <strong>Bilety kupione</strong>${t.bilety.ref ? ` — rez. ${t.bilety.ref}` : ""} — wejście ${t.bilety.godzina}, ${t.bilety.czas}, ${t.bilety.osoby}.</p>
      ${t.bilety.numery ? `<p class="tb-nr">Numery: ${t.bilety.numery.map((n) => `<code>${n}</code>`).join(" · ")}</p>` : ""}
      ${t.rozbieznosc ? `<p class="tb-uwaga"><strong>⚠️ Do sprawdzenia:</strong> ${t.rozbieznosc}</p>` : ""}
    </div>`;
  }

  function renderDayTrailAlert(day) {
    const host = document.querySelector("#day-trail-alert");
    if (!host || !day) return;
    const moje = TRAILS_PLATNE.filter((t) => t.dayId === day.id);
    if (!moje.length) { host.hidden = true; return; }
    const dni = dniDoWyjazdu();
    const pilne = dni <= 30 && dni > 0;
    host.innerHTML = `
      <aside class="trail-alert is-day${pilne ? " is-urgent" : ""}" role="note">
        <p class="ta-head"><span class="ta-ico" aria-hidden="true">🎟️</span><strong>${moje.map((t) => t.kod + " " + t.nazwa).join(" i ")}</strong> — wejście tylko z rezerwacją online.</p>
        <ul class="ta-list">${moje.map((t) => `<li>${t.cena.toFixed(2).replace(".", ",")} € od osoby, slot 30-minutowy. ${t.uwaga}</li>`).join("")}</ul>
        ${moje.map(biletyHTML).join("")}
        <p class="ta-note">Bilet trzeba mieć w telefonie przy wejściu — zasięg w górach bywa zerowy, więc zapiszcie go offline (zrzut ekranu albo PDF).</p>
        <p class="ta-actions"><a class="button" href="${SIMPLIFICA}" target="_blank" rel="noopener">Rezerwacja SIMplifica ↗</a></p>
      </aside>`;
  }

  function renderMapPage() {
    const root = document.querySelector("#map-root");
    if (!root || document.body.dataset.page !== "map") return;
    const dniZTrasa = days.filter((d) => (d.route || []).length > 1);
    root.innerHTML = `
      <main class="guide-main map-main" id="main-content">
        <header class="guide-hero">
          <p class="eyebrow">Wszystko na jednej mapie</p>
          <h1>Mapa wyjazdu</h1>
          <p class="guide-lead">Każdy przystanek planu, atrakcje po drodze, opcje na zapas i miejsca do jedzenia. Włącz tylko to, czego akurat potrzebujesz — a klikając pinezkę zobaczysz godzinę i opis z planu.</p>
        </header>
        <section class="map-panel" aria-label="Warstwy mapy">
          <div class="map-toggles" id="map-toggles"></div>
          <details class="map-days" id="map-days" hidden>
            <summary class="map-days-label">Dni planu — pokaż tylko wybrane</summary>
            <div class="map-daychips" id="map-daychips"></div>
          </details>
        </section>
        <div class="card map-card">
          <div class="map-shell is-active" id="full-map-shell">
            <div class="route-map full-map" id="full-map" role="application" aria-label="Interaktywna mapa całego wyjazdu"></div>
          </div>
          <div class="map-actions">
            <button class="button secondary" type="button" id="map-fit">Dopasuj widok do Madery</button>
            <button class="button secondary" type="button" id="map-fit-all">Cała trasa z Berlinem</button>
            <a class="button secondary" href="assets/Madera-2026.kml" download>Pobierz do Google My Maps</a>
          </div>
        </div>
        <p class="map-hint" id="map-count"></p>
        <nav class="guide-nav" aria-label="Nawigacja przewodników">
          <a class="button secondary" href="index.html">← Wróć do planu</a>
          <a class="button" href="praktyczne.html">Informacje praktyczne →</a>
        </nav>
        <footer class="footer">Mapa i dane © OpenStreetMap. Współrzędne miejsc pochodzą z OpenStreetMap — godziny otwarcia potwierdzić na miejscu.</footer>
      </main>`;

    const przelaczniki = document.querySelector("#map-toggles");
    przelaczniki.innerHTML = MAP_GRUPY.map((g) => `
      <label class="map-toggle" style="--kolor:${g.kolor}">
        <input type="checkbox" data-grupa="${g.id}"${g.domyslnie ? " checked" : ""}>
        <span class="mt-ico" aria-hidden="true">${g.ikona}</span>
        <span class="mt-label">${g.label}</span>
      </label>`).join("");

    document.querySelector("#map-daychips").innerHTML = dniZTrasa.map((d, i) => `
      <label class="map-daychip" style="--kolor:${MAP_DNI_KOLORY[i % MAP_DNI_KOLORY.length]}">
        <input type="checkbox" data-dzien="${d.id}" checked>
        <span>${d.date.split(" ·")[0]}</span>
      </label>`).join("");

    initFullMap(dniZTrasa);
  }

  async function initFullMap(dniZTrasa) {
    const element = document.querySelector("#full-map");
    if (!element) return;
    let L;
    try { L = await loadLeaflet(); }
    catch (e) {
      element.innerHTML = '<p class="map-error">Nie udało się wczytać mapy. Sprawdź połączenie albo pobierz plik do Google My Maps.</p>';
      return;
    }
    const map = L.map(element, { scrollWheelZoom: true, zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const kropka = (kolor, etykieta) => L.divIcon({
      className: "map-pin",
      html: `<span style="--kolor:${kolor}">${etykieta || ""}</span>`,
      iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -12]
    });
    const warstwy = {};
    let wszystkie = [];

    MAP_GRUPY.filter((g) => g.typ === "poi").forEach((g) => {
      const grupa = L.layerGroup();
      g.dane().forEach((p) => {
        L.marker([p.lat, p.lon], { icon: kropka(g.kolor, g.ikona), title: p.n })
          .bindPopup(`<strong>${p.n}</strong><br>${p.d}<br><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}" target="_blank" rel="noopener">Otwórz w Google Maps ↗</a>`)
          .addTo(grupa);
        wszystkie.push([p.lat, p.lon]);
      });
      warstwy[g.id] = grupa;
    });

    const warstwyDni = {};
    dniZTrasa.forEach((d, i) => {
      const kolor = MAP_DNI_KOLORY[i % MAP_DNI_KOLORY.length];
      const grupa = L.layerGroup();
      const punkty = [];
      // hotel jest startem i metą prawie każdego dnia — pinezkę trzyma warstwa logistyki
      const pokazHotel = d.id === "2026-08-20" || d.id === "2026-08-30";
      d.route.forEach(([lat, lon, nazwa], idx) => {
        if (!pokazHotel && /^hotel/i.test(nazwa)) { punkty.push([lat, lon]); return; }
        const opis = (d.agenda.find(([, ti, op]) => (ti + " " + op).toLowerCase().includes(nazwa.split(" ")[0].toLowerCase())) || [])
          .filter(Boolean);
        const szczegol = opis.length ? `<br><em>${opis[0]}</em> — ${opis[1]}<br>${opis[2]}` : "";
        L.marker([lat, lon], { icon: kropka(kolor, String(idx + 1)), title: nazwa })
          .bindPopup(`<strong>${nazwa}</strong><br><span class="pop-day">${d.date} · ${d.title}</span>${szczegol}<br><a href="days/${d.id}.html">Otwórz plan dnia →</a>`)
          .addTo(grupa);
        punkty.push([lat, lon]);
        wszystkie.push([lat, lon]);
      });
      if (punkty.length > 1) L.polyline(punkty, { color: kolor, weight: 3, opacity: .55, dashArray: "6 6" }).addTo(grupa);
      warstwyDni[d.id] = grupa;
    });

    const madera = wszystkie.filter(([la, lo]) => la < 40 && lo < -10);
    const dopasuj = (zbior) => { if (zbior.length) map.fitBounds(L.latLngBounds(zbior).pad(0.08)); };
    dopasuj(madera.length ? madera : wszystkie);

    const policz = () => {
      let n = 0;
      Object.values(warstwy).forEach((w) => { if (map.hasLayer(w)) n += w.getLayers().length; });
      Object.values(warstwyDni).forEach((w) => { if (map.hasLayer(w)) n += w.getLayers().filter((l) => l instanceof L.Marker).length; });
      const el = document.querySelector("#map-count");
      if (el) el.textContent = `Na mapie: ${n} ${n === 1 ? "punkt" : n < 5 ? "punkty" : "punktów"}.`;
    };

    const przelacz = (warstwa, wlacz) => { if (wlacz) map.addLayer(warstwa); else map.removeLayer(warstwa); };

    document.querySelectorAll("#map-toggles input").forEach((input) => {
      const id = input.dataset.grupa;
      if (id === "dni") {
        if (input.checked) Object.values(warstwyDni).forEach((w) => map.addLayer(w));
        document.querySelector("#map-days").hidden = !input.checked;
        input.addEventListener("change", () => {
          document.querySelector("#map-days").hidden = !input.checked;
          document.querySelectorAll("#map-daychips input").forEach((chip) => {
            przelacz(warstwyDni[chip.dataset.dzien], input.checked && chip.checked);
          });
          policz();
        });
        return;
      }
      if (input.checked) map.addLayer(warstwy[id]);
      input.addEventListener("change", () => { przelacz(warstwy[id], input.checked); policz(); });
    });

    document.querySelectorAll("#map-daychips input").forEach((chip) => {
      chip.addEventListener("change", () => { przelacz(warstwyDni[chip.dataset.dzien], chip.checked); policz(); });
    });

    document.querySelector("#map-fit").addEventListener("click", () => dopasuj(madera));
    document.querySelector("#map-fit-all").addEventListener("click", () => dopasuj(wszystkie));
    policz();
    setTimeout(() => map.invalidateSize(), 120);
  }

  // ── Pogoda a plan: prognoza dla dni, w których pogoda decyduje ────────
  const WX_PUNKTY = {
    "2026-08-24": { lat: 32.8663, lon: -17.1667, co: "Fanal i baseny w Porto Moniz", szuka: "mgla" },
    "2026-08-27": { lat: 32.7583, lon: -16.9419, co: "wejście na Pico Ruivo", szuka: "widok" },
    "2026-08-28": { lat: 32.6300, lon: -16.9100, co: "rejs na delfiny", szuka: "spokoj" },
    "2026-08-29": { lat: 32.7586, lon: -17.1313, co: "Levada das 25 Fontes (wariant)", szuka: "sucho" }
  };

  function wxWerdykt(szuka, chmury, deszcz, wiatr, opad) {
    if (szuka === "widok") {
      if (chmury <= 30 && deszcz <= 25) return ["dobry", "Szczyt powinien być odsłonięty — to dzień na widok."];
      if (chmury <= 60 && deszcz <= 45) return ["sredni", "Szczyt może tonąć w chmurach; wejście ma sens, ale bez gwarancji panoramy."];
      return ["zly", "Duże zachmurzenie — rozważcie przestawienie dnia górskiego na pogodniejszy termin."];
    }
    if (szuka === "spokoj") {
      if (wiatr <= 20 && deszcz <= 30) return ["dobry", "Morze powinno być spokojne — dobre warunki na rejs."];
      if (wiatr <= 30) return ["sredni", "Wiatr umiarkowany; operator potwierdza wyjście rano."];
      return ["zly", "Silny wiatr — rejs bywa przy takich warunkach odwoływany."];
    }
    if (szuka === "sucho") {
      if (deszcz <= 30 && opad < 2) return ["dobry", "Sucho — levada będzie miała dobrą przyczepność."];
      if (deszcz <= 55) return ["sredni", "Możliwe przelotne opady; kamienie na levadzie robią się śliskie."];
      return ["zly", "Deszczowo — na wąskiej levadzie to realne ryzyko poślizgnięcia."];
    }
    // Fanal jest efektowny właśnie we mgle
    if (chmury >= 60) return ["dobry", "Wilgotno i pochmurno — Fanal będzie wyglądał tak, jak powinien."];
    if (deszcz >= 55) return ["sredni", "Sporo wilgoci: Fanal zyska, baseny w Porto Moniz stracą."];
    return ["sredni", "Czyste niebo: baseny tak, ale Fanal bez mgły traci swój klimat."];
  }

  async function renderWeatherPlan() {
    const host = document.querySelector("#wx-plan");
    if (!host) return;
    const wpisy = Object.entries(WX_PUNKTY).filter(([id]) => days.some((d) => d.id === id));
    try {
      const wyniki = await Promise.all(wpisy.map(async ([id, p]) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&daily=weather_code,temperature_2m_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,cloud_cover_mean&timezone=Atlantic%2FMadeira&forecast_days=16`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("wx");
        const d = await res.json();
        const k = d.daily.time.indexOf(id);
        return { id, p, d: k >= 0 ? d.daily : null, k };
      }));
      const wiersze = wyniki.map(({ id, p, d, k }) => {
        const dzien = days.find((x) => x.id === id);
        const data = dzien ? dzien.date : id;
        if (!d) return `<tr><td><strong>${data}</strong><span>${p.co}</span></td><td colspan="2" class="wx-daleko">Prognoza pojawi się bliżej terminu (16 dni naprzód).</td></tr>`;
        const chmury = d.cloud_cover_mean[k] ?? 50, deszcz = d.precipitation_probability_max[k] ?? 0;
        const wiatr = Math.round(d.wind_speed_10m_max[k] ?? 0), opad = d.precipitation_sum[k] ?? 0;
        const [klasa, tekst] = wxWerdykt(p.szuka, chmury, deszcz, wiatr, opad);
        return `<tr class="wx-${klasa}">
          <td><strong>${data}</strong><span>${p.co}</span></td>
          <td class="wx-liczby">${wxEmoji(d.weather_code[k])} ${Math.round(d.temperature_2m_max[k])}° · chmury ${chmury}% · deszcz ${deszcz}% · wiatr ${wiatr} km/h</td>
          <td class="wx-werdykt">${tekst}</td></tr>`;
      }).join("");
      host.innerHTML = `
        <div class="card"><div class="card-body">
          <table class="wx-table"><tbody>${wiersze}</tbody></table>
          <p class="wx-nota">Prognoza sięga 16 dni naprzód i im dalej, tym mniej znaczy — traktujcie ją jako wskazówkę, nie wyrok. Jeśli układ się zmieni, dni bez kłódki można przestawić przyciskiem „Przestaw dni" nad planem.</p>
        </div></div>`;
    } catch (e) {
      host.innerHTML = '<p class="weather-loading">Prognoza dla kluczowych dni chwilowo niedostępna.</p>';
    }
  }

  function renderCountdown() {
    const el = document.querySelector("#countdown");
    if (!el) return;
    const start = new Date("2026-08-19T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.round((start - today) / 86400000);
    el.textContent = diff > 0 ? diff : diff === 0 ? "0" : "—";
    const label = el.parentElement.querySelector("span");
    if (label) label.textContent = diff > 0 ? "dni do wyjazdu" : diff === 0 ? "wyjazd dziś!" : "w trakcie podróży";
  }

  // Pasek postępu czytania + delikatne wejście sekcji (wzorzec z planu Japonii)
  function setupScrollUx() {
    if (document.body.dataset.page === "print") return;
    const bar = document.createElement("div");
    bar.className = "readbar";
    bar.innerHTML = '<i></i>';
    document.body.appendChild(bar);
    const fill = bar.firstChild;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Delikatne wejście TYLKO sekcji dekoracyjnych (data-reveal). Plan dnia, mapa,
    // pogoda i checklista są zawsze widoczne — treść użytkowa nigdy nie może zniknąć.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const secs = [...document.querySelectorAll("main > section[data-reveal]")];
    if (!secs.length) return;
    const showAll = () => secs.forEach((s) => s.classList.add("in"));
    if (reduce || !("IntersectionObserver" in window)) { showAll(); return; }
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    secs.forEach((s) => io.observe(s));
    // bezpiecznik: gdyby obserwator nie zdążył (skok scrolla, kotwica), pokaż wszystko
    window.setTimeout(showAll, 2500);
  }

  function renderBackToTop() {
    if (document.body.dataset.page === "print") return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Wróć na górę strony");
    btn.textContent = "↑";
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(btn);
    const onScroll = () => btn.classList.toggle("is-visible", window.scrollY > 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Atrybucja zdjęć z Wikimedia Commons — wymagana przez licencje CC BY-SA / CC BY
  const BYSA4 = "https://creativecommons.org/licenses/by-sa/4.0";
  const BYSA3 = "https://creativecommons.org/licenses/by-sa/3.0";
  const BY2 = "https://creativecommons.org/licenses/by/2.0";
  const BY3 = "https://creativecommons.org/licenses/by/3.0";
  const PHOTO_CREDITS = [
    [commons.picoRuivo, "GerritR", "CC BY-SA 4.0", BYSA4],
    [commons.arieiro, "H. Zell", "CC BY-SA 3.0", BYSA3],
    [commons.fontes, "Asurnipal", "CC BY-SA 4.0", BYSA4],
    [commons.fanal, "Dietmar Rabich", "CC BY-SA 4.0", BYSA4],
    [commons.portoMoniz, "Dietmar Rabich", "CC BY-SA 4.0", BYSA4],
    [commons.camara, "Dietmar Rabich", "CC BY-SA 4.0", BYSA4],
    [commons.curral, "Diego Delso", "CC BY-SA 4.0", BYSA4],
    [commons.santana, "H. Zell", "CC BY-SA 3.0", BYSA3],
    [commons.pontaDoSol, "Paul Mannix", "CC BY 2.0", BY2],
    [commons.funchalBay, "Pedro (Maia, Portugal)", "CC BY 2.0", BY2],
    [commons.funchal, "Dietmar Rabich", "CC BY-SA 4.0", BYSA4],
    [commons.lido, "Hein.M\u00fcck", "CC BY-SA 3.0", BYSA3],
    [commons.monte, "Dietmar Rabich", "CC BY-SA 4.0", BYSA4],
    [commons.machico, "Bengt Nyman", "CC BY 3.0", BY3],
    [commons.dolphin, "Virg\u00edlio Gomes", "CC BY-SA 4.0", BYSA4],
    [commons.espetada, "Dirk Klaassen", "CC BY-SA 4.0", BYSA4]
  ];
  const creditFor = (src) => {
    const hit = PHOTO_CREDITS.find((c) => c[0] === src);
    return hit ? `fot. ${hit[1]} · <a href="${hit[3]}" target="_blank" rel="noopener">${hit[2]}</a> · Wikimedia Commons` : "";
  };

  function setupLightbox() {
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Powiększone zdjęcie");
    overlay.innerHTML = '<button class="lb-close" type="button" aria-label="Zamknij">✕</button><button class="lb-nav lb-prev" type="button" aria-label="Poprzednie zdjęcie">‹</button><figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption></figure><button class="lb-nav lb-next" type="button" aria-label="Następne zdjęcie">›</button><span class="lb-counter"></span>';
    document.body.appendChild(overlay);
    const img = overlay.querySelector(".lb-img");
    const cap = overlay.querySelector(".lb-caption");
    const counter = overlay.querySelector(".lb-counter");
    const prevBtn = overlay.querySelector(".lb-prev");
    const nextBtn = overlay.querySelector(".lb-next");
    const closeBtn = overlay.querySelector(".lb-close");
    let items = [], idx = 0, lastFocus = null;
    const show = () => {
      const it = items[idx];
      img.src = it.src; img.alt = it.caption || "";
      cap.innerHTML = `<span class="lb-place">${it.caption || ""}</span>${it.credit ? `<span class="lb-credit">${it.credit}</span>` : ""}`;
      counter.textContent = `${idx + 1} / ${items.length}`;
      const multi = items.length > 1;
      prevBtn.hidden = !multi; nextBtn.hidden = !multi; counter.hidden = !multi;
    };
    const go = (delta) => { idx = (idx + delta + items.length) % items.length; show(); };
    const open = (list, start) => {
      items = list; idx = start || 0; lastFocus = document.activeElement;
      overlay.hidden = false; document.body.classList.add("lb-open"); show(); closeBtn.focus();
    };
    const close = () => { overlay.hidden = true; document.body.classList.remove("lb-open"); if (lastFocus && lastFocus.focus) lastFocus.focus(); };
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => go(-1));
    nextBtn.addEventListener("click", () => go(1));
    overlay.addEventListener("click", (e) => { if (e.target === overlay || e.target.classList.contains("lb-figure")) close(); });
    document.addEventListener("keydown", (e) => {
      if (overlay.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft" && items.length > 1) go(-1);
      else if (e.key === "ArrowRight" && items.length > 1) go(1);
    });
    return { open };
  }


  // Pogoda (Open-Meteo)
  const PL_WD = ["niedz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."];
  const wxEmoji = (c) => c === 0 ? "☀️" : c <= 3 ? "⛅" : (c === 45 || c === 48) ? "🌫️" : (c >= 51 && c <= 57) ? "🌦️" : (c >= 61 && c <= 67) ? "🌧️" : (c >= 71 && c <= 77) ? "🌨️" : (c >= 80 && c <= 82) ? "🌦️" : (c >= 85 && c <= 86) ? "🌨️" : c >= 95 ? "⛈️" : "☁️";
  const wxLabel = (c) => c === 0 ? "Bezchmurnie" : c <= 3 ? "Częściowe zachmurzenie" : (c === 45 || c === 48) ? "Mgła" : (c >= 51 && c <= 57) ? "Mżawka" : (c >= 61 && c <= 67) ? "Deszcz" : (c >= 71 && c <= 77) ? "Śnieg" : (c >= 80 && c <= 82) ? "Przelotny deszcz" : (c >= 85 && c <= 86) ? "Przelotny śnieg" : c >= 95 ? "Burza" : "Zachmurzenie";
  const plWeekday = (dateStr) => PL_WD[new Date(dateStr + "T12:00:00").getDay()];

  async function renderWeather() {
    const host = document.querySelector("#weather");
    if (!host) return;
    const locations = [
      { name: "Funchal · wybrzeże", lat: 32.6486, lon: -16.9186 },
      { name: "Pico Ruivo · góry", lat: 32.7583, lon: -16.9419 }
    ];
    try {
      const results = await Promise.all(locations.map(async (loc) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Atlantic%2FMadeira&forecast_days=6`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("weather");
        return { loc, data: await res.json() };
      }));
      const tile = (id, v, code) => { const el = document.querySelector(id); if (el) el.innerHTML = `${wxEmoji(code)} ${Math.round(v)}°`; };
      if (results[0]) tile("#wx-coast", results[0].data.current.temperature_2m, results[0].data.current.weather_code);
      if (results[1]) tile("#wx-mount", results[1].data.current.temperature_2m, results[1].data.current.weather_code);
      host.innerHTML = results.map(({ loc, data }) => {
        const cur = data.current, d = data.daily;
        const days6 = d.time.map((t, i) => `<div class="wd"><span class="wd-day">${i === 0 ? "dziś" : plWeekday(t)}</span><span class="wd-ico" title="${wxLabel(d.weather_code[i])}">${wxEmoji(d.weather_code[i])}</span><span class="wd-temp">${Math.round(d.temperature_2m_max[i])}° <em>${Math.round(d.temperature_2m_min[i])}°</em></span><span class="wd-pop">💧 ${d.precipitation_probability_max[i] ?? 0}%</span></div>`).join("");
        return `<article class="weather-card"><header class="weather-head"><h3>${loc.name}</h3><p class="weather-now">${wxEmoji(cur.weather_code)} ${Math.round(cur.temperature_2m)}°C <span>${wxLabel(cur.weather_code)}</span></p></header><div class="weather-days">${days6}</div></article>`;
      }).join("");
    } catch (e) {
      host.innerHTML = '<p class="weather-error">Nie udało się pobrać pogody na żywo. Aktualną prognozę dla Madery znajdziesz w serwisie <a href="https://www.ipma.pt/en/otempo/prev.localidade.hora/" target="_blank" rel="noopener">IPMA</a> albo w ulubionej aplikacji pogodowej.</p>';
    }
  }

  // Czy pogoda sprzyja temu, co zaplanowane — tylko dla dni, w których to realnie decyduje
  function weatherVerdict(day, code, pop) {
    const what = WEATHER_CRITICAL[day.id];
    if (!what) return "";
    const deszcz = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95 || pop >= 60;
    const mgla = code === 45 || code === 48;
    if (deszcz) return `<p class="dw-verdict bad"><b>Uwaga:</b> prognoza mówi o opadach (${pop}%). Rozważcie plan B — ${what} może być rozczarowaniem albo lepiej przełożyć.</p>`;
    if (mgla) return `<p class="dw-verdict warn"><b>Mgła w prognozie.</b> ${what}: widoków może nie być. W Fanal mgła jest atutem, na szczytach i levadach — nie.</p>`;
    return `<p class="dw-verdict good"><b>Prognoza sprzyja.</b> ${what} — bez przeciwwskazań pogodowych.</p>`;
  }
  const sunLine = (d, idx) => {
    if (idx < 0 || !d.sunrise || !d.sunrise[idx]) return "";
    const g = (t) => t.slice(11, 16);
    return `<p class="dw-sun">🌅 wschód ${g(d.sunrise[idx])} · 🌇 zachód ${g(d.sunset[idx])}</p>`;
  };

  async function renderDayWeather(day) {
    const host = document.querySelector("#day-weather");
    if (!host) return;
    const dayLabel = day.date.split(" · ")[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${day.center[0]}&longitude=${day.center[1]}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Atlantic%2FMadeira&forecast_days=16`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("weather");
      const data = await res.json();
      const cur = data.current, d = data.daily;
      const idx = d.time.indexOf(day.id);
      const now = `<div class="dw-now"><span class="dw-ico">${wxEmoji(cur.weather_code)}</span><div><strong>${Math.round(cur.temperature_2m)}°C</strong><span>teraz · ${wxLabel(cur.weather_code)}</span></div></div>`;
      let main, verdict = "";
      if (idx >= 0) {
        main = `<div class="dw-forecast"><span class="dw-ico">${wxEmoji(d.weather_code[idx])}</span><div><strong>${Math.round(d.temperature_2m_max[idx])}° / ${Math.round(d.temperature_2m_min[idx])}°</strong><span>prognoza na ${dayLabel} · ${wxLabel(d.weather_code[idx])} · 💧 ${d.precipitation_probability_max[idx] ?? 0}%</span></div></div>`;
        verdict = weatherVerdict(day, d.weather_code[idx], d.precipitation_probability_max[idx] ?? 0);
      } else {
        main = `<p class="dw-note">Prognoza na <strong>${dayLabel}</strong> pojawi się około 16 dni przed terminem — zajrzyj tu bliżej wyjazdu. Poniżej aktualna pogoda w rejonie trasy tego dnia.</p>`;
      }
      host.innerHTML = `<div class="card"><div class="card-body">
        <h2>Pogoda w rejonie trasy</h2>
        <p class="section-copy">Dane na żywo dla okolicy, w której spędzamy ten dzień — odświeżają się przy każdym otwarciu strony.</p>
        <div class="dw-grid">${idx >= 0 ? main + now : now}</div>
        ${verdict}
        ${sunLine(d, idx)}
        ${idx >= 0 ? "" : main}
      </div></div>`;
    } catch (e) {
      host.innerHTML = '<div class="card"><div class="card-body"><h2>Pogoda w rejonie trasy</h2><p class="weather-error">Nie udało się pobrać pogody na żywo. Aktualną prognozę dla Madery znajdziesz w serwisie <a href="https://www.ipma.pt/en/otempo/prev.localidade.hora/" target="_blank" rel="noopener">IPMA</a> albo w ulubionej aplikacji pogodowej.</p></div></div>';
    }
  }

  // Eksport planu do kalendarza (.ics) — godziny „pływające", czyli takie jak na stronie
  function setupCalendarExport() {
    const btn = document.querySelector("#ics-export");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
      const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Madera 2026//PL", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Madera 2026"];
      days.forEach((day, di) => {
        day.agenda.forEach((sl, si) => {
          const m = /^(\d{2}):(\d{2})/.exec(sl[0]);
          if (!m) return;
          const ymd = day.id.replace(/-/g, "");
          const start = `${ymd}T${m[1]}${m[2]}00`;
          const endMin = (+m[1] * 60 + +m[2] + 60) % 1440;
          const carry = (+m[1] * 60 + +m[2] + 60) >= 1440;
          const eh = String(Math.floor(endMin / 60)).padStart(2, "0"), em = String(endMin % 60).padStart(2, "0");
          const endYmd = carry ? String(+ymd + 1) : ymd;
          lines.push("BEGIN:VEVENT",
            `UID:madera-${day.id}-${si}@plan`,
            `DTSTAMP:${ymd}T000000Z`,
            `DTSTART:${start}`,
            `DTEND:${endYmd}T${eh}${em}00`,
            `SUMMARY:${esc(sl[1])}`,
            `DESCRIPTION:${esc(sl[2])}`,
            `LOCATION:${esc("Dzień " + (di + 1) + " · " + day.title)}`,
            "END:VEVENT");
        });
      });
      lines.push("END:VCALENDAR");
      const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "madera-2026.ics";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  // Tryb offline — plan działa bez zasięgu (w górach i tunelach go nie ma)
  function registerOffline() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    navigator.serviceWorker.register("sw.js".replace(/^/, document.body.dataset.page === "day" ? "../" : "")).catch(() => {});
  }

  const lightbox = setupLightbox();
  // Jeden błąd w którymkolwiek module nie może wygasić całej strony.
  [
    ["zastosujZapisanyUklad", zastosujZapisanyUklad],
    ["renderTopNav", renderTopNav],
    ["renderIndex", renderIndex],
    ["renderDay", renderDay],
    ["renderPrint", renderPrint],
    ["renderPractical", renderPractical],
    ["renderFood", renderFood],
    ["renderMapPage", renderMapPage],
    ["renderTrailAlert", renderTrailAlert],
    ["renderWeather", renderWeather],
    ["renderWeatherPlan", renderWeatherPlan],
    ["renderCountdown", renderCountdown],
    ["renderFocusDay", renderFocusDay],
    ["setupSwap", setupSwap],
    ["setupCalendarExport", setupCalendarExport],
    ["registerOffline", registerOffline],
    ["setupScrollUx", setupScrollUx],
    ["renderBackToTop", renderBackToTop]
  ].forEach(([nazwa, fn]) => {
    try { fn(); } catch (e) { console.error("Moduł " + nazwa + " zgłosił błąd:", e); }
  });
})();
