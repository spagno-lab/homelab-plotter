# Guida alle funzioni

## Piatto, testina e penna

Il piatto è il rettangolo fisico usato come riferimento per collocare il foglio. I limiti X/Y della testina sono coordinate ugello indipendenti: non si ricavano dalle dimensioni fisiche del piatto. Il grigio rappresenta i punti sul piatto che la punta non può raggiungere con quei limiti e con l'offset impostato. I default 0–260 mm sono valori iniziali, non una misura certificata della corsa della X2D.

La relazione usata è `ugello = punta + offset`. Con piatto 260×260, limiti testina 0–256 e offset +28/+35, la punta può raggiungere X0–228 e Y0–221. Fit e Center usano l'intersezione tra questa area e il foglio, senza spostare la carta impostata. Non viene verificato l'ingombro tridimensionale di clip, holder o altri accessori.

Pen width preview rappresenta lo spessore della punta sul disegno. Non modifica il G-code, non compensa i contorni e non sottrae automaticamente metà diametro dai limiti del foglio: con margine 0 la traccia può sbordare di mezzo diametro.

## Progetti e livelli

Save project scarica un `.plotter.json` con SVG, formato carta, posizionamento, quote, opzioni, ordine e selezione dei gruppi. Open project lo ripristina. Gli SVG importati conservano livelli/gruppi e colori di riempimento e tratto. L'ordine scelto vale anche per le passate esportate.

Il file contiene le impostazioni del modo attivo; le preferenze dell'altro modo conservate nel browser non fanno parte del file. Non aprire un vecchio progetto assumendo che le sue quote Z siano ancora corrette sul montaggio attuale.

Standard export produce un singolo disegno con la penna montata. Export colour passes prepara un file Homing e un file per ogni gruppo/colore abilitato. Eseguire Homing una volta senza holder; poi montare e regolare la penna e lanciare i file numerati in ordine. Tra una passata completata e la successiva cambiare penna conservando carta, holder e altezza della punta. Il software non effettua cambi utensile automatici. Ogni passata solleva la penna prima di muoversi e non ripete l'homing.

## Tracciati e riempimenti

Remove duplicate segments elimina segmenti coincidenti, anche percorsi al contrario, con risoluzione numerica di 0,00001 mm. Non è un riconoscimento di curve simili né un'unione generale di segmenti parzialmente sovrapposti. L'operazione vale all'interno di ciascuna passata: non elimina tracce appartenenti a penne diverse.

Join nearby ends è disattivato a 0. Se abilitato collega estremi vicini con un tratto inchiostrato entro la tolleranza scelta. La semplificazione può perdere dettagli; Minimum path elimina tratti più corti della soglia.

Il puntinato usa brevi tratti da circa 0,06 mm, non soste con la penna premuta. Per conservarli imposta Minimum path sotto 0,06 mm. Il tratteggio ondulato viene ritagliato sul riempimento. Stile e spaziatura possono essere sovrascritti per gruppo; 0 nella spaziatura del gruppo eredita il valore globale.

## Testo e immagini

Create text SVG crea un nuovo disegno; Add text layer aggiunge al disegno corrente conservandone la scala e la posizione. X/Y del testo sono in mm rispetto all'angolo alto sinistro dell'artwork, prima di rotazione e mirroring. Il font integrato è a segmenti, maiuscolo latino, numeri e punteggiatura di base; gli accenti sono normalizzati. I caratteri non supportati vengono segnalati. Il testo presente come `<text>` dentro SVG esterni richiede ancora conversione in tracciati.

Le immagini PNG/JPG vengono ridotte a massimo 320 pixel sul lato lungo. Threshold genera contorni dalle zone scure; Tonal hatching quantizza i grigi e crea riempimenti da tratteggiare; Edge outlines rileva bordi e ne traccia i contorni. Non è un generatore AI e non ricostruisce automaticamente un ritratto a linea singola. Il piccolo riquadro mostra la sorgente; l'anteprima centrale mostra i percorsi effettivi. Apply image conversion applica soglia, metodo e risoluzione al file importato. Il cambio di metodo/soglia richiede questo pulsante.

## Compatibilità SVG

Supportati: path e forme di base, trasformazioni, colori fill/stroke separati, gruppi, riferimenti locali `<use>`/`symbol` e clipPath vettoriali in userSpaceOnUse o objectBoundingBox. Riferimenti esterni o ciclici sono rifiutati. I clipPath sono applicati ai percorsi generati; non aggiungono una nuova linea lungo il bordo del ritaglio.

Non sono riprodotti completamente filtri, maschere alfa, gradienti, pattern, immagini raster incorporate nell'SVG, testo/font o tutte le regole CSS. L'applicazione avvisa per i principali elementi non supportati; per SVG complessi è opportuno convertire gli effetti in tracciati e confrontare l'anteprima. Importare PNG/JPG direttamente usa il convertitore immagini.

Per evitare calcoli eccessivi ci sono limiti su file, espansione dei riferimenti, punti campionati e numero di percorsi. Se viene richiesto, ridurre risoluzione/dettaglio o aumentare la spaziatura. La simulazione e la stima temporale non sostituiscono una prova fisica.
