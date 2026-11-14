# Muskelmodell V2 – Darstellungsflächen für Muskelbündel

Stand: 2026-11-14. Karte **E24** (Antwort auf G04/N4 der Grafik).
Grundlage: [Muskelmodell V1](muskelmodell.md), Vorschlag [n4-muskelbuendel-vorschlag.md](../design-handoff/from-design/n4-muskelbuendel-vorschlag.md).
Maschinenlesbar: [muskelmodell-v2-entwurf.json](../design-handoff/muskelmodell-v2-entwurf.json).
Die Umsetzung in `src/data/muscles.js` macht die App-Leitung.

## Kurzfassung

- V2 fügt **19 Darstellungsflächen** hinzu: 12 endgültig, 7 vorbehaltlich.
- Alle 93 V1-IDs bleiben unverändert. Die 81 Blätter bleiben die **Übungsebene**.
- Neue IDs haben das Schema `<eltern-id>__<bereich>`. Der doppelte Unterstrich heißt: Darstellungsfläche, keine Übungszuordnung.
- Eine Fläche zeigt, wo ein Muskelteil liegt. Sie sagt nichts über Aktivierung.

## Begriffe

- **Muskel / Muskelteil (V1)**: Eintrag aus `muscles.js`. Die Blätter tragen die Übungsdaten. Beispiel: `pectoralis_major_clavicular`.
- **Darstellungsfläche (neu, `kind: 'region'`)**: anatomisch begründeter Abschnitt eines Blatts. Nur für Masken, Atlas und Auswahl. Beispiel: `longissimus__capitis`.
- **Status `final`**: ID und Abgrenzung stehen fest.
- **Status `vorbehaltlich`**: ID steht fest. Aufnahme in `muscles.js` erst nach Freigabe (Nutzer oder geprüfte Referenzform der Grafik).

## Prüfung je Region

### Großer Brustmuskel – angenommen, keine neuen IDs
- TA2 führt drei Teile: Pars clavicularis, sternocostalis, abdominalis. Sie sind in V1 schon Blätter.
- Neue `__`-IDs wären Doppelzuordnungen. Die drei V1-IDs bleiben die Flächen.
- Der Bauchteil ist klein und in der Ausprägung variabel. Er bleibt als Fläche, weil TA2 ihn führt. Die Grafik soll ihn klein und am unteren Rand des Muskels zeigen.

### Trapezmuskel – angenommen, keine neuen IDs
- Drei TA2-Teile, in V1 schon Blätter. Absteigender Teil vorne und hinten sichtbar (`both`), die anderen hinten. Korrekt.

### Deltamuskel – unverändert
- Drei TA2-Teile, in V1 schon Blätter (`deltoid_anterior/lateral/posterior`). Keine weitere Teilung.

### Breiter Rückenmuskel – angenommen, vorbehaltlich
- TA2 führt **keine** Teile des Latissimus. Die zwei Regionen stammen aus der Architekturstudie von Gerling & Brown (2013): „thoracic“ (T) und „lumbar-pelvic-costal“ (LPC).
- Bogduk et al. (1998) bestätigen die segmentale Faszikelstruktur: Dornfortsätze Th7–L2 (bzw. untere sechs Brustwirbel, L1–L2), Fascia thoracolumbalis, Darmbeinkamm, untere drei Rippen.
- Lehrbücher (z. B. Prometheus) gliedern nach Ursprung in Pars vertebralis, iliaca, costalis und scapularis. Diese Gliederung ist ebenfalls kein TA2-Begriff.
- Entscheidung: Wir übernehmen die zwei Forschungsregionen. Sie sind belegt und als Fläche gut abgrenzbar. Status **vorbehaltlich**, weil sie keine TA2-Teile sind. Der Nutzer entscheidet, ob er außerhalb der TA2 Forschungsgliederungen zulässt.
- Nur Muskelfläche markieren, nicht die Aponeurose der Fascia thoracolumbalis.

### Rückenstrecker – angenommen mit Anpassungen
- Die Regionalteile sind TA-Begriffe (Tah 1794–1805). Die drei Säulen bleiben Übungsebene (heute in 15, 15 und 2 Übungen). Die Regionalteile werden nur Flächen.
- **Abweichung 1, IDs vereinheitlicht**: Der Vorschlag mischte Englisch (`iliocostalis__lumbar`) und Latein (`longissimus__capitis`). V2 nutzt durchgehend die lateinische Endung: `iliocostalis__lumborum`, `__thoracis`, `__cervicis`.
- **Longissimus thoracis**: TA führt eine Pars lumbalis. Die Teilung in `longissimus__thoracis_lumbar` und den Rest `longissimus__thoracis_thoracic` ist richtig und vermeidet Doppelzählung. Übernommen.
- **Iliocostalis thoracis**: In TA98 heißt er „Pars thoracica musculi iliocostalis lumborum“. Lehrbücher und TAH führen ihn als eigenen Teil. Als Fläche unproblematisch.
- **Abweichung 2, Spinalis**: Spinalis cervicis fehlt oft. Spinalis capitis ist inkonstant und meist mit dem Semispinalis capitis verschmolzen (Gray's Anatomy). Beide **vorbehaltlich**: nur belegen, wenn die Referenzform sie zeigt. Spinalis thoracis ist endgültig.
- **Abweichung 3, Sichtbarkeit**: Hals- und Kopfteile liegen unter Trapezius, Splenius und Kopfwender (`deep`). Iliocostalis thoracis liegt größtenteils unter dem Latissimus (`deep`). Lendenteile, Longissimus thoracis und Spinalis thoracis bleiben `back`, weil sie bei trainierten Figuren als Relief neben der Wirbelsäule sichtbar sind.

### Bauch – angenommen, nur Darstellung
- Der Rectus abdominis ist **ein** Muskel. Die Zwischensehnen (Intersectiones tendineae, TA2) teilen ihn in Felder.
- Studien: 96 % von 54 Körperspendern hatten drei Zwischensehnen (Anita et al. 2015). Auch Broyles et al. (2018) fanden meist drei Paare. Drei Sehnen ergeben vier Felder. Die vier Slots sind damit der Regelfall und **endgültig**.
- Zählung von oben nach unten je Seite. Feld 4 liegt unterhalb der Sehne auf Nabelhöhe bis zum Schambein.
- Die Felder sind **reine Darstellungsflächen** (`display_only`). Sie bekommen nie eine Übungszuordnung. Feld 4 heißt in der App nie „unterer Bauch“.
- Linea alba und Zwischensehnen gehören zu keiner Fläche. M. pyramidalis bleibt nicht geführt.
- Äußerer schräger (`front`), innerer schräger und querer Bauchmuskel (`deep`) bleiben ungeteilt. Korrekt.

### Ergänzung: Vorderer Sägemuskel – neu, vorbehaltlich
- Gray's Anatomy und Prometheus beschreiben drei Teile: oberer (1.–2. Rippe zum oberen Schulterblattwinkel), mittlerer (2.–3. Rippe zum medialen Rand), unterer Teil (4.–9. Rippe zum unteren Winkel). Kein TA2-Begriff.
- Sichtbar sind nur die Zacken des unteren Teils seitlich unter dem Brustmuskel. Oberer und mittlerer Teil sind `deep`.
- Vorschlag, weil der Nutzer die „Zacken“ als markierbare Bündel wünscht. **Vorbehaltlich** wie der Latissimus.

### Geprüft und nicht aufgenommen
- **Gluteus medius vorne/mittel/hinten**: nur funktionelle Faserbeschreibung, kein TA2-Teil, keine sichtbare Grenze.
- **Gluteus maximus oben/unten**: kein TA2-Teil.
- **Vastus medialis „obliquus“ (VMO)**: kein TA2-Teil, typische Trainingszone.
- **Latissimus, Pars scapularis**: inkonstant und klein; liegt in der Forschungsgliederung im Brustwirbelanteil.
- **Adductor magnus / Adductor minimus**: TA führt den Adductor minimus. Er liegt tief und ist variabel. Offene Frage, nicht in V2.

## Endgültige ID-Liste V2 (neu)

Gruppe = Gruppe des Elternmuskels. Lateinisch nur, wo ein anatomischer Begriff existiert.

| ID | Eltern | Ansicht | Deutsch | Englisch | Lateinisch | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `latissimus_dorsi__thoracic` | latissimus_dorsi | back | Breiter Rückenmuskel, Brustwirbelanteil | Latissimus dorsi, thoracic region | – | vorbehaltlich |
| `latissimus_dorsi__lumbar_pelvic_costal` | latissimus_dorsi | back | Breiter Rückenmuskel, Lenden-Becken-Rippen-Anteil | Latissimus dorsi, lumbar-pelvic-costal region | – | vorbehaltlich |
| `iliocostalis__lumborum` | iliocostalis | back | Darmbein-Rippen-Muskel, Lendenteil | Iliocostalis lumborum | Musculus iliocostalis lumborum (Pars lumbalis) | final |
| `iliocostalis__thoracis` | iliocostalis | deep | Darmbein-Rippen-Muskel, Brustteil | Iliocostalis thoracis | Musculus iliocostalis thoracis | final |
| `iliocostalis__cervicis` | iliocostalis | deep | Darmbein-Rippen-Muskel, Halsteil | Iliocostalis cervicis | Musculus iliocostalis cervicis | final |
| `longissimus__thoracis_lumbar` | longissimus | back | Längster Rückenmuskel, Brustteil – Lendenabschnitt | Longissimus thoracis, lumbar part | Pars lumbalis musculi longissimi thoracis | final |
| `longissimus__thoracis_thoracic` | longissimus | back | Längster Rückenmuskel, Brustteil – Brustabschnitt | Longissimus thoracis, thoracic part | Musculus longissimus thoracis (ohne Pars lumbalis) | final |
| `longissimus__cervicis` | longissimus | deep | Längster Rückenmuskel, Halsteil | Longissimus cervicis | Musculus longissimus cervicis | final |
| `longissimus__capitis` | longissimus | deep | Längster Rückenmuskel, Kopfteil | Longissimus capitis | Musculus longissimus capitis | final |
| `spinalis__thoracis` | spinalis | back | Dornmuskel, Brustteil | Spinalis thoracis | Musculus spinalis thoracis | final |
| `spinalis__cervicis` | spinalis | deep | Dornmuskel, Halsteil | Spinalis cervicis | Musculus spinalis cervicis | vorbehaltlich |
| `spinalis__capitis` | spinalis | deep | Dornmuskel, Kopfteil | Spinalis capitis | Musculus spinalis capitis | vorbehaltlich |
| `rectus_abdominis__segment_01` | rectus_abdominis | front | Gerader Bauchmuskel, 1. Feld von oben | Rectus abdominis, 1st field from the top | – | final |
| `rectus_abdominis__segment_02` | rectus_abdominis | front | Gerader Bauchmuskel, 2. Feld von oben | Rectus abdominis, 2nd field from the top | – | final |
| `rectus_abdominis__segment_03` | rectus_abdominis | front | Gerader Bauchmuskel, 3. Feld von oben | Rectus abdominis, 3rd field from the top | – | final |
| `rectus_abdominis__segment_04` | rectus_abdominis | front | Gerader Bauchmuskel, 4. Feld von oben | Rectus abdominis, 4th field from the top | – | final |
| `serratus_anterior__superior` | serratus_anterior | deep | Vorderer Sägemuskel, oberer Teil | Serratus anterior, superior part | – | vorbehaltlich |
| `serratus_anterior__intermediate` | serratus_anterior | deep | Vorderer Sägemuskel, mittlerer Teil | Serratus anterior, intermediate part | – | vorbehaltlich |
| `serratus_anterior__inferior` | serratus_anterior | front | Vorderer Sägemuskel, unterer Teil | Serratus anterior, inferior part | – | vorbehaltlich |

Weiter als Flächen genutzt, ohne neue ID: die drei Teile von Pectoralis major, Trapezius und Deltamuskel.

Zahlen: V1 93 Einträge. V2 mit allen Flächen 112 Einträge. Übungsebene unverändert 81 IDs.

## Regeln für Übungsdaten

1. Übungen verweisen nur auf die **81 V1-Blätter**. IDs mit `__` sind in `src/data/exercises/*.js` verboten. Ein Test prüft das.
2. Eine Übung markiert jede ihrer Muskel-IDs als **Vereinigung aller Flächen** dieser ID, gleich stark. Keine Abstufung je Fläche.
3. Klick auf eine Fläche im Atlas: Die App zeigt den Flächennamen. Filter und Übungssuche nutzen den nächsten Vorfahren der Übungsebene. Beispiel: `rectus_abdominis__segment_04` filtert nach `rectus_abdominis`.
4. Auswahl eines Elternmuskels vereinigt alle freigegebenen Kinderflächen. Fehlen Kinderflächen, trägt die bisherige Gesamtmaske.
5. Eine Fläche wird nur nach dokumentierter fachlicher Entscheidung (Studie in dieser Datei) zur Übungsebene. Die ID bleibt dann gleich. Für die Rectus-Felder ist das ausgeschlossen.
6. Die Körperseite steht nur in Masken-Pfad-IDs (`<id>__left`, `<id>__right`), nie in Muskel-IDs oder Übungsdaten.

## Umsetzung in `muscles.js` (für die App-Leitung)

- Neue Einträge mit `kind: 'region'`, `parent`, `group` des Elternmuskels, `view`, `de`, `en`, `latin` (oder `null`). Rectus-Felder zusätzlich `displayOnly: true`.
- `resolveMuscleId(id)` behält seine Bedeutung: es liefert die Übungsebene und überspringt Regionen. Eine Regions-ID löst es zur Übungsebenen-ID des Vorfahren auf.
- Neu: `resolveDisplayRegions(id)` liefert die Flächen für die Masken (oder die ID selbst, wenn sie keine Flächen hat).
- Vorbehaltliche Flächen erst nach Freigabe aufnehmen.

## Migration gespeicherter Pläne

- Keine V1-ID wird umbenannt oder gelöscht. `LEGACY_MUSCLE_IDS` bleibt.
- Gespeicherte Pläne enthalten Übungen, keine Flächen. Sie bleiben unverändert gültig.
- Taucht trotzdem eine Regions-ID in gespeicherten Daten auf, gilt Regel 3 (Auflösung zum Vorfahren).
- Wird eine vorbehaltliche Fläche verworfen, kommt sie in eine Tabelle `RETIRED_REGION_IDS` und zeigt auf ihren Elternmuskel.

## Offene Fragen

- **Nutzer**: Sind Gliederungen aus Forschung und Lehrbuch erlaubt, die kein TA2-Teil sind (Latissimus 2 Flächen, Serratus 3 Flächen)? Bei Nein bleiben beide Muskeln ganz.
- **Grafik**: Zeigt die gemeinsame Referenzform beider Figuren drei Zwischensehnen und damit vier Felder? Sonst nur die tatsächlich modellierten Felder belegen.
- **Grafik**: Sind Spinalis cervicis und capitis in der Referenzform getrennt vom Semispinalis darstellbar?

## Quellen

- FIPAT: *Terminologia Anatomica*, 2. Aufl. (TA2), 2019, Teil 2. [PDF](https://cdn.dal.ca/content/dam/dalhousie/pdf/library/FIPAT/TA2/FIPAT-TA2-Part-2.pdf)
- IFAA: TAH-Quelltabellen (Rückenstrecker-Teile, Tah 1794–1805). [Link](https://ifaa.unifr.ch/Public/TNAEntryPage/prop/ViewPartListLAEN.html)
- Gerling M. E., Brown S. H. M. (2013): Architectural analysis and predicted functional capability of the human latissimus dorsi muscle. *J Anat* 223(2):112–122. [PMC3724205](https://pmc.ncbi.nlm.nih.gov/articles/PMC3724205/)
- Bogduk N., Johnson G., Spalding D. (1998): The morphology and biomechanics of latissimus dorsi. *Clin Biomech* 13(6):377–385. [PubMed 11415812](https://pubmed.ncbi.nlm.nih.gov/11415812/)
- Broyles J. M. et al. (2018): Defining the anatomy of the tendinous intersections of the rectus abdominis muscle. *Ann Plast Surg* 80(1):50–53. [PubMed 28671887](https://pubmed.ncbi.nlm.nih.gov/28671887/)
- Anita, Haque M., Gupta A., Nasar A. (2015): Variation in tendinous intersections of rectus abdominis muscle in North Indian population. *J Clin Diagn Res* 9(6):AC10–AC12. [PMC4525496](https://pmc.ncbi.nlm.nih.gov/articles/PMC4525496/)
- Standring S. (Hrsg.): *Gray's Anatomy*, 42. Aufl., Elsevier 2020 – Serratus anterior (drei Teile), Spinalis capitis/cervicis (inkonstant).
- Schünke M., Schulte E., Schumacher U.: *Prometheus LernAtlas – Allgemeine Anatomie und Bewegungssystem* – Ursprungsteile von Latissimus und Serratus anterior.
