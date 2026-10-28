#!/usr/bin/env python3
"""Skaner RSS promocji lotniczych pod wyjazd Warszawa–Mendoza (listopad 2027).
Użycie: python3 -I promo_rss.py [--days 7] [--json out.json]
Pobiera publiczne kanały RSS serwisów promocyjnych i filtruje wpisy słowami kluczowymi.
Nie loguje się nigdzie, nie obchodzi zabezpieczeń – tylko oficjalne kanały RSS."""
import sys, json, re, time, datetime as dt, urllib.request, xml.etree.ElementTree as ET, email.utils, html

FEEDS = [
 # (nazwa, url, tryb): "eu" = serwis europejski – szukamy wzmianek o Argentynie/Ameryce Płd.;
 # "ar" = serwis argentyński – szukamy wzmianek o Europie, Iberii/Aerolíneas/Air Europa/LATAM, Ezeiza, promocjach z Europy
 ("Fly4free.pl", "https://www.fly4free.pl/feed/", "eu"),
 ("Fly4free.pl · Argentyna", "https://www.fly4free.pl/tag/argentyna/feed/", "eu"),
 ("Fly4free.com", "https://www.fly4free.com/feed/", "eu"),
 ("Travel-dealz", "https://travel-dealz.com/feed/", "eu"),
 ("Wakacyjni Piraci", "https://www.wakacyjnipiraci.pl/feed", "eu"),
 ("HolidayPirates", "https://www.holidaypirates.com/feed", "eu"),
 ("Pepper.pl", "https://www.pepper.pl/rss/nowe", "eu"),
 ("Infoviajera", "https://www.infoviajera.com/feed/", "ar"),
 ("Promociones Aéreas", "https://promociones-aereas.com.ar/feed/", "ar"),
 ("Sir Chandler", "https://www.sirchandler.com.ar/feed/", "ar"),
 ("Aeroroutes", "https://www.aeroroutes.com/eng?format=rss", "routes"),
]
KEY_EU = re.compile(r"argentyn|argentin|buenos|mendoz|\beze\b|\bmdz\b|aerol[ií]neas|santiago de chile|\bscl\b|são paulo|sao paulo|\bgru\b|ameryk\w* po(?:łudni|ludni)|south america|südamerika|s[uü]damerika|latam|error fare|błąd taryf|fuel dump", re.I)
STRONG_EU = re.compile(r"argentyn|argentin|buenos|mendoz|\beze\b|\bmdz\b|aerol[ií]neas", re.I)
KEY_AR = re.compile(r"europa|madrid|\broma\b|par[ií]s|frankfurt|iberia|air europa|level\b|plus ultra|world2fly|air france|klm|ita airways|lufthansa|turkish|ethiopian|ezeiza|inprotur|visit argentina|desde europa|hacia europa|tarifa(?:s)? promocional|promoci[oó]n.*(?:europa|exterior|extranjero)|mendoza.*(?:vuelo|ruta|madrid)|stopover", re.I)
STRONG_AR = re.compile(r"iberia|air europa|aerol[ií]neas.*(?:europa|madrid|roma|promo)|inprotur|visit argentina|desde europa|ezeiza.*(?:obra|pista|cierre|restricci)|mendoza.*madrid|madrid.*mendoza|plus ultra|level\b|world2fly", re.I)
# „Szalona Środa” LOT: tylko loty LOT, bagaż podręczny – dla nas wyłącznie jako dolot do huba (scenariusz 4)
SZALONA = re.compile(r"szalon\w*\s+środ|szalon\w*\s+srod", re.I)
HUB = re.compile(r"madryt|madrid|rzym|rome|paryż|paryz|paris|lizbon|lisbon|frankfurt|amsterdam|barcelon|mediolan|milan|monachium|munich|zurych|zurich", re.I)
KEY_ROUTES = re.compile(r"argentin|buenos aires|mendoza|aerol[ií]neas|\beze\b|\bmdz\b|(?:iberia|air europa|latam|ita|air france|klm|lufthansa|turkish|ethiopian|level|plus ultra|world2fly).*(?:argentin|buenos|mendoza|santiago|s[aã]o paulo)", re.I)
UA = "promo-rss-check/1.0 (+rocznica-2027; publiczne kanaly RSS)"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml, */*"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

def parse(name, raw):
    out = []
    try:
        root = ET.fromstring(raw)
    except ET.ParseError:
        return out
    ns = {"content": "http://purl.org/rss/1.0/modules/content/", "atom": "http://www.w3.org/2005/Atom"}
    items = root.findall(".//item") or root.findall(".//atom:entry", ns)
    for it in items:
        def g(tag):
            e = it.find(tag) if not tag.startswith("atom:") else it.find(tag, ns)
            return (e.text or "").strip() if e is not None and e.text else ""
        title = html.unescape(g("title") or g("atom:title"))
        link = g("link") or (it.find("atom:link", ns).get("href") if it.find("atom:link", ns) is not None else "")
        date = g("pubDate") or g("atom:updated") or g("atom:published")
        desc = html.unescape(re.sub(r"<[^>]+>", " ", g("description") or g("content:encoded") or g("atom:summary")))
        try:
            d = email.utils.parsedate_to_datetime(date) if "," in date or date[:2].isalpha() else dt.datetime.fromisoformat(date.replace("Z", "+00:00"))
        except Exception:
            d = None
        out.append({"zrodlo": name, "tytul": title, "url": link, "data": d.date().isoformat() if d else "", "_d": d, "opis": desc[:400]})
    return out

def main():
    days = 7; outp = None
    a = sys.argv[1:]
    if "--days" in a: days = int(a[a.index("--days") + 1])
    if "--json" in a: outp = a[a.index("--json") + 1]
    since = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days)
    hits, stats = [], []
    for name, url, mode in FEEDS:
        try:
            items = parse(name, fetch(url))
            stats.append({"zrodlo": name, "wpisy": len(items), "ok": True})
        except Exception as e:
            stats.append({"zrodlo": name, "wpisy": 0, "ok": False, "blad": str(e)[:80]}); continue
        for it in items:
            if it["_d"] and it["_d"].tzinfo is None: it["_d"] = it["_d"].replace(tzinfo=dt.timezone.utc)
            if it["_d"] and it["_d"] < since: continue
            txt = it["tytul"] + " " + it["opis"]
            key, strong = (KEY_EU, STRONG_EU) if mode == "eu" else (KEY_AR, STRONG_AR) if mode == "ar" else (KEY_ROUTES, KEY_ROUTES)
            if SZALONA.search(txt):
                it["sila"] = "dolot" if HUB.search(txt) else "slabe"; it["tryb"] = "lot-szalona-sroda"
                hits.append({k: v for k, v in it.items() if k != "_d"}); continue
            if key.search(txt):
                it["sila"] = "silne" if strong.search(txt) else "slabe"
                it["tryb"] = mode
                hits.append({k: v for k, v in it.items() if k != "_d"})
        time.sleep(0.5)
    order = {"silne": 0, "dolot": 1, "slabe": 2}
    hits.sort(key=lambda x: (order.get(x["sila"], 3), x["data"]))
    res = {"sprawdzono": dt.datetime.now().strftime("%Y-%m-%d %H:%M"), "dni": days, "kanaly": stats, "trafienia": hits}
    if outp: json.dump(res, open(outp, "w"), ensure_ascii=False, indent=1)
    print(f"Kanały: {sum(1 for s in stats if s['ok'])}/{len(stats)} ok · wpisów z {days} dni z trafieniem: {len(hits)}")
    for h in hits: print(f"[{h['sila']}] {h['data']} {h['zrodlo']}: {h['tytul']} — {h['url']}")
    bad = [s for s in stats if not s["ok"]]
    if bad: print("Niedostępne:", ", ".join(f"{s['zrodlo']} ({s.get('blad','')})" for s in bad))

if __name__ == "__main__":
    main()
