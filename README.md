# homelab-plotter

Generatore SVG → G-code per usare la **Bambu Lab X2D come plotter**, basato su [Stiftplotter di addicted2create](https://github.com/addicted2create/Stiftplotter). Questa versione raccoglie la traduzione in inglese usata durante le prove e gli adattamenti sviluppati per il nostro montaggio X2D.

**Apri il sito: [spagno-lab.github.io/homelab-plotter](https://spagno-lab.github.io/homelab-plotter/).** Puoi anche scaricare `index.html` e aprirlo direttamente nel browser: non richiede installazione, account o un server applicativo. SVG e G-code vengono elaborati nel browser; le preferenze sono salvate nel suo local storage.

## Origine e attribuzione

Il progetto originale è **Stiftplotter Bambulab X2D by addicted2create**. Il motore SVG, la generazione di G-code, la simulazione, le opzioni di tratteggio e la modalità di taglio provengono da quel progetto. Non sono funzionalità create da questo repository.

- [Repository originale](https://github.com/addicted2create/Stiftplotter)
- [Interfaccia originale](https://addicted2create.github.io/Stiftplotter/)
- [README e istruzioni originali in tedesco](https://github.com/addicted2create/Stiftplotter/blob/main/README.md)
- [Codice originale](https://github.com/addicted2create/Stiftplotter/blob/main/index.html)

La licenza MIT e il copyright dell'autore, riportati nella sezione «Lizenz» del README originale, sono conservati nel file [LICENSE](LICENSE). [NOTICE.md](NOTICE.md) distingue il codice di origine dalle modifiche locali. Il credito all'autore resta anche nell'interfaccia.

## Cosa abbiamo cambiato

- **Traduzione in inglese** dell'interfaccia, degli aiuti e delle istruzioni integrate dell'originale tedesco.
- **Compensazione XY del portapenna** configurabile. Per il nostro toolhead Sebas X2D i valori iniziali sono X **+28 mm**, Y **+35 mm**, ricavati dal G-code di riferimento Desert Fox. Le coordinate della testina sono quelle desiderate per la punta più questa compensazione. Un portapenna diverso può richiedere altri valori.
- **Controllo dell'area realmente raggiungibile dalla penna** prima della generazione: con bed 256×256 mm e compensazione +28/+35, la zona utile della punta sul bed è X0…228 / Y0…221 mm.
- **Fit e Center** tengono conto del foglio, del margine e dell'area raggiungibile, conservando la posizione fisica impostata per la carta. Fit mantiene le proporzioni del disegno.
- **Anteprima più leggibile**: area non raggiungibile in grigio, zona utilizzabile del foglio in verde, contorno del disegno in blu e legenda dedicata. La zona grigia non è un errore.
- **Repository e pubblicazione automatica** su GitHub Pages, test di regressione e build senza dipendenze npm. Tutti i job Actions usano i runner **self-hosted Linux** dell'organizzazione.

L'homing rimane separato dal disegno e non è stato modificato per portare la testina all'angolo del foglio. La traduzione e gli adattamenti non rendono universali i valori Z: questi dipendono dalla regolazione fisica della penna e dalla superficie usata.

## Progetti e guide usati durante le prove

Questi sono riferimenti esterni; i rispettivi modelli CAD, G-code e licenze non sono inclusi nel repository.

| Riferimento | Uso nel progetto |
|---|---|
| [X2D Pen Plotter Toolhead — SebasCoquiMoran](https://makerworld.com/en/models/3334658-x2d-pen-plotter-toolhead) | Toolhead utilizzato nel montaggio attuale, confermato compatibile dal supporto 3DPlotter |
| [Improved Pen Plotter Tube for UMTS — MisterAnderson](https://makerworld.com/en/models/2956018-improved-pen-plotter-tube-for-umts-parametric) | Tubo guida parametrico della penna; provate varianti di diametro per consentire lo scorrimento |
| [Modular System for A1, X1, P1 & P2 Series — Falu / UMTS](https://makerworld.com/en/models/2029113) | Sistema modulare di riferimento e componente elastico/molla del portapenna |
| [GenPlot AI Drawings Your 3D Printer Can Pen Plot](https://makerworld.com/en/models/3501256-genplot-ai-drawings-your-3d-printer-can-pen-plot) | Istruzioni di montaggio e demo Desert Fox usata come riferimento per la compensazione XY |
| [Pen holder for Bambu Lab X2D pen plotter](https://makerworld.com/en/models/3531061-pen-holder-for-bambu-lab-x2d-pen-plotter#profileId-4037310) | Portapenna alternativo e istruzioni esaminati insieme a Stiftplotter; distinto dal montaggio Sebas attuale |
| [Guida 3DPlotter per Bambu Lab X2D](https://3dplotter.xyz/guides/bambu-lab-x2d) | Guida esterna consultata per montaggio e procedura del sistema X2D |

I progetti MakerWorld appartengono ai rispettivi autori. Questo repository non è una versione ufficiale di Stiftplotter, GenPlot, 3DPlotter o Bambu Lab.

## Uso

1. Apri il sito oppure `index.html` e seleziona la modalità di disegno.
2. Carica un SVG; converti prima in tracciati gli eventuali testi che il file contiene.
3. Imposta il bed reale, le dimensioni del foglio e le coordinate del suo angolo inferiore sinistro. Posiziona fisicamente la carta nello stesso punto.
4. Imposta la compensazione del portapenna, quindi usa Fit o Center e controlla l'anteprima e la simulazione.
5. Imposta **Pen down** e **Pen up** usando le quote verificate sul tuo montaggio. Pen up deve essere maggiore di Pen down.
6. Salva i due file: esegui **Homing senza portapenna**, attendi la fine, monta il portapenna regolato e avvia **Draw**.

La posizione del foglio e l'offset del portapenna sono due impostazioni distinte. Una piastra aggiuntiva sotto la carta cambia la configurazione fisica: verifica il riferimento Z sulla superficie realmente usata, senza sommare automaticamente lo spessore ai valori precedenti. L'anteprima verifica la geometria XY; non misura contatto, pressione della penna o ingombro degli accessori.

## Sviluppo e controlli

Richiede Node.js 22 o successivo, senza pacchetti da installare:

```sh
npm test
npm run build
```

La build copia l'applicazione e le attribuzioni in `dist/`. L'HTML è autosufficiente e non richiede un percorso base speciale per GitHub Pages. I test verificano sintassi degli script, JSON degli aiuti, compensazione XY, limiti del bed, separazione Homing/Draw e 108 combinazioni di Fit con formati, rotazioni e offset diversi. Non sono prove fisiche sulla stampante.

## GitHub Actions e Pages

Il workflow [pages.yml](.github/workflows/pages.yml) controlla ogni push e pull request su `main`. Dopo un push su `main` o un avvio manuale, costruisce e pubblica il sito su Pages. I pull request eseguono soltanto i controlli e la build.

**Entrambi i job usano `runs-on: [self-hosted, linux]`**. Le azioni sono fissate a commit verificati; il token ha permessi di sola lettura nel job di build e permessi Pages/OIDC soltanto nel deploy. In Settings → Pages la sorgente è GitHub Actions. I runner dell'organizzazione devono essere abilitati per questo repository pubblico.
