function collisionePalla(bloccoX, bloccoY, larghezzaBlocco, altezzaBlocco, pallaX, pallaY, dimensionePalla) {
  //creo la struttura con gli elementi necessari per verificare le collisioni
  let gruppoCollisioni = {
    interseca: false,
    lato: null,
    x: pallaX,
    y: pallaY
  };

  //confronto le coordinate per i valori della palla in x e dei blocchi
  if (pallaX < bloccoX) {
    //in base alla collisione definisco e assegno il lato sul quale si ha colliso
    gruppoCollisioni.x = bloccoX;
    gruppoCollisioni.lato = "left";
  } else if (pallaX > bloccoX + larghezzaBlocco) {
    //in base alla collisione definisco e assegno il lato sul quale si ha colliso
    gruppoCollisioni.x = bloccoX + larghezzaBlocco;
    gruppoCollisioni.lato = "right";
  }

  //confronto le coordinate per i valori della palla in y e dei blocchi
  if (pallaY < bloccoY) {
    //in base alla collisione definisco e assegno il lato sul quale si ha colliso
    gruppoCollisioni.y = bloccoY;
    gruppoCollisioni.lato = "top";
  } else if (pallaY > bloccoY + altezzaBlocco) {
    //in base alla collisione definisco e assegno il lato sul quale si ha colliso
    gruppoCollisioni.y = bloccoY + altezzaBlocco;
    gruppoCollisioni.lato = "bottom";
  }

  //tramite this.dist calcolo la distanza
  //a gruppoCollisioni.interseca assegno un boolean "distanza <= dimensionePalla / 2"
  let distanza = this.dist(pallaX, pallaY, gruppoCollisioni.x, gruppoCollisioni.y);
  gruppoCollisioni.interseca = distanza <= dimensionePalla / 2;

  return gruppoCollisioni;
  }