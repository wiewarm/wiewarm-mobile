# 🏊 wiewarm.ch App

Di moderni Web-App zur intuitive und barrierefreiä Anzeig von Temperaturdate i schwizer Badis.

---

## 🔧 Technologie-Stack

- **Framework:** Angular 20
- **Sprach:** TypeScript
- **Styles:** Design Tokens mit SCSS, Icon Sprite Angular Material SVG-Icons
- **Build & Deployment:** Vite/Firebase
- **Entwicklig:** Node 22+
- **Hosting:** Firebase Hosting

---

## 🎯 Principles

1. **Barrierefreiheit (Accessibility)**
   - Mostly Konform nach WCAG 2.1 AA-Standard
2. **Suechmaschinenoptimierig (SEO)**
   - Isatz vo Semantic HTML & Metadaten
3. **Intuitivi Nutzerfüehrig (UX/UI)**
   - Klar strukturierte Navigation
   - Responsive Design für 3 Bildschirmgrössine (Mobile, Tablet & Desktop)
   - Müglechscht aglehnt a ds wiewarm.ch-Design
4. **Performance**
   - Lazy Loading vo Modul
   - Optimierti Bild- und Asset-Uusliferig
   - Clientsitigs Caching vo API-Date
   - Virtuells Scrolling über d'Angular CDK

---

## ✨ Features

- TBD

---

## 📱 Live-Demo

Probier’s us: 

 * https://händy.wiewarm.ch/ öffischel
 * https://m.wiewarm.ch/ Auternative für Schribfuli
 * https://wie-warm.web.app/ Firebase 
 * `podman run -p 3000:3000 ghcr.io/wiewarm/wiewarm-mobile:latest` On-Prem Installation für Hardcore User :) 

---

## 🛠️ Installation & Entwicklung

1. Repository klonen

   ```bash
   git clone https://github.com/nile4000/wiewarm-mobile.git
   cd wiewarm-mobile
   cd app (das isch d Angular-App)
   ```

2. Node Packages installiere (zersch lokal node 22 irichte)

   ```bash
   npm install
   ```

3. Startet d App im Entwickligsmodus

   ```bash
   # API-Endpoint chan via Umgebigsvariable chonfiguriert werde
   NG_APP_API_BASE=https://beta.wiewarm.ch/api/v1 npm run start
   ```

## Support

- Bi Frage oder Problem, bitte es Issue uf GitHub eröffne.

## Credits

- Externe Icons und Bilder findest du in [CREDITS.md](./CREDITS.md).

## 📝 Lizenz - ds Legalese chunnt itz in Hochdütsch

### Code

Der Code in diesem Repository steht unter der [MIT License](./LICENSE).

### Daten

Alle auf wiewarm.ch erhobenen Daten unterstehen der CC BY-SA 3.0 Lizenz. Das heisst dass die Daten frei kopiert und adaptiert werden können, solange folgende Bedingungen eingehalten werden:

- **Namensnennung** – Sie müssen den Namen des Autors/Rechteinhabers in der von ihm festgelegten Weise nennen. In unserem Fall ist dies:
  "http://www.wiewarm.ch sowie teilnehmende Badeanstalten und Individuen"
  Falls es das Medium erlaubt, sollte die URL ein Hyperlink sein.
- **Weitergabe unter gleichen Bedingungen** — Wenn Sie das lizenzierte Werk bzw. den lizenzierten Inhalt bearbeiten oder in anderer Weise erkennbar als Grundlage für eigenes Schaffen verwenden, dürfen Sie die daraufhin neu entstandenen Werke bzw. Inhalte nur unter Verwendung von Lizenzbedingungen weitergeben, die mit denen dieses Lizenzvertrages identisch oder vergleichbar sind.

```
Creative Commons License

The full dataset of wiewarm.ch by http://www.wiewarm.ch and contributing baths
and individuals is licensed under a Creative Commons Attribution-ShareAlike
3.0 Unported License.

Based on a work at http://www.wiewarm.ch.
Permissions beyond the scope of this license may be available at
mailto:info@wiewarm.ch.
```
