# Seiten- und Schrägprüfung 02.11.2026

Etwa 40 GB frei; Speicherblockade aufgehoben. Vier tatsächliche Renderansichten beider bestehenden Skin-V15-Bewegungsquellen in Frame 25 erstellt und angesehen: renders/*_skin-v15-hip-knee-anatomical_left-2026-11-02.png sowie *-oblique-2026-11-02.png unter fitness-graphics/production-v13/.

Technisch: 640 x 640 RGBA, alle vier Dateien decodiert, Alpha reicht von 0 bis 255. SHA-256 beider gespeicherter Bewegungsquellen unverändert. Armature, Helfermaske und Glättung sind in Ansicht und Render aktiviert. Reproduzierbarer Ablauf source/inspect_hip_knee_multiview.py; Bericht validation/skin-v15-hip-knee-multiview-2026-11-02.json.

Visuell: Blau/Schwarz und Grün/Schwarz bleiben auf gebeugten Figuren erhalten. Seitlich werden Konturen an Hüfte/Oberschenkel gestreckt, am Knie zusammengedrängt. Keine offensichtliche offene Netzspalte in diesen vier Ansichten; daraus folgt keine Kollisionsfreiheit. Gewichte, Pose und UV-Ursache sind noch nicht getrennt. Fachliche Anatomie und Bewegung: NICHT FREIGEGEBEN. Kleidung und Seitennähte bleiben offen. Keine Figur verändert oder vervielfältigt.

Nächster Schritt: stärkste Kantenänderungen auf Basisvertices zurückführen und zugehörige Knochengewichte prüfen, danach begrenzte lokale Korrektur testen. Die globale volumenerhaltende Option bleibt verworfen. Kein App-Gesamtdesign und keine App-Integration.

Neue Artefakte liegen zusätzlich im geprüften Ergänzungsarchiv fitness-graphics-diagnose-2026-11-02.zip. Das vollständige Archiv vom 31.10. bleibt historischer Arbeitsstand.
