#!/usr/bin/env python3
"""Generate learn/*.json translations from en.learn via batched machine translation."""
import json
import re
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
LEARN_DIR = HERE / "learn"
CACHE_PATH = HERE / "learn-translation-cache.json"
DELIM = "\n###REDI###\n"

LOCALE_TARGETS = {
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

EN_LEARN = json.loads((ROOT / "messages/en.json").read_text())["learn"]


def flatten(obj, prefix=""):
    out = {}
    if isinstance(obj, dict):
        for key, value in obj.items():
            path = f"{prefix}.{key}" if prefix else key
            if isinstance(value, dict):
                out.update(flatten(value, path))
            else:
                out[path] = value
    return out


def unflatten(flat):
    out = {}
    for path, value in flat.items():
        parts = path.split(".")
        cur = out
        for part in parts[:-1]:
            cur = cur.setdefault(part, {})
        cur[parts[-1]] = value
    return out


def protect(text):
    tokens = []

    def repl(match):
        tokens.append(match.group(0))
        return f"__PH{len(tokens)-1}__"

    patterns = [
        r"\{[^}]+\}",
        r"\d+(?:\.\d+)?",
        r"\d+/\d+",
        r"\d+°C",
        r"\d+–\d+",
        r"\b112\b",
        r"\bBCG\b",
        r"\bDTP\b",
        r"\bMMR\b",
        r"\bHib\b",
        r"\bWHO\b",
        r"\bECG\b",
        r"\bEKG\b",
        r"\bTB\b",
        r"\bHIV\b",
        r"\bGDPR\b",
        r"\bBMI\b",
        r"mg/dL",
        r"mmol/L",
        r"Stayin' Alive",
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
    protected = []
    work = []
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
        raise RuntimeError(f"batch translate failed for {target}")
    parts = translated.split("###REDI###")
    if len(parts) != len(strings):
        # fallback per string
        parts = []
        for s in strings:
            parts.append(translator.translate(s))
    return [restore(part.strip(), protected[i]) for i, part in enumerate(parts)]


def translate_locale(locale, target, en_flat, cache):
    locale_flat = {}
    paths = list(en_flat.keys())
    batch_size = 12
    for i in range(0, len(paths), batch_size):
        chunk_paths = paths[i : i + batch_size]
        chunk_vals = [en_flat[p] for p in chunk_paths]
        cache_keys = [f"{locale}:{p}" for p in chunk_paths]
        if all(k in cache for k in cache_keys):
            for p, k in zip(chunk_paths, cache_keys):
                locale_flat[p] = cache[k]
            continue
        translated = translate_batch(chunk_vals, target)
        for p, val, k in zip(chunk_paths, translated, cache_keys):
            locale_flat[p] = val
            cache[k] = val
        CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2))
    return locale_flat


def main():
    LEARN_DIR.mkdir(parents=True, exist_ok=True)
    en_flat = flatten(EN_LEARN)
    cache = json.loads(CACHE_PATH.read_text()) if CACHE_PATH.exists() else {}

    for locale, target in LOCALE_TARGETS.items():
        locale_flat = translate_locale(locale, target, en_flat, cache)
        out = unflatten(locale_flat)
        (LEARN_DIR / f"{locale}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
        print(f"wrote {locale}.json", flush=True)

    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
