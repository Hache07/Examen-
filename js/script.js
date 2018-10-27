var img='img/1.jpg' ;
var turno=1;
var arreglo = new Array();
var jug1=0;
var jug2=0;

for(i=0; i<=8; i++) {
  arreglo[i]=-1;
}

function box(pos) {

  if(arreglo[pos]==-1) {
    if(turno==1) {
      if(img=='img/1.jpg') {
        document.getElementById('c'+pos).src=img;
        arreglo[pos]=1;
        turno=2;
        img='img/2o.png';
      }
    } else if(turno==2) { 
            if(img=='img/2o.png') {
              document.getElementById('c'+pos).src=img;
              arreglo[pos]=0;
              turno=1;
              img='img/1.jpg' ;
            }
          }
  } else { 
      alert('Posicion ocupada!'); 
    }
    
  if(arreglo[0]==1 && arreglo[1]==1 && arreglo[2]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[0]==0 && arreglo[1]==0 && arreglo[2]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[3]==1 && arreglo[4]==1 && arreglo[5]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[3]==0 && arreglo[4]==0 && arreglo[5]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[6]==1 && arreglo[7]==1 && arreglo[8]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[6]==0 && arreglo[7]==0 && arreglo[8]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[0]==1 && arreglo[3]==1 && arreglo[6]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[0]==0 && arreglo[3]==0 && arreglo[6]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[1]==1 && arreglo[4]==1 && arreglo[7]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[1]==0 && arreglo[4]==0 && arreglo[7]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[2]==1 && arreglo[5]==1 && arreglo[8]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[2]==0 && arreglo[5]==0 && arreglo[8]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[0]==1 && arreglo[4]==1 && arreglo[8]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[0]==0 && arreglo[4]==0 && arreglo[8]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[2]==1 && arreglo[4]==1 && arreglo[6]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[2]==0 && arreglo[4]==0 && arreglo[6]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }
}

function reiniciar() {
  document.getElementById('reset');

  for(i=0; i<=8; i++){
    document.getElementById('c'+i).src="img/fondo1.jpg";
  }

  for(i=0; i<=8; i++){
    arreglo[i]=-1;
  }
}