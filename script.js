// variables globales
let the_word = ''; // mot à trouver
let nbLetters = 0; // nombre de lettre saisi pour l'essai actuel
let life = 6;      // compteur de vie
let row_indice = 0; // indice d'écriture : permet d'écrire dans la bonne case de la grille
let the_table = document.querySelectorAll(".letter-box"); // affichage du tableau
let finish = false; // pour savoir si la partie est teminée

// FONCTIONS

// fonction permettant d'afficher une ligne
function oneRow(nbLettersWord){
   // création d'une ligne
    let row = `<div class = "letter-row">`
    for(let j =1; j<=nbLettersWord;j++){
        row += ` <div class = "letter-box"></div>
      `;
    } 
    row += `</div>`;  
    return row;
} // fin de oneRow


// fonction permettant d'afficher la grille
function grid(nbLettersWord){
  document.querySelector("#game-board").innerHTML = '';
  for(let i=1;i<=6;i++){
    document.querySelector("#game-board").innerHTML += oneRow(nbLettersWord);
  } 
    // initialisation de the_table
  the_table = document.querySelectorAll(".letter-box");
} // fin de grid


// fonction permettant d'ajouter une lettre dans la grille
function addLetter(keyName) {
    // écriture de la lettre
	  the_table[row_indice].textContent = keyName.toUpperCase(); 

    // on met à jour l'indice d'écriture et le nombre de lettre saisie pour le mot
    row_indice++;
    nbLetters++;
} // fin de addLetter


// fonction permettant d'effacer une lettre 
function deleteLetter() {
  if(row_indice > 0){
    // on revient à la case précédente et on l'efface
    row_indice--;
    the_table[row_indice].textContent = "";
    // on met à jour le nombre de lettre(s) saisie(s)
    nbLetters--;
  }
} // fin de deleteLetter


// fonction permettant de vérifier le mot et de colorier les cases en conséquence 
// prend en paramètre l'indice d'écriture
function checkWord(table_position){
    let countGood = 0;
    // on boucle sur chaque lettre et on la colorie 
    for(let i = 0; i<the_word.length;i++){
       // on regarde si la lettre est dans le mot
        if(the_word.includes(the_table[i+table_position].textContent)){
            the_table[i+table_position].style.background = "yellow";
        }
        if(!the_word.includes(the_table[i+table_position].textContent)){
          the_table[i+table_position].style.background = "gray";
        }

        if(the_table[i+table_position].textContent===the_word[i]){
         // la lettre est correcte 
          the_table[i+table_position].style.background = "green";
          countGood++
        }
    }

    // on vérifie si le joueur à gagné : si oui on affiche le message, sinon on met à jour le compteur de vie
    if(countGood === the_word.length){
      document.querySelector("#result").textContent = "YOU WON!";
      document.querySelector("#result").style.color = "green"
      finish = true;
    }else{
      life = life -1;
    }

    // on vérifie si le joueur a perdu
    if(life === 0){
      document.querySelector("#result").textContent = "GAME OVER";
      document.querySelector("#result").style.color = "red"
      finish = true;
    }
   // on remet à zéro le nombre de lettre saisie
    nbLetters = 0;

} // fin de checkWord



//          EVENEMENTS

// click sur le bouton new game 
document.querySelector('#newGame').addEventListener('click',
  function () {
    // remise à zéro des variable au cas où 
    the_word = ''; 
    nbLetters = 0; 
    life = 6;      
    row_indice = 0; 
    finish = false; 
    document.querySelector("#result").textContent = "";
    // on affiche un message le temps de charger le mot
    document.querySelector("#game-board").innerHTML = 'Chargement du mot...';
    // 
    fetch('https://wordle-backend-chi.vercel.app/game/new')
    .then(response => response.json())
    .then(data => { 
        // récupération du mot et de l'id de la partie
        the_word =data.word;
        document.querySelector("#gameId").textContent=data.gameId;
        // affichage de la grille
        grid(the_word.length)

        document.activeElement.blur();
        })
    }
);


// quand on relâche une touche
document.addEventListener('keyup', (event) => {
  
    // on vérifie si le joueur peut encore jouer
    if(finish){
      return
    }

    // récupération de la touche pressée
    const pressedKey = event.key;

    // il presse la touche Backspace
    if(pressedKey === "Backspace"){
      deleteLetter()
    }

    // le joueur n'a pas rempli toute la ligne et presse sur Entrée : on lui indique qu'il n'a pas saisi assez de lettre
    if(nbLetters !== the_word.length && pressedKey === "Enter"){
        document.querySelector("#result").textContent = "Not enough letters !";
    }

    // le joueur n'a pas rempli toute la ligne et il presse une lettre minuscule
    if(nbLetters !== the_word.length && 97 <=pressedKey.charCodeAt() && pressedKey.charCodeAt()<=122 ){
      addLetter(pressedKey)
      document.querySelector("#result").textContent = "";
      document.querySelector("#result").style.color = "black"
    }

    // le joueur a rempli toute la ligne et il presse sur Entrée : on vérifie son mot et on remet à zéro le nombre de lettre(s) saisie(s)
    if(nbLetters === the_word.length && pressedKey === "Enter"){
      document.querySelector("#result").textContent = "";
      document.querySelector("#result").style.color = "black"
      checkWord(row_indice - the_word.length);
    } 

    // le joueur a rempli toute la ligne et il ne presse pas sur Entrée 
    if(nbLetters === the_word.length && pressedKey !== "Enter"){
      document.querySelector("#result").textContent = "Press Enter to validate";
    }
  });