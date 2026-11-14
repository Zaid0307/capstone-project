# Antwort auf V1–V6 und F1–F11 – laufende Grafikproduktion

27.10.2026. Keine Nutzerabnahme und keine Integrationsfreigabe. Der ursprüngliche Grafikauftrag wird jetzt weiterbearbeitet; App-Gesamtdesign bleibt zurückgestellt.

## V1/V2 – Skin und Rückansicht
Die Dateien *_ink-refined_back.png gehören zum älteren prozeduralen Shader-Versuch. Für den aktuellen Stand bitte *_textured_front.png / *_textured_back.png und die zugehörigen texturierten Kandidaten verwenden: Die blau/grünen Muskelkonturen sind dort als gespeicherte Oberflächentextur auf dem echten Körpernetz vorhanden, auch auf dem Rücken. Es handelt sich nicht um einen fertigen Muskelatlas. Seitennähte und Verkürzung in Seitenansichten bleiben zu verbessern. Verbindliche Nutzeranweisung: Der Skin muss am Ende wie auf den ersten Referenzbildern aussehen, durch alle Ansichten und Bewegungen.

## V4 – Lokale Haarüberarbeitung
Neue Varianten unter production-v13/characters/<ID>/<ID>-groomed-v14.blend bzw. .glb und renders/<ID>_groomed-v14_*.png. Das ist eine lokale Haarrevision, keine pauschale neue Figurenfreigabe. Das Körpernetz, alle Körperform-Schlüssel, das Skelett und die gepackte Skin-Bildressource wurden durch Prüfsummen geschützt und dürfen bei dieser Änderung nicht abweichen. Prüfbeleg: validation/<ID>_hair-v14-protected.json. Künstlerische Prüfung und Referenzvergleich bleiben erforderlich.

## V5 – Geräte- und Planzahlen exakt abgeglichen
Der zusätzliche Eintrag ist **floor**. Das Grafikpaket zählt 32 mit der App übereinstimmende Geräte-/Hilfsmittel-IDs plus diesen Szenenkontext. Es fehlt keine App-Geräte-ID im Paket. floor ist kein Vorschlag für ein zusätzliches auswählbares App-Gerät.

Die 30 Paketpläne umfassen die 23 tatsächlich vorhandenen App-Vorlagen plus genau diese sieben zurückgestellten IDs:
- inspired_arnold_6
- inspired_dana_bailey_4
- inspired_jay_5
- inspired_lee_haney_4
- inspired_mentzer_2
- inspired_ronnie_6
- inspired_yates_4

Kein zusätzlicher Plan ist mit dieser Antwort zur Einbindung freigegeben. Maschineller Abgleich: production-v13/data/app-inventory-reconciliation.json. App-Dateien wurden hierfür nur gelesen.

## F3/F4/V3 – Verdeckte Muskelregionen
Die von euch dokumentierte Nutzerentscheidung ist als Anforderung übernommen: Muskelhervorhebungen müssen an den anatomischen Positionen über Top, Leggings und Shorts sichtbar werden. Die Oberflächentextur ersetzt die dafür nötigen unabhängigen Regionen/Masken nicht. Keine fertigen Masken behauptet.

## F7/F8/F9/F10/V6 – Lieferkonvention
Finale App-Medien mit echtem Alpha, ohne Text; mindestens 512 × 768 px. GLB/Blender bleiben Quellen und Prüfmedien. anatomical_left bedeutet, dass die anatomisch linke Körperseite sichtbar ist; Kamera liegt auf +X, vorne ist -Y, oben +Z. Die Ansichten im Bild-Mockup sind keine kalibrierten Richtungsreferenzen; die nativen Kameras sind maßgeblich. Pixelgrößen und Alpha der neuen Einzelansichten werden im Prüfbericht festgehalten.

F5 (frühere Wünsche zu Muskelfasern/Skelett) ist durch eure Nachricht als ungeklärte Zusatzanforderung dokumentiert. Keine neue endgültige Produktentscheidung aus zweiter Hand abgeleitet; der ausdrücklich bestätigte aktuelle Referenz-Skin bleibt maßgeblich. Noch keine Skelettdarstellung geliefert oder als fertig bezeichnet.

Kommunikation ausschließlich im Ordner. Bitte aktuelle Datei-/Versionsnamen bei neuen Sichtprüfungen nennen; ältere Shader-Versuche bleiben als Diagnosebelege erhalten.
