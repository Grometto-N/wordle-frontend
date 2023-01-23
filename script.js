let nbLetters = 0;
let the_word = '';
let life = 6;
let the_table = document.querySelectorAll(".letter-box");

function one_row(nbLettersWord){
   // création d'une ligne
   let row = `<div class = "letter-row">`
   for(let j =1; j<=nbLettersWord;j++){
       row += ` <div class = "letter-box"></div>
      `;
       } 
   row += `</div>`;  
   return row;
}

document.querySelector('#newGame').addEventListener('click',
  function () {
   console.log('Click detected!');
    fetch('http://localhost:3000/game/new')
    .then(response => response.json())
     .then(data => { 
        console.log(data); 
        the_word =data.word;
        document.querySelector("#gameId").textContent=data.gameId;
        // ajout des row
        for(let i=1;i<=6;i++){
            document.querySelector("#game-board").innerHTML += one_row(the_word.length);
        } 
        the_table = document.querySelectorAll(".letter-box");
        this.disabled = true;  
        })
 }
);


let indice = 0;
let row = 0;

document.addEventListener('keyup', (event) => {
    const nomTouche = event.key;
    
    if(nomTouche === "Enter"){
        if(nbLetters === the_word.length){
           let countGood = 0;
           // on boucle sur chaque lettre
            for(let i = 0; i<the_word.length;i++){
              // on regarde si la lettre est dans le mot
              if(the_word.includes(the_table[i+indice - the_word.length].textContent)){
                  the_table[i+indice - the_word.length].style.background = "yellow";
              }else{
                the_table[i+indice - the_word.length].style.background = "gray";
              }
              if(the_table[i+indice - the_word.length].textContent===the_word[i]){
                // la lettre est correcte 
                 the_table[i+indice - the_word.length].style.background = "green";
                 countGood++
                }
          }
          if(countGood === the_word.length){
            document.querySelector("#result").textContent = "YOU WON!";
          }else{
            life = life -1;
          }
            
          if(life === 0){
            document.querySelector("#result").textContent = "GAME OVER";
          }
          nbLetters = 0;
        }else{
          document.querySelector("#result").textContent = "Not enough letters !";
        }
    }else{
      if(97 <=nomTouche.charCodeAt() && nomTouche.charCodeAt()<=122 && nbLetters<the_word.length && document.querySelector("#result").textContent !== "YOU WON!"){
        // la touche est différente d'enter donc on complète la case
        the_table[indice].textContent = nomTouche.toUpperCase();
        the_table[indice].classList.add("filled-box");
        // the_table[indice].className="filled-box";
        indice++;
        nbLetters = nbLetters +1 ;
      }
    }

    
  });