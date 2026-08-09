#!/usr/bin/env python3
"""
BIO N:OV — theme schema pre-flight check.

Shopify validates section schemas on upload and, on failure, SILENTLY DROPS
the file. Worse, dropping a section also drops every JSON template that
references it, so a single bad schema can take the whole homepage with it
and the import still reports processingFailed: false.

These four rules were each found the hard way by pushing to a real store
and reading back what survived. Run this before every upload:

    python3 scripts/validate-schemas.py

Exits non-zero if anything would be rejected.
"""

import glob
import json
import os
import re
import sys

THEME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errors = []


def check_settings(settings, where, filename):
    for st in settings:
        sid = st.get("id", "?")

        # RULE 1: a blank default is rejected — omit the key instead.
        if st.get("default") == "":
            errors.append(f'{filename}: {where} "{sid}" has "default": "" (omit the key)')

        # RULE 2: a range default must land exactly on a step.
        if st.get("type") == "range":
            mn, stp, dflt = st.get("min"), st.get("step"), st.get("default")
            if None not in (mn, stp, dflt):
                if round((dflt - mn) / stp, 6) % 1 != 0:
                    errors.append(
                        f'{filename}: {where} range "{sid}" default {dflt} is not a step '
                        f"of min={mn} step={stp}"
                    )
                if not (mn <= dflt <= st.get("max", dflt)):
                    errors.append(f'{filename}: {where} range "{sid}" default out of bounds')

        # A select default must be one of its options.
        if st.get("type") == "select":
            opts = {o["value"] for o in st.get("options", [])}
            if "default" in st and st["default"] not in opts:
                errors.append(f'{filename}: {where} select "{sid}" default not in options')


for path in sorted(glob.glob(os.path.join(THEME, "sections", "*.liquid"))):
    name = os.path.relpath(path, THEME)
    src = open(path, encoding="utf-8").read()
    m = re.search(r"\{%\s*schema\s*%\}(.*?)\{%\s*endschema\s*%\}", src, re.S)
    if not m:
        continue
    try:
        schema = json.loads(m.group(1))
    except Exception as exc:
        errors.append(f"{name}: schema is not valid JSON — {exc}")
        continue

    # RULE 3: a section may declare `presets` or `default`, never both.
    if "default" in schema and "presets" in schema:
        errors.append(f"{name}: declares both 'default' and 'presets' (keep presets only)")

    check_settings(schema.get("settings", []), "section", name)
    for blk in schema.get("blocks", []):
        check_settings(blk.get("settings", []), f'block:{blk["type"]}', name)

    # Preset blocks are an ARRAY of {type, settings}; templates use a keyed object.
    declared = {b["type"] for b in schema.get("blocks", [])}
    for preset in schema.get("presets", []):
        if not isinstance(preset.get("blocks", []), list):
            errors.append(f"{name}: preset blocks must be an array, not an object")
            continue
        for b in preset.get("blocks", []):
            if b["type"] not in declared:
                errors.append(f'{name}: preset uses undeclared block type "{b["type"]}"')

settings_schema = os.path.join(THEME, "config", "settings_schema.json")
if os.path.exists(settings_schema):
    data = json.load(open(settings_schema, encoding="utf-8"))
    # RULE 4: theme_name is capped at 25 characters. Exceeding it makes Shopify
    # replace the ENTIRE settings_schema.json with "[]", leaving the theme with
    # no colour schemes and no theme settings at all.
    theme_name = data[0].get("theme_name", "")
    if len(theme_name) > 25:
        errors.append(
            f"config/settings_schema.json: theme_name is {len(theme_name)} chars (max 25)"
        )
    for group in data[1:]:
        check_settings(group.get("settings", []), f'group:{group.get("name")}', "config/settings_schema.json")

if errors:
    print(f"FAIL — {len(errors)} issue(s) Shopify would reject:\n")
    for e in errors:
        print("  •", e)
    sys.exit(1)

print("PASS — all section schemas and theme settings satisfy Shopify's rules.")
