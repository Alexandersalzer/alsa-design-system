# Calendly

Calendly-bokning (popup) används när knappar har `action.type === "booking"` och `settings.calendlyUrl`.

## Komponenter

- **CalendlyModal** – laddar Calendly-script och exponerar `openCalendlyPopup(url)` (används av Button vid klick).
- **CalendlyInline** – inline-widget för att bädda in bokningssidan direkt på sidan.

## Demo

I **SiteMind Advisory**-demon används Calendly för CTA-knapparna "Kom igång gratis" (hero) och "Boka möte" (navbar). Företagsnamn i demon: **SiteMind Advisory**.

URL som används i demon: `https://calendly.com/sitemindadvisory/30min` (ersätt med riktig Calendly-URL om annan).
