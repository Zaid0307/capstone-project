"""Checks the exercise catalog V2 in design-handoff/uebungskatalog-v2/.

Usage: python -I scripts/validate_exercise_catalog.py [area ...]
Without arguments every file in uebungen/ is checked. Exit code 1 on errors.
Format: design-handoff/uebungskatalog-v2/README.md
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'design-handoff' / 'uebungskatalog-v2'
EXISTING_IDS = ROOT / 'scripts' / 'existing_exercise_ids.json'

CATEGORIES = {'strength', 'isometric', 'plyometric', 'mobility', 'stretch', 'yoga', 'pilates', 'cardio', 'boxing'}
MECHANICS = {'compound', 'isolation', 'none'}
LEVELS = {'beginner', 'intermediate', 'advanced'}
LATERALITY = {'bilateral', 'unilateral', 'alternating'}
PATTERNS = {'horizontal_push', 'vertical_push', 'horizontal_pull', 'vertical_pull', 'squat', 'hinge', 'lunge', 'carry',
            'rotation', 'anti_rotation', 'anti_extension', 'anti_lateral_flexion', 'flexion', 'extension', 'isolation',
            'locomotion', 'jump', 'strike', 'mobility', 'stretch', 'balance'}
POSITIONS = {'standing', 'seated', 'supine', 'prone', 'side_lying', 'kneeling', 'half_kneeling', 'quadruped', 'hanging',
             'plank', 'inverted', 'lunge_stance', 'split_stance'}
LOOPS = {'repeat', 'hold', 'alternate', 'continuous'}
CAMERAS = {'front', 'back', 'side', 'front_45', 'back_45', 'top'}
ROLES = ('primary', 'secondary', 'stabilizers', 'stretched')
TEXT_FIELDS = ('start', 'breathing', 'rangeOfMotion', 'safety')


def muscle_leaves():
    text = (ROOT / 'src' / 'data' / 'muscles.js').read_text(encoding='utf-8')
    block = text[text.index('export const MUSCLES = {'):]
    block = block[:block.index('\n};')]
    ids = re.findall(r'^  (\w+): \{', block, re.M)
    parents = set(re.findall(r"parent: '(\w+)'", block))
    return set(ids), {i for i in ids if i not in parents}


def existing_ids():
    # The 99 IDs of the first exercise library; saved plans refer to them.
    return set(json.loads(EXISTING_IDS.read_text(encoding='utf-8')))


def bilingual(value):
    return isinstance(value, dict) and all(isinstance(value.get(k), str) and value[k].strip() for k in ('de', 'en'))


def check(entry, where, muscles, leaves, equipment, joints, errors):
    def err(message):
        errors.append(f'{where} {entry.get("id", "?")}: {message}')

    if not re.fullmatch(r'[a-z0-9]+(_[a-z0-9]+)*', str(entry.get('id', ''))):
        err('id fehlt oder ist kein snake_case')
    if entry.get('status') not in ('bestehend', 'neu'):
        err('status muss "bestehend" oder "neu" sein')
    if not bilingual(entry.get('name')):
        err('name braucht de und en')
    for field, allowed in (('category', CATEGORIES), ('mechanics', MECHANICS), ('level', LEVELS),
                           ('laterality', LATERALITY), ('pattern', PATTERNS)):
        if entry.get(field) not in allowed:
            err(f'{field} "{entry.get(field)}" ist nicht erlaubt')
    if not isinstance(entry.get('perSide'), bool):
        err('perSide muss true oder false sein')
    for item in entry.get('equipment', None) if isinstance(entry.get('equipment'), list) else [None]:
        if item not in equipment:
            err(f'Gerät "{item}" fehlt in geraete.json')

    roles = entry.get('muscles') or {}
    seen = {}
    for role in ROLES:
        values = roles.get(role)
        if not isinstance(values, list):
            err(f'muscles.{role} muss eine Liste sein')
            continue
        for muscle in values:
            if muscle not in muscles:
                err(f'Muskel "{muscle}" gibt es nicht in muscles.js')
            elif muscle not in leaves:
                err(f'Muskel "{muscle}" ist kein Blatt (Köpfe/Anteile verwenden)')
            if muscle in seen:
                err(f'Muskel "{muscle}" steht in {seen[muscle]} und {role}')
            seen[muscle] = role
    if not roles.get('primary') and not roles.get('stretched') and entry.get('category') not in ('cardio', 'boxing'):
        err('primary oder stretched braucht mindestens einen Muskel')

    execution = entry.get('execution') or {}
    for field in TEXT_FIELDS:
        if not bilingual(execution.get(field)):
            err(f'execution.{field} braucht de und en')
    steps = execution.get('steps')
    if not isinstance(steps, list) or not 3 <= len(steps) <= 6 or not all(bilingual(s) for s in steps):
        err('execution.steps braucht 3–6 Schritte mit de und en')
    for field in ('cues', 'mistakes'):
        items = execution.get(field)
        if not isinstance(items, list) or not items or not all(bilingual(i) for i in items):
            err(f'execution.{field} braucht mindestens einen Eintrag mit de und en')

    dose = entry.get('dose') or {}
    if dose.get('unit') == 'repetitions':
        if not (isinstance(dose.get('min'), int) and isinstance(dose.get('max'), int) and 0 < dose['min'] <= dose['max']):
            err('dose: min/max ungültig')
    elif dose.get('unit') == 'seconds':
        if not (isinstance(dose.get('value'), (int, float)) and dose['value'] > 0):
            err('dose: value ungültig')
    else:
        err('dose.unit muss repetitions oder seconds sein')

    movement = entry.get('movement') or {}
    if movement.get('bodyPosition') not in POSITIONS:
        err(f'movement.bodyPosition "{movement.get("bodyPosition")}" ist nicht erlaubt')
    if movement.get('loop') not in LOOPS:
        err(f'movement.loop "{movement.get("loop")}" ist nicht erlaubt')
    cameras = movement.get('camera')
    if not isinstance(cameras, list) or not cameras or any(c not in CAMERAS for c in cameras):
        err('movement.camera ungültig')
    if not isinstance(movement.get('contacts'), list) or not movement['contacts']:
        err('movement.contacts braucht mindestens einen Kontaktpunkt')
    phases = movement.get('phases')
    if not isinstance(phases, list) or len(phases) < (1 if movement.get('loop') == 'hold' else 2):
        err('movement.phases zu kurz')
    else:
        if phases[0].get('share') != 0:
            err('erste Phase braucht share 0')
        total = sum(p.get('share', 0) for p in phases)
        if abs(total - 1) > 0.02 and not (movement.get('loop') == 'hold' and total == 0):
            err(f'Summe der share ist {total:.2f}, nicht 1')
        for phase in phases:
            for joint, angle in (phase.get('joints') or {}).items():
                if joint not in joints:
                    err(f'Gelenk "{joint}" fehlt in gelenke.json')
                if not isinstance(angle, (int, float)) or not -180 <= angle <= 180:
                    err(f'Winkel {joint}={angle} ungültig')
    media = entry.get('media') or {}
    if media.get('priority') not in (1, 2, 3):
        err('media.priority muss 1, 2 oder 3 sein')
    if not isinstance(entry.get('sources'), list) or not entry['sources']:
        err('sources braucht mindestens eine Quelle')


def main(areas):
    muscles, leaves = muscle_leaves()
    equipment = {e['id'] for e in json.loads((CATALOG / 'geraete.json').read_text(encoding='utf-8'))['equipment']}
    joints = set(json.loads((CATALOG / 'gelenke.json').read_text(encoding='utf-8'))['joints'])
    files = sorted((CATALOG / 'uebungen').glob('*.json'))
    errors, all_entries = [], {}
    for path in files:
        try:
            entries = json.loads(path.read_text(encoding='utf-8'))
        except json.JSONDecodeError as error:
            errors.append(f'{path.name}: kein gültiges JSON ({error})')
            continue
        for entry in entries:
            all_entries.setdefault(entry.get('id'), []).append(path.stem)
            if not areas or path.stem in areas:
                check(entry, path.stem, muscles, leaves, equipment, joints, errors)

    for exercise_id, places in all_entries.items():
        if len(places) > 1:
            errors.append(f'doppelte ID {exercise_id} in {", ".join(places)}')
    known = set(all_entries)
    for path in files:
        if areas and path.stem not in areas:
            continue
        for entry in json.loads(path.read_text(encoding='utf-8')):
            for field in ('variants',):
                for ref in entry.get(field) or []:
                    if ref not in known:
                        errors.append(f'{path.stem} {entry["id"]}: Variante "{ref}" fehlt im Katalog (Hinweis, falls ein anderer Bereich sie noch anlegt)')
            for field in ('regression', 'progression'):
                ref = entry.get(field)
                if ref and ref not in known:
                    errors.append(f'{path.stem} {entry["id"]}: {field} "{ref}" fehlt im Katalog (Hinweis, falls ein anderer Bereich sie noch anlegt)')
    if not areas:
        missing = existing_ids() - known
        if missing:
            errors.append('bestehende IDs fehlen im Katalog: ' + ', '.join(sorted(missing)))

    count = sum(len(v) for v in all_entries.values())
    for line in errors:
        print(line)
    print(f'{count} Übungen in {len(files)} Dateien, {len(errors)} Meldungen')
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main(set(sys.argv[1:])))
