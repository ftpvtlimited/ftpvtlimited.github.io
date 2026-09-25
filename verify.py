"""Validate generated routes, local links, metadata and branding without dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent
DIST=ROOT/'dist'
config=json.loads((ROOT/'site.config.json').read_text())
class Document(HTMLParser):
    def __init__(self,text):
        super().__init__(); self.ids=[];self.refs=[];self.h1=0;self.meta={};self.canonical=[];self.images=[];self.title='';self.in_title=False;self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='title':self.in_title=True
        if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
        if tag=='img':self.images.append(a)
        for attr in ('src','href'):
            if attr in a:self.refs.append(a[attr])
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
    def handle_data(self,data):
        if self.in_title:self.title+=data

documents={p:Document(p.read_text(encoding='utf-8')) for p in DIST.rglob('*.html')}
errors=[];link_count=0;titles=[];descs=[]
for path,doc in documents.items():
    rel=path.relative_to(DIST).as_posix()
    redirect=rel in ('privacy/index.html','terms/index.html')
    if doc.h1!=1:errors.append(f'{rel}: expected one h1')
    if len(doc.ids)!=len(set(doc.ids)):errors.append(f'{rel}: duplicate IDs')
    if not redirect:
        titles.append(doc.title);descs.append(doc.meta.get('description'))
        for field in ('description','viewport','og:title','og:description','og:type','og:site_name','twitter:card','twitter:title','twitter:description'):
            if not doc.meta.get(field):errors.append(f'{rel}: missing {field}')
        if 'FT PVT. LIMITED' not in doc.title:
            errors.append(f'{rel}: missing company in title')
    for image in doc.images:
        if 'alt' not in image:errors.append(f'{rel}: missing alt')
    for ref in doc.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc:
            if u.scheme=='mailto' and unquote(u.path)!='kcorporation70@gmail.com':errors.append(f'{rel}: wrong contact email')
            continue
        link_count+=1
        if u.path.startswith('/'):target=DIST/unquote(u.path).lstrip('/')
        elif u.path:target=path.parent/unquote(u.path)
        else:target=path
        if target.is_dir():target=target/'index.html'
        if not target.exists():errors.append(f'{rel}: broken link {ref}')
        elif u.fragment and target.suffix=='.html' and unquote(u.fragment) not in documents[target].ids:errors.append(f'{rel}: missing fragment {ref}')
    text=path.read_text(encoding='utf-8')
    for prohibited in [r'cell[\s_-]*cave',r'cloud-backup',r'video-downloader',r'status-downloader',r'age-calculator',r'switch-smart',r'qr-code-scaner',r'phone-cleaner',r'document-reader-read-all-pdf',r'com\.softwarealliance',r'href=["\x27]#["\x27]']:
        if re.search(prohibited,text,re.I):errors.append(f'{rel}: stale or empty reference {prohibited}')
if len(titles)!=len(set(titles)):errors.append('Duplicate page titles')
if len(descs)!=len(set(descs)):errors.append('Duplicate page descriptions')
sitemap=ET.parse(DIST/'sitemap.xml')
locations=[e.text for e in sitemap.findall('.//{*}loc')]
if len(locations)!=9:errors.append('Expected nine canonical sitemap routes')
for loc in locations:
    route=urlsplit(loc).path
    if not (DIST/route.strip('/')/'index.html').is_file():errors.append('Invalid sitemap route: '+route)
appdirs={p.parent.parent.name for p in DIST.glob('apps/*/privacy/index.html')}
if appdirs!={'all-document-reader'}:errors.append('Unexpected product privacy routes')
result={'html_files':len(documents),'canonical_content_pages':9,'internal_links_and_assets_checked':link_count,'unique_titles':len(set(titles)),'sitemap_urls':len(locations),'errors':errors,'preview_build':not bool(config['site_url'])}
(ROOT/'docs/static-checks.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
if errors:raise SystemExit(1)
