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

- Angular 20 mit Standalone Components.
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

- Vor Abschluss mindestens `npm run build` in `app/` ausfuehren.
- Bei Logik-Aenderungen in Utils sowie Services passende Tests erstellen oder anpassen.
- Code formieren gemäss .editorconfig.
- Keine irrelevanten Refactors im selben Schritt mischen.
- Keine bestehenden Nutzer-Aenderungen rueckgaengig machen.

## Dokumentation

- Wenn Architektur- oder Workflow-Regeln geaendert werden, `README.md` und diese Datei aktuell halten.
