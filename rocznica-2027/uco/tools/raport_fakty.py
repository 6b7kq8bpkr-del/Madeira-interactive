#!/usr/bin/env python3
"""Fakty dnia do raportu lotów (Valle de Uco 2027) – to, czego nie wolno liczyć z pamięci.
Użycie: python3 -I raport_fakty.py [--date RRRR-MM-DD]   wypisuje kurs NBP, okna sprzedaży, fazę i terminy
        python3 -I raport_fakty.py --check [--date …]     błąd, gdy „raport” w loty.json nie jest dzisiejszy albo jest niepełny
Procedura raportu: ../../uco-src/RAPORT.md"""
import sys, json, os, datetime as dt, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, "..", "..", "uco-src", "data", "program.json"), encoding="utf-8"))
L = json.load(open(os.path.join(HERE, "..", "loty.json"), encoding="utf-8"))
D = dt.date.fromisoformat
TODAY = D(sys.argv[sys.argv.index("--date") + 1]) if "--date" in sys.argv else dt.date.today()
pl = lambda d: f"{d.day}.{d.month:02d}.{d.year}"
PROG_KURS = 3.0  # % odchylenia USD od kursu budżetu, od którego raport ma żądać przeliczenia budżetu

def check():
    r, err = L.get("raport") or {}, []
    if r.get("data") != TODAY.isoformat(): err.append(f"raport.data = {r.get('data')}, a dziś jest {TODAY}")
    if len(r.get("werdykt") or "") < 20: err.append("brak werdyktu")
    if len(r.get("punkty") or []) < 4 or any(len(x) != 2 or not all(isinstance(s, str) and s for s in x) for x in r.get("punkty") or []): err.append("punkty: co najmniej 4 pary [nagłówek, treść]")
    if len(r.get("teraz") or []) < 2: err.append("teraz: co najmniej 2 kroki")
    if len(r.get("zrodla") or []) < 3 or any(not str(z.get("url", "")).startswith("https://") or not z.get("label") for z in r.get("zrodla") or []): err.append("zrodla: co najmniej 3, każde z label i adresem https")
    if err: sys.exit("raport lotów: " + "; ".join(err))
    print("ok: raport lotów z", pl(TODAY))

def nbp():
    try:
        with urllib.request.urlopen("https://api.nbp.pl/api/exchangerates/tables/A/?format=json", timeout=30) as r:
            t = json.load(r)[0]
        k = {x["code"]: x["mid"] for x in t["rates"]}
        return t["no"], t["effectiveDate"], k["USD"], k["EUR"]
    except Exception as e:
        return None, None, None, str(e)

def fakty():
    wyl, pow_ = D(P["loty"]["okna"]["wylot"]), D(P["loty"]["okna"]["powrot"])
    print(f"DZIŚ {pl(TODAY)} · do wylotu {(wyl - TODAY).days} dni · raport na stronie z {L.get('raport', {}).get('data')} · monitor z {L.get('zaktualizowano')}")
    for f in P["loty"]["kalendarz"]["fazy"]:
        if f["od"] <= TODAY.isoformat() <= f["do"]: print(f"FAZA {f['faza']} ({pl(D(f['od']))}–{pl(D(f['do']))})")
    ku = P["budzet"]["kursy"]; no, data, usd, eur = nbp()
    if usd is None: print("KURS NBP: nie udało się pobrać –", eur, "– w raporcie napisać, że kurs jest z", ku["data"])
    else:
        h = P["hotels"][0]; m = h["model"]; b = h["budget"]
        usd_para = m.get("usd_para") or m["usd_para_poza"] + m["dom_usd_noc"] * m["noce"] / 3
        eksp = usd_para + P["grupa"]["transport_usd"]["3"] / 3 + (b["jedzenie"] + b["wycieczki_bilety"]) / ku["baza_kosztow"]  # USD na parę, 3 pary
        dz = round(eksp * (usd - ku["USD"]) / 10) * 10; pct = (usd / ku["USD"] - 1) * 100
        print(f"KURS NBP tabela {no} z {pl(D(data))}: USD {usd:.4f}, EUR {eur:.4f} · budżet liczony po USD {ku['USD']} i EUR {ku['EUR']} (z {pl(D(ku['data']))})")
        print(f"  dolar {pct:+.1f}% wobec budżetu = {dz:+d} zł na parę w wariancie polecanym (3 pary)" + (f" · PRZELICZYĆ BUDŻET (próg {PROG_KURS:.0f}%)" if abs(pct) >= PROG_KURS else f" · bez przeliczania (próg {PROG_KURS:.0f}%)"))
    print("SPRZEDAŻ NASZYCH DAT według kalendarzy linii (liczby dni niepotwierdzone – sprawdzić w wyszukiwarce):")
    for l in P["loty"]["okna"]["linie"]:
        a, z = wyl - dt.timedelta(days=l["dni"]), pow_ - dt.timedelta(days=l["dni"])
        st = "sprzedaje w obie strony" if z <= TODAY else f"wylot tak, powrót od {pl(z)}" if a <= TODAY else f"wylot od {pl(a)}, powrót od {pl(z)}"
        print(f"  {l['n']} ({l['dni']} dni): {st}")
    print("TERMINY (zaległe i najbliższe 7 dni):")
    for z in sorted(P["loty"]["zadania"], key=lambda z: z["do"]):
        if z["do"] <= (TODAY + dt.timedelta(days=7)).isoformat(): print(f"  {pl(D(z['do']))}{' PO TERMINIE' if z['do'] < TODAY.isoformat() else ''}: {z['t']}")

check() if "--check" in sys.argv else fakty()
