const options = {
	duree: 150, // en secondes
	nbPaires: 18
};



const introJeu = document.querySelector('#intro');
const divJeu = document.querySelector('#memory');
const playButton = document.querySelector('#intro button');

let chrono = options.duree*1000;
let carteSelectionnee = null; // Mémoire de la première carte sélectionnée
let score = 0;
let pause = false; // Permet de bloquer le jeu quelques instants pour voir les 2 cartes, avant qu'elles ne se retournent (si ce n'est pas une bonne paire)

window.onload = function(){
	const buttonIntro = document.querySelector('#intro button span');
	buttonIntro.innerHTML = `Vous avez ${showTime(options.duree)} :-)`;
}


const initMemory = () => {
	divJeu.innerText = ''; // On s'assure que le plateau est vide avant l'initialisation du jeu
	introJeu.style.display = 'none'; // On cache la partie introductive avec les meilleurs scores
	
	// On crée les différents éléments HTML nécessaires
	const board = document.createElement('div');
	board.classList.add('board');
	
	const scoreDiv = document.createElement('div');
	scoreDiv.classList.add('score');
	
	const chronoDiv = document.createElement('div');
	chronoDiv.classList.add('chrono');
	
	const chronoBarre = document.createElement('div');
	
	chronoDiv.appendChild(chronoBarre);
	
	board.appendChild(scoreDiv);
	board.appendChild(chronoDiv);
	divJeu.appendChild(board);


	const divPlateau = document.createElement('div');
	divPlateau.classList.add('jeu');
	divJeu.appendChild(divPlateau);
	
	// On prépare la fonction qui affiche les cartes
	const initPlateau = (classeCarte) => {
		let mixArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];

		for (let i = 0; i < mixArray.length - 1; i++) {
			const j = Math.floor(Math.random() * (i + 1)); // Nombre au hasard entre 0 et 17
			[mixArray[i], mixArray[j]] = [mixArray[j], mixArray[i]]; // Destructuring 
		}
		
		for (let i = 0; i < mixArray.length - 1; i++) {
			const carte = document.createElement('div');
			carte.classList.add('carte');
			carte.classList.add(`${classeCarte}`);
			carte.classList.add(`carte-${mixArray[i]}`);
			carte.setAttribute('num',`${mixArray[i]}`);
			
			const cacheCarte = document.createElement('div');
			cacheCarte.classList.add('cache');
			carte.appendChild(cacheCarte);
			
			
			divPlateau.appendChild(carte);
			
			carte.addEventListener('click',function funcClick() {
				
				clickCarte(this);
				carte.removeEventListener("click", funcClick); // On supprime l'évènement pour ne pas pouvoir re-cliquer dessus
			});
		}
	
	};
	
	// On lance 2 fois pour obtenir les paires
	initPlateau('carte1');
	initPlateau('carte2');
	
	// On affiche la zone du score
	majScore();
	// On intialise la barre du chrono
	majChrono();
	
	// TOut est prêt, on lance le jeu !
	chronoFunc();
};

const clickCarte = (e) => {
	if(chrono > 0 && pause == false){
		e.classList.toggle("show"); // On ajoute une classe qui affiche la carte
		testPaire(e.getAttribute('num')); // On vérifie si c'est la bonne paire
	}
};

const testPaire = (numCarte) => {
	if(carteSelectionnee == null){ // Si on n'a cliqué que sur une carte, on ne fait pas de test mais on stocke la valeur
		carteSelectionnee = numCarte;
	}else if (carteSelectionnee == numCarte){ // Si on a trouvé une paire...
		score++; // On incrémente le score
		majScore(); 
		carteSelectionnee = null; // On vide la mémoire de la première carte sélectionnée
	}else{
		// On cache les cartes après 1 sec		
		pause = true;
		
		const nextQuiz = setTimeout(function(){
			const carte1 = document.querySelector(`.carte.show[num="${carteSelectionnee}"]`);
			carte1.classList.remove('show');			
			carte1.addEventListener('click',function funcClick() {	// On réinitialise l'évènement au clic
				clickCarte(this);
				carte1.removeEventListener("click", funcClick);
			});

			const carte2 = document.querySelector(`.carte.show[num="${numCarte}"]`);
			carte2.classList.remove('show');			
			carte2.addEventListener('click',function funcClick() {				
				clickCarte(this);
				carte2.removeEventListener("click", funcClick);
			});
			
			carteSelectionnee = null;
			
			pause = false;
			
		},1000);
		
	}
};

// Mise à jour HTML du score
const majScore = () => {
	const divScore = document.querySelector('.score');
	divScore.innerHTML = `Score: ${score}/${options.nbPaires}`;
};

// Mise à jour HTML de la barre de progression
const majChrono = () => {
	const divBarre = document.querySelector('.chrono div');
	const percentBarre = (chrono * 100 / options.duree)/1000;
	if(divBarre){divBarre.style.width = `${percentBarre}%`;}
};

// Le coeur du jeu...
const chronoFunc = () => {
	const chronoMemory = setInterval(function() {	
		chrono = chrono - 100;
		majChrono();
		//console.log('chrono...');
		if(chrono <= 0){ // Fin du jeu !
		
		
			clearInterval(chronoMemory); // On stoppe l'appel répété à la fonction chronoMemory
			saveScore(); // On stocke le score en BDD

			
			if(score == options.nbPaires){
				alert(`Vous avez gagné, bravo !`);
			}else{
				alert(`Trop tard :-(`);
			}
		
			// On retourne les cartes restantes
			Array.from(document.querySelectorAll('.carte')).map( carte => {
				carte.classList.add('show');
			});
			
			
			// Pour rejouer...
			
			// On affiche un bouton
			const replayDiv = document.createElement('div');
				replayDiv.classList.add('text-center');
			const replayBtn = document.createElement('button');
			replayBtn.innerHTML = 'C\'est reeeeeeparti !';
				replayDiv.appendChild(replayBtn);
				divJeu.appendChild(replayDiv);
				
			
			replayBtn.addEventListener('click',function(){				
				score = 0; // Remise à zéro du score et du chrono
				chrono = options.duree*1000;
				initMemory(); // On réinitialise le jeu et l'affichage du score
				majScore();
			});
			
		}
	},100);

};

const saveScore = () => {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {		
		
		if (this.readyState == 4 && this.status == 200) {
			if(this.response){alert(this.response);}
		}
     };

	xhttp.open("POST", "save-score.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(`score=${score}&duree=${(options.duree*1000 - chrono)}`);
};


const showTime = (time) => {
	let sec = time;
	const min = Math.floor(sec/60);
	
	if(min > 0){
		sec = time - min * 60
	}
	
	return(`${min} minute${min > 1 ? "s" : ""} ${sec} sec`);
};

// Lancement du jeu
playButton.addEventListener('click',function(){

	initMemory();
});


