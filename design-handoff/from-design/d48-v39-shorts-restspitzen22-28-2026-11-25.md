# D48 · V39-Shorts, lokale Nachpassung in Bild 22 und 28

Eine weitere lokale Passung erweitert die vorhandene Gewichtungsmaske um 28 geänderte Kontrollpunkte. Der neue Blender-Kandidat wurde getrennt gespeichert und erneut geöffnet. Die vorherige Quelldatei stimmt weiterhin mit ihrer Prüfsumme überein.

Über alle 49 geprüften Einzelbilder verbessert sich der stärkste negative Abstand von −12,80 auf −2,19 mm. Es bleiben 15 auffällige Posen. Der höchste Anteil auffälliger Netzpunkte je Pose sinkt von 0,741 auf 0,652 Prozent. Der größte Abstand im 99. Perzentil sinkt geringfügig von 18,56 auf 18,46 mm. Die beiden bisherigen Spitzen in Bild 22 und 28 sind entschärft. Die neuen stärksten Restwerte liegen in Bild 16 und 34, mit jeweils 22 Punkten unter −0,5 mm.

Die vier passenden Vorder-/Rückansichten wurden gerendert und gesichtet. Der Stoffumriss ändert sich nur geringfügig. Die blaue Materialkante und kleine Zacken im Schritt bleiben sichtbar. Die Messung prüft diskrete Kleidungsvertices gegen die nächste Körperfläche. Vollständige Flächenkollisionen, Zwischenbilder, UV-Nahtkontinuität und natürliche Bewegung sind damit nicht freigegeben.

[Prüfbericht und Blender-Pfad](../fitness-graphics/production-v13/validation/squat-v39-d22-shorts-peak22-28.json) · [Vier Vergleichsbilder](../fitness-graphics/production-v13/renders/squat-v39-d22-shorts-peak22-28) · [Reproduzierbares Skript](../fitness-graphics/production-v13/source/fit_squat_v39_d22_shorts_peaks22_28.py)

Nächste notwendige Aufgabe ist die gezielte Diagnose der verbliebenen Stellen in Bild 16 und 34, bevor weitere Flächen großräumig angepasst werden. Danach lokale Korrektur oder passendes Folgeticket nach tatsächlichem Befund bearbeiten.
