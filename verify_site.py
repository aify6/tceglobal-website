from pathlib import Path
import re
root = Path('.')
html_files = sorted([p for p in root.glob('*.html')])
link_re = re.compile(r'href=["\']([^"\']+)["\']')
for path in html_files:
    text = path.read_text(encoding='utf-8')
    for href in link_re.findall(text):
        if href.startswith(('http://','https://','mailto:','#','javascript:')):
            continue
        target = (path.parent / href.split('#')[0]).resolve()
        if not target.exists():
            print('MISSING', path.name, href)
img_re = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)
for path in html_files:
    text = path.read_text(encoding='utf-8')
    for src in img_re.findall(text):
        if src.startswith(('http://','https://','data:','mailto:','#')):
            continue
        target = (path.parent / src).resolve()
        if not target.exists():
            print('MISSING_IMG', path.name, src)
for pattern in ['Utako', '10:30', '6:30', 'nav-give', 'aria-extended', 'alert(']:
    hits = []
    for path in html_files:
        text = path.read_text(encoding='utf-8')
        if pattern in text:
            hits.append(path.name)
    if hits:
        print('PATTERN', pattern, hits)
js_path = root/'assets/js/main.js'
try:
    compile(js_path.read_text(encoding='utf-8'), str(js_path), 'exec')
    print('JS_OK', js_path)
except Exception as exc:
    print('JS_ERR', js_path, exc)
css_path = root/'assets/css/styles.css'
css_text = css_path.read_text(encoding='utf-8')
print('CSS_BRACES', css_text.count('{'), css_text.count('}'))
for p in ['assets/js/main.min.js','assets/css/styles.min.css','assets/images/pastors/dr-bukola-williams.png','assets/images/pastors/pst-blessing-bukola-williams.png','assets/images/books/achieving-excellence.png','assets/images/hero-about.webp']:
    print('EXISTS', p, (root/p).exists())
