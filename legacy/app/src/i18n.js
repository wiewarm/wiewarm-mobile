import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  chBE: {
    translation: {
      "AppTitle": "händy.wiewarm.ch",
      "aktualisiert": "aktualisiert",
      "Prise": "Prise",
    }
  },
  de: {
    translation: {
      "AppTitle": "handy.wiewarm.ch",
      "Sortiere nach Dischtanz": "Sortieren nach Distanz",
      "Sortiere nach Datum": "Sortieren nach Datum",
      "Sueche...": "Suchen...",
      "aktualisiert": "aktualisiert",
      "Details zur Badi": "Details zum Bad",
      "Zyte": "Zeiten",
      "Prise": "Preise",
      "Infos": "Infos",
      "key Ahnig wiviu": "unbekannt",
      "Meter wyt wägg": "Meter von hier",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "chBE",
    debug: false,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
