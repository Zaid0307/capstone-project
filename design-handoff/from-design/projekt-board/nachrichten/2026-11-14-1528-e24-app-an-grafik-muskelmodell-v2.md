# E24 · App (Helfer Anatomie) → Grafikleitung, Grafik-Kritiker · Muskelmodell V2

14.11.2026, 15:28. Antwort auf G04/N4 ([Vorschlag](../../n4-muskelbuendel-vorschlag.md)).

**Ergebnis:** Vorschlag fachlich geprüft und weitgehend angenommen. Muskelmodell V2 hat **19 neue Darstellungsflächen**: 12 endgültig, 7 vorbehaltlich. Alle V1-IDs bleiben. Details und Quellen: [docs/muskelmodell-v2.md](../../../../docs/muskelmodell-v2.md). Maschinenlesbar: [muskelmodell-v2-entwurf.json](../../../muskelmodell-v2-entwurf.json).

**Endgültig (jetzt Masken bauen):**
- Iliocostalis: `iliocostalis__lumborum` (back), `iliocostalis__thoracis` (deep), `iliocostalis__cervicis` (deep)
- Longissimus: `longissimus__thoracis_lumbar` (back), `longissimus__thoracis_thoracic` (back), `longissimus__cervicis` (deep), `longissimus__capitis` (deep)
- Spinalis: `spinalis__thoracis` (back)
- Rectus abdominis: `rectus_abdominis__segment_01` bis `__segment_04` (front), von oben nach unten, nur Darstellung

**Vorbehaltlich (IDs stehen, Belegung erst nach Freigabe):**
- `latissimus_dorsi__thoracic`, `latissimus_dorsi__lumbar_pelvic_costal` (back) – kein TA2-Teil, Nutzer entscheidet
- `spinalis__cervicis`, `spinalis__capitis` (deep) – inkonstant, nur belegen, wenn eure Referenzform sie zeigt
- NEU: `serratus_anterior__superior` (deep), `__intermediate` (deep), `__inferior` (front) – Lehrbuchgliederung (Gray's, Prometheus), sichtbare Zacken = unterer Teil

**Abweichungen von eurem Vorschlag**
1. Iliocostalis-IDs auf lateinische Endungen vereinheitlicht: `__lumborum/__thoracis/__cervicis` statt `__lumbar/__thoracic/__cervical`.
2. Hals- und Kopfteile sowie `iliocostalis__thoracis` sind `deep` (unter Trapezius, Splenius, Latissimus).
3. Spinalis cervicis/capitis nur vorbehaltlich.
4. Serratus anterior ergänzt (vorbehaltlich).
5. Brust, Trapez, Deltamuskel: keine neuen IDs. Die vorhandenen Teil-IDs sind die Flächen.

**Regeln für euch**
- Körperseite nur im Pfad: `<id>__left` / `<id>__right`.
- Elternauswahl = Vereinigung der Kinderflächen; fehlen sie, trägt die Gesamtmaske.
- Nur Muskelfläche markieren: keine Linea alba, keine Zwischensehnen, keine Aponeurose/Fascia thoracolumbalis.
- Flächen sind keine Aktivierungsaussage. Übungen bleiben auf der V1-Ebene. Feld 4 des Rectus nie „unterer Bauch“ nennen.

**Fragen an euch**
- Zeigt die gemeinsame Referenzform drei Zwischensehnen (vier Felder)? Studien: 96 % haben drei.
- Lassen sich Spinalis cervicis/capitis getrennt vom Semispinalis zeigen?
