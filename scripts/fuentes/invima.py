"""Convierte los datasets INVIMA (datos.gov.co) en fabricantes de fuentes públicas para el directorio.

Uso: python3 -I scripts/fuentes/invima.py <dir_con_json> <fecha_descarga> > src/content/public-sources/co-invima.json
Incluye solo certificados con concepto «Cumple» o «Cumple Condicionado» y vencimiento posterior a la descarga.
No publica nombres ni direcciones: el directorio es anónimo.
"""
import json, re, sys, unicodedata
from datetime import date

src, retrieved = sys.argv[1], sys.argv[2]
today = date.fromisoformat(retrieved)

def plain(s):
    return unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().upper()

FORMS = [
    ("softgels", r"CAPSULAS? BLANDAS?"),
    ("capsules", r"CAPSULAS? DURAS?(?! DE GELATINA \(VACIAS\))"),
    ("tablets", r"TABLETAS?|COMPRIMIDOS?|GRAGEAS?"),
    ("gummies", r"GOMAS?|GOMITAS?"),
    ("powders", r"POLVOS?|GRANULADOS?|SOBRES?"),
    ("liquids", r"LIQUIDOS?|SOLUCION|JARABES?|SUSPENSION|EMULSIONES? ORALES?"),
    ("topicals", r"SEMISOLIDOS?|CREMAS?|UNGUENTOS?|GELES|POMADAS?"),
]

def forms_of(concept):
    body = plain(concept).split("NOTAS")[0]
    body = re.sub(r"CAPSULAS DURAS DE GELATINA \(VACIAS\)", "", body)
    return [k for k, rx in FORMS if re.search(rx, body)]

def areas_of(concept):
    body = (concept or "").split("NOTAS")[0]
    items = re.findall(r"^\s*\d+(?:\.\d+)*\.?\s+(.+)$", body, flags=re.M)
    clean = [re.sub(r"\s+", " ", i).strip(" .:").capitalize() for i in items]
    generic = {"No esteriles", "No estériles", "Esteriles", "Estériles", "Solidos", "Sólidos", "Liquidos", "Líquidos", "Semisolidos", "Semisólidos"}
    return [c for c in clean if 3 < len(c) < 90 and c not in generic][:6]

def valid(row):
    if row.get("concepto_corto") not in ("Cumple", "Cumple Condicionado"):
        return None
    v = (row.get("fecha_vencimiento") or "")[:10]
    try:
        d = date.fromisoformat(v)
    except ValueError:
        return None
    return v if d >= today else None

items = []
for r in json.load(open(f"{src}/medicamentos.json")):
    v = valid(r)
    if not v: continue
    items.append({"country": "Colombia", "city": (r.get("ciudad") or "").title(), "region": (r.get("departamento") or "").title(),
                  "scope": "medicines", "forms": forms_of(r.get("concepto")), "areas": areas_of(r.get("concepto")),
                  "certificate": "BPM INVIMA (medicamentos)" + (" · condicionado" if r["concepto_corto"] != "Cumple" else ""), "validUntil": v})
for r in json.load(open(f"{src}/consolidado.json")):
    if "SUPLEMENTOS DIETARIOS" not in plain(r.get("tipo_certificacion")): continue
    v = valid(r)
    if not v: continue
    # En las filas nacionales la fuente pone la ciudad en «pais» y el departamento en «ciudad».
    items.append({"country": "Colombia", "city": (r.get("pais") or "").title(), "region": (r.get("ciudad") or "").title(),
                  "scope": "supplements", "forms": forms_of(r.get("concepto")), "areas": areas_of(r.get("concepto")),
                  "certificate": "BPM INVIMA (suplementos dietarios)" + (" · condicionado" if r["concepto_corto"] != "Cumple" else ""), "validUntil": v})

items = [i for i in items if i["forms"]]
items.sort(key=lambda i: (i["scope"] != "supplements", i["city"]))
json.dump({"source": {"name": "INVIMA · datos.gov.co (BPM)", "url": "https://www.datos.gov.co/resource/xbpm-2jee.json", "retrieved": retrieved},
           "items": items}, sys.stdout, ensure_ascii=False, indent=1)
