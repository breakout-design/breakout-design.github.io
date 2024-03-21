//Definisco tutte le costanti che mi servono per la creazione del gioco
let bgimg;
let back;
let contatore = 0;
let contLivello = 0;
let contCicli = 0;
let score = 0;

const larghezza = 400;
const altezza = 400;

const distanzaBloccoSinistra = larghezza - 25;
const distanzaBloccoDestra = larghezza - 5;
const distanzaBloccoSopra = (altezza / 2) - 20;
const distanzaBloccoSotto = altezza / 2;
const distanzaStopSopra = (altezza / 2) + 20;
const distanzaStopSotto = (altezza / 2) + 40;

const dimensionePalla = 10;
const larghezzaBlocco = 20;
const altezzaBlocco = 10;
const larghezzaBarra = 80;

//const canvas = document.getElementById('gameCanvas');
//const ctx = canvas.getContext('2d');

function preload(){
  bgimg = loadImage('./img/menu.png');
}

//verifico la pressione dei pulsanti di controllo del gioco
function mousePressed(){
  if(mouseIsPressed && mouseX >= distanzaBloccoSinistra && mouseX <= distanzaBloccoDestra
                    && mouseY >= distanzaBloccoSopra && mouseY <= distanzaBloccoSotto){
    location.reload();
  }
  if(mouseIsPressed && mouseX >= distanzaBloccoSinistra && mouseX <= distanzaBloccoDestra
                    && mouseY >= distanzaStopSopra && mouseY <= distanzaStopSotto){
    back = bgimg;
  }
}

//creo la struttura di palla formata dalla posizione e dalla velocità
let palla = {
  x: larghezza / 2,
  y: altezza - 30,
  xVel: 0,
  yVel: -3
};

//creo la struttura barra formata dalla posizione e dalla dimensione
let barra = {
  x: larghezza / 2,
  larg: larghezzaBarra
};

//creo la finestra di gioco passando al canvas le costanti delle dimensioni
function setup() {
  createCanvas(larghezza, altezza);
  back = bgimg;
}

//nella funzione draw faccio disegnare tutti gli elementi e definisco i comandi di gioco
function draw() {
  background(back);
  if(back == bgimg && key == " "){
    back = 0;
  }

  if(back == 0){
    drawBarra(barra.x, barra.larg);
    drawPalla(palla.x, palla.y);
    drawLivelli(Livelli);
    drawBottoni();
    movimentoPalla(palla);

    collisioneBordi(palla, Livelli);
    collisioneBarra(palla, barra);
    collisioneBlocchi(palla, Livelli);

    if (keyIsDown(LEFT_ARROW)) {barra.x = barra.x - 5;}
    if (keyIsDown(RIGHT_ARROW)) {barra.x = barra.x + 5;}
    mousePressed();
    //drawScore();
  }
}
/*
function drawScore() {
  //Imposta lo stile del testo per il punteggio
  ctx.font = "24px Arial";
  ctx.fillStyle = "white";
  
  //Disegna il punteggio sul canvas
  ctx.fillText("Score: " + score, 10, 30);
}
*/
//definisco il movimento palla iniziale, che verierà in base alle collisioni
function movimentoPalla(palla){
  palla.x = palla.x + palla.xVel;
  palla.y = palla.y + palla.yVel;
}

//disegno i bottoni di controllo del gioco
function drawBottoni(){
  fill(color("white"));
  rect(larghezza - 25, (altezza / 2) - 20, 20, 20)
  rect(larghezza - 23, (altezza / 2) + 20, 5, 20)
  rect(larghezza - 13, (altezza / 2) + 20, 5, 20)
}

//disegno la palla passando per valore la posizione
function drawPalla(xpos, ypos) {
  fill(color("white"));
  ellipse(xpos, ypos, dimensionePalla);
}

//disegno la barra passando la posizione e la dimensione per valore
function drawBarra(pos, larg) {
  fill(color("white"));
  rect(pos - larg / 2, altezza - 20, larg, 5);
}

//disegno i vari layer di gioco tramite la funzione "disegna blocco"
function drawLivelli(Livelli) {
  for (let i = 0; i < Livelli.length; i++) {
    drawBlocco(Livelli[i]);
  }
}

//disegno i blocchi assegnando a blocco i valori di "Livelli" alla posizione [i] del ciclo
//blocchi funziona quindi a chiamata e prende i valore tramite il .x o .y per esempio
function drawBlocco(blocco) {
  let colore = {1: "yellow", 2: "green", 3: "blue",}

  if (blocco.hp == 0) {return;}
  fill(colore[blocco.hp]);
  rect(blocco.x, blocco.y, larghezzaBlocco, altezzaBlocco);
}

//verifico le collisioni della palla con la barra passando per valore le due strutture
//confronto le posizioni per definire la collisione
function collisioneBarra(palla, barra) {
  if (palla.y < altezza - 25) {return;}
  if (palla.x < barra.x - barra.larg / 2) {return;}
  if (palla.x > barra.x + barra.larg / 2) {return;}

  palla.xVel = (palla.x - barra.x) / 10;
  palla.yVel = -palla.yVel;
}

//verifico le collisioni della palla con i blocchi dei layer
function collisioneBlocchi(palla, Livelli) {
  let blocco;

  //verifico che il blocco sia ancora presente controllando la vita "hp"
  for (let k = 0; k < Livelli.length; k++) {
    blocco = Livelli[k];
    //se hp è minore o uguale a zero la palla non colliderà perchè il blocco non è presente
    if (blocco.hp <= 0) {continue;}

    //verifico le collisioni in maniera precisa passando per valore tutti i parametri
    let Collisioni = collisionePalla( blocco.x, blocco.y, larghezzaBlocco, altezzaBlocco,
                                      palla.x, palla.y, dimensionePalla);
    
    //verifico se sono avvenute collisione con "Interseca"
    //se non ha colliso la palla non verrà deviata e il codice continuerà
    if (Collisioni.interseca == false){continue;}
    let ingombroPalla = (dimensionePalla / 2) + 1;
    
    //tramite uno switch case, verifico il lato di collisione e devio la palla di conseguenza
    switch (Collisioni.lato) {
      case "top":
        palla.y = Collisioni.y - ingombroPalla;
        palla.yVel = -palla.yVel;
        break;
      case "right":
        palla.x = Collisioni.x + ingombroPalla;
        palla.xVel = -palla.xVel;
        break;
      case "bottom":
        palla.y = Collisioni.y + ingombroPalla;
        palla.yVel = -palla.yVel;
        break;
      case "left":
        palla.x = Collisioni.x - ingombroPalla;
        palla.xVel = -palla.xVel;
        break;
    }
    //quando si collide con un blocco, la sua vita diminuisce
    blocco.hp = blocco.hp - 1;
    score++;
    console.log("Score: " + score);
    //score++;
    if(contLivello < 19){
      contLivello++;
    }else{
      contLivello = 0
      palla.yVel = palla.yVel * 1.7;
      console.log("Next Level!");
      if(contCicli < 4){
        contCicli++;
      }else{
        contCicli = 0;
        palla.yVel = -3;
        console.log("You Won!");
        location.reload();
      }
    }
  }
}

//verifico le collisioni con i bordi del canvas
function collisioneBordi(palla, Livelli) {
  if (palla.y < 0) {palla.yVel = -palla.yVel;}
  if (palla.x < 0) {palla.xVel = -palla.xVel;}
  if (palla.x > larghezza) {palla.xVel = -palla.xVel;}

  //se la palla supera la barra, in basso, il gioco si ferma
  if (palla.y > altezza) {
    console.log("Hai Perso!");
    location.reload();
  }
}