"""Strip inline dark-theme styles from SEO content pages; apply content-page classes."""
import re
from pathlib import Path

PAGES = [
    "mushroom-chocolate-bars",
    "buy-shroom-bars",
    "microdosing-chocolate",
    "neau-tropics",
]

ROOT = Path(__file__).resolve().parents[1] / "src" / "app"


def clean(content: str) -> str:
    content = re.sub(
        r"<main style=\{\{[^}]+\}\}>",
        '<main className="content-page">',
        content,
    )
    content = re.sub(r"<h1 style=\{\{[^}]+\}\}>", "<h1>", content)
    content = re.sub(r"<h2 style=\{\{[^}]+\}\}>", "<h2>", content)
    content = re.sub(
        r"<h3 style=\{\{ fontSize: '1\.3rem', fontWeight: 700, marginBottom: '1rem', color: '#c9a44a' \}\}>",
        '<h3 className="content-callout-title">',
        content,
    )
    content = re.sub(
        r"<h3 style=\{\{ fontSize: '1\.4rem', fontWeight: 700, marginBottom: '1rem', color: '#c9a44a' \}\}>",
        '<h3 className="content-callout-title">',
        content,
    )
    content = re.sub(
        r"<h3 style=\{\{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' \}\}>",
        "<h3>",
        content,
    )
    content = re.sub(r'<section style=\{\{ marginBottom: \'3rem\' \}\}>', "<section>", content)
    content = re.sub(
        r"<p style=\{\{ fontSize: '1\.1rem', marginBottom: '1\.5rem' \}\}>",
        "<p>",
        content,
    )
    content = re.sub(r"<p style=\{\{ marginBottom: '1\.5rem' \}\}>", "<p>", content)
    content = re.sub(
        r" style=\{\{ color: '#c9a44a', textDecoration: 'underline' \}\}",
        "",
        content,
    )
    content = re.sub(r"<li style=\{\{ marginBottom: '[^']+' \}\}>", "<li>", content)
    content = re.sub(
        r"<ul style=\{\{ paddingLeft: '2rem', marginBottom: '1\.5rem' \}\}>",
        "<ul>",
        content,
    )
    content = re.sub(
        r"<ol style=\{\{ paddingLeft: '2rem', marginBottom: '1\.5rem' \}\}>",
        "<ol>",
        content,
    )
    content = re.sub(
        r"<section style=\{\{ marginBottom: '3rem', padding: '3rem', backgroundColor: 'rgba\(255,255,255,0\.03\)', border: '1px solid rgba\(201,164,74,0\.3\)', borderRadius: '16px', textAlign: 'center' \}\}>",
        '<section className="content-cta">',
        content,
    )
    content = re.sub(
        r"<div style=\{\{ backgroundColor: 'rgba\(255,255,255,0\.03\)', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid #c9a44a' \}\}>",
        '<div className="content-callout">',
        content,
    )
    content = re.sub(
        r"<Link href=\"([^\"]+)\" style=\{\{ display: 'inline-block', padding: '1rem 2\.5rem', backgroundColor: '#c9a44a', color: '#000', fontWeight: 800, textDecoration: 'none', borderRadius: '50px', letterSpacing: '0\.05em' \}\}>",
        r'<Link href="\1" className="content-cta-btn">',
        content,
    )
    content = re.sub(
        r"<p style=\{\{ marginBottom: '2rem', fontSize: '1\.1rem', color: '#aaa' \}\}>",
        '<p className="content-cta-lead">',
        content,
    )
    return content


def main() -> None:
    for slug in PAGES:
        path = ROOT / slug / "page.tsx"
        text = path.read_text(encoding="utf-8")
        path.write_text(clean(text), encoding="utf-8")
        print(f"Updated {path.relative_to(ROOT.parents[1])}")


if __name__ == "__main__":
    main()
