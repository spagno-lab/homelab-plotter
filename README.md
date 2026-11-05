# homelab-plotter

Trasforma un SVG in G-code per usare la **Bambu Lab X2D come plotter**. Funziona nel browser, senza installazione: i file vengono elaborati localmente.

**[Apri homelab-plotter](https://spagno-lab.github.io/homelab-plotter/)** oppure scarica `index.html` e aprilo nel browser.

## Da dove nasce

Basato su **[Stiftplotter di addicted2create](https://github.com/addicted2create/Stiftplotter)**, da cui provengono il motore SVG, la generazione G-code, la simulazione, il tratteggio e la modalità di taglio. Le [istruzioni originali](https://github.com/addicted2create/Stiftplotter/blob/main/README.md) sono in tedesco; questa versione include la traduzione in inglese.

Abbiamo aggiunto:

- Compensazione XY configurabile per il portapenna; valori iniziali **X +28 / Y +35 mm** per il toolhead Sebas X2D, ricavati dalla demo Desert Fox.
- Controllo dei limiti realmente raggiungibili dalla punta.
- **Fit e Center** che rispettano foglio, margini e area utile.
- Anteprima con legenda e distinzione tra disegno, area utile e zone non raggiungibili.

## Come usarlo

1. Carica un SVG e imposta dimensioni e posizione del foglio, uguali a quelle sul piatto.
2. Controlla l'offset del portapenna, usa **Fit** o **Center** e verifica l'anteprima.
3. Imposta **Pen down** e **Pen up** in base alla regolazione fisica della tua penna.
4. Salva i due file: esegui **Homing senza portapenna**, poi monta il portapenna regolato e avvia **Draw**.

I valori Z dipendono dal montaggio e dalla superficie usata. L'homing resta separato dal disegno e non posiziona la testina sull'angolo del foglio. Per tutti i dettagli usa gli aiuti integrati e la guida originale.

## Hardware e riferimenti

| Progetto | Riferimento |
|---|---|
| [X2D Pen Plotter Toolhead — SebasCoquiMoran](https://makerworld.com/en/models/3334658-x2d-pen-plotter-toolhead) | Toolhead del montaggio attuale |
| [Improved Pen Plotter Tube for UMTS — MisterAnderson](https://makerworld.com/en/models/2956018-improved-pen-plotter-tube-for-umts-parametric) | Tubo guida parametrico della penna |
| [Modular System — Falu / UMTS](https://makerworld.com/en/models/2029113) | Sistema modulare e molla del portapenna |
| [GenPlot AI Drawings](https://makerworld.com/en/models/3501256-genplot-ai-drawings-your-3d-printer-can-pen-plot) | Istruzioni e demo Desert Fox di riferimento |
| [Pen holder for Bambu Lab X2D](https://makerworld.com/en/models/3531061-pen-holder-for-bambu-lab-x2d-pen-plotter#profileId-4037310) | Portapenna alternativo esaminato |
| [Guida 3DPlotter X2D](https://3dplotter.xyz/guides/bambu-lab-x2d) | Montaggio e procedura X2D |

## Crediti

Licenza [MIT](LICENSE), copyright addicted2create. I modelli collegati appartengono ai rispettivi autori e non sono inclusi nel repository. Progetto indipendente, non affiliato a Bambu Lab o agli autori dei sistemi citati.

[Attribuzioni](NOTICE.md) · [Sviluppo e pubblicazione](CONTRIBUTING.md)
