document.addEventListener("DOMContentLoaded", function() {
  const gameContainer = document.getElementById("game");
  const scoreDisplay = document.getElementById("score");
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const topScoresList = document.getElementById("top-scores-list"); 

  let pairsMatched = 0;
  let firstCard = null;
  let secondCard = null;
  let lockedBoard = false;
  let score = 0;

  const IMAGES_FOLDER = "images/";
  const EVEN_NUMBER = chooseEvenNumber();
  const IMAGE_COUNT = EVEN_NUMBER / 2;
  const IMAGES = Array.from({ length: 10 }, (_, i) => `${IMAGES_FOLDER}${String(i + 1).padStart(3, "0")}.png`);

  function chooseEvenNumber() {
      const randomNumber = Math.floor(Math.random() * 5) + 1;
      return randomNumber * 2;
  }

  function shuffle(array) {
      let counter = array.length;
      while (counter > 0) {
          let index = Math.floor(Math.random() * counter);
          counter--;
          let temp = array[counter];
          array[counter] = array[index];
          array[index] = temp;
      }
      return array;
  }

  function selectRandomImages() {
      const shuffledImages = shuffle(IMAGES);
      const selectedImages = shuffledImages.slice(0, IMAGE_COUNT);
      const uniqueImages = [...new Set(selectedImages)];
      return uniqueImages.concat(uniqueImages);
  }

  const selectedImages = selectRandomImages();

  function createDivsForCards() {
      shuffle(selectedImages);
      for (let i = 0; i < selectedImages.length; i++) {
          const card = document.createElement("div");
          card.classList.add("card");
          card.style.backgroundImage = `url(${IMAGES_FOLDER}blank.png)`;
          card.dataset.image = selectedImages[i];
          gameContainer.appendChild(card);
          card.addEventListener("click", handleCardClick);
      }
  }

  function handleCardClick(event) {
      if (lockedBoard) return;
      const currentCard = event.target;
      if (currentCard === firstCard || currentCard.classList.contains("flipped")) return;

      currentCard.classList.add("flipped");
      currentCard.style.backgroundImage = `url(${currentCard.dataset.image})`;

      if (!firstCard) {
          firstCard = currentCard;
      } else {
          secondCard = currentCard;
          checkForMatch();
      }

      increaseScore();
  }

  function increaseScore() {
      score++;
      updateScore();
      saveScore();
  }

  function updateScore() {
      scoreDisplay.textContent = `Score: ${score}`;
  }

  function saveScore() {
      localStorage.setItem("memoryGameScore", score);
  }

  function checkForMatch() {
      lockedBoard = true;
      if (firstCard.dataset.image === secondCard.dataset.image) {
          setTimeout(() => {
              firstCard.removeEventListener("click", handleCardClick);
              secondCard.removeEventListener("click", handleCardClick);
              resetCards();
              pairsMatched++;
              lockedBoard = false;
              if (pairsMatched === IMAGE_COUNT) {
                  setTimeout(() => {
                      endGame();
                  }, 500);
              }
          }, 1000);
      } else {
          setTimeout(() => {
              firstCard.classList.remove("flipped");
              secondCard.classList.remove("flipped");
              firstCard.style.backgroundImage = `url(${IMAGES_FOLDER}blank.png)`;
              secondCard.style.backgroundImage = `url(${IMAGES_FOLDER}blank.png)`;
              resetCards();
              lockedBoard = false;
          }, 1000);
      }
  }

  function resetCards() {
      firstCard = null;
      secondCard = null;
  }

  function startGame() {
      pairsMatched = 0;
      score = 0;
      updateScore();
      gameContainer.innerHTML = "";
      createDivsForCards();
      startButton.style.display = "none";
      restartButton.style.display = "inline-block";
  }

  function endGame() {
    alert(`Congratulations! You've matched all pairs! \n Your score is : ${score}`);
    storeScore(score);
    updateTopScores(); 
    window.location.reload();
    restartGame();
  }

  function restartGame() {
      pairsMatched = 0;
      score = 0;
      updateScore();
      gameContainer.innerHTML = "";
      createDivsForCards();
  }

  updateTopScores();
  function storeScore(score) {
    let scores = JSON.parse(localStorage.getItem("scores")) ?? []; 
    scores.push(score);
    localStorage.setItem("scores", JSON.stringify(scores));
  }


  function updateTopScores() {
  const scores = JSON.parse(localStorage.getItem("scores")) ?? [];
  const filteredScores = scores.filter(score => score !== null);
  filteredScores.sort((a, b) => a - b);

  for (let i = 0; i < Math.min(15, filteredScores.length); i++) {
    const scoreItem = document.createElement("li");
    scoreItem.textContent = `Score ${i + 1}: ${filteredScores[i]}`;
    topScoresList.appendChild(scoreItem);
  }
}

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", restartGame);
});
