# Übungskatalog V2 – Format und Arbeitsweise

Stand 14.11.2026. Verantwortlich: App-Leitung (Karte **E31** im [gemeinsamen Board](../from-design/redesign-kanban.md)).

Ziel: eine große, fachlich saubere Übungsliste mit allen Geräten, Bändern, Körpergewicht, Yoga, Mobility, Dehnen, Pilates, Cardio und Boxen. Jede Übung ist so genau beschrieben, dass

1. **die App** sie anzeigen, filtern und auswerten kann (Muskeln mit Rolle, Ausführung, Fehler, Sicherheit, Varianten), und
2. **das Grafik-Team** ohne Rückfrage Animation und Standbild bauen kann – auch verteilt auf viele parallele Agenten (Körperlage, Gelenkwinkel je Phase, Kontaktpunkte, Gerät und Einstellung, Kamera, Tempo).

## Dateien

| Datei | Inhalt | Wer schreibt |
|---|---|---|
| `README.md` | Dieses Format | App-Leitung |
| `geraete.json` | Alle erlaubten Geräte-IDs mit Name, Maßen und beweglichen Teilen | App-Leitung (Ergänzungen über Bericht) |
| `gelenke.json` | Erlaubte Gelenk- und Bewegungsnamen für die Bewegungsdaten | App-Leitung |
| `uebungen/<bereich>.json` | Übungen eines Bereichs, ein JSON-Array | je ein Helfer pro Bereich |
| `berichte/<bereich>.md` | Fehlende Geräte oder Muskeln, offene Fragen, Quellen | je ein Helfer |
| `../../scripts/validate_exercise_catalog.py` | Prüfer (Format, IDs, Muskeln, Geräte, Doppelte) | App-Leitung |

Bereiche: `brust-ruecken`, `schultern-arme`, `beine-gesaess`, `rumpf-pilates`, `mobility-dehnen-yoga`, `cardio-boxen-athletik`.

## Format einer Übung

```json
{
  "id": "barbell_bench_press",
  "status": "bestehend",
  "name": { "de": "Langhantel-Bankdrücken", "en": "Barbell bench press" },
  "aliases": { "de": ["Bankdrücken"], "en": ["Bench press", "Flat bench press"] },
  "category": "strength",
  "mechanics": "compound",
  "pattern": "horizontal_push",
  "level": "beginner",
  "laterality": "bilateral",
  "perSide": false,
  "equipment": ["barbell", "bench_flat", "rack"],
  "setup": { "de": "Flachbank im Rack, Ablagen auf Höhe der gestreckten Arme, Sicherungsablagen knapp unter Brusthöhe.", "en": "…" },
  "muscles": {
    "primary": ["pectoralis_major_sternocostal"],
    "secondary": ["pectoralis_major_clavicular", "deltoid_anterior", "triceps_brachii_long", "triceps_brachii_lateral", "triceps_brachii_medial"],
    "stabilizers": ["serratus_anterior", "rhomboid_major", "rhomboid_minor", "trapezius_ascending", "rectus_abdominis"],
    "stretched": []
  },
  "execution": {
    "start": { "de": "…", "en": "…" },
    "steps": [ { "de": "…", "en": "…" } ],
    "breathing": { "de": "…", "en": "…" },
    "tempo": "3-1-1-0",
    "rangeOfMotion": { "de": "…", "en": "…" },
    "cues": [ { "de": "…", "en": "…" } ],
    "mistakes": [ { "de": "…", "en": "…" } ],
    "safety": { "de": "…", "en": "…" },
    "contraindications": { "de": "…", "en": "…" }
  },
  "dose": { "unit": "repetitions", "min": 6, "max": 12, "sets": 3, "restSeconds": 120 },
  "variants": ["dumbbell_bench_press", "machine_chest_press", "push_up"],
  "regression": "dumbbell_bench_press",
  "progression": "close_grip_bench_press",
  "movement": {
    "bodyPosition": "supine",
    "loop": "repeat",
    "durationSeconds": 4,
    "camera": ["side", "front_45"],
    "mirrorAllowed": true,
    "contacts": ["back_on_bench", "feet_on_floor", "hands_on_bar"],
    "equipmentMotion": { "de": "Stange senkrecht über der unteren Brust, Weg leicht diagonal Richtung Schulter.", "en": "…" },
    "phases": [
      { "name": "start", "share": 0, "joints": { "shoulder_flexion": 90, "shoulder_abduction": 60, "elbow_flexion": 0 } },
      { "name": "lowering", "share": 0.5, "joints": { "shoulder_flexion": 0, "shoulder_abduction": 60, "elbow_flexion": 90 } },
      { "name": "pressing", "share": 0.25, "joints": { "shoulder_flexion": 90, "shoulder_abduction": 60, "elbow_flexion": 0 } },
      { "name": "pause", "share": 0.25, "joints": { "shoulder_flexion": 90, "shoulder_abduction": 60, "elbow_flexion": 0 } }
    ]
  },
  "media": { "priority": 1, "figures": ["male", "female"], "assets": ["loop", "still"] },
  "sources": ["NSCA Essentials of Strength Training and Conditioning, 4th ed.", "https://…"]
}
```

## Regeln

- **IDs:** `snake_case`, englisch, eindeutig über alle Bereiche. **Bestehende Übungen behalten ihre ID genau** (`"status": "bestehend"`), neue haben `"status": "neu"`. Die Liste der bestehenden IDs pro Bereich steht im Auftrag des Helfers.
- **Kategorien:** `strength`, `isometric`, `plyometric`, `mobility`, `stretch`, `yoga`, `pilates`, `cardio`, `boxing`. Nur `strength` und `isometric` zählen in der App als Muskelaufbau-Sätze.
- **mechanics:** `compound` | `isolation` | `none`. **level:** `beginner` | `intermediate` | `advanced`. **laterality:** `bilateral` | `unilateral` | `alternating`; `perSide: true`, wenn Werte pro Seite eingetragen werden (einarmig/einbeinig).
- **pattern:** `horizontal_push`, `vertical_push`, `horizontal_pull`, `vertical_pull`, `squat`, `hinge`, `lunge`, `carry`, `rotation`, `anti_rotation`, `anti_extension`, `anti_lateral_flexion`, `flexion`, `extension`, `isolation`, `locomotion`, `jump`, `strike`, `mobility`, `stretch`, `balance`.
- **Muskeln:** NUR Blatt-IDs aus `src/data/muscles.js` (Einträge, die selbst kein `parent` anderer Einträge sind; z. B. `triceps_brachii_long`, nicht `triceps_brachii`). Keine erfundenen Zonen. Rollen:
  - `primary`: Zielmuskel, leistet die Hauptarbeit (in der App 1 Satz).
  - `secondary`: hilft deutlich mit (½ Satz).
  - `stabilizers`: hält Gelenke oder Rumpf stabil, ohne die Bewegung zu treiben (Farblogik „Stabilisator“).
  - `stretched`: wird in der Übung gezielt gedehnt (bei Dehnungen und Yoga der Hauptinhalt, dann darf `primary` leer sein).
  - Ein Muskel steht nur in einer Rolle. Fehlt ein Muskel im Modell (z. B. Tibialis posterior), NICHT erfinden, sondern im Bericht unter „Fehlende Muskeln“ melden.
- **Geräte:** NUR IDs aus `geraete.json`; leeres Array = ohne Gerät. Fehlt ein Gerät, im Bericht unter „Fehlende Geräte“ mit Vorschlag melden und die Übung trotzdem mit dem nächstpassenden Gerät oder vorerst ohne eintragen.
- **Texte:** eigene Formulierungen auf Deutsch und Englisch, kurz und klar, Du-Form im Deutschen. Nichts wörtlich aus Quellen kopieren. Ausführung als 3–6 Schritte.
- **dose:** sinnvoller Standard für einen Plan: Kraft `repetitions` (min, max), Halte-, Dehn-, Yoga-, Cardio- und Boxübungen `seconds` (value). Dazu `sets` und `restSeconds`.
- **Varianten:** nur IDs, die im Katalog existieren (eigener oder anderer Bereich). Die Prüfung meldet unbekannte IDs; vor dem Abschluss alle auflösen.
- **movement (für die Grafik):**
  - `bodyPosition`: `standing`, `seated`, `supine`, `prone`, `side_lying`, `kneeling`, `half_kneeling`, `quadruped`, `hanging`, `plank`, `inverted`, `lunge_stance`, `split_stance`.
  - `loop`: `repeat` (Wiederholung), `hold` (gehaltene Position, leichte Atembewegung), `alternate` (links/rechts im Wechsel), `continuous` (z. B. Laufen, Seilspringen).
  - `camera`: aus `front`, `back`, `side`, `front_45`, `back_45`, `top` – die erste ist die Hauptansicht.
  - `phases`: Gelenkwinkel in Grad, die am **Ende** der jeweiligen Phase erreicht sind (Schlüsselpose); die erste Phase `start` ist die Ausgangsstellung mit `share` 0. `share` = Anteil an der Gesamtdauer (Summe 1). Bei einseitigen Übungen gelten die Winkel für die rechte Seite; die Haltung der anderen Seite steht in `equipmentMotion`. (Festgelegt 14.11.2026, 23:40.) Gelenknamen nur aus `gelenke.json`, Winkel für die rechte Körperseite (bei `alternate` die führende Seite). Neutrale Gelenke weglassen. Ungefähre, realistische Werte reichen.
  - `contacts`: Kontaktpunkte als kurze englische IDs (`feet_on_floor`, `hands_on_bar`, `back_on_bench`, `knees_on_mat`, `band_under_feet` …).
  - `equipmentMotion`: wie sich Gerät, Gewicht oder Band bewegt, in Worten.
- **media.priority:** 1 = wichtig für den Start (häufige Grundübungen), 2 = normal, 3 = selten.
- **sources:** 1–3 seriöse Quellen (Lehrbuch, Verband, Studie, Fachseite), gern mit Link.

## Prüfen

```text
python -I scripts/validate_exercise_catalog.py
```

Meldet Formatfehler, unbekannte Muskeln oder Geräte, Nicht-Blatt-Muskeln, doppelte IDs, Muskeln in zwei Rollen, unbekannte Varianten und fehlende bestehende IDs.
