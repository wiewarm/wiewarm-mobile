# AGENTS.md

Diese Datei definiert verbindliche Arbeitsregeln fuer Coding-Agents in diesem Repository.

## Projektstruktur

- Repo-Root enthaelt Doku und Meta-Dateien.
- Die Angular-App liegt in `app/`.
- Relevante Quellstruktur:
  - `app/src/app/features/` fuer Feature-Module/Views
  - `app/src/app/shared/` fuer wiederverwendbare Services, Layout, Utils, Typen, Mappers

## Arbeitsverzeichnis und Befehle

- Fuer Node/Angular-Kommandos immer in `app/` arbeiten.
- Standardbefehle:
  - `npm run start`
  - `npm run build`
  - `npm run lint`
  - `npm run test`

## Architektur und Code-Style

- Angular 21 mit Standalone Components.
- TypeScript strict bleibt aktiv; keine Aufweichung von Strictness ohne Begruendung.
- Bevorzuge Signals (`signal`, `computed`, wenn noetig `effect`) fuer lokalen reaktiven State.
- Bevorzuge `resource()` fuer datenladende Services, wenn passend.
- Templates deklarativ halten; Logik in TypeScript kapseln.
- `inject()` wird bevorzugt; Constructor-Injection ist erlaubt, wenn sie klarer oder pragmatischer ist.
- `ChangeDetectionStrategy.OnPush` bevorzugen, besonders bei groesseren/haeufig gerenderten Komponenten.
- Reine Hilfslogik in `shared/util` halten.

## A11y und UI

- Semantisches HTML verwenden.
- Landmarks und Rollen konsistent setzen (z. B. `main`, `role="main"` wenn sinnvoll).
- Bestehende Design-Tokens und SCSS-Struktur verwenden und ggf. erweitern.

## Qualitaetsregeln bei Aenderungen

- Vor Abschluss `npm run build` in `app/` ausfuehren.
- Bei Logik-Änderungen in Utils sowie Services passende Tests erstellen oder anpassen.
- Code gemäss `.editorconfig` formatieren.

## Dokumentation

- Wenn Architektur- oder Workflow-Regeln geändert werden, `README.md` und diese Datei aktuell halten.

## Arbeitsverhalten

Diese Regeln reduzieren typische Fehler von Coding-Agents. Sie bevorzugen Sorgfalt vor Geschwindigkeit; bei trivialen Aufgaben ist pragmatisches Augenmass erlaubt.

### Vor dem Implementieren denken

- Annahmen explizit nennen, wenn sie für die Lösung relevant sind.
- Bei mehreren plausiblen Interpretationen nicht stillschweigend eine wählen; Abwägungen kurz benennen oder nachfragen.
- Einfachere Ansätze nennen, wenn sie das Ziel genauso gut erreichen.
- Wenn eine Anforderung unklar ist und eine falsche Annahme riskant waere, stoppen und gezielt nachfragen.

### Einfachheit zuerst

- Nur umsetzen, was angefragt wurde.
- Keine spekulativen Features, Konfigurationsoptionen oder Abstraktionen für einmalige Nutzung einführen.
- Keine Fehlerbehandlung für praktisch unmögliche Fälle erfinden.
- Wenn eine Loöung deutlich kürzer und klarer sein kann, vereinfachen.

### Chirurgische Aenderungen

- Nur Dateien und Zeilen ändern, die direkt zur Aufgabe gehören.
- Keine angrenzenden Refactorings, Kommentar-, Stil- oder Formatierungsanpassungen ohne Bedarf.
- Bestehende Nutzer-Änderungen nicht rückgängig machen.
- Unbenutzte Imports, Variablen oder Funktionen nur entfernen, wenn sie durch die eigene Änderung entstanden sind.
- Unabhaengigen toten Code erwähnen, aber nicht ohne Auftrag löschen.

### Zielorientiert arbeiten

- Erfolgskriterien aus der Aufgabe ableiten, z. B. Bug reproduzieren, Test schreiben, Fix umsetzen, Build prüfen.
- Bei mehrstufigen Aufgaben einen kurzen Plan mit Verifikation nennen.
- Bis zur Verifikation weiterarbeiten, soweit das ohne Rückfrage möglich ist.
- Jede geänderte Zeile muss nachvollziehbar auf die Nutzeranfrage zurückführen.
