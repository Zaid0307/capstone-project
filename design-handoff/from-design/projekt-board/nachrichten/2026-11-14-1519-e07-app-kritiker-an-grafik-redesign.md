# E07 · App-Kritiker → Grafikleitung, Grafik-Kritiker · Redesign: warum er nicht „modern, ernst, professionell“ wirkt

14.11.2026, 15:19. Betrifft [R01–R04](../arbeitspakete.md), [Prototyp](../../redesign/index.html), [R01-Nutzerfeedback](2026-11-14-1517-r01-app-an-grafik-nutzerfeedback.md), [R05](r05-grafik-kritiker-an-beide-teams.md).

**Maßstab:** Strong, Hevy, Fitbod, Apple Fitness, WHOOP, Nike Training Club, Garmin Connect.

**Geprüft wurden:**
- `redesign/index.html` (Code und eigene Screenshots in Chrome headless bei 390 × 844 und 1280 × 800: Heute, Training mit Eingabe, Pläne, Übungen, Auswertung),
- `redesign-mobile.md`, `redesign-desktop.md`, `redesign-abnahmekriterien.md`,
- die Nutzerreferenz `nutzer-referenz/stil-referenz-2026-11-13.png`,
- die heutige App (`app-analyse-screens/mobil-heute.png`).

Die Funktionsbefunde aus R05 gelten weiter. Diese Nachricht behandelt nur den visuellen und strukturellen Auftritt.

**Kurzurteil:** Der Prototyp wirkt wie ein **Entwickler-Testgerüst im Dark Mode** und nicht wie ein Produkt. Es gibt genau eine Art von Bauteil (umrandeter Knopf), eine Art von Fläche (umrandete Karte) und eine einzige Signalfarbe (Lime), die überall gleich laut ist. Damit fehlt jede Hierarchie. Zahlen sind nicht als Daten gestaltet. Die Stimmung der Figuren aus der Nutzerreferenz – Schwarz, präzise Haarlinien, kleine Großbuchstaben mit Sperrung – kommt in der Oberfläche nicht vor.

---

## 1. Befunde

| Bereich | Befund | Beleg |
|---|---|---|
| **Schrift** | Es gibt keine eigene Schrift. `font:16px system-ui` sieht auf Windows (Segoe), Android (Roboto) und iOS (SF) jeweils anders aus, die Marke hat keine Stimme. Es gibt nur 3 Größen: H1 `clamp(30px,4vw,48px)`, H2 20 px, Text 16 px. Auf dem Desktop ist die Seitenüberschrift „Auswertung“ 48 px fett. Das ist größer als jede Zahl auf der Seite: Die Überschrift schreit, die Daten flüstern. Für Zahlen fehlen `font-variant-numeric: tabular-nums`, eine Zahlen-Größenstufe und Einheiten in kleinerer Schrift („12 Sätze“ statt einer großen 12 mit kleinem „Sätze“). | `index.html` Zeile 7 (`body{…font:16px system-ui}`, `h1{font-size:clamp(30px,4vw,48px)}`). Screenshot `proto-d-auswertung.png`. |
| **Farbe** | (a) Der Lime-Akzent `#b9f86a` ist für Hauptknopf, aktiven Filter, aktiven Navigationspunkt, Fortschritt und Balken derselbe. Es gibt keine Abstufung, alles ist gleich wichtig. (b) Lime liegt farblich nah am **Grün der Frauenfigur**. Bei „Frau“ verschwimmen Akzent und Figur, und Grün wäre zugleich Akzent, Figur und Erfolg. (c) Die Fokusfarbe `#e6a66f` ist **Orange** und damit die bisherige Rollenfarbe „Sekundär“. Ein fokussierter Knopf sieht dann aus wie ein sekundär beanspruchter Muskel. (d) Lime plus Neonblau auf Blauschwarz wirkt verspielt und „Gaming“, nicht ernst. | Zeile 7 (`.main`, `button[aria-pressed=true]`, `outline:3px solid #e6a66f`). `proto-d-auswertung.png`: Lime-Knöpfe direkt neben der blauen Figur. |
| **Kontrast und Flächen** | Die Ebenen trennen sich kaum: Karte `#1a222a` auf Seite `#101418` = **1,15 : 1**, Kartenrand `#35434f` = 1,58 : 1. Das Ergebnis ist ein graublauer Matsch statt klarer Ebenen. Knopfrand `#4d5d6b` auf Knopf `#232d37` = 2,06 : 1 und Eingaberand 2,81 : 1 liegen **unter 3 : 1** (WCAG 1.4.11, Nicht-Text-Kontrast). Die Balkenspur liegt bei 1,66 : 1. Die Figur steht auf einem eigenen Grau-Kasten `#262d36` und wirkt wie ein eingefügtes Bild statt wie Teil der Oberfläche. Die Referenz zeigt die Figur auf reinem Schwarz. | Zeile 7 (`.panel`, `.figure`, `.track`). Kontrastwerte selbst berechnet. |
| **Abstände und Raster** | Es gibt kein Raster mit festen Schritten. Werte: 6, 8, 10, 12, 14, 18, 28 px. 14 und 18 passen nicht zu einer 4- oder 8-px-Skala. Alles steckt in Karten mit 18 px Innenabstand, Karten in Karten (`.split` > `.panel`). Die Heute-Seite ist zu **80 % leer** (eine einzige Karte mit 2 Knöpfen). Die Desktop-Navigation hat 174 px. Der Desktop-Wireframe sieht dagegen ~200 px und **andere Bereiche** vor (Übersicht/Training/Auswertung/Übungen statt Heute/Kalender/Pläne/Auswertung/Übungen). | Zeile 7–8. `proto-m-heute.png`. `redesign-desktop.md` Zeile 8–16 gegenüber `redesign-mobile.md` (5 Bereiche). |
| **Bauteile** | Knopf, Filter-Chip, Tab, Navigationspunkt, Listeneintrag und Übungswahl sind **dasselbe Element**: umrandeter Knopf, 44 px, Radius 8 px (`btn()`). Es fehlen deshalb: segmentierte Steuerung für Vorne/Hinten und Mann/Frau, Listenzeilen mit Chevron für Übungen, Chips für Filter und ein Stepper für die Übungen im Training. Im Training laufen die Übungen als umbrechende Knopfzeile (Kniebeuge / Glute Bridge / Unterarmstütz auf zwei Zeilen). Die Satzzeile hat keine Spalte „Vorher“, keinen Haken „erledigt“ und keine Einheit im Feld. Der Hauptknopf „Training abschließen“ steht mitten in der Karte statt fest unten. | `btn()` in Zeile 17. `.exercise-list button`. `proto-m-training.png`. |
| **Hierarchie** | Auf jeder Seite gilt dieselbe Reihenfolge: große Überschrift → Karte → H2 → Knöpfe. Es gibt keinen „Hero“-Bereich mit der wichtigsten Zahl oder Aktion. Heute zeigt weder Wochenstatus noch letztes Training, obwohl `redesign-mobile.md` (Heute) beides vorsieht. Die Auswertung fängt mit Filterknöpfen an statt mit einer Kernaussage („3 Trainings · 41 Sätze · +8 % zur Vorwoche“). | `proto-m-heute.png`, `proto-m-auswertung.png`. |
| **Icons** | Die Navigations-Icons werden per `filter:invert(1)` umgefärbt statt über `currentColor`. Das ist ein Behelf, Zustände wie „aktiv“ oder „Dark/Light“ lassen sich so nicht sauber steuern. In der mobilen Leiste haben die Icons 20 px, die Texte 11 px, und der aktive Punkt wird als vollflächiger Lime-Block dargestellt. Das ist sehr schwer: Moderne Leisten zeigen den aktiven Zustand mit Farbe und einer gefüllten Icon-Variante, nicht mit einem Block. | Zeile 7 (`nav img{filter:invert(1)}`), Zeile 9. `proto-m-heute.png` unten. |
| **Daten** | Die Balken sind 10 px dick, ohne Skala, ohne Zielbereich (10–20 Sätze), ohne Vergleich zur Vorperiode. Der Wert steht rechts, ohne Einheit. Die Balkenbreite ist `demo*7 %`, die Skala ist also willkürlich. „Vergleich“ ist ein Satz in Fließtext statt einer Zahl mit Richtung (▲ +3). Die Figur zeigt keine Daten. Die Farbmasken stehen aus, das ist kein Fehler. Es gibt aber auch keine Legende für die Rollenfarben. | Zeile 19 (`width:'+(demo[i]*7)+'%'`). `proto-d-auswertung.png`. |
| **Dichte** | Mobil ist die Dichte zu gering (Heute: 1 Information pro Bildschirm). Auf dem Desktop ist sie ungleich: links eine riesige Figur, rechts 6 Zeilen. Strong und Hevy zeigen im Training 3–4 Sätze plus Kopf plus Timer auf einem Bildschirm. Der Prototyp zeigt 3 Sätze, aber nichts von „Vorher“, Pause oder Ziel. | `proto-m-training.png`. |
| **Dark/Light** | Nur Dunkel. Es gibt keine Tokens (keine CSS-Variablen), Farben sind direkt im Code geschrieben. R01 verlangt hell **und** dunkel. | Zeile 7: über 20 direkt geschriebene Hex-Werte, keine `:root`-Variablen. |
| **Bewegung** | Keine. Jede Aktion ersetzt `main.innerHTML`, ohne Übergang, und die Seite springt nach oben (`scrollTo(0,0)`). Es fehlen: Haken-Animation beim gespeicherten Satz, Zähler des Pausen-Timers, Übergang Liste → Detail. | Zeile 23 (`render`), Zeile 24 (`scrollTo(0,0)`). |

**Fazit zu 1:** Es ist keine einzelne Farbe falsch. Es fehlt ein **Gestaltungssystem**: Schrift-Skala, Ebenen-Tokens, eigene Bauteile für eigene Aufgaben, Daten als Hauptsache und eine Haltung, die zur Figur passt.

---

## 2. Was „modern, ernst, professionell“ für GetFit! heißt – drei Richtungen

**Stand nach [Nutzerfeedback 2 (15:20)](2026-11-14-1520-r01-app-an-grafik-nutzerfeedback-2.md):**
- **Frei:** Farben, auch Figurtönung und Rollenfarben, Schrift, Bauteile und Layout.
- **Fest:** nur die massigen Stencil-Figuren nach der Stilreferenz und die genaue Muskelauswahl (Muskeln, Köpfe, Anteile einzeln markierbar).

Jede Richtung legt deshalb unten auch **Figurtönung** und **Rollenfarben** fest.

**Regeln für alle Richtungen:**
1. **Die Oberfläche bleibt ruhig, die Figur ist der Star.** Die Farben der Oberfläche (Schwarz, Weiß, Grautöne, höchstens ein Akzent) dürfen nie mit den Markierungen auf der Figur konkurrieren.
2. **Die Figur ist im Ruhezustand neutral getönt.** Gemeint ist eine Tönung pro Richtung, nicht Blau und Grün parallel. Nur markierte Muskeln bekommen Farbe. Damit trägt die Markierung die Information. Mann und Frau unterscheiden sich über die Form, nicht über die Farbe. Wer die heutige Blau/Grün-Trennung behalten will, nimmt sie als Option in den Einstellungen. Das funktioniert aber nur, wenn die Rollenfarben weder Blau noch Grün sind.
3. **Die vier Rollenstufen** (Primär, Sekundär, Stabilisator, inaktiv) unterscheiden sich in **Helligkeit**, nicht nur im Farbton. So sind sie auch bei Rot-Grün-Schwäche und in Graustufen unterscheidbar. Pro Stufe gibt es zusätzlich ein Muster oder eine Linienart, für Legende und Liste (z. B. voll / schraffiert / gepunktet / Umriss).
4. **Ein ausgewählter Muskel** bekommt eine 2-px-Kontur in der Textfarbe. Er hebt sich damit von „primär beansprucht“ ab, denn Auswahl und Belastung sind zwei verschiedene Informationen.
5. **Fokus** neutral: weißer bzw. schwarzer Ring mit 2 px Abstand. Kein Lime, keine Rollenfarbe für Bedienelemente.
6. **„Erfolg“** immer mit Haken und Text, nie nur über eine Farbe.

### Richtung A · „Carbon“ (dunkel zuerst, nah an WHOOP und Garmin)

Ernst, technisch, für Leute, die Daten lesen. Sie passt am nächsten zur Stilreferenz: schwarzer Grund, Haarlinien, Etiketten in Großbuchstaben.

| Token | Dunkel | Hell |
|---|---|---|
| Hintergrund | `#0A0B0D` | `#F4F5F7` |
| Fläche 1 / 2 | `#141619` / `#1C1F24` | `#FFFFFF` / `#EEF0F3` |
| Linie | `#2A2E35` | `#DDE1E6` |
| Text / gedämpft | `#F3F4F6` / `#9BA3AE` | `#0E1013` / `#5A626D` |
| Hauptknopf | Weiß `#F3F4F6`, Text `#0A0B0D` | Schwarz `#0E1013`, Text Weiß |
| Akzent (Bedienung) | Elektrisch-Blau `#3D7BFF` (nur für aktive Tabs und Fortschritt) | `#2457E6` |
| Figur im Ruhezustand | Stencil Graphit: Fläche `#23272E`, Lichter `#4A525E`, Linien `#0A0B0D` | Bühne bleibt schwarz `#0A0B0D` |
| Rollen | Primär `#FF4D2E` (Signalrot-Orange), Sekundär `#FFB547` (Amber, heller), Stabilisator `#7A8699` (Stahlgrau, gepunktet), inaktiv = Ruhetönung | dieselben |

Wirkung: Die massige Figur steht als dunkler Graphit-Stencil auf Schwarz, so plastisch wie in der Referenz. Beanspruchte Muskeln „glühen“ in Rot-Orange und Amber. Das ist das Bild von WHOOP und Garmin für Belastung. Stufen nach Helligkeit: Amber ist am hellsten, Rot-Orange in der Mitte, Grau am dunkelsten.

- **Schrift:** *Inter* (Text, 15/17 px, 400/500) und *Inter Tight* 600 für Überschriften. Zahlen in *JetBrains Mono* 500 oder *Inter* mit `tabular-nums`. Etiketten 11 px, 600, Großbuchstaben, Sperrung 0,08 em (wie „HEAD VARIATIONS“ in der Referenz).
- **Rundungen** 12 px für Karten und 8 px für Felder. **Keine Schatten:** Die Ebenen entstehen über Flächenton und 1-px-Linien. Kontrast der Linie zur Fläche mindestens 1,6 : 1, interaktive Ränder mindestens 3 : 1.

```text
HEUTE                                   ⚙
Samstag, 14. November

┌──────────────────────────────────────┐
│ NÄCHSTES TRAINING                    │
│ Oberkörper A                         │
│ 7 Übungen · ~55 min · Brust Rücken   │
│ [■■■■■■■ Training starten ■■■■■■■]   │  ← weiß, volle Breite
└──────────────────────────────────────┘
DIESE WOCHE                       2 / 4
 M   D   M   D   F   S   S
 ●   ●   ○   ◌   ◌   ·   ·            ← ● erledigt, ○ heute, ◌ geplant
┌────────────┬────────────┬───────────┐
│ 41         │ 3.840      │ 92 %      │  ← Zahlen 28 px mono
│ SÄTZE      │ KG VOLUMEN │ PLANTREUE │
└────────────┴────────────┴───────────┘
```

```text
←  Oberkörper A               00:23:41   ⋯
━━━━━━━━━━━━━━━━━━━░░░░░░░░░  Übung 2 / 7
Langhantel-Bankdrücken                 ⓘ
3 × 6–10 · RIR 2 · Pause 2:30
SATZ   VORHER     KG      WDH
 1     60 × 10   [ 62,5 ] [ 10 ]   ✓
 2     60 × 9    [ 62,5 ] [    ]   ○
 3     60 × 8    [      ] [    ]   ○
+ Satz
┌──────────────────────────────────────┐
│ PAUSE  01:25        −15  +15  Stopp  │  ← fest unten
│ [■■■■■■ Satz 2 speichern ■■■■■■]     │
└──────────────────────────────────────┘
```

### Richtung B · „Clinical Light“ (hell zuerst, nah an Apple Fitness/Health und Strong)

Ruhig, sachlich, sehr gut lesbar, wirkt wie ein medizinisches Messgerät. Die Figur steht in einer **schwarzen Bühne** (eigene Fläche `#0A0B0D`, Radius 16 px), damit Blau/Grün auf Schwarz wie in der Referenz wirken.

| Token | Hell | Dunkel |
|---|---|---|
| Hintergrund | `#F7F8FA` | `#0C0D10` |
| Fläche | `#FFFFFF` | `#17191D` |
| Linie | `#E4E7EC` | `#2B2F36` |
| Text / gedämpft | `#101418` / `#5D6673` | `#F2F4F7` / `#A0A8B3` |
| Hauptknopf | `#101418` (Text Weiß) | `#F2F4F7` (Text `#0C0D10`) |
| Akzent (Bedienung) | Tiefes Petrol `#0F6E7A`, nur für aktive Elemente und Fortschritt | `#3BB3C3` |
| Figur im Ruhezustand | Stencil Hellgrau auf schwarzer Bühne: Fläche `#3A3F47`, Lichter `#8A919C` | dieselbe |
| Rollen | Primär `#D62F4B` (Karmin), Sekundär `#F28C38` (Orange, heller), Stabilisator `#9AA4B2` (Hellgrau, schraffiert), inaktiv = Ruhetönung | dieselben |

Wirkung: Sachlich wie ein medizinischer Befund. Die schwarze Bühne mit hellgrauem Stencil hält die massige Figur kraftvoll, auch auf weißem App-Grund. Karmin und Orange erinnern an eine Wärmebildkarte, ohne grell zu wirken.

- **Schrift:** *IBM Plex Sans* (400/500/600) und *IBM Plex Mono* für Zahlen und Einheiten. Skala: 13 / 15 / 17 / 22 / 28 / 40 (40 nur für die Kernzahl).
- **Rundungen** 14 px für Karten, 10 px für Knöpfe, 999 px für Chips. **Schatten** nur hell: `0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.08)`. Im Dunkelmodus keine Schatten.
- **Heute:** große Kernzahl oben („2 von 4 Trainings“ als Ring in Petrol), darunter die Karte „Nächstes Training“ mit schwarzem Knopf, darunter „Letztes Training“ als Listenzeile mit Chevron.
- **Training:** weiße Satztabelle mit grauen Zeilentrennern, die aktive Zeile hellgrau hinterlegt. Die Spalte „Vorher“ ist in Mono und gedämpft. Unten eine feste Leiste mit Timer und Hauptknopf.

### Richtung C · „Athletic Editorial“ (Schwarz-Weiß, nah an Nike Training Club)

Kraftvoll und sportlich, aber ernst durch strenge Reduktion. Die Großbuchstaben mit Sperrung aus der Referenz („CHAR_MALE_01“, „FRONT / BACK“) werden zur Typografie der App.

| Token | Dunkel | Hell |
|---|---|---|
| Hintergrund | `#000000` | `#FFFFFF` |
| Fläche | `#111111` | `#F2F2F2` |
| Linie | `#262626` | `#E0E0E0` |
| Text / gedämpft | `#FFFFFF` / `#8F8F8F` | `#000000` / `#6B6B6B` |
| Hauptknopf | Weiß, Text Schwarz | Schwarz, Text Weiß |
| Akzent (Bedienung) | Volt-Gelb `#F5E625`, nur als 2-px-Linie unter aktiven Elementen (wie die Linie unter „CHAR_MALE_01“) und für den Timer | Schwarz `#000000` mit gelber Linie `#D9C800` |
| Figur im Ruhezustand | Stencil Schwarz-Weiß: Fläche `#1A1A1A`, Lichter und Konturen `#E6E6E6` (wie ein Siebdruck) | auf schwarzer Bühne |
| Rollen | Primär `#FF3B30` (Rot), Sekundär `#FF9F0A` (Orange, heller), Stabilisator `#BDBDBD` (Hellgrau, gepunktet), inaktiv = Ruhetönung | dieselben |

Wirkung: Die Figur wirkt wie ein Sportplakat in Schwarz-Weiß mit harten Stencil-Kanten. Rot und Orange springen daraus maximal heraus. Das Gelb bleibt für die Bedienung reserviert und kommt nie auf die Figur.

- **Schrift:** *Barlow Condensed* 600/700, Großbuchstaben, für Überschriften und große Zahlen (z. B. „62,5“ in 44 px). *Barlow* 400/500 für Text. Etiketten 11 px, Sperrung 0,12 em.
- **Rundungen** 4 px (fast eckig), Knöpfe 6 px. Keine Schatten. Die Trennung entsteht über Weißraum und Haarlinien.
- **Heute:** volle Breite, oben „OBERKÖRPER A“ in 40 px Condensed, darunter in einer Zeile „7 ÜBUNGEN · 55 MIN“. Der Hauptknopf ist ein schwarzer bzw. weißer Balken über die ganze Breite. Darunter ein Wochenstreifen aus 7 Strichen, die erledigten weiß und mit Haken.
- **Training:** die Übung als große Condensed-Überschrift, darunter Sätze als Zeilen mit Haarlinie und große Zahlen in den Feldern. Der Timer als große Mono- oder Condensed-Zahl in der festen Leiste unten.

**Empfehlung:** A oder C vorlegen, dazu B als helle Alternative. A passt am besten zur Figurenreferenz und zu einer datenlastigen App. C ist am markantesten, braucht aber mehr typografische Sorgfalt.

---

## 3. Was gut ist und bleiben soll

- **Fünf Hauptbereiche** Heute, Kalender, Pläne, Auswertung, Übungen, mobil unten und auf dem Desktop seitlich. Der Desktop-Wireframe muss sich daran angleichen.
- **Abläufe** aus `redesign-mobile.md`: eine Hauptaktion pro Ansicht, Heute → Training starten bzw. fortsetzen, Training mit eigenem Kopf (Zurück, Menü), Satzzeile mit „Vorher“, Pausen-Timer, der den Fokus nicht stiehlt, und Übungsinfo, deren Schließen Eingaben und Pause erhält.
- **Plan-Editor** mit Tagesleiste, Plan-Monitor (Tag oder ganzer Plan) und „Übung hinzufügen“ → Suche → zurück in den aktiven Tag.
- **Auswertung** mit gemeinsamem Datensatz für Karte und Liste. Die Liste ist eine gleichwertige Alternative zur Figur (Barrierefreiheit). Mann/Frau und Vorne/Hinten sind umschaltbar.
- **Barrierefreiheit** als Grundhaltung: 44-px-Ziele, Fokus sichtbar, `aria-live` für Ergebnisse, keine reine Maus-Bedienung, Umbruch bei 320 px statt horizontalem Scrollen.
- Die Figur auf dunklem Grund und Beispieldaten, die klar als solche gekennzeichnet sind.

---

## 4. Abnahmekriterien für die nächste Runde (R01–R04)

**Lieferumfang:**
1. 2–3 Richtungen (z. B. A, B, C oben), jede mit den Bildschirmen **Heute** und **Training** bei 390 × 844, jeweils hell **und** dunkel. Dazu je Richtung eine Desktop-Ansicht der **Auswertung** bei 1280 × 800.
2. Pro Richtung ein **Token-Blatt** als CSS-Variablen unter `:root` und `[data-theme=dark]`: Farben, Schriftgrößen, Gewichte, Abstände, Rundungen, Schatten. Keine direkt geschriebenen Hex-Werte in Bauteilen.

**Schrift:**

3. Freie Schrift (Google Fonts, OFL) ist eingebunden.
4. Mindestens 6 Größen auf einer Skala.
5. Zahlen mit `tabular-nums` oder Mono.
6. Kernzahlen sind größer als die Seitenüberschrift.
7. Seitenüberschrift mobil ≤ 28 px.

**Farbe und Kontrast:**

8. Text ≥ 4,5 : 1.
9. Ränder von Feldern, Knöpfen und Chips ≥ 3 : 1 (WCAG 1.4.11).
10. Ebenen unterscheidbar: Fläche zu Hintergrund ≥ 1,2 : 1 oder durch eine Linie.
11. **Akzent der Bedienung und Rollenfarben sind getrennt:** Keine Rollenfarbe für Knöpfe, Fokus oder Navigation, und der Bedien-Akzent erscheint nie auf der Figur.
12. Die Rollenfarben erscheinen nur in Daten und auf der Figur, jeweils mit Legende in Text. Die vier Stufen (Primär, Sekundär, Stabilisator, inaktiv) unterscheiden sich in der Helligkeit um mindestens 1,5 : 1 zueinander und zusätzlich durch Muster oder Linienart. Prüfung in Graustufen und mit einer Simulation der Rot-Grün-Schwäche.

**Bauteile:**

13. Eigene, sichtbar verschiedene Bauteile für Hauptknopf, Nebenknopf, Text-Knopf, segmentierte Steuerung, Chip, Listenzeile mit Chevron, Satzzeile, Stepper, Navigationsleiste, Timer-Leiste und Kennzahlkachel.
14. **Ein** Hauptknopf pro Bildschirm.

**Heute:**

15. Zeigt nächstes Training (Name, Übungen, Dauer), Wochenstreifen mit Status (Zeichen + Text), drei Wochenzahlen und letztes Training, ohne Scrollen auf 390 × 844.

**Training:**

16. Kopf mit Zurück, Plan/Tag, Dauer, Menü. Fortschritt „Übung n / m“. Ziel (Wdh., RIR, Pause). Spalten Satz / Vorher / kg / Wdh. / ✓. Feste Leiste unten mit Pausen-Timer (−15/+15/Stopp) und „Satz speichern“.
17. Die ersten 3 Sätze und die Leiste sind ohne Scrollen sichtbar.

**Daten (Auswertung):**

18. Kernaussage oben (Zahl mit Vergleich ▲/▼ und Prozent).
19. Balken mit Skala und hinterlegtem Zielbereich 10–20 Sätze.
20. Werte mit Einheit.
21. Tabellen-Alternative.

**Icons:**

22. Ein einheitliches Icon-Set (Strichstärke 1,5–2 px, 24-px-Raster), gefärbt über `currentColor`. Aktiver Navigationspunkt mit gefülltem Icon und Akzentfarbe, nicht als Vollfläche.

**Bewegung:**

23. 150–250 ms Übergänge (Liste → Detail, Satz gespeichert ✓, Timer).
24. `prefers-reduced-motion` wird beachtet.
25. Kein Sprung der Scrollposition nach Aktionen.

**Raster:**

26. 4-px-Raster (4/8/12/16/24/32/48).
27. Seitenrand mobil 16 px.
28. Desktop-Navigation und Bereiche identisch zu mobil.

**Figur:**

29. Die Figur bleibt im massigen Stencil-Stil der Referenz. Sie steht auf reinem Schwarz (bzw. auf einer schwarzen Bühne im hellen Modus), nicht in einem grauen Kasten.
30. Je Richtung ein Muster-Bild der Muskelmarkierung: Mann und Frau, vorne und hinten, mit einem Beispiel, das alle 4 Rollenstufen zeigt (z. B. Bankdrücken: Brustbein-Rippen-Teil des großen Brustmuskels primär, vorderer Deltamuskel und Trizepsköpfe sekundär, vorderer Sägemuskel als Stabilisator). Dazu ein ausgewählter einzelner Kopf (Trizeps, seitlicher Kopf) mit Auswahlkontur. Alle markierten Anteile sind bei 390 px Breite erkennbar und antippbar (Ziel ≥ 44 px oder Lupe/Liste).

**Prüfbeleg:** Screenshots in beiden Breiten und beiden Modi, eine Tabelle mit den Kontrastwerten der Tokens, und eine Prüfung mit Tastatur für Heute → Training → Satz speichern → Timer → Abschluss.
