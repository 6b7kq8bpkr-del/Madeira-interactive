"""Testy bez sieci: odczyt, awarie, deduplikacja i daty radaru."""
import importlib.util, pathlib, unittest, datetime as dt
from unittest.mock import patch
path=pathlib.Path(__file__).resolve().parents[2]/'uco/tools/promo_rss.py'
spec=importlib.util.spec_from_file_location('rss',path); rss=importlib.util.module_from_spec(spec);spec.loader.exec_module(rss)
class RSS(unittest.TestCase):
 def test_html_is_failure(self):
  with self.assertRaises(ValueError):rss.parse('test',b'<html><body>Blocked</body></html>')
 def test_broken_xml_is_failure(self):
  with self.assertRaises(ValueError):rss.parse('test',b'<rss>')
 def test_namespaced_content(self):
  raw=b'<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><item><title>Promo</title><link>https://example.org/a</link><content:encoded>Mendoza</content:encoded></item></channel></rss>'
  self.assertEqual(rss.parse('test',raw)[0]['opis'],'Mendoza')
 def test_atom_uses_article_not_self_link(self):
  raw=b'<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Mendoza</title><link rel="self" href="https://example.org/api"/><link rel="alternate" href="https://example.org/a"/></entry></feed>'
  self.assertEqual(rss.parse('test',raw)[0]['url'],'https://example.org/a')
 def test_dedup_partial_and_undated(self):
  raw=b'<rss><channel><item><title>Mendoza promo</title><link>https://example.org/a?utm_source=test</link></item></channel></rss>'
  with patch.object(rss,'FEEDS',[('a','https://example.org/feed','eu'),('b','https://example.org/tag/feed','eu'),('bad','https://bad.example/feed','eu')]), patch.object(rss,'fetch',side_effect=lambda u: b'<html/>' if 'bad.example' in u else raw):
   r=rss.scan(3)
  self.assertEqual(len(r['trafienia']),1);self.assertEqual(r['stan'],'czesciowy');self.assertEqual(sum(s['ok'] for s in r['kanaly']),2)
  self.assertEqual(r['trafienia'][0]['status'],'brak daty - do sprawdzenia')
  self.assertEqual(r['trafienia'][0]['kanaly'],['a','b'])
 def test_old_news_not_new_deal(self):
  raw=b'<rss><channel><item><title>Mendoza</title><link>https://example.org/a</link><pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate></item></channel></rss>'
  now=dt.datetime(2026,11,26,tzinfo=dt.timezone.utc)
  with patch.object(rss,'fetch',return_value=raw):
   stat,hits=rss.scan_feed(('a','https://example.org/feed','eu'),now-dt.timedelta(days=3),now)
  self.assertTrue(stat['ok']);self.assertEqual(hits,[])
if __name__=='__main__':unittest.main()
