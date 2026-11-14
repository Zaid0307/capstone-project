# Animationen und Zubehör – Zwischenstand

Danke für den Abgleich zur ID floor und zum Plan-Editor. Die Medien bleiben den bestehenden Übungs- und Geräte-IDs zugeordnet. Die laufenden Arbeiten betreffen Kniebeuge, Seilspringen und drei Bandtypen.

Die Kurzhanteln zur Katalog-ID dumbbells liegen als zwei bearbeitbare Modelle mit getrennten Griffen und Köpfen vor. Beim Wiederöffnen wurden die Griffmittelpunkte und die vier Übergänge von Griff zu Kopf geprüft. Figurenkontakt und Bewegung stehen aus. [Kurzhantelstudie](../fitness-graphics/production-v13/validation/dumbbells-hex-study.json)

Rückmeldungen bitte wie bisher in feedback-entwicklung.md im Austauschordner ablegen. Die Nutzbarkeitsprüfung folgt mit dem vollständigen Paket.

## Geprüfte Zubehörbewegungen

- Das Springseil dreht in der bearbeitbaren Studie mit 80 Umdrehungen pro Minute. In 145 Messpunkten blieben die Griffverbindungen geschlossen und die Seillänge konstant. Handsynchronisation und Seildurchlauf unter den Füßen sind offen. [Seilschwung](../fitness-graphics/production-v13/validation/jump-rope-swing-study.json)
- Widerstandsband, Miniband und Klimmzug-Hilfsband liegen mit getrennten Formen und bewegten Kontaktmarken vor. Alle 41 Bilder je Band wurden technisch geprüft. Die Verformung ist eine Studie, die Anbindung an Figuren und Anker steht aus. [Bandstudien](../fitness-graphics/production-v13/validation/pilot-bands-study.json)
- Die zwei bearbeitbaren V38-Kniebeugen zeigen korrigierte Schuhsohlen. Ferse und Vorfuß lagen bei beiden Figuren in jeweils 97 Stichproben innerhalb von 0,02 mm der Bodenebene. Die Bewegung blieb erhalten. Die Mittelsohle der weiblichen Figur und die Übungstechnik brauchen weitere Prüfung. [Kniebeugenprüfung](../fitness-graphics/production-v13/validation/squat-heel-fit-v38-contact.json)

## Figuren und gerenderte Vorschauen

- Für beide Figuren liegt je eine vier Sekunden lange Kniebeugenvorschau als MP4 vor. Die 48 Bilder je Video wurden technisch geprüft, zehn dekodierte Einzelbilder wurden gesichtet. Bodenhelligkeit, weiblicher Sohlenübergang und Übungstechnik stehen zur weiteren Prüfung. [Videobericht mit Dateipfaden](../fitness-graphics/production-v13/validation/squat-v38-loop-render.json)
- Die Seilgriffe sind an beide Handgelenke der weiblichen Figur gekoppelt. An sechs auffälligen Zeitpunkten aus der Fußpassage ergab der genauere Test keinen Schnitt von Schuh und Seil. Fingerhaltung und die natürliche Sprungbewegung stehen aus. [Figurenstudie zum Seil](../fitness-graphics/production-v13/validation/jump-rope-hand-contact-study.json)
- Eine bearbeitbare Szene führt das Miniband um die Oberschenkel der weiblichen Figur. In 17 Messbildern blieb die gemessene Eindringtiefe unter 0,5 mm. An den Kontaktmarken bleiben bis zu 15,5 mm Abstand zur Leggings. Die Seitwärtsschritte fehlen. [Miniband-Passform](../fitness-graphics/production-v13/validation/miniband-figure-fit-study.json)

Stand der finalen Übungsmedien ist 0 von 194 Figuren-/Übungspaaren.

## Sichtprüfung aller Kniebeugenbilder

Beide V38-Videos wurden vollständig dekodiert und als Bildfolgen mit je 48 Bildern gesichtet. Im kleinen Prüfformat waren beide Figuren über die gesamte Abwärts- und Aufwärtsbewegung vollständig im Bild. Die Bodenhelligkeit springt sichtbar zwischen aufeinanderfolgenden Bildern, besonders bei der weiblichen Figur. Für den nächsten Renderdurchgang braucht der Boden eine gleichmäßige Darstellung. Die Bildfolgen sind eine Sichtprüfung der Vorschauen. Die Übungstechnik und die Sohlenform bleiben in Prüfung.

- [Bildfolge der männlichen Figur](../fitness-graphics/production-v13/renders/squat-heel-fit-v38-loops/char_male_01_all-frames-review.png)
- [Bildfolge der weiblichen Figur](../fitness-graphics/production-v13/renders/squat-heel-fit-v38-loops/char_female_01_all-frames-review.png)

## Kniebeugen mit gleichmäßigem Boden

Die beiden V38-Videos wurden mit einem Boden neu gerendert, dessen Helligkeit unabhängig von der Szenenbeleuchtung ist. In je 48 dekodierten Bildern sank die Schwankung der gemessenen Bodenfläche von 87,76 auf 0,16 RGB-Stufen beim Mann und von 82,83 auf 0,17 bei der Frau. Beide Bildfolgen wurden gesichtet. Die Videos bleiben Prüfvorschauen. Die Übungstechnik und der weibliche Sohlenübergang bleiben offen. [Bericht mit Video- und Bildpfaden](../fitness-graphics/production-v13/validation/squat-v38-stable-floor-render.json)

## Rückfrage zum Plan-Editor

Die neue Rückmeldung M1–M4 und A1–A2 ist angekommen. Bitte lege die exakte aktuelle Muskel-ID-Liste mit Ansichtszuordnung und die priorisierten Übungs-IDs aus den 23 Vorlagen als JSON oder Markdown im Austauschordner ab. Bitte kennzeichne dabei alle Varianten-IDs außerhalb des bisherigen Katalogs mit 97 Übungen. Dann können wir Masken und Animationen gegen dieselben IDs prüfen. Für den Plan-Editor verwenden wir die neutralen Masken und liefern je fertiger Übungsschleife ein PNG-Standbild.

Für beide Kniebeugen-Prüfvideos liegt jetzt je ein geprüftes PNG-Standbild aus Frame 25 vor. Dateipfade und Prüfsummen stehen im Bericht zu den Videos mit gleichmäßigem Boden.

## Bewegungstiefe der Kniebeuge

Die Bewegungsprüfung erfasst je Figur 97 Zeitpunkte der bearbeitbaren V38-Kandidaten. Der tiefste Messpunkt liegt bei beiden in Bild 25. Der Oberschenkel verläuft dort anhand der Rig-Punkte rund 33 Grad beim Mann und 28 Grad bei der Frau über der Waagerechten. Die gemessene Kniebeugung beträgt rund 78 beziehungsweise 84 Grad. Damit ist die bisherige Abwärtsbewegung quantifiziert. Die Wahl der Zieltiefe und die Übungstechnik stehen weiter zur Prüfung. [Messbericht](../fitness-graphics/production-v13/validation/squat-v38-rig-depth.json)

Die Taktungsprüfung findet den tiefsten Hüftpunkt bei beiden Figuren nach zwei Sekunden. Auf der Abwärts- und Aufwärtsstrecke gab es in den Halbframe-Stichproben keine Richtungswechsel über 1 mm. [Taktungsbericht](../fitness-graphics/production-v13/validation/squat-v38-timing.json)

## Abgleich mit Muskelmodell V1

Die 97 Übungs-IDs stimmen zwischen dem App-Export und dem Grafikkatalog vollständig überein. Bei den 81 Ziel-Masken haben 23 eine direkt gleichlautende vorhandene Quell-ID. Für 36 weitere gibt es eine Eltern- oder Alt-ID-Beziehung, deren einzelne Quellkomponenten wir prüfen müssen. Für die übrigen 22 fand der erste ID-Abgleich keine Beziehung. Der Bericht enthält die vollständige Liste. Die Zahlen beziehen sich auf IDs und Quellen. Die Passung und Anatomie jeder Maske muss separat geprüft werden. Die Reihenfolge aus den 23 Vorlagen ist noch offen. [ID-Abgleich](../fitness-graphics/production-v13/validation/app-muscle-model-v1-id-comparison.json)

## Neue Bewegungskandidaten

- V39 zeigt eine tiefere Kniebeuge der männlichen Figur. Der Oberschenkelwinkel am tiefsten Punkt beträgt rund 15 Grad über der Waagerechten statt 33 Grad. Die gemessenen tiefsten Sohlenpunkte lagen in 97 Stichproben innerhalb von 0,008 mm zur Bodenebene. Drei Posen wurden gesichtet. Die Übertragung auf die weibliche Figur und die vollständige Bewegungsprüfung stehen aus. [V39-Bericht](../fitness-graphics/production-v13/validation/squat-v39-deeper-motion.json)
- Für die weibliche Figur gibt es einen animierten Seitwärtsschritt mit Miniband über 25 Bilder. Beide Füße versetzen sich um je 19 cm. Ferse und Vorfuß erreichen in den gemessenen Standphasen die Bodenebene. Die Armhaltung wirkt steif und am Band bleibt ein sichtbarer Spalt. [Seitwärtsschritt-Bericht](../fitness-graphics/production-v13/validation/lateral-band-walk-study-v1.json)

## Auftrag vom 13.11. um 16:30 Uhr

00-AKTUELL-AN-GRAFIK.md gelesen. Für den Ganzkörperatlas verwenden wir die App-IDs und getrennte tiefe Ebenen. Für lange und kurze Bizepsköpfe liegen je Figur neutrale SVG-Kandidaten in der Frontansicht vor. Schulter- und Ellenbogenansätze sowie überlappende Projektionsbereiche brauchen weitere Sicht- und Anatomieprüfung. [Maskenbericht](../fitness-graphics/production-v13/validation/biceps-leaf-mask-fit-v1.json)

Die konkrete Prioritätenliste aus den 23 Vorlagen bleibt offen. Bitte als Liste bestehender Übungs-IDs im Austauschordner ablegen.

## V39 für beide Figuren

Die tiefere Kniebeuge liegt für beide Figuren als bearbeitbare Blender-Aktion und viersekündiges MP4 vor. Bei der weiblichen Figur liegen die Oberschenkel am tiefsten Punkt rund 12 Grad über der Waagerechten, beim Mann rund 15 Grad. Die Fersen- und Vorfußpunkte wurden bei beiden Figuren über je 97 Zeitpunkte geprüft. Je fünf Einzelbilder wurden aus den Videos dekodiert. Bild 25 wurde bei beiden Figuren gesichtet und dient als PNG-Standbild. Die Übungstechnik, der grüne Toprand und der weibliche Sohlenübergang bleiben offen. [V39-Videobericht](../fitness-graphics/production-v13/validation/squat-v39-loop-render.json)

Für die Katalog-ID ez_bar ist eine bearbeitbare SZ-Stange mit technisch geprüften Griffmarken gespeichert. Formübergänge und Figurengriff sind noch offen. [Gerätebericht](../fitness-graphics/production-v13/validation/ez-bar-study.json)

Alle 48 Bilder je V39-Kniebeugenvideo sind in den Prüftafeln gesichtet. Beide Figuren bleiben vollständig im Bild. Die Übungstechnik und feine Kleidungsdetails bleiben in Prüfung.

Der technische Bildvergleich für V39 erfasst jetzt auch den Übergang vom letzten zum ersten Bild und die Bodenhelligkeit. [Schleifenprüfung](../fitness-graphics/production-v13/validation/squat-v39-loop-continuity.json)

## Einseitige Übungen

Der Changelog vom 13.11. nennt die Liste PER_SIDE_EXERCISE_IDS für die L/R-Sätze im Tagebuch. Bitte legt die IDs im Austauschordner ab und gebt an, ob die Vorschau je Übung beide Seiten im selben Clip zeigen soll oder ob der L/R-Umschalter eigene Clips benötigt. Die 194 Übungs-/Figurenpaare bleiben bis zur Klärung die vereinbarte Basis.

Die Links-rechts-Symmetrie der V39-Rigpunkte an Hüfte, Knie und Knöchel ist anhand von 97 Zeitpunkten je Figur dokumentiert. [Symmetrieprüfung](../fitness-graphics/production-v13/validation/squat-v39-rig-symmetry.json)

## Nutzeranforderung zur anatomischen Detailtiefe

Der Nutzer hat bestätigt, dass der Trainingsplan für jede hinzugefügte Übung die beanspruchten Muskeln am gesamten Körper beider Figuren gezielt markieren soll. Das gilt für oberflächliche und tiefe Muskeln sowie für einzeln adressierbare anatomische Köpfe und Anteile. Die Masken sollen sich anhand der Muskel-IDs der App einzeln einfärben lassen. Bei einer isolierten Übung soll die Anzeige den ausgewählten Zielmuskel gezielt hervorheben.

Die 81 Einträge der feinsten Ebene im aktuellen App-Modell sind die bisher vereinbarte Grundlage für die Zuordnung. Der Nutzer hat zusätzlich einzelne Muskelfasern erwähnt. Bitte bei der gemeinsamen Spezifikation zwischen sichtbaren Faserverläufen, separat anwählbaren anatomischen Muskelanteilen und mikroskopisch einzelnen Muskelfasern unterscheiden. Der aktuelle Export adressiert Muskeln, Köpfe und Anteile. Eine Auswahl einzelner mikroskopischer Fasern ist darin nicht definiert.

Die erste separate Tiefenebene ist als Trizeps-Kandidat vorhanden. Der mittlere Kopf liegt in einer eigenen Ebene, der lange und seitliche Kopf in der Rückansicht der Oberflächenebene. Zusammen mit den Bizepsköpfen liegen Kandidaten für fünf Muskel-IDs an beiden Figuren vor. Die anatomische Prüfung steht aus. [Trizeps-Prüfbericht](../fitness-graphics/production-v13/validation/triceps-leaf-mask-fit-v1.json)

## Weitere Tiefenmasken und Kleidung in der tiefen Kniebeuge

Je Figur liegen drei neue neutrale Tiefenmasken vor. Sie zeigen den kleinen Brustmuskel und den Unterschulterblattmuskel von vorne und den Obergrätenmuskel von hinten. Die Vorderansicht demonstriert die Markierung über dem Sporttop. Die anatomische Lage der Ansätze und die Tiefe brauchen weitere Prüfung. Damit enthält der Maskenindex Kandidaten für acht der 81 App-IDs. [Maskenindex](../fitness-graphics/production-v13/data/app-muscle-mask-coverage-v1.json)

Die neue Prüfung über 49 Zeitpunkte der V39-Kniebeugen meldet Stellen an Shorts und Leggings, an denen Kleidungsvertices nach dem Abstandstest innerhalb der Körperoberfläche liegen können. Die stärksten Ausschläge liegen bei beiden Figuren in Bild 29. Diese Stellen brauchen gezielte Sichtprüfung und gegebenenfalls Korrektur. [Kleidungsprüfung](../fitness-graphics/production-v13/validation/squat-v39-garment-clearance.json)

## Kleidungsprüfung in Bild 29

Die Abstandsmessung markiert zwei Punkte an den Shorts und 18 an den Leggings. Das Sporttop bleibt in Bild 29 ohne Auffälligkeit im Abstandstest. Positionen und Abstände sind für eine lokale Anpassung gespeichert. In der schrägen Videoansicht sind die tiefsten gemessenen Stellen nicht eindeutig als sichtbare Durchdringung erkennbar. Für die Korrektur braucht es Nahansichten der markierten Stellen aus mehreren Blickwinkeln. [Messpunkte](../fitness-graphics/production-v13/validation/squat-v39-garment-frame29-locations.json) · [Videobilder](../fitness-graphics/production-v13/renders/squat-deeper-v39-loops/garment-review/)
