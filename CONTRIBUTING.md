# Sviluppo

## Controlli locali

Richiede Node.js 22 o successivo, senza pacchetti da installare:

```sh
npm test
npm run build
```

La build copia l'applicazione e le attribuzioni in `dist/`. L'HTML è autosufficiente e non richiede un percorso base speciale per GitHub Pages. I test verificano sintassi degli script, JSON degli aiuti, compensazione XY, limiti del bed, separazione Homing/Draw e 108 combinazioni di Fit con formati, rotazioni e offset diversi. Non sono prove fisiche sulla stampante.

## GitHub Actions e Pages

Il workflow [pages.yml](.github/workflows/pages.yml) controlla ogni push e pull request su `main`. Dopo un push su `main` o un avvio manuale, costruisce e pubblica il sito su Pages. I pull request eseguono soltanto i controlli e la build.

**Entrambi i job usano `runs-on: [self-hosted, linux]`**. Le azioni sono fissate a commit verificati; il token ha permessi di sola lettura nel job di build e permessi Pages/OIDC soltanto nel deploy. In Settings → Pages la sorgente è GitHub Actions. I runner dell'organizzazione devono essere abilitati per questo repository pubblico.
