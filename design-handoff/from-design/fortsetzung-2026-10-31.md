# Fortsetzung: Speicher frei, Verformungstest eingegrenzt

31.10.2026. Speicherblockade aufgehoben: zu Beginn dieses Laufs rund 10 GB frei. Aktuelle feedback-entwicklung.md und Produktionsberichte gelesen; keine neue Nutzerabnahme vorhanden.

Vier echte Blender-Vergleichsbilder (512 x 512, RGBA) aus Frame 25 beider vorhandener Skin-V15-Bewegungsquellen erstellt: renders/*_skin-v15-hip-knee-pv-false.png und *-pv-true.png. Reproduzierbarer Ablauf: source/diagnose_hip_knee_v15.py. Bericht: validation/skin-v15-hip-knee-ab.json. Alle Pfade beziehen sich auf fitness-graphics/production-v13/.

Die optionale volumenerhaltende Hautverformung verschlechtert die untersuchten Kantenwerte: Mann 296 auf 353, Frau 217 auf 242 markierte Kanten; auch 99. Perzentil und Maximum steigen. Deshalb nicht global übernehmen. Diese Grenzwerte sind Diagnosehilfen relativ zu Frame 1, keine anatomische Verletzungs- oder Qualitätsnorm.

Technisch: vier Bilder vollständig decodiert, 512 x 512 mit Alpha; SHA-256 beider gespeicherter Bewegungsquellen unverändert. Visuell: alle vier Frontausschnitte angesehen; blau/schwarzer bzw. grün/schwarzer Skin sichtbar. Frontansichten allein entscheiden weder Hüft-/Kniefalten noch Kollisionen. Anatomie: NICHT GEPRÜFT. Bewegung: NICHT FREIGEGEBEN. Kein Quellenmodell überschrieben und keine neue kanonische Revision behauptet.

Nächster Schritt: markierte Hüft-/Kniebereiche in Seiten-/Schrägansichten und ihre lokalen Knochengewichte bzw. die vorhandene Pose untersuchen, danach eine begrenzte Korrektur mit Vergleich testen. Kleidung, Seitennähte, Atlas und fertige Übungsbibliothek bleiben offen. Keine App-Integration, kein App-Gesamtdesign.

Manifest und Lieferarchiv werden mit den tatsächlich vorhandenen neuen Diagnoseartefakten aktualisiert; historischer Speicherhinweis gilt nicht mehr als aktuelle Blockade.

Archivprüfung: CRC aller Einträge bestanden. Das Ersetzen des bisherigen ZIP wurde von Windows mit Zugriff verweigert abgelehnt. Deshalb liegt der neue geprüfte Stand separat unter fitness-graphics-arbeitsstand-v13-2026-10-31.zip; das alte ZIP blieb unverändert.
