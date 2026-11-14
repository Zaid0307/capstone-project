# R09N · Statische Prüfung der Redesign-Entwürfe

Geprüft wurden `index.html`, `richtung-a.html`, `richtung-b.html`, `r09-desktop.html` und das von beiden mobilen Ansichten verwendete `r09-training.js`. Der aktuelle Quellstand zeigt keine bestätigte unsichere Ausführung nutzergesteuerter Inhalte und keine Übertragung von Trainingseingaben. Die folgenden Stellen sind für eine spätere App-Integration relevant.

| Priorität | Befund | Defensive Umsetzung |
| --- | --- | --- |
| Mittel | `index.html` erzeugt Navigation, Hauptansicht und Suchergebnisse mit `innerHTML` (Zeilen 46–47 und 78). Planname, Eingaben und Suchfeld werden in den geprüften Ausgabestellen maskiert. `btn()` und `heading()` erwarten an anderen Stellen bereits aufbereitete Inhalte. Die aktuelle Schutzwirkung hängt damit von allen Aufrufstellen ab. | Beim Übernehmen der Ansichten DOM-Knoten und `textContent` für Texte verwenden. Werte über DOM-Eigenschaften setzen. Katalog- und Übungs-IDs gegen das erwartete Schema prüfen, sobald sie aus einem gemeinsamen Datenbestand kommen. |
| Niedrig | `r09-desktop.html` baut Kennzahlen, Balken, Tabelle und Chronik aus internen Beispieldaten per `innerHTML` (Zeilen 31–34). Die Muskelbeschriftung verwendet dagegen `textContent`. Der HTML-Pfad wird relevant, sobald Trainingshistorie oder Beschriftungen aus App-Daten kommen. | Beim Anschluss realer Daten die Textausgabe auf DOM-Knoten umstellen, Zahlen numerisch prüfen und Balkenbreite begrenzen. |
| Niedrig | Beide mobilen Richtungen laden dieselbe lokale SVG-Maske über `object`. Das geprüfte SVG enthält nur SVG, Metadaten, Gruppe und Pfade. Das Element kann grundsätzlich ein zusätzliches Dokument einbetten. | Für künftige extern gelieferte Masken ein passives Bild oder geprüfte Pfadgeometrie verwenden. Die Produktions-Hostregeln können dann Objekt-Einbettung sperren. |

In den geprüften Dateien stammen JavaScript, SVGs, PNGs und Videos aus relativen lokalen Pfaden. Die CSS-Schriftfamilien haben lokale System-Fallbacks. Die SVG-Namensraum-URI im Desktop-Code ist ein Bezeichner. Es sind keine externen Skript- oder Fontimporte, Netz-APIs, URL-Parameter als Datenquelle oder Cross-Origin-Nachrichtenhandler erkennbar.

In `index.html` liegen Planname, Suche und Training als Variablen im Arbeitsspeicher. In `r09-training.js` hält der Abschlusszustand die eingegebenen Sätze in einer JavaScript-Datenstruktur. Der Formularhandler unterbindet den Standardversand und prüft Gewicht und Wiederholungen vor dem Speichern. Im geprüften Code gibt es keine Browser-Datenbank, keinen persistenten Web Storage und keine Trainingsübertragung. Ein Neuladen setzt die Entwurfsdaten zurück.

Geprüft wurde der lokale Quelltext einschließlich der eingebetteten SVG-Datei. Produktivhost, Browserlaufzeit, App-Quellcode, Datenbank und Serverkonfiguration liegen außerhalb dieser Prüfung.
