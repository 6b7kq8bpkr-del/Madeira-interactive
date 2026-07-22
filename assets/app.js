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

  const TOUR_COLORS = ["#0b7276", "#d9684f", "#e9ad4b", "#246b51"];

  const days = [
    {
      id: "2026-08-19", date: "19 sierpnia · środa", title: "Łódź → Berlin", short: "Spokojny start podróży, P8 i lekki wieczór w Berlinie.",
      image: images.berlin, alt: "Brama Brandenburska w Berlinie o wieczornej porze", cats: ["podróż", "spokojny"],
      intensity: "Łagodna", duration: "6–7 h przejazdu + 2 h", transport: "Samochód", walking: "Spacer 1–3 km", kids: "Tak, sprawnie chodzą", exposure: "Niska", knee: "Orteza; postój co 90 min",
      center: [52.5163, 13.3777], route: [[51.7592, 19.4560, "Łódź"], [52.3664, 13.5071, "Parking P8 BER"], [52.5163, 13.3777, "Brama Brandenburska"]], google: "https://www.google.com/maps/dir/%C5%81%C3%B3d%C5%BA/Berlin+Brandenburg+Airport+P8/Brandenburg+Gate",
      agenda: [["11:00", "Wyjazd z Łodzi", "Start bez pośpiechu; zaplanować regularne postoje dla dzieci."], ["17:00", "Parking P8 przy BER", "Wjazd zgodnie z rezerwacją, zdjęcie miejsca postoju i shuttle lub krótkie przejście do terminala."], ["17:45", "Pociąg do centrum", "FEX albo S-Bahn z dworca pod terminalem BER — do centrum około 30 minut, bez auta i bez szukania parkingu."], ["18:30", "Jeden lekki spacer", "Brama Brandenburska i Reichstag z zewnątrz albo kameralne Nikolaiviertel — bez łączenia wszystkiego."], ["19:30", "Wczesna kolacja", "Proste menu, nawodnienie i powrót pociągiem na nocleg w okolicy BER."]],
      tips: ["Nocleg wybrać blisko BER (najlepiej z własnym shuttle) — auto zostaje na P8, a do centrum i z powrotem jeździ FEX/S-Bahn.", "Przed wyjazdem pobrać mapę offline Berlina i okolic BER.", "Sprawdzić kod wjazdu, numer rezerwacji P8 i sposób transferu do terminala.", "Po drodze robić postoje najpóźniej co 90 minut; po przyjeździe zaplanować jeden spacer 1–3 km w ortezie, bez długiego stania.", "Zostawić bagaże lotnicze łatwo dostępne — nie przepakowywać auta wieczorem."],
      planB: "Jeśli trasa się wydłuży, pomijamy centrum Berlina. Kolacja i spokojny nocleg w okolicy BER są pełnoprawnym planem.", gentle: "spacer traktujemy jako bonus, nie punkt obowiązkowy.",
      deepDive: {
        context: "Trasa Łódź–Berlin to najkrótsza droga do lotniska BER bez nocnego pośpiechu. Berlin bywa tu tylko przystankiem, ale Brama Brandenburska i kameralne Nikolaiviertel dają poczucie stolicy nawet przy krótkim, wieczornym spacerze.",
        food: "Na szybki obiad po drodze sprawdzają się przydrożne Autohof z prostą niemiecką kuchnią; wieczorem w Berlinie warto zjeść coś lekkiego z piekarni albo klasyczne curry-wurst zamiast szukać restauracji na godziny.",
        practical: "Parking P8 przy BER to długoterminowy parking peryferyjny z bezpłatnym shuttle busem do terminala. Kod wjazdu i numer rezerwacji warto mieć zapisane offline — zasięg w garażu bywa słaby."
      }
    },
    {
      id: "2026-08-20", date: "20 sierpnia · czwartek", title: "Berlin BER → Funchal", short: "Lot, prywatny transfer, Hotel Baía Azul i pierwsze spotkanie z oceanem.",
      image: images.funchal, alt: "Panorama Funchal i Oceanu Atlantyckiego na Maderze", cats: ["podróż", "spokojny"],
      intensity: "Łagodna", duration: "Dzień logistyczny", transport: "Samolot + transfer", walking: "Mało", kids: "Tak", exposure: "Niska", knee: "Rozważyć asystę lotniskową",
      center: [32.6387, -16.9304], route: [[52.3667, 13.5033, "Lotnisko BER"], [32.6979, -16.7745, "Lotnisko FNC"], [32.6384, -16.9353, "Hotel Baía Azul"], [32.6386, -16.9332, "Lido"]], google: "https://www.google.com/maps/dir/Madeira+Airport/Hotel+Baia+Azul,+Funchal/Lido+Bathing+Complex",
      agenda: [["rano", "Spokojny dojazd na BER", "Odprawa z zapasem i bez dodatkowego programu."], ["10:55*", "Lądowanie w Funchal", "Lot EJU5333 i godzina 10:55 są do ponownego potwierdzenia przed wylotem."], ["12:00", "Prywatny transfer", "Transfer z madeira-in; po odbiorze bagażu kontakt z kierowcą i przejazd do Hotelu Baía Azul."], ["14:00", "Obiad i odpoczynek", "Lekki posiłek, zameldowanie i basen."], ["17:00", "Lido lub promenada", "Krótki spacer tylko jeśli grupa ma energię."]],
      tips: ["Numer lotu i godziny sprawdzić ponownie w aplikacji przewoźnika.", "Jeśli dłuższe przejścia lub kolejki obciążają kolano, zamówić z wyprzedzeniem bezpłatną asystę lotniskową i potwierdzić ją z przewoźnikiem.", "Przy rezerwacji z madeira-in nie zamawiać fotelików ani podkładek; potwierdzić liczbę osób, bagaże i miejsce spotkania.", "Mieć pod ręką numer kierowcy i potwierdzenie transferu.", "Pierwszego dnia nie planować zakupów ani dalszych dojazdów."],
      planB: "Przy opóźnieniu lotu rezygnujemy z Lido. Hotel, posiłek i sen są jedynymi priorytetami.", gentle: "po transferze cały program odbywa się w hotelu.",
      deepDive: {
        context: "Lot z Berlina na Maderę trwa około 4,5 godziny. Madera leży geograficznie bliżej Maroka niż kontynentalnej Portugalii, więc odmienny, łagodniejszy klimat jest odczuwalny już na płycie lotniska.",
        food: "Pierwszego dnia najlepiej sprawdza się coś lekkiego w hotelu albo w prostej kawiarni przy Lido. Na poncha, espetadę i bolo do caco przyjdzie czas w kolejnych dniach, gdy zmęczenie podróżą minie.",
        practical: "Lotnisko Cristiano Ronaldo Madeira (FNC) ma krótki pas częściowo wybudowany na filarach nad oceanem. Odbiór bagażu bywa wolniejszy niż w Berlinie, więc warto z góry poinformować kierowcę transferu o buforze czasowym."
      }
    },
    {
      id: "2026-08-21", date: "21 sierpnia · piątek", title: "Funchal i CR7", short: "Marina, muzeum, stare miasto i dużo miejsca na odpoczynek.",
      image: images.funchal, alt: "Funchal widziane od strony oceanu", cats: ["aktywny", "spokojny"],
      intensity: "Umiarkowana", duration: "4–5 h", transport: "Autobus / taxi", walking: "2–4 km", kids: "Tak, sprawnie chodzą", exposure: "Niska", knee: "Orteza; przerwy co 45–60 min",
      center: [32.648, -16.913], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6443, -16.9148, "Muzeum CR7"], [32.6454, -16.9096, "Marina"], [32.6484, -16.9033, "Stare miasto"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/CR7+Museum/Funchal+Marina/Mercado+dos+Lavradores",
      agenda: [["09:30", "Centrum i marina", "Spokojny start przy nabrzeżu i widok na port."], ["10:30", "Muzeum CR7", "Krótka, konkretna atrakcja; bilety sprawdzić przed wyjściem."], ["12:00", "Stare miasto", "Rua de Santa Maria i lunch w wygodnym miejscu."], ["15:00", "Hotel, basen lub Lido", "Reszta dnia bez sztywnego harmonogramu."]],
      tips: ["Trasa 2–4 km przez marinę, CR7 i wybrany fragment starego miasta jest planem podstawowym.", "Orteza na cały spacer; przerwa na siedząco co 45–60 minut, a taxi dopiero jeśli kolano wyraźnie daje znać.", "Kapelusze, woda i przerwa w cieniu w południe.", "Sprawdzić aktualne godziny otwarcia muzeum CR7."],
      planB: "Przy upale lub zmęczeniu: tylko marina i CR7, a lunch oraz popołudnie w hotelu.", gentle: "poruszamy się taxi między hotelem, CR7 i starym miastem.",
      deepDive: {
        context: "Funchal jest stolicą Madery od XV wieku; nazwa nawiązuje do dziko rosnącego tu niegdyś koperku. Stare miasto wokół Rua de Santa Maria znane jest z pomalowanych drzwi — lokalnego projektu artystycznego, który ożywił dawną, zaniedbaną dzielnicę portową.",
        food: "Mercado dos Lavradores przy starym mieście to dobre miejsce na świeże owoce tropikalne i rybę espada; w mieście warto spróbować bolo do caco z masłem czosnkowym jako lekkiej przekąski między atrakcjami.",
        practical: "Muzeum CR7, poświęcone urodzonemu w Funchal Cristianowi Ronaldo, ma osobny cennik biletów i bywa zamykane w niektóre dni poza sezonem — aktualne godziny warto sprawdzić dzień wcześniej."
      }
    },
    {
      id: "2026-08-22", date: "22 sierpnia · sobota", title: "Wschód Madery", short: "Arieiro o poranku, levada na Balcões, Santana i wybrzeże.",
      image: images.arieiro, alt: "Górski krajobraz Pico do Arieiro ponad chmurami", cats: ["aktywny", "wycieczka busem"],
      intensity: "Aktywna", duration: "09:30–17:30", transport: "Prywatny bus", walking: "Balcões + okolice, 2–3 km", kids: "Tak, dobrze chodzą po górach", exposure: "Niska / kontrolowana", knee: "Orteza i kijki na Balcões",
      center: [32.735, -16.886], route: [[32.6384, -16.9353, "Hotel"], [32.7356, -16.9280, "Pico do Arieiro"], [32.7353, -16.8865, "Ribeiro Frio"], [32.7419, -16.8905, "Balcões"], [32.8036, -16.8819, "Santana"], [32.7163, -16.7653, "Machico / Porto da Cruz"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Pico+do+Arieiro/Ribeiro+Frio/Balc%C3%B5es/Santana,+Madeira",
      agenda: [["09:30", "Start z hotelu", "Mercedes Sprinter madeira-in; nie zamawiamy fotelików ani podkładek."], ["10:15", "Pico do Arieiro", "Rano szansa na czyste widoki jest największa — chmury zwykle narastają w ciągu dnia. Punkt widokowy i krótki spacer w komfortowym obszarze; bez trasy na Pico Ruivo."], ["11:45", "Ribeiro Frio i Balcões", "Łatwa levada do tarasu Balcões (ok. 1,5 km w obie strony) plus spacer po okolicy. Osoba z kolanem idzie w ortezie i z kijkami, w spokojnym tempie, z możliwością zawrócenia."], ["13:30", "Santana i lunch", "Domki, odpoczynek i spokojny posiłek."], ["15:30", "Porto da Cruz lub Machico", "Jeden dodatkowy przystanek zależnie od czasu i pogody."], ["17:30", "Powrót", "Wieczór bez dodatkowego programu."]],
      tips: ["W górach temperatura może być znacznie niższa niż w Funchal — zabrać warstwy i kurtki.", "Lunch wypada dopiero w Santanie około 13:30 — spakować drugie śniadanie i przekąski dla dzieci do busa.", "Balcões jest domyślnym spacerem dnia: kijki pomagają na nierównych fragmentach, a dzieci mogą iść pełną trasę.", "Na Arieiro wybierać miejsca oddalone od krawędzi ze względu na lęk wysokości, nie ze względu na kondycję grupy.", "Pełna trasa Arieiro–Ruivo nie jest częścią planu."],
      planB: "Przy chmurach na Arieiro rano odwracamy kolejność: najpierw Ribeiro Frio i Balcões, a punkt górski próbujemy po południu albo pomijamy.", gentle: "Arieiro tylko wtedy, gdy widoczność i komfort całej grupy są dobre.",
      deepDive: {
        context: "Ribeiro Frio to dawna stacja hodowli pstrąga w sercu lasu laurowego (laurisilva), wpisanego na listę UNESCO. Balcões to jeden z najłatwiej dostępnych punktów widokowych na szczyty centralnej Madery, a Pico do Arieiro — trzeci najwyższy szczyt wyspy (ok. 1818 m) — to jedno z niewielu miejsc, gdzie asfaltowa droga prowadzi niemal pod sam punkt widokowy.",
        food: "W Ribeiro Frio warto spróbować świeżego pstrąga z lokalnej hodowli; w Santanie tradycyjne trójkątne domki 'palheiros' sąsiadują z kawiarniami serwującymi bolo de mel i lokalny miód.",
        practical: "Na Arieiro bywa znacznie chłodniej i bardziej wietrznie niż w Funchal, a mgła potrafi ograniczyć widoczność w kilka minut — warstwowe ubranie i kurtka przeciwwiatrowa przydają się tu bardziej niż na wybrzeżu."
      }
    },
    {
      id: "2026-08-23", date: "23 sierpnia · niedziela", title: "Dzień bez zegarka", short: "Hotel Baía Azul, basen, Lido i pełna regeneracja.",
      image: images.lido, alt: "Baseny oceaniczne przy wybrzeżu Funchal", cats: ["odpoczynek", "spokojny"],
      intensity: "Bardzo łagodna", duration: "Dowolnie", transport: "Pieszo / taxi", walking: "Tylko według samopoczucia", kids: "Idealny", exposure: "Niska", knee: "Dzień regeneracyjny",
      center: [32.6386, -16.9332], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6386, -16.9332, "Lido"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/search/?api=1&query=Lido+Bathing+Complex+Funchal",
      agenda: [["rano", "Śniadanie bez budzika", "Każda rodzina wybiera własne tempo."], ["11:00", "Basen lub Lido", "Krótki blok wodny z ochroną przeciwsłoneczną."], ["14:00", "Lunch i cisza", "Drzemka, książka lub czas w pokoju."], ["wieczór", "Promenada", "Tylko jeśli wszyscy mają ochotę."]],
      tips: ["Nie zamieniać dnia odpoczynku w nadrabianie atrakcji.", "Przy Lido sprawdzić warunki oceanu i komunikaty ratowników.", "Uzupełnić wodę, przekąski i drobiazgi na kolejną wycieczkę."],
      planB: "To już jest plan awaryjny: hotel, gry, spokojny posiłek i zero dojazdów.", gentle: "pozostajemy przy basenie hotelowym.",
      deepDive: {
        context: "Complexo Balnear do Lido to największy kompleks basenów oceanicznych w Funchal, częściowo wykuty w skalistym wybrzeżu. To popularne miejsce zarówno wśród turystów, jak i mieszkańców szukających kąpieli tam, gdzie wyspa nie ma naturalnej piaszczystej plaży.",
        food: "Dzień bez planu to dobra okazja na dłuższy lunch w hotelu albo w pobliskiej knajpce z widokiem na ocean — bez pośpiechu i bez wcześniejszej rezerwacji.",
        practical: "Warunki morza przy Lido bywają zmienne z dnia na dzień; flagi i komunikaty ratowników na miejscu są zawsze bardziej aktualne niż jakakolwiek prognoza sprzed wyjścia z hotelu."
      }
    },
    {
      id: "2026-08-24", date: "24 sierpnia · poniedziałek", title: "Zachód Madery", short: "Wioski, czarne wybrzeże, Porto Moniz i opcjonalny Fanal.",
      image: images.porto, alt: "Naturalne baseny lawowe Porto Moniz na Maderze", cats: ["aktywny", "wycieczka busem"],
      intensity: "Pełna", duration: "09:30–17:30", transport: "Prywatny bus", walking: "Łącznie 3–5 km", kids: "Tak, sprawnie chodzą", exposure: "Niska; Cabo opcjonalne", knee: "Orteza i kijki; Fanal przy suchej trasie",
      center: [32.8663, -17.1667], route: [[32.6384, -16.9353, "Hotel"], [32.6496, -16.9769, "Câmara de Lobos"], [32.6747, -17.0633, "Ribeira Brava"], [32.8126, -17.1038, "Seixal"], [32.8663, -17.1667, "Porto Moniz"], [32.8097, -17.1436, "Fanal — opcjonalnie"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/C%C3%A2mara+de+Lobos/Ribeira+Brava/Seixal,+Madeira/Porto+Moniz",
      agenda: [["09:30", "Câmara de Lobos", "Krótki spacer przy porcie i rodzinne zdjęcie."], ["11:00", "Ribeira Brava", "Kawa, toaleta i przerwa przed północnym wybrzeżem."], ["12:15", "Seixal", "Plaża lub punkt przy miejscowości — bez ryzykownego schodzenia."], ["13:30", "Porto Moniz", "Lunch i obserwacja basenów; kąpiel tylko przy dobrych warunkach."], ["15:30", "Fanal opcjonalnie", "Tylko gdy pogoda jest dobra, a grupa nadal ma energię."], ["17:30", "Powrót do hotelu", "Cabo Girão nie jest punktem obowiązkowym."]],
      tips: ["To długi dzień, ale plan zakłada spacery w miejscowościach i przy wybrzeżu — łącznie około 3–5 km.", "Zabrać rano stroje kąpielowe i ręczniki oraz przekąski dla dzieci — lunch wypada w Porto Moniz około 13:30, a decyzja o kąpieli zapada na miejscu.", "Fanal jest możliwy przy suchej nawierzchni i dobrej energii; osoba z kolanem używa ortezy i kijków, bez forsowania tempa.", "Cabo Girão traktować wyłącznie jako propozycję dla chętnych ze względu na wysokość.", "Kąpiel w Porto Moniz zależy od fal, komunikatów i czasu."],
      planB: "Przy złej pogodzie na północy zostajemy dłużej w Câmara de Lobos i Ribeira Brava, potem wracamy południowym wybrzeżem.", gentle: "bez Cabo Girão i bez postojów wymagających podejścia do krawędzi.",
      deepDive: {
        context: "Câmara de Lobos, dawna wioska rybacka, zasłynęła dzięki Winstonowi Churchillowi, który malował tu w latach 50. XX wieku; to również miejsce narodzin poncha, tradycyjnego madeirskiego drinka z trzciny cukrowej. Porto Moniz słynie z naturalnych basenów lawowych uformowanych przez wulkaniczne skały i ocean, a Fanal to fragment pierwotnego lasu laurowego, znany z charakterystycznej mgły i sędziwych drzew ostrokrzewu.",
        food: "W Câmara de Lobos warto spróbować poncha na miejscu jego powstania; w Porto Moniz popularna jest świeża ryba z grilla serwowana tuż przy basenach, z widokiem na ocean.",
        practical: "Baseny w Porto Moniz bywają zamykane przy dużym falowaniu — decyzję podejmuje obsługa na miejscu. Fanal bywa spowity mgłą nawet w słoneczny dzień na wybrzeżu, co jest częścią jego charakteru, a nie usterką pogody."
      }
    },
    {
      id: "2026-08-25", date: "25 sierpnia · wtorek", title: "Funchal po swojemu", short: "Ogród, zakupy albo Monte — z pełnym wariantem bez kolejki.",
      image: images.funchal, alt: "Zielone ogrody i zabudowa Funchal", cats: ["spokojny", "odpoczynek"],
      intensity: "Umiarkowana", duration: "4–6 h", transport: "Autobus / taxi", walking: "3–5 km", kids: "Tak, sprawnie chodzą", exposure: "Wariant bez wysokości", knee: "Orteza; kijki do ogrodu",
      center: [32.662, -16.895], route: [[32.6384, -16.9353, "Hotel"], [32.6624, -16.8946, "Ogród botaniczny"], [32.6496, -16.9080, "Centrum Funchal"], [32.6750, -16.9022, "Monte — opcjonalnie"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Madeira+Botanical+Garden/Funchal",
      agenda: [["10:00", "Wybór wariantu", "Ogród botaniczny albo centrum, zakupy i spokojna kawiarnia."], ["12:30", "Lunch", "Bez rezerwowania kolejnych atrakcji na siłę."], ["14:30", "Monte tylko dla chętnych", "Kolejka i wysokość są całkowicie opcjonalne."], ["16:00", "Hotel", "Basen i spokojna kolacja."]],
      tips: ["Plan podstawowy to ogród botaniczny i centrum: 3–5 km z przerwami, w ortezie, z kijkami na pochyłych alejkach.", "Wariant bez kolejki pozostaje pełnym programem — wysokość jest kwestią komfortu, nie kondycji dzieci.", "Rodziny mogą rozdzielić się na 2–3 godziny i spotkać na lunchu.", "Sprawdzić godziny ogrodu i temperaturę przed wyjazdem."],
      planB: "Cały dzień w hotelu i przy Lido; zakupy można zrobić wieczorem w najbliższej okolicy.", gentle: "bez kolejki i bez Monte; wybieramy ogród dostępny taxi albo centrum.",
      deepDive: {
        context: "Ogród botaniczny w Funchal założono w połowie XX wieku na terenie dawnej posiadłości rodziny Reid. Monte to historyczna dzielnica nad miastem, znana z bazyliki Nossa Senhora do Monte oraz tradycyjnych wiklinowych sań ('carros de cesto'), którymi dawniej zjeżdżano z góry do centrum.",
        food: "W okolicy ogrodu botanicznego i Monte warto spróbować lokalnych ciast z owocami tropikalnymi (np. z maracują); w centrum Funchal dobrym wyborem na lekki lunch są niewielkie tasquinhas z domową kuchnią.",
        practical: "Wjazd do ogrodu botanicznego jest płatny, a kolejka linowa na Monte bywa oblegana w środku dnia — jeśli ktoś zdecyduje się na ten wariant, lepiej wybrać wcześniejsze albo późniejsze godziny."
      }
    },
    {
      id: "2026-08-26", date: "26 sierpnia · środa", title: "Curral das Freiras", short: "Pół dnia w Dolinie Zakonnic, spokojne widoki i lunch.",
      image: images.camara, alt: "Górskie doliny i miejscowości w centralnej Maderze", cats: ["aktywny", "spokojny"],
      intensity: "Umiarkowana", duration: "5–6 h", transport: "Taxi / wycieczka", walking: "2–4 km", kids: "Tak, sprawnie chodzą", exposure: "Kontrolowana", knee: "Krótkie podejście w ortezie i z kijkami",
      center: [32.7202, -16.9691], route: [[32.6384, -16.9353, "Hotel"], [32.7107, -16.9615, "Eira do Serrado"], [32.7202, -16.9691, "Curral das Freiras"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Funchal/Eira+do+Serrado/Curral+das+Freiras",
      agenda: [["09:30", "Wyjazd z Funchal", "Trasa w głąb wyspy i spokojne rozpoczęcie aktywnego pół dnia."], ["10:15", "Eira do Serrado", "Krótkie podejście do komfortowego punktu widokowego; orteza, kijki i przerwy według potrzeby."], ["11:45", "Curral das Freiras", "Spacer 2–3 km po miejscowości i spokojny lunch."], ["15:00", "Powrót do hotelu", "Popołudnie na basenie lub krótka promenada."]],
      tips: ["Podejście do punktu widokowego jest częścią planu, jeśli nawierzchnia jest sucha i kolano nie boli; zawrócenie pozostaje prostą opcją.", "Nie trzeba podchodzić do barierek, aby zobaczyć dolinę.", "W razie choroby lokomocyjnej usiąść z przodu i przygotować wodę.", "Dzieci mogą przejść pełny spacer; dorosły z kolanem reguluje tempo."] ,
      planB: "Zamiana na ogród w Funchal, Lido lub dzień hotelowy — szczególnie przy niskich chmurach w dolinie.", gentle: "pomijamy każdy punkt, który powoduje dyskomfort; sama miejscowość i lunch wystarczą.",
      deepDive: {
        context: "Curral das Freiras (Dolina Zakonnic) zawdzięcza nazwę zakonnicom, które według legendy schroniły się tu przed piratami w XVI wieku. Miejscowość leży w głębokim kraterze otoczonym szczytami centralnej Madery, przez długi czas dostępnym praktycznie tylko pieszo.",
        food: "Lokalna specjalność to kasztany (castanhas) pod różnymi postaciami — od zupy po likier 'licor de castanha' — oraz domowe ciasto orzechowe 'bolo de nozes', które najlepiej smakuje na miejscu.",
        practical: "Punkt widokowy Eira do Serrado bywa zatłoczony w środku dnia z powodu wycieczek autokarowych; wcześniejszy przyjazd daje spokojniejszy widok na dolinę i lepsze warunki do zdjęć."
      }
    },
    {
      id: "2026-08-27", date: "27 sierpnia · czwartek", title: "Calheta i południowy zachód", short: "Piaszczysta plaża, Engenhos i słoneczne Ponta do Sol.",
      image: images.beach, alt: "Spokojne wybrzeże południowo-zachodniej Madery", cats: ["wycieczka busem", "spokojny"],
      intensity: "Umiarkowana", duration: "09:30–17:00", transport: "Prywatny bus", walking: "2–4 km", kids: "Bardzo dobry", exposure: "Niska", knee: "Orteza; kijki w Jardim do Mar",
      center: [32.7219, -17.1775], route: [[32.6384, -16.9353, "Hotel"], [32.7219, -17.1775, "Plaża Calheta"], [32.7223, -17.1785, "Engenhos da Calheta"], [32.7370, -17.2115, "Jardim do Mar — opcjonalnie"], [32.6819, -17.1045, "Ponta do Sol"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Calheta+Beach/Engenhos+da+Calheta/Jardim+do+Mar/Ponta+do+Sol",
      agenda: [["09:30", "Wyjazd z hotelu", "Trzeci dzień madeira-in w spokojnym rytmie."], ["10:30", "Calheta", "Piaszczysta plaża i czas rodzinny bez pośpiechu."], ["12:45", "Lunch przy plaży", "Posiłek jeszcze w Calhecie, o normalnej porze dla dzieci — bez przesuwania na późne popołudnie."], ["14:00", "Engenhos da Calheta", "Krótka wizyta zależna od godzin otwarcia."], ["15:00", "Jardim do Mar opcjonalnie", "Leży tuż za Calhetą, więc wypada teraz — tylko jeśli grupa ma energię."], ["16:00", "Ponta do Sol", "Lody i spacer przy oceanie w drodze powrotnej do Funchal."], ["17:00", "Powrót", "Bez dokładania Rabaçal ani Risco."]],
      tips: ["Kolejność jedzie wzdłuż wybrzeża: najdalej Calheta i Jardim do Mar, a Ponta do Sol na deser w drodze powrotnej — bez cofania się.", "Rabaçal i Risco nie są domyślną rekomendacją dla tej grupy — zgodnie z sugestią madeira-in, a nie z powodu niskiej kondycji dzieci.", "Według korespondencji madeira-in Risco nie jest dobrym wyborem przy problemie z klifami.", "Calheta i Ponta do Sol dają 2–4 km spacerów; Jardim do Mar można dodać z kijkami, jeśli kolano jest spokojne.", "Sprawdzić godziny Engenhos i zabrać rzeczy plażowe."],
      planB: "Przy gorszej pogodzie: dłuższy lunch w Ponta do Sol, krótka Calheta i wcześniejszy powrót.", gentle: "wyłącznie Calheta i Ponta do Sol; żadnych tras przy klifach.",
      deepDive: {
        context: "Plaża w Calheta to jedna z niewielu piaszczystych plaż na Maderze — piasek został tu sprowadzony, bo wyspa ma głównie wybrzeże wulkaniczne i kamieniste. Engenhos da Calheta to dawna gorzelnia trzciny cukrowej, wciąż produkująca lokalny rum i miód trzcinowy.",
        food: "W Engenhos da Calheta można zobaczyć tradycyjny proces produkcji i spróbować rumu oraz mel de cana (melasy trzcinowej); w Ponta do Sol, znanej z najbardziej słonecznego mikroklimatu na wyspie, warto usiąść w kawiarni z widokiem na ocean.",
        practical: "Plaża w Calheta ma strzeżoną strefę kąpieli i zaplecze (prysznice, toalety, parking) — to jedno z wygodniejszych miejsc na dłuższy, rodzinny pobyt nad wodą."
      }
    },
    {
      id: "2026-08-28", date: "28 sierpnia · piątek", title: "Rejs: delfiny i wieloryby", short: "Główny punkt dnia: rodzinny rejs obserwacyjny z odpoczynkiem po powrocie.",
      image: images.lido, alt: "Ocean Atlantycki przy wybrzeżu Funchal, gdzie odbywają się rejsy obserwacyjne", cats: ["aktywny", "spokojny"],
      intensity: "Łagodna", duration: "Rejs 2–3 h + odpoczynek", transport: "Taxi + stabilna łódź", walking: "Minimum", kids: "Tak, po potwierdzeniu wieku", exposure: "Zależna od morza", knee: "Łatwe wejście, miejsce siedzące i toaleta",
      center: [32.6386, -16.9332], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6454, -16.9096, "Marina w Funchal"], [32.6200, -17.0300, "Obszar obserwacji na oceanie"], [32.6454, -16.9096, "Powrót do mariny"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Funchal+Marina",
      agenda: [["08:30", "Spokojne śniadanie", "Lekki posiłek, nawodnienie i przygotowanie zgodnie z zaleceniami operatora."], ["09:30", "Taxi do mariny", "Bez długiego dojścia; przybycie z zapasem na spokojne wejście na pokład."], ["10:30", "Rejs na delfiny i wieloryby", "Zaplanowany główny punkt dnia. Wybieramy stabilniejszą jednostkę z siedzeniami, cieniem, toaletą i możliwie łatwym wejściem."], ["14:00", "Lekki lunch i odpoczynek", "Po rejsie wracamy do hotelu; bez dokładania kolejnej atrakcji."], ["wieczór", "Wspólna kolacja", "Spokojne zakończenie dnia."]],
      tips: ["Zarezerwować rejs z możliwością bezpłatnej zmiany na 29 sierpnia przy złym stanie morza.", "Przed rezerwacją opisać operatorowi problem z kolanem i potwierdzić sposób wejścia, stabilne siedzenie, toaletę oraz pomoc załogi.", "Na wodzie wieje i mocno operuje słońce — kurtki przeciwwiatrowe, nakrycia głowy i krem są potrzebne nawet przy upale w mieście.", "Rejs jest zaplanowany, ale wypłynięcie zależy od decyzji operatora i bezpiecznych warunków; obserwacji zwierząt nie da się zagwarantować.", "Przy chorobie morskiej wcześniej ustalić bezpieczne postępowanie z lekarzem lub farmaceutą."],
      planB: "Jeśli operator odwoła rejs z powodu morza, przenosimy go na 29 sierpnia. Tego dnia zostają basen, Lido i odpoczynek; bezpieczeństwo ma pierwszeństwo przed wypłynięciem.", gentle: "rejs pozostaje w planie, ale wybieramy stabilną jednostkę, taxi pod marinę, miejsce siedzące i pomoc przy wejściu.",
      deepDive: {
        context: "Wody wokół Madery leżą blisko brzegu nad głębokim szelfem oceanicznym, co sprzyja obserwacji waleni przez cały rok. Najczęściej spotykane są delfiny butlonose i zwyczajne oraz oresy krótkopłetwe; sezonowo pojawiają się też większe gatunki wielorybów.",
        food: "Przed rejsem lepiej sprawdza się lekki, niskotłuszczowy posiłek niż ciężkie śniadanie; na statku zwykle dostępna jest woda, czasem lekka przekąska — warto dopytać operatora przy rezerwacji.",
        practical: "Operatorzy rejsów obserwacyjnych w Funchal zwykle oferują gwarancję ponownego wyjścia lub zwrot, jeśli zwierzęta nie zostaną zaobserwowane — warto to potwierdzić od razu, razem z warunkami dla osoby z ograniczoną mobilnością."
      }
    },
    {
      id: "2026-08-29", date: "29 sierpnia · sobota", title: "Dzień rezerwowy", short: "Machico, Funchal, plaża albo powrót do ulubionego miejsca.",
      image: images.coast, alt: "Miasteczko i wybrzeże Madery nad Atlantykiem", cats: ["spokojny", "odpoczynek"],
      intensity: "Do wyboru", duration: "3–7 h", transport: "Autobus / taxi", walking: "2–5 km", kids: "Tak, sprawnie chodzą", exposure: "Wariant nisko położony", knee: "Orteza; aktywny wariant nisko położony",
      center: [32.7163, -16.7653], route: [[32.6384, -16.9353, "Hotel"], [32.6454, -16.9096, "Marina — termin zapasowy rejsu"], [32.7163, -16.7653, "Wariant: Machico"], [32.6496, -16.9080, "Wariant: Funchal"], [32.6384, -16.9353, "Hotel"]], google: "https://www.google.com/maps/dir/Funchal/Machico",
      agenda: [["09:00", "Najpierw termin zapasowy rejsu", "Jeżeli rejs 28 sierpnia odwołano z powodu morza, dziś ma pierwszeństwo przed pozostałymi wariantami."], ["10:30", "Machico", "Plaża i płaska promenada — wariant, jeśli rejs odbył się poprzedniego dnia."], ["10:30", "Funchal", "Ostatnie zakupy, kawiarnia i miejsce pominięte wcześniej."], ["10:30", "Ulubione miejsce", "Powtórka bez poczucia, że trzeba zobaczyć coś nowego."], ["17:00", "Pakowanie", "Przygotować dokumenty, bagaże i ubrania na powrót."]],
      tips: ["29 sierpnia jest terminem zapasowym rejsu — nie rezerwować na rano innej bezzwrotnej atrakcji.", "Jeśli rejs odbył się wcześniej, planujemy 2–5 km spaceru w Machico albo Funchal; orteza i kijki według nawierzchni.", "Machico daje aktywny, nisko położony wariant bez górskiej ekspozycji.", "Wieczorem zakończyć pakowanie i potwierdzić transfer."],
      planB: "Hotel i Funchal. Najważniejszym zadaniem dnia jest spokojne przygotowanie powrotu.", gentle: "wybieramy najbliższy, nisko położony wariant i kończymy dzień wcześnie.",
      deepDive: {
        context: "Machico było pierwszą stolicą Madery po odkryciu wyspy przez João Gonçalvesa Zarco w 1419 roku. Dziś to spokojne miasteczko z częściowo dosypywaną, piaszczystą plażą i płaską nadmorską promenadą.",
        food: "W Machico warto spróbować lokalnej espetady — szaszłyka wołowego z liściem laurowym, tradycyjnie serwowanego na metalowym haku zamiast talerza — to jedna z najbardziej charakterystycznych madeirskich potraw.",
        practical: "Ten dzień celowo nie ma sztywnego planu — to bufor na rejs, pogodę albo zwykłe zmęczenie przed podróżą powrotną, więc żadna z opcji nie wymaga wcześniejszej rezerwacji."
      }
    },
    {
      id: "2026-08-30", date: "30 sierpnia · niedziela", title: "Powrót do Łodzi", short: "Hotel, FNC, lot do Berlina, P8 i ostatni odcinek autem.",
      image: images.funchal, alt: "Funchal i wybrzeże Madery widziane z góry", cats: ["podróż"],
      intensity: "Logistyczna", duration: "Cały dzień", transport: "Transfer + samolot + auto", walking: "Mało", kids: "Tak, z przerwami", exposure: "Niska", knee: "Asysta lotniskowa i postoje co 90 min",
      center: [32.6942, -16.7745], route: [[32.6384, -16.9353, "Hotel Baía Azul"], [32.6979, -16.7745, "Lotnisko FNC"], [52.3667, 13.5033, "Lotnisko BER"], [52.3664, 13.5071, "Parking P8"], [51.7592, 19.4560, "Łódź"]], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Madeira+Airport",
      agenda: [["rano", "Checklista hotelowa", "Dokumenty, ładowarki, leki, stroje kąpielowe i sejf."], ["08:45*", "Prywatny transfer", "Transfer z madeira-in; godzina odbioru do ostatecznego potwierdzenia po weryfikacji lotu FNC–BER."], ["11:45*", "Lot FNC–BER", "Godzina EJU5334 z wcześniejszych dokumentów — sprawdzić ponownie przed wyjazdem."], ["po lądowaniu", "Samochód z P8", "Zdjęcie sektora i dane rezerwacji ułatwią odbiór."], ["wieczór", "Berlin → Łódź", "Regularne przerwy i zmiana kierowcy, jeśli to możliwe."]],
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
    grid.innerHTML = days.map((day) => `<article class="day-card" data-cats="${day.cats.join(" ")}">${imageMarkup(day, false)}<div class="day-card-content"><small>${day.date}</small><h3><a class="day-link" href="days/${day.id}.html">${day.title}</a></h3><p>${day.short}</p><button class="choose-day" type="button" data-select-day="${day.id}" aria-pressed="${state.selected.includes(day.id)}">${state.selected.includes(day.id) ? "✓ Wybrany" : "+ Wybierz dzień"}</button></div></article>`).join("");

    document.querySelectorAll("[data-select-day]").forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.selectDay;
      state.selected = state.selected.includes(id) ? state.selected.filter((item) => item !== id) : state.selected.concat(id);
      save();
      button.setAttribute("aria-pressed", String(state.selected.includes(id)));
      button.textContent = state.selected.includes(id) ? "✓ Wybrany" : "+ Wybierz dzień";
    }));

    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((item) => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-pressed", String(item === button));
        });
        grid.querySelectorAll(".day-card").forEach((card) => { card.hidden = filter !== "all" && !card.dataset.cats.includes(filter); });
      });
    });
    setupCalculator();
    setupChecklist();
    renderOverviewLegend();
    setupOverviewMap();
  }

  function setupCalculator() {
    const form = document.querySelector("#cost-form");
    if (!form) return;
    const defaults = { tours: "3", transfer: "90", cruise: "0", parking: "0", other: "0", rate: "4.30" };
    const values = Object.assign(defaults, state.calculator);
    Object.keys(values).forEach((key) => { if (form.elements[key]) form.elements[key].value = values[key]; });
    const update = () => {
      const data = Object.fromEntries(new FormData(form));
      state.calculator = data;
      save();
      const eur = Number(data.transfer || 0) + Number(data.tours || 0) * 220 + Number(data.cruise || 0) + Number(data.parking || 0) + Number(data.other || 0);
      const pln = eur * Number(data.rate || 0);
      document.querySelector("#total-eur").textContent = `${eur.toLocaleString("pl-PL", {maximumFractionDigits: 2})} EUR`;
      document.querySelector("#total-pln").textContent = `${pln.toLocaleString("pl-PL", {maximumFractionDigits: 2})} PLN przy kursie ${Number(data.rate || 0).toLocaleString("pl-PL")}`;
    };
    form.addEventListener("input", update);
    update();
  }

  function setupChecklist() {
    document.querySelectorAll("[data-check]").forEach((input) => {
      input.checked = Boolean(state.checklist[input.dataset.check]);
      input.addEventListener("change", () => { state.checklist[input.dataset.check] = input.checked; save(); });
    });
    const reset = document.querySelector("#reset-plan");
    if (reset) reset.addEventListener("click", () => {
      if (!window.confirm("Zresetować wybrane dni, pominięte punkty, checklistę i kalkulator?")) return;
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
    const metrics = [["Intensywność", day.intensity], ["Czas", day.duration], ["Transport", day.transport], ["Chodzenie", day.walking], ["Dla dzieci", day.kids], ["Ekspozycja", day.exposure], ["Ochrona kolana", day.knee]];
    root.innerHTML = `
      <header class="hero">${imageMarkup(day, true, "hero-media")}<div class="hero-inner"><p class="eyebrow">${day.date} · dzień ${index + 1} z ${days.length}</p><h1>${day.title}</h1><p class="lead">${day.short}</p><div class="chips"><span class="chip">${day.intensity}</span><span class="chip">${day.transport}</span><span class="chip">${day.walking}</span></div></div></header>
      <main id="main-content">
        <div class="grid">
          <section class="card" aria-labelledby="agenda-title"><div class="card-body"><h2 id="agenda-title">Plan dnia</h2><div class="timeline">${day.agenda.map((slot, slotIndex) => `<article class="slot ${state.skipped[day.id]?.includes(slotIndex) ? "is-skipped" : ""}" data-slot="${slotIndex}"><span class="time">${slot[0]}</span><span class="dot" aria-hidden="true"></span><div><h3>${slot[1]}</h3><p>${slot[2]}</p><button class="skip-item" type="button" data-skip="${slotIndex}">${state.skipped[day.id]?.includes(slotIndex) ? "Przywróć punkt" : "Pomijamy"}</button></div></article>`).join("")}</div></div></section>
          <aside class="card"><div class="card-body"><h2>W skrócie</h2><div class="info">${metrics.map((metric) => `<div class="metric"><strong>${metric[1]}</strong><span>${metric[0]}</span></div>`).join("")}</div><div class="badges"><span class="badge">Dzieci chodzą po górach</span><span class="badge">Aktywnie z ochroną kolana</span><span class="badge">Niska ekspozycja</span>${day.cats.includes("odpoczynek") ? "<span class=\"badge optional\">Elastyczny plan</span>" : ""}${day.cats.includes("wycieczka busem") || day.id === "2026-08-28" ? "<span class=\"badge weather\">Pogoda ma znaczenie</span>" : ""}</div><div class="variant-note"><strong>Wariant łagodniejszy:</strong> ${day.gentle}</div></div></aside>
        </div>
        <section class="section grid" aria-label="Mapa i wskazówki">
          <div class="card"><div class="map-shell"><button class="map-activate" type="button">Aktywuj mapę</button><div class="route-map" id="route-map" role="application" aria-label="Mapa OpenStreetMap z trasą: ${day.title}"></div></div><div class="route-summary"><p><strong>Orientacyjna trasa dnia</strong> — linia łączy główne punkty; dokładny przebieg dróg sprawdź w Google Maps.</p><ol class="route-stop-list">${day.route.map((stop, stopIndex) => `<li><span>${stopIndex + 1}</span>${stop[2]}</li>`).join("")}</ol></div><div class="map-actions"><a class="button" href="${day.google}" target="_blank" rel="noopener">Otwórz trasę w Google Maps ↗</a><button class="button secondary" type="button" data-deactivate-map>Wyłącz mapę</button></div></div>
          <div class="card"><div class="card-body"><h2>Wskazówki praktyczne</h2><ul class="tips">${day.tips.map((tip) => `<li>${tip}</li>`).join("")}</ul></div></div>
        </section>
        <section class="section card deep-dive" aria-labelledby="deep-dive-title"><div class="card-body"><h2 id="deep-dive-title">Więcej o tym dniu</h2><div class="deep-grid"><div><h3>Kontekst i historia</h3><p>${day.deepDive.context}</p></div><div><h3>Jedzenie i lokalne smaki</h3><p>${day.deepDive.food}</p></div><div><h3>Praktyczne detale</h3><p>${day.deepDive.practical}</p></div></div></div></section>
        <section class="section card plan-b"><h2>Plan B</h2><p class="section-copy">${day.planB}</p></section>
        <nav class="nav-days" aria-label="Nawigacja między dniami">${prev ? `<a href="${prev.id}.html">← ${prev.date.split(" · ")[0]}</a>` : "<span></span>"}<a class="home" href="../index.html">Strona główna</a>${next ? `<a class="next" href="${next.id}.html">${next.date.split(" · ")[0]} →</a>` : "<span></span>"}</nav>
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
      if (event.target.matches("input, select, textarea")) return;
      if (event.key === "ArrowLeft" && prev) window.location.href = `${prev.id}.html`;
      if (event.key === "ArrowRight" && next) window.location.href = `${next.id}.html`;
    });
    initRouteMap(day);
  }

  function renderPrint() {
    const root = document.querySelector("#print-root");
    if (!root) return;
    const checklistItems = ["Potwierdzone numery i godziny obu lotów", "Rezerwacja, kod wjazdu i sektor P8", "Operator transferu: madeira-in — potwierdzone godziny i miejsce spotkania", "Rezerwacja transferu bez fotelików i podkładek", "Rejs z terminem zapasowym 29 sierpnia, łatwym wejściem i miejscem siedzącym", "Zalecenia lekarza, leki i ewentualna asysta lotniskowa dla osoby przed operacją kolana", "Ubezpieczenie i EKUZ", "Dokumenty, leki i ładowarki", "Mapy offline i kontakty alarmowe"];
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

  renderIndex();
  renderDay();
  renderPrint();
})();
