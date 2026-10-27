"""Imports the plan templates of the graphics package into the app's format.

Usage: python scripts/import_plan_templates.py <path to training-plans.json>

Writes src/data/planTemplates.json. Only the package's own templates are
imported; templates inspired by real athletes stay out until name and
personality rights are clarified (design handoff, open question O9).
The package only has German texts, so the English texts live here. The script
stops if a German text has no translation, so no template is half translated.
"""
import json
import pathlib
import sys

OUTPUT = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'data' / 'planTemplates.json'
WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

PLAN_NAMES_EN = {
    'hypertrophy_fullbody_3': 'Muscle building full body, 3 days',
    'hypertrophy_upperlower_4': 'Muscle building upper/lower, 4 days',
    'hypertrophy_ppl_6': 'Push/Pull/Legs, 6 days',
    'hypertrophy_chest_back_split_4': 'Chest/back and leg focus',
    'hypertrophy_5day_bodypart': 'Five-day bodybuilding split',
    'strength_hypertrophy_4': 'Strength & muscle mass',
    'gym_short_3': 'Compact 30–45 min',
    'bodyweight_beginner_3': 'Getting started with bodyweight',
    'home_band_3': 'Home gym with resistance bands',
    'home_band_4': 'Home gym, 4 days',
    'home_heavybag_band_4': 'Home gym + heavy bag + bands',
    'boxing_technical_3': 'Heavy bag basics + strength',
    'boxing_and_strength_4': 'Boxing + muscle building',
    'mobility_strength_3': 'Healthy muscle building + mobility',
    'mobility_daily_light': 'Mobility, stretching and recovery',
    'women_strength_glutes_4': 'Glutes & muscle building – 4 days',
    'women_strength_pilates_4': 'Strength + Pilates – 4 days',
    'women_pilates_beginner_3': 'Pilates for beginners',
    'women_pilates_strength_5': 'Pilates & defined muscle building',
    'women_home_glutes_band_3': 'Home workout: glutes & bands',
    'women_fullbody_strength_3': 'Strong full body for women',
    'women_mobility_stretch_4': 'Flexibility & Pilates',
    'women_athlete_5': 'Athletic & muscular – 5 days',
}

TEXTS_EN = {
    # Plan description and note.
    'Originales, vollständig editierbares Trainingsprogramm. Keine medizinische Individualberatung.':
        'Original, fully editable training programme. No individual medical advice.',
    'Trainingsprinzipien sind grundsätzlich nicht an ein Geschlecht gebunden; Anzeige nach ausgewähltem Zielprofil.':
        'Training principles are generally not tied to a gender; shown according to the chosen goal profile.',
    # Day names.
    'Beine schwer (kontrolliert)': 'Heavy legs (controlled)',
    'Beine/Körpermitte': 'Legs/core',
    'Boxsack Ausdauer': 'Heavy bag endurance',
    'Boxsack Technik (nicht maximale Schlagkraft)': 'Heavy bag technique (not maximum power)',
    'Brust/Rücken': 'Chest/back',
    'Brust/Trizeps': 'Chest/triceps',
    'Ganzkörper A': 'Full body A',
    'Ganzkörper B': 'Full body B',
    'Glute-Fokus': 'Glute focus',
    'Home Ganzkörper (ersetzt Gym-Übungen)': 'Home full body (replaces gym exercises)',
    'Home Gym Beine': 'Home gym legs',
    'Home Gym Ganzkörper': 'Home gym full body',
    'Home Gym Oberkörper': 'Home gym upper body',
    'Kurztraining A': 'Short workout A',
    'Kurztraining B': 'Short workout B',
    'Legs: Beine': 'Legs',
    'Mobility und Dehnen': 'Mobility and stretching',
    'Oberkörper A': 'Upper body A',
    'Oberkörper B': 'Upper body B',
    'Pause': 'Rest',
    'Pilates A: Core': 'Pilates A: core',
    'Pilates B: Balance': 'Pilates B: balance',
    'Pull: Rücken/Bizeps': 'Pull: back/biceps',
    'Push: Brust/Schultern/Trizeps': 'Push: chest/shoulders/triceps',
    'Rücken/Bizeps': 'Back/biceps',
    'Schultern/Arme': 'Shoulders/arms',
    'Schultern/Trizeps': 'Shoulders/triceps',
    'Unterkörper A': 'Lower body A',
    'Unterkörper B': 'Lower body B',
    # Day notes.
    'Intensität dem Technikstand anpassen; keine Ermüdungs-Schläge mit zusammenbrechender Technik.':
        'Match the intensity to your technique; no tired punches with failing technique.',
    'Regeneration, leichte Alltagsbewegung optional.': 'Recovery; light everyday movement is optional.',
    'Technik, leichte bis moderate Intensität. Hände bandagieren, Boxhandschuhe; Anfänger idealerweise mit qualifiziertem Coach. Keine maximalen Schläge.':
        'Technique at light to moderate intensity. Wrap your hands and wear boxing gloves; beginners ideally with a qualified coach. No maximum punches.',
    # Progression.
    'Alle Sätze technisch sauber im Wiederholungsbereich; wenn obere Grenze kontrolliert erreichbar, Belastung klein steigern. Bei Schmerzen abbrechen.':
        'Do all sets with clean technique within the repetition range; once the upper limit is reached under control, increase the load slightly. Stop if you feel pain.',
    'ca. 2-3, bei längerer Erfahrung und guter Erholung teils 1-2':
        'about 2–3 repetitions in reserve; with more experience and good recovery sometimes 1–2',
    'Erholung, Alltag, Technik und Gesamtvolumen vor pauschaler Intensitätssteigerung priorisieren.':
        'Put recovery, everyday life, technique and total volume before blanket increases in intensity.',
    # Safety.
    'Boxsack erfordert stabile Befestigung, intakte Handschuhe und Handbandagen; Technik vor Schlagkraft.':
        'A heavy bag needs a secure mount, intact gloves and hand wraps; technique before power.',
    'Die Einheiten sind leichte Beweglichkeitseinheiten, kein tägliches intensives Krafttraining.':
        'These are light mobility sessions, not daily intense strength training.',
    'Fortgeschrittenes Programm. Wöchentlichen Umfang und Erholung beobachten, nicht als Anfängerstandard.':
        'Advanced programme. Watch your weekly volume and recovery; not a standard for beginners.',
    'Für Glutes & Beintraining mit Band: passende Bandspannung und Verankerung beachten; Hip-Thrust mit Langhantel erfordert Gerät, andernfalls Glute-Bridge wählen.':
        'For glute and leg training with bands, use suitable band tension and anchoring; the barbell hip thrust needs equipment, otherwise choose the glute bridge.',
    'Kein erzwungenes Muskelversagen, keine Rekordlasten und keine extremen Profi-Umfänge als Standard.':
        'No forced muscle failure, no record loads and no extreme professional volumes as a default.',
}


def both(german):
    if german == '':
        return None
    if german not in TEXTS_EN:
        raise SystemExit(f'Missing English translation for: {german}')
    return {'de': german, 'en': TEXTS_EN[german]}


def convert_entry(entry):
    dose = entry['dose']
    if dose['unit'] == 'seconds':
        dose = {'unit': 'seconds', 'value': dose['target']}
    else:
        dose = {'unit': 'repetitions', 'min': dose['min'], 'max': dose['max']}
    return {
        'exerciseId': entry['exercise_id'],
        'sets': entry['sets'],
        'dose': dose,
        'restSeconds': entry['rest_seconds'],
        'rirTarget': entry['rir_target'],
    }


def convert_plan(plan):
    if plan['cycle_days'] != 7 or len(plan['sessions']) != 7:
        raise SystemExit(f"{plan['id']}: only 7-day cycles map onto weekdays")
    days = []
    for session in sorted(plan['sessions'], key=lambda item: item['day_index']):
        day = session['day']
        days.append({
            'day': WEEKDAYS[session['day_index'] - 1],
            'type': day['type'],
            'name': both(day['name_de']),
            'note': both(day.get('notes_de', '')),
            'entries': [convert_entry(entry) for entry in day['entries']],
        })
    progression = plan['progression']
    return {
        'id': plan['id'],
        'version': plan['schema_version'],
        'name': {'de': plan['name_de'], 'en': PLAN_NAMES_EN[plan['id']]},
        'description': both(plan['description_de']),
        'note': both(plan['note_de']),
        'goals': plan['primary_goals'],
        'level': plan['level'],
        'setting': plan['setting'],
        'audience': plan['sex_filter'],
        'weeklyTrainingDays': plan['weekly_training_days'],
        'progression': {
            'instruction': both(progression['instruction_de']),
            'repsInReserve': both(progression['initial_rir']),
            'recovery': both(progression['rest_days_rule']),
        },
        'safety': {
            'caution': both(plan['safety']['caution_de']),
            'medicalClearance': plan['safety']['medical_clearance_for_pain_pregnancy_rehab'],
        },
        'days': days,
    }


def main(source):
    items = json.loads(pathlib.Path(source).read_text(encoding='utf-8'))['items']
    own = [plan for plan in items if plan['type'] == 'original_editable_template']
    templates = [convert_plan(plan) for plan in own]
    OUTPUT.write_text(json.dumps(templates, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    skipped = len(items) - len(own)
    print(f'Wrote {len(templates)} templates to {OUTPUT.name}, skipped {skipped} athlete-inspired templates.')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
