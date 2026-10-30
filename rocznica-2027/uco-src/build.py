# Strona „Valle de Uco 2027”: data/program.json + data/extra.json + data/hotele.json + data/zdjecia.json -> ../uco/
# python3 -I build.py          buduje ../uco/data.js, ../uco/index.html i ../uco/plan.ics
# python3 -I build.py --check  nic nie zapisuje; kończy się błędem, gdy ../uco/ różni się od tego, co dałyby źródła
import json, os, re, sys, subprocess, html, datetime
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
CHECK = "--check" in sys.argv
E = html.escape
P = json.load(open("data/program.json", encoding="utf-8"))
X = json.load(open("data/extra.json", encoding="utf-8"))
HOT = {h["n"]: h for h in json.load(open("data/hotele.json", encoding="utf-8"))}
META = json.load(open("data/zdjecia.json", encoding="utf-8"))
OUT = os.path.normpath(os.path.join(HERE, "..", "uco"))

# twarde spacje: jednoliterowe w, z, i, a, o, u nie zostają na końcu linii, a liczba nie odrywa się od tysięcy i jednostki
NB1 = re.compile(r"(?<![^\s(\[„\"'«–—])([aiouwzAIOUWZ]) ")
NB2 = re.compile(r"(\d) (?=\d{3}(?!\d)|(?:zł|USD|EUR|km|m|h|min|os\.|°C|%|dni|noc[ey]?|par[ay]?)(?![\wąćęłńóśźż]))")
def nb(s): return NB2.sub("\\1\u00a0", NB1.sub("\\1\u00a0", s))
def nbx(o): return {k: nbx(v) for k, v in o.items()} if isinstance(o, dict) else [nbx(v) for v in o] if isinstance(o, list) else nb(o) if isinstance(o, str) else o
def nb_html(page):
    parts = re.split(r"(<script\b.*?</script>|<style\b.*?</style>)", page, flags=re.S)
    for i in range(0, len(parts), 2): parts[i] = re.sub(r">([^<]+)<", lambda m: ">" + nb(m.group(1)) + "<", parts[i])
    return "".join(parts)

def jpeg_size(path):
    # szerokość i wysokość z nagłówka SOF – bez ImageMagicka, żeby --check działał w CI
    with open(path, "rb") as fh:
        b = fh.read()
    i = 2
    while i < len(b):
        while b[i] == 0xFF: i += 1
        mk = b[i]; i += 1
        if mk in (0xD8, 0x01) or 0xD0 <= mk <= 0xD7: continue
        ln = int.from_bytes(b[i:i + 2], "big")
        if 0xC0 <= mk <= 0xCF and mk not in (0xC4, 0xC8, 0xCC):
            return int.from_bytes(b[i + 5:i + 7], "big"), int.from_bytes(b[i + 3:i + 5], "big")
        i += ln
    raise ValueError("brak SOF: " + path)

def pic(f, h):
    # oryginał w zdjecia/ (poza gitem) jest potrzebny tylko do wygenerowania nowych rozmiarów; gotowe pliki leżą w ../uco/img/
    for w, q in ((720, 62), (1800, 68)):
        o = f"{OUT}/img/{h}-{w}.jpg"
        if not os.path.exists(o):
            if CHECK or not os.path.exists(f): return None
            os.makedirs(OUT + "/img", exist_ok=True)
            subprocess.run(["convert", f, "-auto-orient", "-resize", f"{w}x>", "-strip", "-quality", str(q), "-interlace", "Plane", o], check=True)
    w, hh = jpeg_size(f"{OUT}/img/{h}-1800.jpg")
    return {"s": f"img/{h}-720.jpg", "l": f"img/{h}-1800.jpg", "w": w, "hh": hh}

# zdjęcia: kolejność wg tematu, opis z podpisu Wikipedii
photos = []
for f, m in META.items():
    p = pic(f, m["h"])
    if not p or p["w"] < 600: continue
    land = p.pop("w") >= p.pop("hh")
    p.update(cap=m.get("cap") or m["file"].rsplit(".", 1)[0].replace("_", " "), page=m["page"], src=m["src"], land=land, au=m.get("author", ""), lic=m.get("lic", ""))
    photos.append(p)
def take(keys, n=1, land=True):
    out = []
    for k in keys:
        for p in photos:
            if p["src"] == k and p not in out and p not in USED and (p["land"] or not land): out.append(p)
            if len(out) >= n: break
        if len(out) >= n: break
    USED.extend(out); return out
USED = []
def bycap(words):
    for w in words:
        for p in photos:
            if w.lower() in p["cap"].lower() and p["land"] and p not in USED: USED.append(p); return [p]
    return []
hero = bycap(["Andes and vineyards in the Uco", "Vista Flores pod"]) or take(["Uco_Valley", "Valle_de_Uco", "Tupungato_(volcano)", "Mendoza_wine", "Aconcagua", "Mendoza_Province"])
DAYPICK = {"6.11": ["Winnice pod Andami", "Chacras"], "7.11": ["Laguna de Horcones i Aconcagua", "Puente del Inca"], "8.11": ["Pod pergolą w winnicy", "Degustacja w Mendozie", "Winnice Vista Flores"], "9.11": ["Viñedos-Bodega Salentein", "Salentein"],
           "10.11": ["Valle de Uco y los Andes", "Vineyards below", "Valle de Uco"], "11.11": ["Manzano"], "12.11": ["Tango na Plaza Dorrego", "Palermo Soho - Centro"], "13.11": ["Recoleta", "El Ateneo"]}
THEME = {"wino": ["Mendoza_wine", "Malbec", "Argentine_wine", "Valle_de_Uco", "Uco_Valley"], "ba": ["BA"], "gory": ["Tupungato_(volcano)", "Cordón_del_Plata", "Aconcagua", "Manzano_Histórico", "Mendoza_Province"],
         "jedzenie": ["Asado", "Empanada"], "miasto": ["Tunuyán", "San_Carlos_(Mendoza)", "Tupungato"]}
def day_theme(d):
    t = (d["title"] + " " + d["text"]).lower()
    if any(w in t for w in ("szlak", "wędrów", "trek", "konn", "manzano", "cordón", "góry", "andy", "rower", "laguna")): return "gory"
    if any(w in t for w in ("asado", "empanad", "kolac")) and "zuccardi" not in t: return "jedzenie"
    if any(w in t for w in ("winn", "degust", "zuccardi", "salentein", "bodeg")): return "wino"
    return "miasto"
days = []
for d in P["days"]:
    im = bycap(DAYPICK.get(d["date"], [])) or take(THEME[day_theme(d)]) or take([k for v in THEME.values() for k in v])
    days.append(dict(d, img=im[0] if im else None, k=day_theme(d)))
def pick(words):
    for w in words:
        for q in photos:
            if w.lower() in q["cap"].lower() and q["land"]: return q
    return None
# drugie zdjęcie dnia (mniejsze, inny kadr tego samego tematu)
DAY2 = {"6.11": ["Winnice pod Andami", "Wino i góry"], "7.11": ["Puente del Inca", "Penitentes"], "8.11": ["Degustacja w Mendozie", "Winnice Vista Flores"], "9.11": ["Bodegas Salentein", "Salentein"],
        "10.11": ["Winnice doliny Uco", "Malbec z widokiem"], "11.11": ["Cordón del Plata", "Manzano"], "12.11": ["Palermo Soho - Centro", "Tango"], "13.11": ["El Ateneo", "Café Tortoni"]}
for d in days:
    q = pick(DAY2.get(d["date"], []))
    d["img2"] = q if q and q is not d.get("img") else None
# pasy pełnoekranowe między sekcjami
BANDS = {"trasa": (["Ruta 7 przez Andy", "Droga RN7"], "Osiem dni, trzy bazy", "Z lotniska w Mendozie pod Aconcaguę, potem w dolinę Uco, a na koniec do Buenos Aires."),
         "hotele": (["Winnice Vista Flores pod Andami", "Andy i winnice"], "Spać z widokiem na Andy", "Finca w Chacras de Coria i szklana suita nad laguną w Los Chacayes."),
         "loty": (["Laguna de Horcones i Aconcagua", "Aconcagua"], "Najwyższa góra poza Azją", "Aconcagua, 6 961 m – godzinny spacer do laguny u jej stóp w niedzielę 7.11."),
         "buenos": (["Puerto Madero nocą", "Obelisk o zmierzchu"], "Finał w wielkim mieście", "Tango, Recoleta i kawa w Café Tortoni po tygodniu pod Andami."),
         "galeria": (["Cordón del Plata przed zimą", "Cordón del Plata"], "Mendoza, Andy, malbec", "Zdjęcia z miejsc, które zobaczycie – wszystkie na wolnych licencjach.")}
bands = {k: dict(img=pick(v[0]), t=v[1], s=v[2]) for k, v in BANDS.items()}
bands = {k: v for k, v in bands.items() if v["img"]}
# mozaika pod hero: 5 różnych zdjęć
mosaic = []
for w in ["Puente del Inca – naturalny", "Winnica Catena Zapata", "Valle de Uco", "Tango na Plaza Dorrego", "Kaplica San Antonio", "Degustacja w The Vines", "Potrerillos"]:
    for q in photos:
        if w.lower() in q["cap"].lower() and q not in mosaic: mosaic.append(q); break
mosaic = mosaic[:5]
gallery = [p for p in photos if p not in USED][:60]

hotels = []
for h in P["hotels"]:
    r = HOT.get(h["name"], {})
    hotels.append({"n": h["name"], "h1": h.get("h1"), "h2": h.get("h2"), "note": h.get("variant_note", ""), "b": h["budget"], "model": h.get("model"), "hotele": h.get("hotele", []), "short": r.get("short", ""), "desc": r.get("note", ""),
                   "rate": r.get("rate"), "cur": r.get("cur", "USD"), "oc": r.get("ocena", ""), "url": r.get("url", ""), "lat": r.get("lat"), "lon": r.get("lon")})

hotele = []
for k in P.get("hotele_karty", []):
    r = HOT.get(k["n"], {}); im = [q for q in photos if k["foto"].lower() in q["cap"].lower() and q["land"]][:1]
    desc = re.split(r" (?:Aktualizacja ceny|Słabości|Cena \d|Cena przyjęta)", r.get("note", ""))[0].replace("konie, rowery, spa, wędrówki", "rowery, spa, wędrówki").replace("konne wyprawy na górskie szlaki, rowery", "rowery")
    gal = list({id(q): q for cap in k.get("gal", []) for q in photos if cap.lower() in q["cap"].lower()}.values())[:4]
    hotele.append(dict(k, gal=gal, short=k.get("short") or r.get("short", ""), desc=desc, rate=r.get("rate"), cur=r.get("cur", "USD"), oc=r.get("ocena", ""), url=r.get("url", ""),
                       img=im[0] if im else None, glowny=bool(k.get("glowny"))))
bapics = [q for q in photos if q.get("src") == "BA" and q["land"]][:8]
alts = []
for a in P.get("alternatywy", []):
    im = [q for q in photos if a["foto"].lower() in q["cap"].lower()][:1]
    alts.append(dict(a, img=im[0] if im else None))
DATA = {"bands": bands, "mosaic": mosaic, "built": datetime.date.today().strftime("%d.%m.%Y"), "bapics": bapics, "hotele": hotele, "alts": alts, "odrzucone": P.get("odrzucone", []), "prog": {k: P.get(k) for k in ("tagline", "stats", "grupa", "czas_w_hotelu", "dojazd", "pogoda", "rezerwacje", "zabrac", "uwagi", "zrodla", "etapy", "loty", "ba", "upgrade")}, "mapa": P.get("mapa", []), "x": X,
        "days": days, "hotels": hotels, "hero": hero[0] if hero else None, "gallery": gallery}
# kalendarz .ics: jedno wydarzenie całodniowe na dzień + noclegi
def ics_esc(s): return s.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n")
ev = []
for d in P["days"]:
    dd, mm = d["date"].split("."); start = f"2027{int(mm):02d}{int(dd):02d}"; end = f"2027{int(mm):02d}{int(dd)+1:02d}"
    ev.append(f"BEGIN:VEVENT\r\nUID:rocznica2027-{start}@uco\r\nDTSTAMP:20261025T120000Z\r\nDTSTART;VALUE=DATE:{start}\r\nDTEND;VALUE=DATE:{end}\r\nSUMMARY:{ics_esc(d['date'] + ' ' + d['title'])}\r\nDESCRIPTION:{ics_esc(d['text'])}\r\nEND:VEVENT")
# noclegi wg wariantu polecanego (hotels[0])
hot = [("20271106", "20271109", "Lares de Chacras, Chacras de Coria"), ("20271109", "20271112", "Casa de Uco – Laguna Suite, Los Chacayes"), ("20271112", "20271113", "Legado Mítico, Palermo Soho, Buenos Aires")]
assert all(x in P["hotels"][0]["name"] for x in ("Lares de Chacras", "Casa de Uco", "Buenos Aires")), "ics: wariant polecany się zmienił"
for a, z, n in hot:
    ev.append(f"BEGIN:VEVENT\r\nUID:rocznica2027-hotel-{a}@uco\r\nDTSTAMP:20261028T120000Z\r\nDTSTART;VALUE=DATE:{a}\r\nDTEND;VALUE=DATE:{z}\r\nSUMMARY:{ics_esc('Nocleg: ' + n)}\r\nEND:VEVENT")
for a, z, s, t in (("20271105", "20271106", "Wylot z Warszawy do Mendozy", "Wylot w piątek 5.11 albo w czwartek 4.11 najwcześniej o 20:00 – zależnie od kupionych biletów."), ("20271114", "20271115", "Powrót do Warszawy", "Lądowanie w Warszawie najpóźniej w niedzielę 14.11 (nocny lot z Buenos Aires 13.11).")):
    ev.append(f"BEGIN:VEVENT\r\nUID:rocznica2027-lot-{a}@uco\r\nDTSTAMP:20261028T120000Z\r\nDTSTART;VALUE=DATE:{a}\r\nDTEND;VALUE=DATE:{z}\r\nSUMMARY:{ics_esc(s)}\r\nDESCRIPTION:{ics_esc(t)}\r\nEND:VEVENT")
def fold(line):
    out, cur = [], ""
    for ch in line:
        if len((cur + ch).encode("utf-8")) > (75 if not out else 74): out.append(cur); cur = ""
        cur += ch
    out.append(cur); return "\r\n ".join(out)
body = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//rocznica 2027//uco//PL\r\nCALSCALE:GREGORIAN\r\nX-WR-CALNAME:Mendoza i Buenos Aires 2027\r\n" + "\r\n".join(ev) + "\r\nEND:VCALENDAR"
files = {"data.js": "window.UCO=" + json.dumps(nbx(DATA), ensure_ascii=False, separators=(",", ":")) + ";\n",
         "plan.ics": "\r\n".join(fold(l) for l in body.split("\r\n")) + "\r\n",
         "index.html": nb_html(open("template.html", encoding="utf-8").read())}
BUILT = re.compile(r'"built":"[^"]*"')
bad = []
for name, txt in files.items():
    path = f"{OUT}/{name}"
    old = open(path, encoding="utf-8", newline="").read() if os.path.exists(path) else None
    same = old is not None and (BUILT.sub("", old) == BUILT.sub("", txt) if name == "data.js" else old == txt)
    if CHECK:
        if not same: bad.append(name)
    elif not same:
        open(path, "w", encoding="utf-8", newline="").write(txt)
if CHECK:
    if bad: sys.exit("Różni się od źródeł: " + ", ".join(bad) + " – zmiany wprowadzaj w uco-src/ i uruchom build.py")
    print("ok: ../uco zgadza się ze źródłami")
else:
    print(f"ok: {len(days)} dni, {len(hotels)} hoteli, {len(photos)} zdjęć ({len(gallery)} w galerii), hero={'tak' if hero else 'nie'}")
