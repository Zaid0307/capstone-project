# Auftrag an die Katalog-Helfer (gemeinsamer Teil)

Projekt: C:\Users\faree\Documents\Claude\Repos\capstone-project (GetFit!, Fitness-App). Du bist ein Helfer im App-Team und arbeitest am Übungskatalog V2 (Karte E31 im gemeinsamen Board design-handoff/from-design/redesign-kanban.md). Fünf andere Helfer arbeiten gleichzeitig an anderen Körperbereichen.

LIES ZUERST VOLLSTÄNDIG: design-handoff/uebungskatalog-v2/README.md (verbindliches Format und Regeln), design-handoff/uebungskatalog-v2/geraete.json, design-handoff/uebungskatalog-v2/gelenke.json, src/data/muscles.js (Muskelmodell, nur Blatt-IDs verwenden), docs/muskelmodell.md, und die bestehenden Übungen in src/data/exercises/*.js (für deine bestehenden IDs: Muskeln und Texte dort als Ausgangspunkt nehmen, fachlich prüfen und verbessern).

Ziel des Nutzers: eine große Übungsliste mit allen Geräten, Bändern, Körpergewicht und (in den passenden Bereichen) Yoga; zu jeder Übung die genaue Ausführung und welche Muskeln arbeiten, stabilisieren oder gedehnt werden – für Anzeige und Auswertung in der App – und die Bewegungsdaten, Geräte und Kontaktpunkte so genau, dass das Grafik-Team später mit vielen parallelen Agenten Animationen und Standbilder bauen kann.

Qualität vor Menge: anatomisch strikt korrekt (Terminologia Anatomica), keine erfundenen Zonen, realistische Gelenkwinkel, sichere Ausführung, eigene Formulierungen (nichts kopieren), Deutsch in Du-Form und Englisch. Nutze seriöse Quellen (Lehrbücher, NSCA/ACSM, Fachartikel, EMG-Studien); Websuche ist erlaubt. Wenn eine Muskelbeteiligung strittig ist, die vorsichtigere Rolle wählen und im Bericht begründen.

Varianten: Jede Grundbewegung möglichst in ihren üblichen Ausführungen erfassen (Langhantel, Kurzhantel, Kettlebell, Kabelzug, Maschine, Band/Expander, Schlingentrainer, Körpergewicht – soweit es sie wirklich gibt und sie sinnvoll sind) und über "variants", "regression", "progression" verknüpfen.

ARBEITSWEISE:
- Schreibe NUR deine eigene Datei design-handoff/uebungskatalog-v2/uebungen/<BEREICH>.json (ein JSON-Array) und deinen Bericht design-handoff/uebungskatalog-v2/berichte/<BEREICH>.md. Sonst NICHTS ändern (kein src/, keine geraete.json, kein README, kein Board, kein git commit, nichts installieren).
- Arbeite in Blöcken von etwa 10 Übungen: schreiben, dann prüfen mit `python -I scripts/validate_exercise_catalog.py <BEREICH>` und Fehler beheben, dann den nächsten Block. Hinweise "Variante fehlt im Katalog (Hinweis …)" zu IDs anderer Bereiche sind bis zum Schluss erlaubt; verweise nur auf Übungen anderer Bereiche, die es mit hoher Wahrscheinlichkeit dort gibt (z. B. bestehende IDs aus src/data/exercises), sonst lass den Verweis weg.
- JSON-Dateien mit einem Python-Skript in deinem Scratchpad schreiben (json.dump mit ensure_ascii=False, indent=1) und mit `python -I` ausführen; Bash-Heredocs verschlucken Backslashes.
- Fehlt ein Gerät oder ein Muskel: nicht erfinden, im Bericht melden (Abschnitte "Fehlende Geräte", "Fehlende Muskeln" mit Vorschlag und Begründung).
- Zuständigkeit, damit keine IDs doppelt entstehen: Brust/Rücken inkl. Trapez, Rückenstrecker, Hyperextension, Shrugs = brust-ruecken; Schultern, Rotatorenmanschette, Arme, Unterarme/Griff, Nacken = schultern-arme; Beine, Gesäß, Waden, Hüftabduktoren/-adduktoren, Kniebeuge-, Hüftstreck- und Ausfallschritt-Muster inkl. Kettlebell-Swing = beine-gesaess; Bauch/Rumpf, Anti-Rotation, Tragen (Farmer's Walk), Turkish Get-up, alles Pilates = rumpf-pilates; Mobility, Dehnen, Faszienrolle, alle Yoga-Haltungen (auch kräftigende wie Krieger) = mobility-dehnen-yoga; Cardio-Geräte, Laufen/Gehen, Seilspringen, Boxen/Kampfsport, Plyometrie/Sprünge, Burpees, olympische Bewegungen und Ganzkörper-Kombinationen (Thruster, Clean), Schlitten, Battle Rope = cardio-boxen-athletik.
- Am Ende: Datei vollständig prüfen (keine Fehler außer Varianten-Hinweisen auf andere Bereiche), Bericht schreiben (Anzahl, Liste der IDs mit Kategorie, Fehlende Geräte, Fehlende Muskeln, strittige Punkte, Quellenliste).

ANTWORT AN MICH: höchstens 10 Zeilen (Anzahl Übungen bestehend/neu, Prüfergebnis, wichtigste fehlende Geräte/Muskeln).
