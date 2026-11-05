# Credits e provenienza

## Progetto originale

**Homelab-Plotter Bambulab X2D è un progetto derivato da [Stiftplotter Bambulab X2D di addicted2create](https://github.com/addicted2create/Stiftplotter)**, distribuito con licenza MIT.

Il codice originale comprende il motore SVG e geometrico, la generazione G-code, la simulazione, i tratteggi, il riempimento concentrico, la gestione del trascinamento della lama e gran parte dell'interfaccia di base. Questi contributi restano attribuiti ad addicted2create.

- [Repository originale](https://github.com/addicted2create/Stiftplotter)
- [Applicazione originale](https://addicted2create.github.io/Stiftplotter/)
- [Istruzioni originali e licenza MIT](https://github.com/addicted2create/Stiftplotter/blob/main/README.md)
- [Codice originale](https://github.com/addicted2create/Stiftplotter/blob/main/index.html)

Il copyright originale e il testo MIT sono conservati in [LICENSE](LICENSE) e anche in un commento dentro `index.html`, affinché accompagnino la copia scaricabile e utilizzabile da sola.

## Modifiche mantenute da spagno-lab

Traduzione inglese; compensazione XY del portapenna; area raggiungibile e Fit/Center; chiarimenti nell'anteprima; separazione tra piatto e limiti della testina; salvataggio progetti; livelli e colori; pulizia dei percorsi; anteprima della punta; testo vettoriale a linea singola; nuovi riempimenti; conversione locale PNG/JPG; supporto aggiuntivo per riferimenti e ritagli SVG; documentazione, test e pubblicazione.

L'alfabeto a linea singola incluso è disegnato per questo progetto su una griglia di segmenti e non incorpora font esterni. Le nuove parti sono anch'esse distribuite sotto licenza MIT. Il cambio di nome identifica il progetto derivato e non attribuisce a spagno-lab la paternità esclusiva del codice originale.

## Hardware e riferimenti

| Progetto | Riferimento |
|---|---|
| [X2D Pen Plotter Toolhead — SebasCoquiMoran](https://makerworld.com/en/models/3334658-x2d-pen-plotter-toolhead) | Toolhead del montaggio attuale |
| [Improved Pen Plotter Tube for UMTS — MisterAnderson](https://makerworld.com/en/models/2956018-improved-pen-plotter-tube-for-umts-parametric) | Tubo guida parametrico della penna |
| [Modular System — Falu / UMTS](https://makerworld.com/en/models/2029113) | Sistema modulare e molla del portapenna |
| [GenPlot AI Drawings](https://makerworld.com/en/models/3501256-genplot-ai-drawings-your-3d-printer-can-pen-plot) | Istruzioni e demo Desert Fox di riferimento |
| [Pen holder for Bambu Lab X2D](https://makerworld.com/en/models/3531061-pen-holder-for-bambu-lab-x2d-pen-plotter#profileId-4037310) | Portapenna alternativo esaminato |
| [Guida 3DPlotter X2D](https://3dplotter.xyz/guides/bambu-lab-x2d) | Montaggio e procedura X2D |


I modelli, i G-code demo e le rispettive licenze non sono inclusi nel repository. Ogni progetto MakerWorld appartiene al suo autore. Il riferimento Desert Fox è stato usato per ricavare la compensazione XY del montaggio; non è redistribuito.

## Strumenti di sviluppo

I test del browser usano [Playwright di Microsoft](https://github.com/microsoft/playwright), con licenza Apache-2.0. È una dipendenza di sviluppo e non viene distribuito nell'HTML dell'applicazione.

Progetto indipendente: nessuna affiliazione o approvazione ufficiale da parte di Bambu Lab, addicted2create, GenPlot, 3DPlotter o degli autori dei modelli collegati. I nomi dei prodotti indicano la compatibilità prevista.
