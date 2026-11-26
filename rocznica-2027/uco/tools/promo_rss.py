#!/usr/bin/env python3
"""Skaner RSS promocji lotniczych pod wyjazd Warszawa–Mendoza (listopad 2027).
Użycie: python3 -I promo_rss.py [--days 7] [--json out.json]
Pobiera publiczne kanały RSS serwisów promocyjnych i filtruje wpisy słowami kluczowymi.
Nie loguje się nigdzie, nie obchodzi zabezpieczeń – tylko oficjalne kanały RSS."""
import sys, json, re, time, datetime as dt, urllib.request, xml.etree.ElementTree as ET, email.utils, html
import argparse, concurrent.futures, os, tempfile
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from zoneinfo import ZoneInfo

FEEDS = [
 # (nazwa, url, tryb): "eu" = serwis europejski – szukamy wzmianek o Argentynie/Ameryce Płd.;
 # "ar" = serwis argentyński – szukamy wzmianek o Europie, Iberii/Aerolíneas/Air Europa/LATAM, Ezeiza, promocjach z Europy
 ("Fly4free.pl", "https://www.fly4free.pl/feed/", "eu"),
 ("Fly4free.pl · Argentyna", "https://www.fly4free.pl/tag/argentyna/feed/", "eu"),
 ("Fly4free.com", "https://www.fly4free.com/feed/", "eu"),
 ("Fly4free.pl · Buenos Aires", "https://www.fly4free.pl/tag/buenos-aires/feed/", "eu"),
 ("Fly4free.pl · Ameryka Płd.", "https://www.fly4free.pl/tag/ameryka-poludniowa/feed/", "eu"),
 ("Travel-dealz · Argentyna", "https://travel-dealz.com/destination/argentina/feed/", "eu"),
 ("Travel-dealz · Chile", "https://travel-dealz.com/destination/chile/feed/", "eu"),
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

def fetch(url, tries=2):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml, */*"})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=8) as r:
                raw = r.read(4_000_001)
                if len(raw) > 4_000_000: raise ValueError("kanał przekracza 4 MB")
                return raw
        except Exception:
            if i == tries - 1: raise
            time.sleep(0.5)

def parse(name, raw):
    out = []
    try:
        root = ET.fromstring(raw)
    except ET.ParseError as e:
        raise ValueError("niepoprawny RSS/Atom") from e
    if root.tag not in ("rss", "{http://www.w3.org/2005/Atom}feed", "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}RDF"):
        raise ValueError("odpowiedź nie jest kanałem RSS/Atom")
    ns = {"content": "http://purl.org/rss/1.0/modules/content/", "atom": "http://www.w3.org/2005/Atom"}
    items = root.findall(".//item") or root.findall(".//atom:entry", ns)
    for it in items:
        def g(tag):
            e = it.find(tag, ns)
            return (e.text or "").strip() if e is not None and e.text else ""
        title = html.unescape(g("title") or g("atom:title"))
        links = it.findall("atom:link", ns)
        link = g("link") or next((e.get("href", "") for e in links if e.get("rel", "alternate") == "alternate"), "")
        if not link.startswith(("https://", "http://")): continue
        date = g("pubDate") or g("atom:updated") or g("atom:published")
        desc = html.unescape(re.sub(r"<[^>]+>", " ", g("description") or g("content:encoded") or g("atom:summary")))
        try:
            d = email.utils.parsedate_to_datetime(date) if "," in date or date[:2].isalpha() else dt.datetime.fromisoformat(date.replace("Z", "+00:00"))
        except Exception:
            d = None
        out.append({"zrodlo": name, "tytul": title, "url": link, "data": d.date().isoformat() if d else "", "_d": d, "opis": desc[:400]})
    return out

def canonical(url):
    p = urlsplit(url)
    q = [(k, v) for k, v in parse_qsl(p.query) if not k.startswith("utm_") and k not in ("fbclid", "gclid")]
    return urlunsplit((p.scheme, p.netloc.lower().removeprefix("www."), p.path.rstrip("/"), urlencode(q), ""))


def scan_feed(feed, since, now):
    name, url, mode = feed
    stamp = now.astimezone(ZoneInfo("Europe/Warsaw")).isoformat(timespec="seconds")
    stat = {"zrodlo": name, "url": url, "grupa": urlsplit(url).hostname.removeprefix("www."), "sprawdzono": stamp}
    try:
        items = parse(name, fetch(url))
        stat.update(wpisy=len(items), ok=True)
    except Exception as e:
        stat.update(wpisy=0, ok=False, blad=str(e)[:160])
        return stat, []
    hits = []
    for it in items:
        d = it.pop("_d")
        if d and d.tzinfo is None: d = d.replace(tzinfo=dt.timezone.utc)
        if d and (d < since or d > now + dt.timedelta(hours=24)): continue
        txt = it["tytul"] + " " + it["opis"]
        key, strong = (KEY_EU, STRONG_EU) if mode == "eu" else (KEY_AR, STRONG_AR) if mode == "ar" else (KEY_ROUTES, KEY_ROUTES)
        if SZALONA.search(txt) and HUB.search(txt):
            it.update(sila="dolot", tryb="lot-szalona-sroda")
        elif key.search(txt):
            it.update(sila="silne" if strong.search(txt) else "slabe", tryb=mode)
        else: continue
        it["status"] = "trop" if d else "brak daty - do sprawdzenia"
        hits.append(it)
    return stat, hits


def scan(days=7, workers=6):
    now = dt.datetime.now(dt.timezone.utc)
    since = now - dt.timedelta(days=days)
    hits, stats = {}, []
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        for stat, found in pool.map(lambda f: scan_feed(f, since, now), FEEDS):
            stats.append(stat)
            for item in found:
                key = canonical(item["url"])
                if key in hits:
                    hits[key]["kanaly"].append(item["zrodlo"])
                else:
                    item["kanaly"] = [item["zrodlo"]]
                    hits[key] = item
    order = {"silne": 0, "dolot": 1, "slabe": 2}
    found = sorted(hits.values(), key=lambda x: x["data"], reverse=True)
    found.sort(key=lambda x: order.get(x["sila"], 3))
    return {"sprawdzono": now.astimezone(ZoneInfo("Europe/Warsaw")).isoformat(timespec="seconds"),
            "dni": days, "kanaly": stats, "trafienia": found,
            "stan": "pelny" if all(s["ok"] for s in stats) else "czesciowy",
            "uwaga": "RSS to tropy, nie potwierdzone oferty. Fora, komentarze, newslettery i ceny linii wymagają osobnego odczytu. Kanały jednego portalu nie są niezależnymi źródłami."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--days", type=int, default=7)
    parser.add_argument("--json")
    args = parser.parse_args()
    if not 1 <= args.days <= 90: parser.error("--days: zakres 1-90")
    res = scan(args.days)
    if args.json:
        dest = os.path.abspath(args.json)
        fd, temp = tempfile.mkstemp(dir=os.path.dirname(dest), prefix=".rss-", suffix=".json")
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(res, f, ensure_ascii=False, indent=1); f.write("\n")
            os.replace(temp, dest)
        finally:
            if os.path.exists(temp): os.unlink(temp)
    stats, hits = res["kanaly"], res["trafienia"]
    print(f"Kanały: {sum(s['ok'] for s in stats)}/{len(stats)} ok · unikalne tropy: {len(hits)} · {res['sprawdzono']}")
    for h in hits: print(f"[{h['sila']}] {h['data']} {h['zrodlo']}: {h['tytul']} - {h['url']}")
    for s in stats:
        if not s["ok"]: print(f"Niedostępny: {s['zrodlo']}: {s['blad']}")
    # Częściowy wynik jest użyteczny; zero działających kanałów to awaria.
    return 0 if any(s["ok"] for s in stats) else 1


if __name__ == "__main__":
    sys.exit(main())
