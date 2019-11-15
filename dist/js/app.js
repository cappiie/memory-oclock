"use strict";

var options = {
  duree: 150,
  // en secondes
  nbPaires: 18
};
var introJeu = document.querySelector('#intro');
var divJeu = document.querySelector('#memory');
var playButton = document.querySelector('#intro button');
var chrono = options.duree * 1000;
var carteSelectionnee = null; // Mémoire de la première carte sélectionnée

var score = 0;
var pause = false; // Permet de bloquer le jeu quelques instants pour voir les 2 cartes, avant qu'elles ne se retournent (si ce n'est pas une bonne paire)

window.onload = function () {
  var buttonIntro = document.querySelector('#intro button span');
  buttonIntro.innerHTML = "Vous avez ".concat(showTime(options.duree), " :-)");
};

var initMemory = function initMemory() {
  divJeu.innerText = ''; // On s'assure que le plateau est vide avant l'initialisation du jeu

  introJeu.style.display = 'none'; // On cache la partie introductive avec les meilleurs scores
  // On crée les différents éléments HTML nécessaires

  var board = document.createElement('div');
  board.classList.add('board');
  var scoreDiv = document.createElement('div');
  scoreDiv.classList.add('score');
  var chronoDiv = document.createElement('div');
  chronoDiv.classList.add('chrono');
  var chronoBarre = document.createElement('div');
  chronoDiv.appendChild(chronoBarre);
  board.appendChild(scoreDiv);
  board.appendChild(chronoDiv);
  divJeu.appendChild(board);
  var divPlateau = document.createElement('div');
  divPlateau.classList.add('jeu');
  divJeu.appendChild(divPlateau); // On prépare la fonction qui affiche les cartes

  var initPlateau = function initPlateau(classeCarte) {
    var mixArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    for (var i = 0; i < mixArray.length - 1; i++) {
      var j = Math.floor(Math.random() * (i + 1)); // Nombre au hasard entre 0 et 17

      var _ref = [mixArray[j], mixArray[i]];
      mixArray[i] = _ref[0];
      mixArray[j] = _ref[1];
    }

    var _loop = function _loop(_i) {
      var carte = document.createElement('div');
      carte.classList.add('carte');
      carte.classList.add("".concat(classeCarte));
      carte.classList.add("carte-".concat(mixArray[_i]));
      carte.setAttribute('num', "".concat(mixArray[_i]));
      var cacheCarte = document.createElement('div');
      cacheCarte.classList.add('cache');
      carte.appendChild(cacheCarte);
      divPlateau.appendChild(carte);
      carte.addEventListener('click', function funcClick() {
        clickCarte(this);
        carte.removeEventListener("click", funcClick); // On supprime l'évènement pour ne pas pouvoir re-cliquer dessus
      });
    };

    for (var _i = 0; _i < mixArray.length - 1; _i++) {
      _loop(_i);
    }
  }; // On lance 2 fois pour obtenir les paires


  initPlateau('carte1');
  initPlateau('carte2'); // On affiche la zone du score

  majScore(); // On intialise la barre du chrono

  majChrono(); // TOut est prêt, on lance le jeu !

  chronoFunc();
};

var clickCarte = function clickCarte(e) {
  if (chrono > 0 && pause == false) {
    e.classList.toggle("show"); // On ajoute une classe qui affiche la carte

    testPaire(e.getAttribute('num')); // On vérifie si c'est la bonne paire
  }
};

var testPaire = function testPaire(numCarte) {
  if (carteSelectionnee == null) {
    // Si on n'a cliqué que sur une carte, on ne fait pas de test mais on stocke la valeur
    carteSelectionnee = numCarte;
  } else if (carteSelectionnee == numCarte) {
    // Si on a trouvé une paire...
    score++; // On incrémente le score

    majScore();
    carteSelectionnee = null; // On vide la mémoire de la première carte sélectionnée
  } else {
    // On cache les cartes après 1 sec		
    pause = true;
    var nextQuiz = setTimeout(function () {
      var carte1 = document.querySelector(".carte.show[num=\"".concat(carteSelectionnee, "\"]"));
      carte1.classList.remove('show');
      carte1.addEventListener('click', function funcClick() {
        // On réinitialise l'évènement au clic
        clickCarte(this);
        carte1.removeEventListener("click", funcClick);
      });
      var carte2 = document.querySelector(".carte.show[num=\"".concat(numCarte, "\"]"));
      carte2.classList.remove('show');
      carte2.addEventListener('click', function funcClick() {
        clickCarte(this);
        carte2.removeEventListener("click", funcClick);
      });
      carteSelectionnee = null;
      pause = false;
    }, 1000);
  }
}; // Mise à jour HTML du score


var majScore = function majScore() {
  var divScore = document.querySelector('.score');
  divScore.innerHTML = "Score: ".concat(score, "/").concat(options.nbPaires);
}; // Mise à jour HTML de la barre de progression


var majChrono = function majChrono() {
  var divBarre = document.querySelector('.chrono div');
  var percentBarre = chrono * 100 / options.duree / 1000;

  if (divBarre) {
    divBarre.style.width = "".concat(percentBarre, "%");
  }
}; // Le coeur du jeu...


var chronoFunc = function chronoFunc() {
  var chronoMemory = setInterval(function () {
    chrono = chrono - 100;
    majChrono(); //console.log('chrono...');

    if (chrono <= 0) {
      // Fin du jeu !
      clearInterval(chronoMemory); // On stoppe l'appel répété à la fonction chronoMemory

      saveScore(); // On stocke le score en BDD

      if (score == options.nbPaires) {
        alert("Vous avez gagn\xE9, bravo !");
      } else {
        alert("Trop tard :-(");
      } // On retourne les cartes restantes


      Array.from(document.querySelectorAll('.carte')).map(function (carte) {
        carte.classList.add('show');
      }); // Pour rejouer...
      // On affiche un bouton

      var replayDiv = document.createElement('div');
      replayDiv.classList.add('text-center');
      var replayBtn = document.createElement('button');
      replayBtn.innerHTML = 'C\'est reeeeeeparti !';
      replayDiv.appendChild(replayBtn);
      divJeu.appendChild(replayDiv);
      replayBtn.addEventListener('click', function () {
        score = 0; // Remise à zéro du score et du chrono

        chrono = options.duree * 1000;
        initMemory(); // On réinitialise le jeu et l'affichage du score

        majScore();
      });
    }
  }, 100);
};

var saveScore = function saveScore() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.response) {
        alert(this.response);
      }
    }
  };

  xhttp.open("POST", "save-score.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("score=".concat(score, "&duree=").concat(options.duree * 1000 - chrono));
};

var showTime = function showTime(time) {
  var sec = time;
  var min = Math.floor(sec / 60);

  if (min > 0) {
    sec = time - min * 60;
  }

  return "".concat(min, " minute").concat(min > 1 ? "s" : "", " ").concat(sec, " sec");
}; // Lancement du jeu


playButton.addEventListener('click', function () {
  initMemory();
});
initMemory();