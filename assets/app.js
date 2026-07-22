(function () {
  "use strict";

  const IMAGE = "?auto=format&fit=crop&w=1800&q=78";
  const images = {
    berlin: "https://images.unsplash.com/photo-1560969184-10fe8719e047" + IMAGE,
    funchal: "https://images.unsplash.com/photo-1674333362725-84e9996aa6fb" + IMAGE,
    lido: "https://images.unsplash.com/photo-1564741520445-3ad576259244" + IMAGE,
    arieiro: "https://unsplash.com/photos/L9hCoorJ64M/download?force=true&w=1800&q=78",
    porto: "https://images.unsplash.com/photo-1723098281716-bb15452fed31" + IMAGE,
    coast: "https://images.unsplash.com/photo-1590963852640-2714d687c102" + IMAGE,
    beach: "https://images.unsplash.com/photo-1583149090851-2b5e18615649" + IMAGE,
    camara: "https://images.unsplash.com/photo-1619162600582-1c24c605a5fa" + IMAGE
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

  const days = [
    {
      id: "2026-08-19", date: "19 sierpnia · środa", title: "Łódź → Berlin", short: "Spokojny start podróży, P8 i lekki wieczór w Berlinie.",
      image: images.berlin, alt: "Brama Brandenburska w Berlinie o wieczornej porze", cats: ["podróż", "spokojny"],
      intensity: "Łagodna", duration: "6–7 h przejazdu + 2 h", transport: "Samochód", walking: "Spacer 1–3 km", kids: "Tak, sprawnie chodzą", exposure: "Niska",
      center: [52.5163, 13.3777], route: [[51.7592, 19.4560, "Łódź"], [52.3664, 13.5071, "Parking P8 BER"], [52.5163, 13.3777, "Brama Brandenburska"]], google: "https://www.google.com/maps/dir/%C5%81%C3%B3d%C5%BA/Berlin+Brandenburg+Airport+P8/Brandenburg+Gate",
      agenda: [["11:00", "Wyjazd z Łodzi", "Start bez pośpiechu; zaplanować regularne postoje dla dzieci."], ["17:00", "Parking P8 przy BER", "Wjazd zgodnie z rezerwacją, zdjęcie miejsca postoju i shuttle lub krótkie przejście do terminala."], ["17:45", "Pociąg do centrum", "FEX albo S-Bahn z dworca pod terminalem BER — do centrum około 30 minut, bez auta i bez szukania parkingu."], ["18:30", "Jeden lekki spacer", "Brama Brandenburska i Reichstag z zewnątrz albo kameralne Nikolaiviertel — bez łączenia wszystkiego."], ["19:30", "Wczesna kolacja", "Proste menu, nawodnienie i powrót pociągiem na nocleg w okolicy BER."]],
      tips: ["Nocleg wybrać blisko BER (najlepiej z własnym shuttle) — auto zostaje na P8, a do centrum i z powrotem jeździ FEX/S-Bahn.", "Przed wyjazdem pobrać mapę offline Berlina i okolic BER.", "Sprawdzić kod wjazdu, numer rezerwacji P8 i sposób transferu do terminala.", "Po drodze robić postoje najpóźniej co 90 minut; po przyjeździe zaplanować jeden spacer 1–3 km, bez długiego stania.", "Zostawić bagaże lotnicze łatwo dostępne — nie przepakowywać auta wieczorem."],
      planB: "Jeśli trasa się wydłuży, pomijamy centrum Berlina. Kolacja i spokojny nocleg w okolicy BER są pełnoprawnym planem.", gentle: "spacer traktujemy jako bonus, nie punkt obowiązkowy.",
      deepDive: {
        context: "Trasa Łódź–Berlin to najkrótsza droga do lotniska BER bez nocnego pośpiechu. Berlin bywa tu tylko przystankiem, ale Brama Brandenburska i kameralne Nikolaiviertel dają poczucie stolicy nawet przy krótkim, wieczornym spacerze.",
        food: "Na szybki obiad po drodze sprawdzają się przydrożne Autohof z prostą niemiecką kuchnią; wieczorem w Berlinie warto zjeść coś lekkiego z piekarni albo klasyczne curry-wurst zamiast szukać restauracji na godziny.",
        practical: "Parking P8 przy BER to długoterminowy parking peryferyjny z bezpłatnym shuttle busem do terminala. Kod wjazdu i numer rezerwacji warto mieć zapisane offline — zasięg w garażu bywa słaby."
      }
    },
    {
      id: "2026-08-20", date: "20 sierpnia · czwartek", title: "Berlin BER → Funchal", short: "Lot, prywatny transfer, Hotel Baía Azul i pierwsze spotkanie z oceanem.",
      image: commons.funchalBay, alt: "Zatoka i marina Funchal na Maderze", cats: ["podróż", "spokojny"],
      intensity: "Łagodna", duration: "Dzień logistyczny", transport: "Samolot + transfer", walking: "Mało", kids: "Tak", exposure: "Niska",
      center: [32.6387, -16.9304], route: [[52.3667, 13.5033, "Lotnisko BER"], [32.6979, -16.7745, "Lotnisko FNC"], [32.6384, -16.9353, "Hotel Baía Azul"], [32.6386, -16.9332, "Lido"]], google: "https://www.google.com/maps/dir/Madeira+Airport/Hotel+Baia+Azul,+Funchal/Lido+Bathing+Complex",
      agenda: [["rano", "Spokojny dojazd na BER", "Odprawa z zapasem i bez dodatkowego programu."], ["10:55*", "Lądowanie w Funchal", "Lot EJU5333 i godzina 10:55 są do ponownego potwierdzenia przed wylotem."], ["12:00", "Prywatny transfer", "Transfer z madeira-in; po odbiorze bagażu kontakt z kierowcą i przejazd do Hotelu Baía Azul."], ["14:00", "Obiad i odpoczynek", "Lekki posiłek, zameldowanie i basen."], ["17:00", "Lido lub promenada", "Krótki spacer tylko jeśli grupa ma energię."]],
      tips: ["Numer lotu i godziny sprawdzić ponownie w aplikacji przewoźnika.", "Przy dłuższych przejściach i kolejkach można z wyprzedzeniem zamówić bezpłatną asystę lotniskową i potwierdzić ją z przewoźnikiem.", "Przy rezerwacji z madeira-in potwierdzić liczbę osób, bagaże i miejsce spotkania.", "Mieć pod ręką numer kierowcy i potwierdzenie transferu.", "Pierwszego dnia nie planować zakupów ani dalszych dojazdów."],
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
      id: "2026-08-22", date: "22 sierpnia · sobota", title: "Pico Ruivo i wschód wyspy", short: "Wejście na najwyższy szczyt Madery (PR1.2), Santana i levada na Balcões.",
      image: commons.picoRuivo, alt: "Szczyt Pico Ruivo — najwyższy punkt Madery", cats: ["aktywny", "wycieczka busem"],
      intensity: "Aktywna", duration: "10:15–18:00", transport: "Prywatny bus + PR1.2", walking: "PR1.2 ok. 5,6 km + Balcões", kids: "Tak, dobrze chodzą po górach", exposure: "Umiarkowana; PR1.2, bez grani PR1",
      center: [32.757, -16.925], route: [[32.6384, -16.9353, "Hotel"], [32.7573, -16.9110, "Achada do Teixeira — start PR1.2"], [32.7583, -16.9419, "Pico Ruivo (1862 m)"], [32.8036, -16.8819, "Santana"], [32.7353, -16.8865, "Ribeiro Frio"], [32.7419, -16.8905, "Balcões"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Achada+do+Teixeira/Pico+Ruivo/Santana,+Madeira/Ribeiro+Frio",
      agenda: [["08:15", "Śniadanie w hotelu", "Bufet 7:30–10:00 — dziś bez pobudki o świcie, spokojne śniadanie przed wyjściem (godziny potwierdzić w recepcji)."], ["10:15", "Wyjazd z hotelu", "Mercedes Sprinter madeira-in; przejazd na płaskowyż przez Santanę, ok. godziny drogi. Rekomendowana godzina wyjazdu: ok. 08:30 dla chętnych na czystsze niebo na szczycie — cała agenda przesuwa się wtedy o ~1,5 h wcześniej (chmury narastają w ciągu dnia)."], ["11:30", "Achada do Teixeira", "Start szlaku PR1.2 na wysokości ~1590 m; przy parkingu skalna formacja 'Homem em Pé' (Stojący Człowiek)."], ["11:45", "PR1.2 na Pico Ruivo", "Najłatwiejsza droga na najwyższy szczyt wyspy (1862 m): ~2,8 km w jedną stronę szeroką, kamienną ścieżką ze schodami, ~260 m podejścia. Idziemy w dzień, spokojnie, z przerwami, plus czas na szczycie i zdjęcia."], ["14:15", "Santana i lunch", "Zjazd do Santany: tradycyjne trójkątne domki 'palheiros' i spokojny lunch po zejściu."], ["15:45", "Ribeiro Frio i Balcões", "W drodze powrotnej łatwa levada do tarasu Balcões (ok. 1,5 km w obie strony) i pstrąg w Ribeiro Frio."], ["18:00", "Powrót", "Wieczór w hotelu."]],
      tips: ["Pico Ruivo to najwyższy szczyt Madery (1862 m), a PR1.2 z Achada do Teixeira to jego najłatwiejsza, dobrze utrzymana droga — dużo mniej ekspozycji niż słynna grań PR1 (Arieiro–Ruivo), której nie robimy.", "Robimy to na spokojnie, po śniadaniu, nie o świcie — rano niebo bywa czystsze (chmury narastają w ciągu dnia), a wejście w dzień jest bezpieczniejsze dla dzieci i osoby z lękiem wysokości.", "Na szczycie bywa zimno i wietrznie nawet w sierpniu — ciepłe warstwy, kurtka przeciwwiatrowa, czapki, woda i buty trekkingowe zamiast sneakersów.", "Blisko szczytu są krótkie odsłonięte fragmenty — trzymamy dzieci od strony ściany i idziemy spokojnie.", "Status trasy potwierdzić tuż przed wyjazdem — szlaki w masywie Ruivo były odbudowywane po pożarach z 2024 r. (planowane otwarcie od kwietnia 2026)."],
      planB: "Przy mgle, deszczu lub silnym wietrze na szczycie rezygnujemy z wejścia na Pico Ruivo i zostajemy niżej: Santana, Ribeiro Frio i łatwa levada na Balcões.", gentle: "zamiast pełnego wejścia krótki odcinek PR1.2 od Achada do Teixeira i powrót, z naciskiem na Santanę i Balcões.",
      deepDive: {
        context: "Pico Ruivo (1862 m) to najwyższy szczyt Madery i trzeci co do wysokości w całej Portugalii. Trasa PR1.2 z Achada do Teixeira to najłatwiejsze podejście — szeroka, kamienna ścieżka przez wrzosowiska i relikty lasu laurowego. Sąsiednia grań PR1 z Pico do Arieiro jest znacznie trudniejsza i bardziej odsłonięta; po pożarach z 2024 r. była zamykana i odbudowywana.",
        food: "W Ribeiro Frio warto spróbować świeżego pstrąga z górskiej hodowli; w Santanie tradycyjne trójkątne domki 'palheiros' sąsiadują z kawiarniami serwującymi bolo de mel i lokalny miód.",
        practical: "Na wysokości 1600–1860 m bywa znacznie chłodniej i wietrzniej niż na wybrzeżu, a mgła potrafi ograniczyć widoczność w kilka minut — warstwy i kurtka przeciwwiatrowa są potrzebne nawet w sierpniu. Parking przy Achada do Teixeira jest niewielki, więc wcześniejszy przyjazd pomaga."
      }
    },
    {
      id: "2026-08-23", date: "23 sierpnia · niedziela", title: "Luźny dzień w Funchal", short: "Basen i Lido, a do wyboru snorkeling albo Stare Miasto.",
      image: commons.lido, alt: "Kompleks basenów Lido przy wybrzeżu Funchal", cats: ["odpoczynek", "spokojny"],
      intensity: "Lekka", duration: "Elastyczny", transport: "Pieszo / taxi", walking: "2–3 km lub według chęci", kids: "Idealny", exposure: "Niska",
      center: [32.6386, -16.9332], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6386, -16.9332, "Lido"], [32.6484, -16.9033, "Stare Miasto — opcjonalnie"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/search/?api=1&query=Lido+Bathing+Complex+Funchal",
      agenda: [["rano", "Śniadanie w hotelu bez budzika", "Bufet w hotelu do 10:00 — dziś bez pośpiechu, jeden wolniejszy poranek między aktywnymi dniami."], ["10:30", "Lido i kąpiel", "Baseny oceaniczne; chętni mogą wypożyczyć sprzęt do snorkelingu przy skalistym brzegu."], ["13:00", "Lunch przy oceanie", "Świeża ryba lub lekki posiłek z widokiem na wodę."], ["15:30", "Stare Miasto dla chętnych", "Spacer po Rua de Santa Maria, pomalowane drzwi i kawiarnie — dla tych, którzy nie chcą siedzieć w miejscu."]],
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
      tips: ["Zabrać rano stroje kąpielowe i ręczniki oraz przekąski dla dzieci — lunch wypada w Porto Moniz około 13:15, a decyzja o kąpieli zapada na miejscu.", "Fanal najlepiej wygląda właśnie we mgle — to jego znak rozpoznawczy, a nie zła pogoda; przy deszczu łąka bywa błotnista, więc przydają się nieprzemakalne buty.", "Na płaskowyżu Paúl da Serra jest chłodniej i wietrzniej niż na wybrzeżu — warstwy i kurtka przeciwwiatrowa.", "Cabo Girão (szklany taras nad klifem) traktować jako propozycję dla chętnych ze względu na wysokość.", "Kąpiel w Porto Moniz zależy od fal, komunikatów i czasu."],
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
      id: "2026-08-26", date: "26 sierpnia · środa", title: "Curral das Freiras", short: "Pół dnia w Dolinie Zakonnic, spokojne widoki i lunch.",
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
      id: "2026-08-27", date: "27 sierpnia · czwartek", title: "Rabaçal, 25 Fontes i południowy zachód", short: "Levada das 25 Fontes w Rabaçal, plaża w Calhecie i bananowce.",
      image: commons.fontes, alt: "Levada das 25 Fontes w rezerwacie Rabaçal", cats: ["aktywny", "wycieczka busem"],
      intensity: "Aktywna", duration: "10:15–18:00", transport: "Prywatny bus + spacer", walking: "Levada 25 Fontes ok. 8 km + wybrzeże", kids: "Tak, dobrze chodzą po górach", exposure: "Kontrolowana; Risco pomijamy",
      center: [32.7400, -17.1500], route: [[32.6384, -16.9353, "Hotel"], [32.7586, -17.1313, "Rabaçal — Levada das 25 Fontes"], [32.7219, -17.1775, "Plaża Calheta"], [32.7031, -17.1276, "Bananowce — Madalena do Mar"], [32.6819, -17.1045, "Ponta do Sol"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Raba%C3%A7al,+Madeira/Calheta+Beach/Madalena+do+Mar/Ponta+do+Sol",
      agenda: [["08:15", "Śniadanie w hotelu", "Bufet 7:30–10:00 — spokojne śniadanie przed wyjazdem (godziny potwierdzić w recepcji)."], ["10:15", "Wyjazd z hotelu", "Aktywny dzień na zachodzie; przejazd na płaskowyż Rabaçal, ok. godziny drogi."], ["11:15", "Rabaçal — Levada das 25 Fontes", "Sztandarowa trasa dnia: levada wśród lasu laurowego do laguny zasilanej dwudziestoma pięcioma źródłami. Około 8 km w obie strony, w większości płasko; idziemy w swoim tempie. Levadę do Risco (odsłonięte klify) pomijamy."], ["14:15", "Calheta — plaża i lunch", "Nagroda po spacerze: piaszczysta plaża i lunch przy oceanie."], ["15:45", "Bananowce w Madalena do Mar", "Krótki przystanek wśród plantacji — dzieci zobaczą, jak rosną banany, i spróbują owoców prosto z krzaka."], ["16:30", "Ponta do Sol", "Lody i spacer przy oceanie w najbardziej słonecznym zakątku wyspy, w drodze powrotnej."], ["18:00", "Powrót", "Wieczór w hotelu."]],
      tips: ["Levada das 25 Fontes to jedna z najsłynniejszych i najczęściej chodzonych tras na Maderze — dobre buty, woda i przekąski są potrzebne, bo pełne przejście zajmuje 2,5–3 godziny.", "Trasa jest w większości płaska, ale ma wąskie odcinki wzdłuż kanału, miejscami zabezpieczone barierką — idziemy spokojnie i trzymamy dzieci od strony ściany. Levadę do Risco (klify) świadomie pomijamy.", "Do Rabaçal prowadzi wąska droga z ograniczonym parkingiem i wahadłowym busem od góry — w środku dnia bywa tłoczno, więc warto uzbroić się w cierpliwość albo dopytać kierowcę o dojazd.", "Na plateau bywa chłodno i mgliście nawet przy upale na wybrzeżu — warstwy i kurtka przeciwwiatrowa.", "Po zejściu z levady stroje kąpielowe i ręczniki czekają w busie na plażę w Calhecie."],
      planB: "Przy deszczu lub gęstej mgle na plateau rezygnujemy z levady i przenosimy ciężar dnia na wybrzeże: więcej czasu w Calhecie, bananowce i Ponta do Sol.", gentle: "zamiast pełnej levady krótki odcinek od strony Rabaçal, a potem wcześniejszy zjazd na plażę do Calhety.",
      deepDive: {
        context: "Levada das 25 Fontes (szlak PR6) prowadzi przez rezerwat Rabaçal w sercu lasu laurowego (laurisilva) wpisanego na listę UNESCO, do laguny zasilanej dwudziestoma pięcioma źródłami — to jedna z ikon wyspy. Sąsiednia Levada do Risco kończy się przy wodospadzie, ale ma odsłonięte, przepaściste fragmenty, dlatego zostaje poza planem. Calheta poniżej ma jedną z niewielu piaszczystych plaż wyspy (piasek został sprowadzony), a Madalena do Mar to bananowe zagłębie z plantacjami schodzącymi tarasami do oceanu.",
        food: "Po spacerze dobrze smakuje późny lunch przy plaży w Calhecie; na plantacji w Madalena do Mar można spróbować maderskich bananów i przetworów, a w słonecznym Ponta do Sol — lodów i kawy z widokiem na ocean.",
        practical: "Rabaçal ma ograniczony parking i wahadłowy bus dowożący na początek trasy; w sezonie kolejki bywają długie, więc wczesny przyjazd się opłaca. Szlak jest oznakowany, a nawierzchnia po deszczu potrafi być śliska."
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
      id: "2026-08-29", date: "29 sierpnia · sobota", title: "Dzień rezerwowy", short: "Machico, Funchal, Caminho Real na południowym zachodzie albo powrót do ulubionego miejsca.",
      image: commons.machico, alt: "Zatoka i plaża w Machico na Maderze", cats: ["spokojny", "odpoczynek"],
      intensity: "Do wyboru", duration: "3–7 h", transport: "Autobus / taxi / bus", walking: "2–5 km", kids: "Tak, sprawnie chodzą", exposure: "Nisko; Caminho Real dla chętnych",
      center: [32.7163, -16.7653], route: [[32.6384, -16.9353, "Hotel"], [32.6454, -16.9096, "Marina — termin zapasowy rejsu"], [32.7163, -16.7653, "Wariant: Machico"], [32.6496, -16.9080, "Wariant: Funchal"], [32.7472, -17.2258, "Wariant SW: Caminho Real (Paúl do Mar)"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Funchal/Machico",
      agenda: [["08:00", "Śniadanie w hotelu", "Bufet śniadaniowy w hotelu, zwykle 7:30–10:00 (godziny potwierdzić w recepcji)."], ["rano", "Termin zapasowy rejsu", "Jeżeli rejs z 28 sierpnia odwołano z powodu morza, dziś ma pierwszeństwo — o godzinie ustalonej z operatorem."], ["10:30", "Machico", "Plaża i płaska promenada — wariant, jeśli rejs odbył się poprzedniego dnia."], ["10:30", "Funchal", "Ostatnie zakupy, kawiarnia i miejsce pominięte wcześniej."], ["10:30", "Caminho Real do Paúl do Mar", "Wariant SW dla chętnych na historyczną, wykutą w klifie królewską drogę (PR19). Domyślnie bezpiecznie: górny punkt widokowy z Prazeres na zygzak schodzący do morza i widok na Jardim do Mar. Pełny, stromy zjazd ~500 m (ok. 1,5 h) tylko dla chętnych — bus odbiera na dole w Paúl do Mar; osoba z lękiem wysokości i najmłodsze zostają przy górnym punkcie."], ["10:30", "Ulubione miejsce", "Powtórka bez poczucia, że trzeba zobaczyć coś nowego."], ["17:00", "Pakowanie", "Przygotować dokumenty, bagaże i ubrania na powrót."]],
      tips: ["29 sierpnia jest terminem zapasowym rejsu — nie rezerwować na rano innej bezzwrotnej atrakcji.", "Jeśli rejs odbył się wcześniej, planujemy 2–5 km spaceru w Machico albo Funchal; kijki według nawierzchni.", "Caminho Real do Paúl do Mar (PR19) to opcja tylko przy dobrej pogodzie, suchej nawierzchni i chęciach — pełny zjazd jest stromy i miejscami odsłonięty, więc bezpieczną wersją dla wszystkich jest sam górny punkt widokowy. Dojazd na SW to ~1 h w jedną stronę, a bus odbiera schodzących na dole.", "Machico daje aktywny, nisko położony wariant bez górskiej ekspozycji.", "Wieczorem zakończyć pakowanie i potwierdzić transfer."],
      planB: "Hotel i Funchal. Najważniejszym zadaniem dnia jest spokojne przygotowanie powrotu.", gentle: "wybieramy najbliższy, nisko położony wariant (bez pełnego zjazdu Caminho Real) i kończymy dzień wcześnie.",
      deepDive: {
        context: "Machico było pierwszą stolicą Madery po odkryciu wyspy przez João Gonçalvesa Zarco w 1419 roku. Dziś to spokojne miasteczko z częściowo dosypywaną, piaszczystą plażą i płaską nadmorską promenadą. Na przeciwległym, południowo-zachodnim krańcu wyspy dawne caminhos reais — królewskie drogi — łączyły wioski przed powstaniem dzisiejszych dróg; najbardziej znany z nich, Caminho Real do Paúl do Mar, jest wykuty w pionowym klifie.",
        food: "W Machico warto spróbować lokalnej espetady — szaszłyka wołowego z liściem laurowym, tradycyjnie serwowanego na metalowym haku zamiast talerza — to jedna z najbardziej charakterystycznych madeirskich potraw.",
        practical: "Ten dzień celowo nie ma sztywnego planu — to bufor na rejs, pogodę albo zwykłe zmęczenie przed podróżą powrotną, więc żadna z opcji nie wymaga wcześniejszej rezerwacji. Caminho Real do Paúl do Mar (PR19): ~1,8 km i ok. 500 m zejścia z Prazeres do Paúl do Mar — wymagający zjazd, ale można poprzestać na górnym punkcie widokowym; jeśli grupa schodzi na dół, warto z góry umówić odbiór busa w porcie."
      }
    },
    {
      id: "2026-08-30", date: "30 sierpnia · niedziela", title: "Powrót do Łodzi", short: "Hotel, FNC, lot do Berlina, P8 i ostatni odcinek autem.",
      image: commons.funchalBay, alt: "Zatoka Funchal i wybrzeże Madery", cats: ["podróż"],
      intensity: "Logistyczna", duration: "Cały dzień", transport: "Transfer + samolot + auto", walking: "Mało", kids: "Tak, z przerwami", exposure: "Niska",
      center: [32.6942, -16.7745], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6979, -16.7745, "Lotnisko FNC"], [52.3667, 13.5033, "Lotnisko BER"], [52.3664, 13.5071, "Parking P8"], [51.7592, 19.4560, "Łódź"]], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Madeira+Airport",
      agenda: [["rano", "Checklista hotelowa", "Dokumenty, ładowarki, leki, stroje kąpielowe i sejf."], ["07:45", "Śniadanie w hotelu", "Bufet rusza o 7:30 — zjeść przed transferem ok. 8:45; przy bardzo wczesnym wyjeździe dopytać recepcję o pakiet śniadaniowy."], ["08:45*", "Prywatny transfer", "Transfer z madeira-in; godzina odbioru do ostatecznego potwierdzenia po weryfikacji lotu FNC–BER."], ["11:45*", "Lot FNC–BER", "Godzina EJU5334 z wcześniejszych dokumentów — sprawdzić ponownie przed wyjazdem."], ["po lądowaniu", "Samochód z P8", "Zdjęcie sektora i dane rezerwacji ułatwią odbiór."], ["wieczór", "Berlin → Łódź", "Regularne przerwy i zmiana kierowcy, jeśli to możliwe."]],
      tips: ["Nie opierać godziny transferu na niepotwierdzonym rozkładzie.", "Potwierdzić asystę na FNC i BER, jeśli została zamówiona, oraz zaplanować postoje podczas jazdy do Łodzi najpóźniej co 90 minut.", "Przed wymeldowaniem sprawdzić sejf, szafki, łazienkę i gniazdka.", "Zostawić zapas na bagaż i kolejki na lotnisku w Funchal."],
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
  const state = Object.assign({ selected: [], skipped: {}, checklist: {}, calculator: {} }, readState());
  const save = () => localStorage.setItem(stateKey, JSON.stringify(state));
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
  let routeMapInstance = null;
  let overviewMapInstance = null;

  function imageMarkup(day, eager, className) {
    return `<img${className ? ` class="${className}"` : ""} src="${day.image}" alt="${escapeHtml(day.alt)}" ${eager ? "fetchpriority=\"high\"" : "loading=\"lazy\""} decoding="async" onerror="this.parentElement.classList.add('image-fallback');this.remove()">`;
  }

  function renderIndex() {
    const grid = document.querySelector("#day-grid");
    if (!grid) return;
    grid.innerHTML = days.map((day) => `<article class="day-card${state.selected.includes(day.id) ? " is-selected" : ""}" data-day="${day.id}" data-cats="${day.cats.join(" ")}">${imageMarkup(day, false)}<div class="day-card-content"><small>${day.date}</small><h3><a class="day-link" href="days/${day.id}.html">${day.title}</a></h3><p>${day.short}</p><button class="choose-day" type="button" data-select-day="${day.id}" aria-pressed="${state.selected.includes(day.id)}">${state.selected.includes(day.id) ? "✓ Wybrany" : "+ Wybierz dzień"}</button></div></article>`).join("");

    const selectedFilterBtn = document.querySelector('[data-filter="selected"]');
    const clearBtn = document.querySelector("#clear-selection");
    const emptyNote = document.querySelector("#days-empty");
    const activeFilter = () => { const el = document.querySelector("[data-filter].active"); return el ? el.dataset.filter : "all"; };
    const applyFilter = (filter) => {
      let visible = 0;
      grid.querySelectorAll(".day-card").forEach((card) => {
        const show = filter === "all" ? true : filter === "selected" ? state.selected.includes(card.dataset.day) : card.dataset.cats.includes(filter);
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (emptyNote) emptyNote.hidden = visible !== 0;
    };
    const updateSelectionUI = () => {
      const n = state.selected.length;
      if (selectedFilterBtn) selectedFilterBtn.textContent = `★ Wybrane (${n})`;
      if (clearBtn) clearBtn.hidden = n === 0;
    };

    document.querySelectorAll("[data-select-day]").forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.selectDay;
      state.selected = state.selected.includes(id) ? state.selected.filter((item) => item !== id) : state.selected.concat(id);
      save();
      const on = state.selected.includes(id);
      button.setAttribute("aria-pressed", String(on));
      button.textContent = on ? "✓ Wybrany" : "+ Wybierz dzień";
      button.closest(".day-card").classList.toggle("is-selected", on);
      updateSelectionUI();
      if (activeFilter() === "selected") applyFilter("selected");
    }));

    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((item) => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-pressed", String(item === button));
        });
        applyFilter(filter);
      });
    });

    if (clearBtn) clearBtn.addEventListener("click", () => {
      state.selected = [];
      save();
      document.querySelectorAll("[data-select-day]").forEach((b) => {
        b.setAttribute("aria-pressed", "false");
        b.textContent = "+ Wybierz dzień";
        b.closest(".day-card").classList.remove("is-selected");
      });
      updateSelectionUI();
      if (activeFilter() === "selected") applyFilter("selected");
    });

    updateSelectionUI();
    renderHighlights();
    renderGallery();
    setupChecklist();
    renderOverviewLegend();
    setupOverviewMap();
  }

  function setupChecklist() {
    document.querySelectorAll("[data-check]").forEach((input) => {
      input.checked = Boolean(state.checklist[input.dataset.check]);
      input.addEventListener("change", () => { state.checklist[input.dataset.check] = input.checked; save(); });
    });
    const reset = document.querySelector("#reset-plan");
    if (reset) reset.addEventListener("click", () => {
      if (!window.confirm("Zresetować wybrane dni, pominięte punkty i checklistę?")) return;
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
      <header class="hero">${imageMarkup(day, true, "hero-media")}<div class="hero-inner"><p class="eyebrow">${day.date} · dzień ${index + 1} z ${days.length}</p><h1>${day.title}</h1><p class="lead">${day.short}</p><div class="chips"><span class="chip">${day.intensity}</span><span class="chip">${day.transport}</span><span class="chip">${day.walking}</span></div></div></header>
      <main id="main-content">
        <nav class="day-rail" aria-label="Przejdź do innego dnia">${days.map((d, i) => `<a class="day-rail-item${d.id === day.id ? " is-current" : ""}" href="${d.id}.html"${d.id === day.id ? ' aria-current="page"' : ""}><span class="drn">${i + 1}</span><span class="drd">${d.date.split(" · ")[0]}</span></a>`).join("")}</nav>
        <div class="grid">
          <section class="card" aria-labelledby="agenda-title"><div class="card-body"><h2 id="agenda-title">Plan dnia</h2><div class="timeline">${day.agenda.map((slot, slotIndex) => `<article class="slot ${state.skipped[day.id]?.includes(slotIndex) ? "is-skipped" : ""}" data-slot="${slotIndex}"><span class="time">${slot[0]}</span><span class="dot" aria-hidden="true"></span><div><h3>${slot[1]}</h3><p>${slot[2]}</p><button class="skip-item" type="button" data-skip="${slotIndex}">${state.skipped[day.id]?.includes(slotIndex) ? "Przywróć punkt" : "Pomijamy"}</button></div></article>`).join("")}</div></div></section>
          <aside class="card"><div class="card-body"><h2>W skrócie</h2><div class="info">${metrics.map((metric) => `<div class="metric"><strong>${metric[1]}</strong><span>${metric[0]}</span></div>`).join("")}</div><div class="badges"><span class="badge">Dzieci chodzą po górach</span><span class="badge">Spokojne tempo</span><span class="badge">Niska ekspozycja</span>${day.cats.includes("odpoczynek") ? "<span class=\"badge optional\">Elastyczny plan</span>" : ""}${day.cats.includes("wycieczka busem") || day.id === "2026-08-28" ? "<span class=\"badge weather\">Pogoda ma znaczenie</span>" : ""}</div><div class="variant-note"><strong>Wariant łagodniejszy:</strong> ${day.gentle}</div></div></aside>
        </div>
        <section class="section grid" aria-label="Mapa i wskazówki">
          <div class="card"><div class="map-shell"><button class="map-activate" type="button">Aktywuj mapę</button><div class="route-map" id="route-map" role="application" aria-label="Mapa OpenStreetMap z trasą: ${day.title}"></div></div><div class="route-summary"><p><strong>Orientacyjna trasa dnia</strong> — linia łączy główne punkty; dokładny przebieg dróg sprawdź w Google Maps.</p><ol class="route-stop-list">${day.route.map((stop, stopIndex) => `<li><span>${stopIndex + 1}</span>${stop[2]}</li>`).join("")}</ol></div><div class="map-actions"><a class="button" href="${day.google}" target="_blank" rel="noopener">Otwórz trasę w Google Maps ↗</a><button class="button secondary" type="button" data-deactivate-map>Wyłącz mapę</button></div></div>
          <div class="card"><div class="card-body"><h2>Wskazówki praktyczne</h2><ul class="tips">${day.tips.map((tip) => `<li>${tip}</li>`).join("")}</ul></div></div>
        </section>
        <section class="section card deep-dive" aria-labelledby="deep-dive-title"><div class="card-body"><h2 id="deep-dive-title">Więcej o tym dniu</h2><div class="deep-grid"><div><h3>Kontekst i historia</h3><p>${day.deepDive.context}</p></div><div><h3>Jedzenie i lokalne smaki</h3><p>${day.deepDive.food}</p></div><div><h3>Praktyczne detale</h3><p>${day.deepDive.practical}</p></div></div></div></section>
        <section class="section card plan-b"><h2>Plan B</h2><p class="section-copy">${day.planB}</p></section>
        <nav class="nav-days" aria-label="Nawigacja między dniami">${prev ? `<a href="${prev.id}.html">← ${prev.date.split(" · ")[0]}</a>` : "<span></span>"}<a class="home" href="../index.html">Strona główna</a>${next ? `<a class="next" href="${next.id}.html">${next.date.split(" · ")[0]} →</a>` : "<span></span>"}</nav>
        <p class="kbd-hint">Wskazówka: przełączaj dni strzałkami ← → na klawiaturze albo skocz do dowolnego dnia z paska na górze.</p>
        <footer class="footer">Plan rodzinny 19–30 sierpnia 2026. Godziny lotów, rezerwacje, warunki pogodowe i dostępność atrakcji wymagają potwierdzenia przed wyjazdem.</footer>
      </main>`;

    document.querySelectorAll("[data-skip]").forEach((button) => button.addEventListener("click", () => {
      const slotIndex = Number(button.dataset.skip);
      const list = state.skipped[day.id] || [];
      state.skipped[day.id] = list.includes(slotIndex) ? list.filter((item) => item !== slotIndex) : list.concat(slotIndex);
      save();
      button.closest(".slot").classList.toggle("is-skipped", state.skipped[day.id].includes(slotIndex));
      button.textContent = state.skipped[day.id].includes(slotIndex) ? "Przywróć punkt" : "Pomijamy";
    }));
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
      heroImg.addEventListener("click", () => lightbox.open([{ src: day.image, caption: day.alt }], 0));
    }
    const rail = document.querySelector(".day-rail");
    const currentRail = rail && rail.querySelector(".is-current");
    if (rail && currentRail) {
      const itemRect = currentRail.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();
      rail.scrollLeft += (itemRect.left + itemRect.width / 2) - (railRect.left + railRect.width / 2);
    }
    initRouteMap(day);
  }

  function renderPrint() {
    const root = document.querySelector("#print-root");
    if (!root) return;
    const checklistItems = ["Potwierdzone numery i godziny obu lotów", "Rezerwacja, kod wjazdu i sektor P8", "Operator transferu: madeira-in — potwierdzone godziny i miejsce spotkania", "Rejs z terminem zapasowym 29 sierpnia, łatwym wejściem i miejscem siedzącym", "Leki, apteczka podróżna i ewentualna asysta lotniskowa", "Ubezpieczenie i EKUZ", "Dokumenty, leki i ładowarki", "Mapy offline i kontakty alarmowe"];
    root.innerHTML = `
      <header class="print-head">
        <h1>Madera 2026 — plan podróży</h1>
        <p class="print-sub">19–30 sierpnia 2026 · dwie rodziny (4 dorosłych + dzieci 6, 10 i 12 lat) · Hotel Baía Azul, Funchal</p>
        <ul class="print-facts">
          <li><strong>Lot tam:</strong> 20.08, EJU5333 Berlin BER → Funchal, lądowanie 10:55*</li>
          <li><strong>Lot powrotny:</strong> 30.08, EJU5334 Funchal → Berlin BER, 11:45*, odbiór z hotelu ok. 08:45*</li>
          <li><strong>Transfery lotniskowe:</strong> madeira-in (Rui Nóbrega), Mercedes Sprinter, 45 EUR w jedną stronę</li>
          <li><strong>Wycieczki busem:</strong> ad hoc z madeira-in, 220 EUR/dzień — orientacyjnie 22, 24 i 27.08</li>
          <li><strong>Auto:</strong> parking P8 przy BER, 19–30.08</li>
        </ul>
        <p class="print-note">* godziny z wcześniejszych dokumentów — potwierdzić przed wyjazdem</p>
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
    const items = [
      { key: "home", label: "Plan", href: "index.html" },
      { key: "practical", label: "Praktyczne", href: "praktyczne.html" },
      { key: "food", label: "Gdzie zjeść", href: "gdzie-zjesc.html" },
      { key: "print", label: "PDF", href: "print.html" }
    ];
    host.innerHTML = items.map((item) => {
      const current = item.key === page;
      const sectionActive = item.key === "home" && page === "day";
      const highlight = current || sectionActive;
      return `<a class="nav-link${highlight ? " is-current" : ""}" href="${prefix}${item.href}"${current ? ' aria-current="page"' : ""}>${item.label}</a>`;
    }).join("");
  }

  const highlights = [
    { dayId: "2026-08-22", image: commons.picoRuivo, title: "Pico Ruivo — dach wyspy", desc: "Wejście na najwyższy szczyt Madery (1862 m) najłatwiejszą trasą PR1.2 z Achada do Teixeira." },
    { dayId: "2026-08-27", image: commons.fontes, title: "Levada das 25 Fontes", desc: "Spacer wśród lasu laurowego UNESCO do laguny zasilanej dwudziestoma pięcioma źródłami." },
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
        <nav class="guide-nav" aria-label="Nawigacja przewodników">
          <a class="button secondary" href="index.html">← Wróć do planu</a>
          <a class="button" href="praktyczne.html">Informacje praktyczne →</a>
        </nav>
        <footer class="footer">Opisy potraw i miejscowości mają charakter orientacyjny — godziny otwarcia i dostępność dań warto potwierdzić na miejscu.</footer>
      </main>`;
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

  // Galeria — autentyczne zdjęcia miejsc z planu (Wikimedia Commons)
  const BYSA4 = "https://creativecommons.org/licenses/by-sa/4.0";
  const BYSA3 = "https://creativecommons.org/licenses/by-sa/3.0";
  const BY2 = "https://creativecommons.org/licenses/by/2.0";
  const galleryItems = [
    { src: commons.picoRuivo, place: "Pico Ruivo (1862 m)", author: "GerritR", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.fontes, place: "Levada das 25 Fontes · Rabaçal", author: "Asurnipal", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.fanal, place: "Zamglony las Fanal", author: "Dietmar Rabich", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.portoMoniz, place: "Baseny lawowe Porto Moniz", author: "Dietmar Rabich", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.camara, place: "Câmara de Lobos", author: "Dietmar Rabich", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.curral, place: "Curral das Freiras", author: "Diego Delso", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.santana, place: "Domki w Santanie", author: "H. Zell", license: "CC BY-SA 3.0", licenseUrl: BYSA3 },
    { src: commons.pontaDoSol, place: "Ponta do Sol", author: "Paul Mannix", license: "CC BY 2.0", licenseUrl: BY2 },
    { src: commons.funchalBay, place: "Zatoka Funchal", author: "Pedro (Maia, Portugal)", license: "CC BY 2.0", licenseUrl: BY2 },
    { src: commons.funchal, place: "Funchal · stare miasto", author: "Dietmar Rabich", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.lido, place: "Baseny Lido w Funchal", author: "Hein.Mück", license: "CC BY-SA 3.0", licenseUrl: BYSA3 },
    { src: commons.monte, place: "Teleférico na Monte", author: "Dietmar Rabich", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.machico, place: "Machico", author: "Bengt Nyman", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0" },
    { src: commons.dolphin, place: "Delfin u wybrzeży Funchal", author: "Virgílio Gomes", license: "CC BY-SA 4.0", licenseUrl: BYSA4 },
    { src: commons.espetada, place: "Espetada madeirense", author: "Dirk Klaassen", license: "CC BY-SA 4.0", licenseUrl: BYSA4 }
  ];
  const galleryCredit = (it) => `fot. ${it.author} · <a href="${it.licenseUrl}" target="_blank" rel="noopener">${it.license}</a> · Wikimedia Commons`;
  const galleryLightboxItems = () => galleryItems.map((it) => ({ src: it.src, caption: it.place, credit: galleryCredit(it) }));

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

  function renderGallery() {
    const grid = document.querySelector("#gallery-grid");
    if (!grid) return;
    const lbItems = galleryLightboxItems();
    grid.innerHTML = galleryItems.map((it, i) => `<button class="gallery-thumb" type="button" data-index="${i}" aria-label="Powiększ: ${it.place}"><img src="${it.src}" alt="${it.place}, Madera" loading="lazy" decoding="async"><span class="gallery-cap">${it.place}</span></button>`).join("");
    grid.querySelectorAll("[data-index]").forEach((btn) => btn.addEventListener("click", () => lightbox.open(lbItems, Number(btn.dataset.index))));
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
      host.innerHTML = results.map(({ loc, data }) => {
        const cur = data.current, d = data.daily;
        const days6 = d.time.map((t, i) => `<div class="wd"><span class="wd-day">${i === 0 ? "dziś" : plWeekday(t)}</span><span class="wd-ico" title="${wxLabel(d.weather_code[i])}">${wxEmoji(d.weather_code[i])}</span><span class="wd-temp">${Math.round(d.temperature_2m_max[i])}° <em>${Math.round(d.temperature_2m_min[i])}°</em></span><span class="wd-pop">💧 ${d.precipitation_probability_max[i] ?? 0}%</span></div>`).join("");
        return `<article class="weather-card"><header class="weather-head"><h3>${loc.name}</h3><p class="weather-now">${wxEmoji(cur.weather_code)} ${Math.round(cur.temperature_2m)}°C <span>${wxLabel(cur.weather_code)}</span></p></header><div class="weather-days">${days6}</div></article>`;
      }).join("");
    } catch (e) {
      host.innerHTML = '<p class="weather-error">Nie udało się pobrać pogody na żywo. Aktualną prognozę dla Madery znajdziesz w serwisie <a href="https://www.ipma.pt/en/otempo/prev.localidade.hora/" target="_blank" rel="noopener">IPMA</a> albo w ulubionej aplikacji pogodowej.</p>';
    }
  }

  const lightbox = setupLightbox();
  renderTopNav();
  renderIndex();
  renderDay();
  renderPrint();
  renderPractical();
  renderFood();
  renderWeather();
  renderBackToTop();
})();
