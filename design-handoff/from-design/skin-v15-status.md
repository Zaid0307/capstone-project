# Aktueller Arbeitsstand: Skin V15, Haarrevision V14

27.10.2026. **Gesamtauftrag weiterhin unvollständig. Keine Nutzerabnahme oder App-Integrationsfreigabe.**

## Neu bearbeitet
- Lokale Haarrevision an beiden echten Figuren. Körpergeometrie, Körperform-Schlüssel, Skelett und bisherige Skin-Ressource blieben dabei per Prüfsumme unverändert.
- Separate seitliche Ink-Zeichnungen, mit Front-/Rückdesign auf der unveränderten Figur verbunden. Bearbeitbare Vier-Projektions-Quelle und gebackene 2048 × 2048 px Hauttextur pro Figur gespeichert.
- Vier native Einzelansichten pro Figur (512 × 768 px mit echtem Alpha). Kein Text im Bild.
- Korrigierter GLB-Export: Im alten Export verdeckten mit ausgegebene Hilfsflächen den Skin. Die eigentliche Bilddatei war korrekt. Das alleinige Entfernen zusätzlicher UV-Kanäle löste den Fehler nicht. Erst die Auswertung der Masken-/Oberflächenmodifikatoren beim Export beseitigte die störenden Hilfsflächen. Die bearbeitbare Quelle wurde nicht destruktiv verändert.
- Kontrollierte Wiederverwendung der bisherigen Kniebeugen-Keyframes auf der neuen Figur. Beim ersten Versuch fehlte der Quaternion-Rotationsmodus; dieser Diagnosefehler ist dokumentiert und korrigiert. Neu geprüft sind fünf native Bewegungsposen je Figur mit identischer gepackter Skin-Datei und ortsfesten Fußknochen. Das ist keine Bewegungs- oder Anatomiefreigabe.

## Maßgebliche Dateien
Unter ../fitness-graphics/production-v13/:
- data/latest-character-candidates.json: aktueller Einstieg für beide Figuren.
- characters/<ID>/<ID>-skin-v15-source.blend: bearbeitbare Mehrfachprojektion.
- characters/<ID>/<ID>-skin-v15-baked.blend: native Figur mit gepacktem gebackenem Skin.
- characters/<ID>/<ID>-skin-v15-runtime.glb: korrigierter Export.
- textures/<ID>_skin-v15-baked.png: 2048er Oberflächentextur; kein Muskelmasken-Atlas.
- renders/<ID>_skin-v15_<Ansicht>.png: native Front-, Rück- und anatomische Seitenansichten.
- animations/<ID>_skin-v15-motion-check.blend: technische Bewegungsprüfung der neuen Skin-Fassung.
- validation/skin-v15-runtime-roundtrip.json sowie skin-v15-matched-aa-comparison.json: vier Rückimport-Sichtvergleiche.
- validation/skin-v15-geometry-roundtrip.json: Oberflächenpositionen vor/nach Export, maximale nächste-Vertex-Abweichung unter 0,000003 m; dies behauptet keine identische Topologie.
- validation/skin-v15-motion-check.json: korrigierte Bewegungsprüfung; Fußknochenabweichung unter 0,000001 m. Das misst keine Sohlenkontakte/Kollisionen.
- data/skin-v15-provenance.json und data/app-inventory-reconciliation.json: Herkunft und Abgleich mit der App.

## Prüfgrenzen
Die vier Rückimportvergleiche bestehen bei gleichen Rendereinstellungen die vorab verwendeten Kriterien: RGB-Abweichung im Körperbereich unter 5/255, Alpha-Übereinstimmung über 0,99 und Farbflächenverhältnis zwischen 0,95 und 1,05. Unterschiedliche Kantenglättungseinstellungen hatten beim ersten Vergleich eine scheinbare Silhouettenabweichung erzeugt; dieser Befund bleibt als Diagnosebeleg erhalten. Die Figuren sind damit nicht künstlerisch oder anatomisch abgenommen.

Die Dateien *-skin-v15-baked.glb und *-skin-v15-single-uv.glb sind fehlgeschlagene Diagnoseexporte, nicht verwenden. Nur *-skin-v15-runtime.glb hat die beschriebene Rückimport-Sichtprüfung bestanden. Ältere GLB-Dateien sind nicht automatisch durch diesen Test mitgeprüft. Die bisherigen vollständigen WebP-/GIF-Kniebeugenloops enthalten noch den älteren V13-Skin; die neue Fassung wurde bisher in fünf Posen geprüft, nicht als neuer finaler Animationsloop geliefert.

Der ursprüngliche Auftrag für Muskelatlas, unabhängige Masken auch über Kleidung, Geräte, sechsübigen Pilot und anschließend 97 Übungen bleibt offen. Keine Serie aus ungeprüfter Anatomie oder Bewegung erzeugen. App-Design bleibt zurückgestellt. Ausschließliche Kommunikation über design-handoff; App-Code wurde nicht geändert.
