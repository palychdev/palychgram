import json, shutil, zipfile
from pathlib import Path

ROOT = Path(__file__).parent
DIST = ROOT / "dist" / "chrome"

def main():
    base = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    base.pop("browser_specific_settings", None)
    base["background"] = {"service_worker": "src/background/background.js"}

    if DIST.exists():
        shutil.rmtree(DIST)
    (DIST / "src").mkdir(parents=True)
    shutil.copytree(ROOT / "src", DIST / "src", dirs_exist_ok=True)
    (DIST / "manifest.json").write_text(json.dumps(base, ensure_ascii=False, indent=2), encoding="utf-8")

    out = Path.home() / "Desktop" / f"palychgram-chrome-{base['version']}.zip"
    if out.exists():
        out.unlink()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for p in [DIST / "manifest.json", *sorted((DIST / "src").rglob("*"))]:
            if p.is_file():
                z.write(p, p.relative_to(DIST))
    print("chrome dist:", DIST)
    print("zip:", out)

if __name__ == "__main__":
    main()
