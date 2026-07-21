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

  const days = [
    {
      id: "2026-08-19", date: "19 sierpnia · środa", title: "Łódź → Berlin", short: "Spokojny start podróży, P8 i lekki wieczór w Berlinie.",
      image: images.berlin, alt: "Brama Brandenburska w Berlinie o wieczornej porze", cats: ["podróż", "spokojny"],
      intensity: "Łagodna", duration: "6–7 h przejazdu + 2 h", transport: "Samochód", walking: "Niewiele", kids: "Tak, z przerwami", exposure: "Niska",
      center: [52.5163, 13.3777], google: "https://www.google.com/maps/dir/%C5%81%C3%B3d%C5%BA/Berlin+Brandenburg+Airport+P8/Brandenburg+Gate",
      agenda: [["11:00", "Wyjazd z Łodzi", "Start bez pośpiechu; zaplanować regularne postoje dla dzieci."], ["17:00", "Parking P8 przy BER", "Wjazd zgodnie z rezerwacją, zdjęcie miejsca postoju i szybka kontrola dojazdu do terminala."], ["18:15", "Jeden lekki spacer", "Brama Brandenburska i Reichstag z zewnątrz albo kameralne Nikolaiviertel — bez łączenia wszystkiego."], ["19:30", "Wczesna kolacja", "Proste menu, nawodnienie i szybki powrót na nocleg."]],
      tips: ["Przed wyjazdem pobrać mapę offline Berlina i okolic BER.", "Sprawdzić kod wjazdu, numer rezerwacji P8 i sposób transferu do terminala.", "Zostawić bagaże lotnicze łatwo dostępne — nie przepakowywać auta wieczorem."],
      planB: "Jeśli trasa się wydłuży, pomijamy centrum Berlina. Kolacja i spokojny nocleg w okolicy BER są pełnoprawnym planem.", gentle: "Tryb łagodny: spacer traktujemy jako bonus, nie punkt obowiązkowy."
    },
    {
      id: "2026-08-20", date: "20 sierpnia · czwartek", title: "Berlin BER → Funchal", short: "Lot, prywatny transfer, Hotel Baía Azul i pierwsze spotkanie z oceanem.",
      image: images.funchal, alt: "Panorama Funchal i Oceanu Atlantyckiego na Maderze", cats: ["podróż", "spokojny"],
      intensity: "Łagodna", duration: "Dzień logistyczny", transport: "Samolot + transfer", walking: "Mało", kids: "Tak", exposure: "Niska",
      center: [32.6387, -16.9304], google: "https://www.google.com/maps/dir/Madeira+Airport/Hotel+Baia+Azul,+Funchal/Lido+Bathing+Complex",
      agenda: [["rano", "Spokojny dojazd na BER", "Odprawa z zapasem i bez dodatkowego programu."], ["10:55*", "Lądowanie w Funchal", "Lot EJU5333 i godzina 10:55 są do ponownego potwierdzenia przed wylotem."], ["12:00", "Transfer madeira-in", "Odbiór bagażu, kontakt z kierowcą i przejazd do Hotelu Baía Azul."], ["14:00", "Obiad i odpoczynek", "Lekki posiłek, zameldowanie i basen."], ["17:00", "Lido lub promenada", "Krótki spacer tylko jeśli grupa ma energię."]],
      tips: ["Numer lotu i godziny sprawdzić ponownie w aplikacji przewoźnika.", "Mieć pod ręką numer kierowcy madeira-in i oznaczenie miejsca spotkania.", "Pierwszego dnia nie planować zakupów ani dalszych dojazdów."],
      planB: "Przy opóźnieniu lotu rezygnujemy z Lido. Hotel, posiłek i sen są jedynymi priorytetami.", gentle: "Tryb łagodny: po transferze cały program odbywa się w hotelu."
    },
    {
      id: "2026-08-21", date: "21 sierpnia · piątek", title: "Funchal i CR7", short: "Marina, muzeum, stare miasto i dużo miejsca na odpoczynek.",
      image: images.funchal, alt: "Funchal widziane od strony oceanu", cats: ["aktywny", "spokojny"],
      intensity: "Umiarkowana", duration: "4–5 h", transport: "Autobus / taxi", walking: "2–4 km", kids: "Tak", exposure: "Niska",
      center: [32.648, -16.913], google: "https://www.google.com/maps/dir/CR7+Museum/Funchal+Marina/Mercado+dos+Lavradores",
      agenda: [["09:30", "Centrum i marina", "Spokojny start przy nabrzeżu i widok na port."], ["10:30", "Muzeum CR7", "Krótka, konkretna atrakcja; bilety sprawdzić przed wyjściem."], ["12:00", "Stare miasto", "Rua de Santa Maria i lunch w wygodnym miejscu."], ["15:00", "Hotel, basen lub Lido", "Reszta dnia bez sztywnego harmonogramu."]],
      tips: ["Wybrać jedną część starego miasta, nie próbować obejść całego Funchal.", "Kapelusze, woda i przerwa w cieniu w południe.", "Sprawdzić aktualne godziny otwarcia muzeum CR7."],
      planB: "Przy upale lub zmęczeniu: tylko marina i CR7, a lunch oraz popołudnie w hotelu.", gentle: "Tryb łagodny: poruszamy się taxi między hotelem, CR7 i starym miastem."
    },
    {
      id: "2026-08-22", date: "22 sierpnia · sobota", title: "Wschód Madery", short: "Balcões, Ribeiro Frio, Arieiro jako punkt widokowy i Santana.",
      image: images.arieiro, alt: "Górski krajobraz Pico do Arieiro ponad chmurami", cats: ["aktywny", "wycieczka busem"],
      intensity: "Umiarkowana", duration: "09:30–17:30", transport: "Prywatny bus", walking: "Łatwe 3 km", kids: "Tak, po skróceniu", exposure: "Niska / kontrolowana",
      center: [32.735, -16.886], google: "https://www.google.com/maps/dir/Ribeiro+Frio/Balc%C3%B5es/Pico+do+Arieiro/Santana,+Madeira",
      agenda: [["09:30", "Start z hotelu", "Mercedes Sprinter madeira-in; foteliki lub podkładki potwierdzić wcześniej."], ["10:20", "Ribeiro Frio i Balcões", "Łatwy spacer leśną ścieżką; zawracamy, jeśli dzieci tracą energię."], ["12:30", "Pico do Arieiro", "Wyłącznie dostępny, komfortowy punkt widokowy. Bez trasy na Pico Ruivo."], ["14:00", "Santana i lunch", "Domki, odpoczynek i spokojny posiłek."], ["16:00", "Porto da Cruz lub Machico", "Jeden opcjonalny przystanek zależnie od czasu i pogody."], ["17:30", "Powrót", "Wieczór bez dodatkowego programu."]],
      tips: ["W górach temperatura może być znacznie niższa niż w Funchal.", "Na Arieiro wybierać miejsca oddalone od krawędzi i nie wywierać presji na nikogo.", "Balcões jest celem spaceru; pełna trasa Arieiro–Ruivo nie jest częścią planu."],
      planB: "Przy chmurach na Arieiro jedziemy dłużej przez Ribeiro Frio, Santanę i Machico. Punkt górski można całkowicie pominąć.", gentle: "Tryb łagodny: Arieiro tylko wtedy, gdy widoczność i komfort całej grupy są dobre."
    },
    {
      id: "2026-08-23", date: "23 sierpnia · niedziela", title: "Dzień bez zegarka", short: "Hotel Baía Azul, basen, Lido i pełna regeneracja.",
      image: images.lido, alt: "Baseny oceaniczne przy wybrzeżu Funchal", cats: ["odpoczynek", "spokojny"],
      intensity: "Bardzo łagodna", duration: "Dowolnie", transport: "Pieszo", walking: "Do 2 km", kids: "Idealny", exposure: "Niska",
      center: [32.6386, -16.9332], google: "https://www.google.com/maps/search/?api=1&query=Lido+Bathing+Complex+Funchal",
      agenda: [["rano", "Śniadanie bez budzika", "Każda rodzina wybiera własne tempo."], ["11:00", "Basen lub Lido", "Krótki blok wodny z ochroną przeciwsłoneczną."], ["14:00", "Lunch i cisza", "Drzemka, książka lub czas w pokoju."], ["wieczór", "Promenada", "Tylko jeśli wszyscy mają ochotę."]],
      tips: ["Nie zamieniać dnia odpoczynku w nadrabianie atrakcji.", "Przy Lido sprawdzić warunki oceanu i komunikaty ratowników.", "Uzupełnić wodę, przekąski i drobiazgi na kolejną wycieczkę."],
      planB: "To już jest plan awaryjny: hotel, gry, spokojny posiłek i zero dojazdów.", gentle: "Tryb łagodny: pozostajemy przy basenie hotelowym."
    },
    {
      id: "2026-08-24", date: "24 sierpnia · poniedziałek", title: "Zachód Madery", short: "Wioski, czarne wybrzeże, Porto Moniz i opcjonalny Fanal.",
      image: images.porto, alt: "Naturalne baseny lawowe Porto Moniz na Maderze", cats: ["aktywny", "wycieczka busem"],
      intensity: "Pełna", duration: "09:30–17:30", transport: "Prywatny bus", walking: "2–4 km", kids: "Tak, z przerwami", exposure: "Niska; Cabo opcjonalne",
      center: [32.8663, -17.1667], google: "https://www.google.com/maps/dir/C%C3%A2mara+de+Lobos/Ribeira+Brava/Seixal,+Madeira/Porto+Moniz",
      agenda: [["09:30", "Câmara de Lobos", "Krótki spacer przy porcie i rodzinne zdjęcie."], ["11:00", "Ribeira Brava", "Kawa, toaleta i przerwa przed północnym wybrzeżem."], ["12:15", "Seixal", "Plaża lub punkt przy miejscowości — bez ryzykownego schodzenia."], ["13:30", "Porto Moniz", "Lunch i obserwacja basenów; kąpiel tylko przy dobrych warunkach."], ["15:30", "Fanal opcjonalnie", "Tylko gdy pogoda jest dobra, a grupa nadal ma energię."], ["17:30", "Powrót do hotelu", "Cabo Girão nie jest punktem obowiązkowym."]],
      tips: ["To długi dzień — ograniczyć liczbę postojów, jeśli dzieci są zmęczone.", "Cabo Girão traktować wyłącznie jako propozycję dla chętnych.", "Kąpiel w Porto Moniz zależy od fal, komunikatów i czasu."],
      planB: "Przy złej pogodzie na północy zostajemy dłużej w Câmara de Lobos i Ribeira Brava, potem wracamy południowym wybrzeżem.", gentle: "Tryb łagodny: bez Cabo Girão i bez postojów wymagających podejścia do krawędzi."
    },
    {
      id: "2026-08-25", date: "25 sierpnia · wtorek", title: "Funchal po swojemu", short: "Ogród, zakupy albo Monte — z pełnym wariantem bez kolejki.",
      image: images.funchal, alt: "Zielone ogrody i zabudowa Funchal", cats: ["spokojny", "odpoczynek"],
      intensity: "Łagodna", duration: "3–5 h", transport: "Taxi / autobus", walking: "2–4 km", kids: "Tak", exposure: "Wariant bez wysokości",
      center: [32.662, -16.895], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Madeira+Botanical+Garden/Funchal",
      agenda: [["10:00", "Wybór wariantu", "Ogród botaniczny albo centrum, zakupy i spokojna kawiarnia."], ["12:30", "Lunch", "Bez rezerwowania kolejnych atrakcji na siłę."], ["14:30", "Monte tylko dla chętnych", "Kolejka i wysokość są całkowicie opcjonalne."], ["16:00", "Hotel", "Basen i spokojna kolacja."]],
      tips: ["Wariant bez kolejki: taxi do ogrodu lub wyłącznie centrum Funchal.", "Rodziny mogą rozdzielić się na 2–3 godziny i spotkać na lunchu.", "Sprawdzić godziny ogrodu i temperaturę przed wyjazdem."],
      planB: "Cały dzień w hotelu i przy Lido; zakupy można zrobić wieczorem w najbliższej okolicy.", gentle: "Tryb łagodny: bez kolejki i bez Monte; wybieramy ogród dostępny taxi albo centrum."
    },
    {
      id: "2026-08-26", date: "26 sierpnia · środa", title: "Curral das Freiras", short: "Pół dnia w Dolinie Zakonnic, spokojne widoki i lunch.",
      image: images.camara, alt: "Górskie doliny i miejscowości w centralnej Maderze", cats: ["aktywny", "spokojny"],
      intensity: "Umiarkowana", duration: "4–5 h", transport: "Taxi / wycieczka", walking: "Mało", kids: "Tak", exposure: "Kontrolowana",
      center: [32.7202, -16.9691], google: "https://www.google.com/maps/dir/Funchal/Eira+do+Serrado/Curral+das+Freiras",
      agenda: [["09:30", "Wyjazd z Funchal", "Krótka trasa w głąb wyspy."], ["10:15", "Punkt widokowy", "Tylko komfortowe miejsce, bez stania przy ekspozycji."], ["11:30", "Curral das Freiras", "Spacer po miejscowości i spokojny lunch."], ["14:00", "Powrót do hotelu", "Popołudnie na basenie."]],
      tips: ["Nie trzeba podchodzić do barierek, aby zobaczyć dolinę.", "W razie choroby lokomocyjnej usiąść z przodu i przygotować wodę.", "Dzień można zamienić na relaks bez straty dla całego planu."],
      planB: "Zamiana na ogród w Funchal, Lido lub dzień hotelowy — szczególnie przy niskich chmurach w dolinie.", gentle: "Tryb łagodny: pomijamy każdy punkt, który powoduje dyskomfort; sama miejscowość i lunch wystarczą."
    },
    {
      id: "2026-08-27", date: "27 sierpnia · czwartek", title: "Calheta i południowy zachód", short: "Piaszczysta plaża, Engenhos i słoneczne Ponta do Sol.",
      image: images.beach, alt: "Spokojne wybrzeże południowo-zachodniej Madery", cats: ["wycieczka busem", "spokojny"],
      intensity: "Łagodna", duration: "09:30–17:00", transport: "Prywatny bus", walking: "Mało", kids: "Bardzo dobry", exposure: "Niska",
      center: [32.7219, -17.1775], google: "https://www.google.com/maps/dir/Calheta+Beach/Engenhos+da+Calheta/Ponta+do+Sol/Jardim+do+Mar",
      agenda: [["09:30", "Wyjazd z hotelu", "Trzeci dzień madeira-in w spokojnym rytmie."], ["10:30", "Calheta", "Piaszczysta plaża i czas rodzinny bez pośpiechu."], ["13:00", "Engenhos da Calheta", "Krótka wizyta zależna od godzin otwarcia."], ["14:30", "Ponta do Sol", "Lunch lub lody i spacer przy oceanie."], ["16:00", "Jardim do Mar opcjonalnie", "Tylko jeśli grupa ma energię i dojazd jest komfortowy."], ["17:00", "Powrót", "Bez dokładania Rabaçal ani Risco."]],
      tips: ["Rabaçal i Risco nie są domyślną rekomendacją dla tej grupy.", "Według korespondencji madeira-in Risco nie jest dobrym wyborem przy problemie z klifami.", "Sprawdzić godziny Engenhos i zabrać rzeczy plażowe."],
      planB: "Przy gorszej pogodzie: dłuższy lunch w Ponta do Sol, krótka Calheta i wcześniejszy powrót.", gentle: "Tryb łagodny: wyłącznie Calheta i Ponta do Sol; żadnych tras przy klifach."
    },
    {
      id: "2026-08-28", date: "28 sierpnia · piątek", title: "Odpoczynek lub ocean", short: "Domyślnie basen i Lido; rejs tylko przy spokojnym morzu.",
      image: images.lido, alt: "Ocean i kąpielisko Lido w Funchal", cats: ["odpoczynek", "spokojny"],
      intensity: "Bardzo łagodna", duration: "Dowolnie", transport: "Pieszo / łódź", walking: "Mało", kids: "Tak", exposure: "Niska",
      center: [32.6386, -16.9332], google: "https://www.google.com/maps/search/?api=1&query=Funchal+Marina+dolphin+tour",
      agenda: [["rano", "Wersja domyślna: odpoczynek", "Basen, Lido i spokojne śniadanie."], ["10:30", "Rejs tylko opcjonalnie", "Delfiny lub wieloryby wyłącznie przy spokojnym morzu i dobrym samopoczuciu grupy."], ["14:00", "Lekki lunch", "Bez planowania kolejnej atrakcji po rejsie."], ["wieczór", "Wspólna kolacja", "Podsumowanie ulubionych miejsc."]],
      tips: ["Rejs nie jest obowiązkowy i nie należy go rezerwować kosztem samopoczucia.", "Przed rejsem sprawdzić wiatr, falowanie i zasady anulowania.", "Przy chorobie morskiej wybrać dzień na lądzie."],
      planB: "Basen, Lido, gry i kawiarnia — pełny, wartościowy dzień bez rejsu.", gentle: "Tryb łagodny: rejs pozostaje wyłączony; dzień odbywa się przy hotelu."
    },
    {
      id: "2026-08-29", date: "29 sierpnia · sobota", title: "Dzień rezerwowy", short: "Machico, Funchal, plaża albo powrót do ulubionego miejsca.",
      image: images.coast, alt: "Miasteczko i wybrzeże Madery nad Atlantykiem", cats: ["spokojny", "odpoczynek"],
      intensity: "Do wyboru", duration: "2–6 h", transport: "Do wyboru", walking: "Do wyboru", kids: "Tak", exposure: "Wariant nisko położony",
      center: [32.7163, -16.7653], google: "https://www.google.com/maps/dir/Funchal/Machico",
      agenda: [["09:00", "Decyzja po śniadaniu", "Wybieramy wariant na podstawie pogody i energii."], ["10:30", "Machico", "Plaża i promenada — dobry wariant pogodowy."], ["10:30", "Funchal", "Ostatnie zakupy, kawiarnia i miejsce pominięte wcześniej."], ["10:30", "Ulubione miejsce", "Powtórka bez poczucia, że trzeba zobaczyć coś nowego."], ["17:00", "Pakowanie", "Przygotować dokumenty, bagaże i ubrania na powrót."]],
      tips: ["Nie wybierać wariantu wcześniej niż dzień przed — to celowy bufor.", "Machico daje łatwy dostęp do plaży bez górskiej ekspozycji.", "Wieczorem zakończyć pakowanie i potwierdzić transfer."],
      planB: "Hotel i Funchal. Najważniejszym zadaniem dnia jest spokojne przygotowanie powrotu.", gentle: "Tryb łagodny: wybieramy najbliższy, nisko położony wariant i kończymy dzień wcześnie."
    },
    {
      id: "2026-08-30", date: "30 sierpnia · niedziela", title: "Powrót do Łodzi", short: "Hotel, FNC, lot do Berlina, P8 i ostatni odcinek autem.",
      image: images.funchal, alt: "Funchal i wybrzeże Madery widziane z góry", cats: ["podróż"],
      intensity: "Logistyczna", duration: "Cały dzień", transport: "Transfer + samolot + auto", walking: "Mało", kids: "Tak, z przerwami", exposure: "Niska",
      center: [32.6942, -16.7745], google: "https://www.google.com/maps/dir/Hotel+Baia+Azul,+Funchal/Madeira+Airport",
      agenda: [["rano", "Checklista hotelowa", "Dokumenty, ładowarki, leki, stroje kąpielowe i sejf."], ["do potw.", "Transfer madeira-in", "Godzinę odbioru ustalić po potwierdzeniu lotu FNC–BER."], ["do potw.", "Lot FNC–BER", "Rozkład i numer lotu sprawdzić ponownie przed wyjazdem."], ["po lądowaniu", "Samochód z P8", "Zdjęcie sektora i dane rezerwacji ułatwią odbiór."], ["wieczór", "Berlin → Łódź", "Regularne przerwy i zmiana kierowcy, jeśli to możliwe."]],
      tips: ["Nie opierać godziny transferu na niepotwierdzonym rozkładzie.", "Przed wymeldowaniem sprawdzić sejf, szafki, łazienkę i gniazdka.", "Zostawić zapas na bagaż i kolejki na lotnisku w Funchal."],
      planB: "Przy opóźnieniu po lądowaniu rozważyć dodatkowy odpoczynek lub nocleg; nie prowadzić zmęczonym.", gentle: "Tryb łagodny: bezpieczeństwo i przerwy mają pierwszeństwo przed godziną dojazdu do Łodzi."
    }
  ];

  const stateKey = "madeira-premium-plan-v1";
  const readState = () => {
    try { return JSON.parse(localStorage.getItem(stateKey)) || {}; } catch (_) { return {}; }
  };
  const state = Object.assign({ gentle: true, selected: [], skipped: {}, checklist: {}, calculator: {} }, readState());
  const save = () => localStorage.setItem(stateKey, JSON.stringify(state));
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
  const rel = document.body.dataset.page === "day" ? "../" : "./";

  function setupGlobal() {
    document.body.classList.toggle("gentle", state.gentle);
    document.querySelectorAll("[data-gentle-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(state.gentle));
      button.textContent = state.gentle ? "Tryb łagodny: włączony" : "Tryb łagodny: wyłączony";
      button.addEventListener("click", () => {
        state.gentle = !state.gentle;
        save();
        document.body.classList.toggle("gentle", state.gentle);
        document.querySelectorAll("[data-gentle-toggle]").forEach((item) => {
          item.setAttribute("aria-pressed", String(state.gentle));
          item.textContent = state.gentle ? "Tryb łagodny: włączony" : "Tryb łagodny: wyłączony";
        });
      });
    });
  }

  function imageMarkup(day, eager) {
    return `<img src="${day.image}" alt="${escapeHtml(day.alt)}" ${eager ? "fetchpriority=\"high\"" : "loading=\"lazy\""} decoding="async" onerror="this.parentElement.classList.add('image-fallback');this.remove()">`;
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

    document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
      grid.querySelectorAll(".day-card").forEach((card) => { card.hidden = filter !== "all" && !card.dataset.cats.includes(filter); });
    }));
    setupCalculator();
    setupChecklist();
  }

  function setupCalculator() {
    const form = document.querySelector("#cost-form");
    if (!form) return;
    const defaults = { tours: "3", cruise: "0", parking: "0", other: "0", rate: "4.30" };
    const values = Object.assign(defaults, state.calculator);
    Object.keys(values).forEach((key) => { if (form.elements[key]) form.elements[key].value = values[key]; });
    const update = () => {
      const data = Object.fromEntries(new FormData(form));
      state.calculator = data;
      save();
      const eur = 90 + Number(data.tours || 0) * 220 + Number(data.cruise || 0) + Number(data.parking || 0) + Number(data.other || 0);
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

  function osmUrl(lat, lon) {
    const dLat = .075, dLon = .105;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-dLon}%2C${lat-dLat}%2C${lon+dLon}%2C${lat+dLat}&layer=mapnik&marker=${lat}%2C${lon}`;
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
      <header class="hero">${imageMarkup(day, true)}<div class="hero-inner"><p class="eyebrow">${day.date} · dzień ${index + 1} z ${days.length}</p><h1>${day.title}</h1><p class="lead">${day.short}</p><div class="chips"><span class="chip">${day.intensity}</span><span class="chip">${day.transport}</span><span class="chip">${day.walking}</span></div></div></header>
      <main id="main-content">
        <div class="grid">
          <section class="card" aria-labelledby="agenda-title"><div class="card-body"><h2 id="agenda-title">Plan dnia</h2><div class="timeline">${day.agenda.map((slot, slotIndex) => `<article class="slot ${state.skipped[day.id]?.includes(slotIndex) ? "is-skipped" : ""}" data-slot="${slotIndex}"><span class="time">${slot[0]}</span><span class="dot" aria-hidden="true"></span><div><h3>${slot[1]}</h3><p>${slot[2]}</p><button class="skip-item" type="button" data-skip="${slotIndex}">${state.skipped[day.id]?.includes(slotIndex) ? "Przywróć punkt" : "Pomijamy"}</button></div></article>`).join("")}</div></div></section>
          <aside class="card"><div class="card-body"><h2>W skrócie</h2><div class="info">${metrics.map((metric) => `<div class="metric"><strong>${metric[1]}</strong><span>${metric[0]}</span></div>`).join("")}</div><div class="badges"><span class="badge">Bezpieczne dla dzieci</span><span class="badge">Niska ekspozycja</span>${day.cats.includes("odpoczynek") ? "<span class=\"badge optional\">Elastyczny plan</span>" : ""}${day.cats.includes("wycieczka busem") ? "<span class=\"badge weather\">Pogoda ma znaczenie</span>" : ""}</div><p class="gentle-note">${day.gentle}</p></div></aside>
        </div>
        <section class="section grid" aria-label="Mapa i wskazówki">
          <div class="card"><div class="map-shell"><button class="map-activate" type="button">Aktywuj mapę</button><iframe title="Mapa OpenStreetMap dla: ${day.title}" loading="lazy" src="${osmUrl(day.center[0], day.center[1])}"></iframe></div><div class="map-actions"><a class="button" href="${day.google}" target="_blank" rel="noopener">Otwórz trasę w Google Maps ↗</a><button class="button secondary" type="button" data-deactivate-map>Wyłącz mapę</button></div></div>
          <div class="card"><div class="card-body"><h2>Wskazówki praktyczne</h2><ul class="tips">${day.tips.map((tip) => `<li>${tip}</li>`).join("")}</ul></div></div>
        </section>
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
    activate.addEventListener("click", () => { mapShell.classList.add("is-active"); activate.textContent = "Mapa aktywna"; });
    deactivate.addEventListener("click", () => { mapShell.classList.remove("is-active"); activate.textContent = "Aktywuj mapę"; });
  }

  setupGlobal();
  renderIndex();
  renderDay();
})();
