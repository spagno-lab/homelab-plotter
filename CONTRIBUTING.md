# Sviluppo

Node.js 22 o successivo. Le dipendenze sono usate solo per i test nel browser; l'applicazione distribuita resta un HTML autosufficiente.

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
npm run build
```

La build copia HTML, licenza, attribuzioni e guida in `dist/`. I test unitari verificano generazione G-code, limiti della testina, pulizia e clipping, testo, conversione raster e formato progetti. I test Chromium coprono anche importazione, interfaccia, ripristino progetti, passate per colore, ridimensionamento mobile e utilizzo offline. Le prove automatiche non muovono una stampante.

## Pubblicazione

Il workflow [pages.yml](.github/workflows/pages.yml) esegue controlli e build sui push e pull request verso `main`. Pubblica su Pages dopo push su `main` o avvio manuale. I pull request non eseguono il deploy.

Entrambi i job usano runner GitHub-hosted `ubuntu-latest`. Le azioni sono fissate a commit; il token è in sola lettura durante la build e riceve permessi Pages/OIDC soltanto nel deploy. Settings → Pages usa la sorgente GitHub Actions.

## Attribuzioni

Mantenere copyright e licenza MIT anche nel commento iniziale di `index.html`, oltre che in `LICENSE`. Documentare contributi e dipendenze distribuite in [CREDITS.md](CREDITS.md). Non includere modelli o demo esterni senza verificarne la licenza specifica.
