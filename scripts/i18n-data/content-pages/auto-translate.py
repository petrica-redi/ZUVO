#!/usr/bin/env python3
"""Generate content-pages/{locale}.json from English source via batched translation."""
import json
import re
import time
from pathlib import Path

from deep_translator import GoogleTranslator

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
OUT_DIR = HERE
CACHE_PATH = HERE / "translation-cache.json"
EN_SOURCE = ROOT / "messages" / "en.json"
DELIM = "\n###REDI###\n"

LOCALE_TARGETS = {
    "it": "it",
    "sq": "sq",
    "ro": "ro",
    "hu": "hu",
    "sk": "sk",
    "cs": "cs",
    "bg": "bg",
    "sr": "sr",
    "hr": "hr",
    "bs": "bs",
    "mk": "mk",
    "sl": "sl",
    "el": "el",
    "tr": "tr",
}

SKIP_PATH_RE = re.compile(
    r"(^rights\.contacts\.|\.name$|Phone$|ombudsman$|antiDiscrimination$|romaRightsOrg$|\.age$)"
)


def flatten(obj, prefix=""):
    out = {}
    if isinstance(obj, list):
        for i, item in enumerate(obj):
            out.update(flatten(item, f"{prefix}[{i}]"))
    elif isinstance(obj, dict):
        for key, value in obj.items():
            path = f"{prefix}.{key}" if prefix else key
            out.update(flatten(value, path))
    elif isinstance(obj, (str, int, float)):
        out[prefix] = str(obj)
    return out


def set_at_path(obj, path, value):
    parts = re.sub(r"\[(\d+)\]", r".\1", path).split(".")
    cur = obj
    for i, part in enumerate(parts[:-1]):
        nxt = parts[i + 1]
        if isinstance(cur, list):
            idx = int(part)
            while len(cur) <= idx:
                cur.append({} if not nxt.isdigit() else [])
            cur = cur[idx]
        else:
            if part not in cur or cur[part] is None:
                cur[part] = [] if nxt.isdigit() else {}
            cur = cur[part]
    last = parts[-1]
    if isinstance(cur, list):
        cur[int(last)] = value
    else:
        cur[last] = value


def unflatten(flat, template):
    out = json.loads(json.dumps(template))
    for path in sorted(flat.keys(), key=lambda p: (p.count("."), p)):
        set_at_path(out, path, flat[path])
    return out


def protect(text):
    tokens = []

    def repl(match):
        tokens.append(match.group(0))
        return f"__PH{len(tokens)-1}__"

    patterns = [
        r"\{[^}]+\}",
        r"\b\d{2,}\b",
        r"\d+/\d+",
        r"mg/dL",
        r"\bTB\b",
        r"\bHIV\b",
        r"\bEU\b",
        r"\bORS\b",
        r"\bCNCD\b",
        r"\bCRISS\b",
        r"\bMaria\b",
        r"\bStefan\b",
        r"\bElena\b",
        r"\bJános\b",
        r"\bAna\b",
        r"\bMirela\b",
        r"Happy Birthday",
    ]
    out = text
    for pat in patterns:
        out = re.sub(pat, repl, out)
    return out, tokens


def restore(text, tokens):
    out = text
    for i, token in enumerate(tokens):
        for variant in (f"__PH{i}__", f"__ PH{i}__", f"__PH {i}__"):
            out = out.replace(variant, token)
    return out


def translate_batch(strings, target):
    protected, work = [], []
    for s in strings:
        p, tokens = protect(s)
        protected.append(tokens)
        work.append(p)
    payload = DELIM.join(work)
    translator = GoogleTranslator(source="en", target=target)
    for attempt in range(4):
        try:
            translated = translator.translate(payload)
            break
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    else:
        translated = DELIM.join(translator.translate(s) for s in strings)
    parts = translated.split("###REDI###")
    if len(parts) != len(strings):
        parts = [translator.translate(s) for s in strings]
    return [restore(part.strip(), protected[i]) for i, part in enumerate(parts)]


def translate_locale(locale, target, en_flat, en_template, cache):
    locale_flat = {}
    paths = list(en_flat.keys())
    batch_size = 10
    for i in range(0, len(paths), batch_size):
        chunk_paths = paths[i : i + batch_size]
        chunk_vals = []
        for p in chunk_paths:
            if SKIP_PATH_RE.search(p):
                locale_flat[p] = en_flat[p]
                continue
            chunk_vals.append((p, en_flat[p]))
        if not chunk_vals:
            continue
        cache_keys = [f"{locale}:{p}" for p, _ in chunk_vals]
        if all(k in cache for k in cache_keys):
            for (p, _), k in zip(chunk_vals, cache_keys):
                locale_flat[p] = cache[k]
            continue
        translated = translate_batch([v for _, v in chunk_vals], target)
        for (p, _), val, k in zip(chunk_vals, translated, cache_keys):
            locale_flat[p] = val
            cache[k] = val
        CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  {locale}: {min(i + batch_size, len(paths))}/{len(paths)}", flush=True)
    for p, v in en_flat.items():
        if p not in locale_flat:
            locale_flat[p] = v
    return unflatten(locale_flat, en_template)


def main():
    en_all = json.loads(EN_SOURCE.read_text(encoding="utf-8"))
    en = {ns: en_all[ns] for ns in ["healthQuiz", "rights", "stories", "challenges", "certificate"] if ns in en_all}
    en_flat = flatten(en)
    cache = json.loads(CACHE_PATH.read_text(encoding="utf-8")) if CACHE_PATH.exists() else {}
    print(f"Translating {len(en_flat)} strings", flush=True)

    for locale, target in LOCALE_TARGETS.items():
        print(f"{locale}...", flush=True)
        out = translate_locale(locale, target, en_flat, en, cache)
        (OUT_DIR / f"{locale}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {locale}.json", flush=True)

    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
