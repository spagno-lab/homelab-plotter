# Homelab-Plotter Bambulab X2D

Da SVG, immagini o testo a G-code per usare la Bambu Lab X2D come plotter. Tutto viene elaborato nel browser, senza caricare i tuoi file su un server.

**[Apri Homelab-Plotter](https://spagno-lab.github.io/homelab-plotter/)** oppure scarica `index.html` per usarlo localmente.

## Funzioni

- Importazione SVG con livelli, colori, riferimenti `<use>` e ritagli `clipPath`.
- Importazione PNG/JPG come contorni, tratteggio tonale o bordi.
- Testo a linea singola, anche come nuovo livello nel disegno.
- Contorni, tratteggio, riempimento concentrico, puntinato e tratteggio ondulato.
- Selezione e ordine dei livelli, stile e spaziatura per colore; esportazione delle passate per cambio penna manuale.
- Pulizia dei segmenti duplicati, unione opzionale degli estremi, anteprima dello spessore della punta e simulazione.
- Progetti salvabili con disegno, posizionamento e impostazioni.
- Dimensioni del piatto separate dai limiti della testina, con compensazione del portapenna.

## Uso rapido

1. Carica un disegno, importa un'immagine oppure crea un testo.
2. Imposta foglio e posizione reale sul piatto; controlla offset, limiti della testina e anteprima.
3. Scegli livelli e stile, poi salva il progetto o il G-code.
4. Esegui Homing senza portapenna, monta il portapenna regolato e avvia Draw. Per più penne scarica le passate numerate e cambia penna tra i file.

Default: piatto 260×260 mm, margine 0, pen down 14 mm e pen up 25 mm. Sono valori iniziali per il nostro montaggio; le quote Z e i limiti della macchina vanno verificati sul proprio sistema. Le preferenze già salvate dal browser hanno precedenza.

[Guida e limiti](GUIDE.md) · [Credits e progetti di riferimento](CREDITS.md) · [Licenza MIT](LICENSE) · [Sviluppo](CONTRIBUTING.md)
