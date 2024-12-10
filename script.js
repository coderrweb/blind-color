const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const gameArea = document.getElementById('game-area');
const certificateElement = document.getElementById('certificate');
const playAgainButton = document.getElementById('play-again');

let score = 0;
let timer = 120;  // 120 seconds for 20 levels
let level = 1;
let butterflies = [];
let gameInterval;
let spawnInterval;
let butterflyImageSrc = './butterfly (1).png';  // Normal butterfly image
let differentButterflyImageSrc = './butterfly.png';  // Different butterfly image

function startGame() {
  score = 0;
  timer = 120;
  level = 1;
  scoreElement.textContent = `Stars: ${score}`;
  timerElement.textContent = `Time: ${formatTime(timer)}`;
  messageElement.textContent = '';
  certificateElement.textContent = '';
  playAgainButton.style.display = 'none';

  butterflies = [];
  clearInterval(gameInterval);
  clearInterval(spawnInterval);

  // Clear all butterflies before starting
  clearButterflies();
  startTimer();
  spawnButterflies();
  gameInterval = setInterval(updateGame, 1000);
}

function startTimer() {
  const timerInterval = setInterval(() => {
    timer--;
    timerElement.textContent = `Time: ${formatTime(timer)}`;
    if (timer === 0 || score >= 20) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function spawnButterflies() {
  spawnInterval = setInterval(() => {
    if (score < 20 && timer > 0) {
      const butterfly = createButterfly();
      butterflies.push(butterfly);
      gameArea.appendChild(butterfly);
    }
  }, Math.max(1500 - (score * 50), 500));  // Decrease spawn interval with each point (increases speed)
}

function createButterfly() {
  const butterfly = document.createElement('div');
  butterfly.classList.add('butterfly');
  const butterflyImage = document.createElement('img');

  // Only one different butterfly in each round
  const isDifferentColor = Math.random() < 0.2;  // 20% chance for a different butterfly

  // Use different image based on whether it's the different butterfly
  butterflyImage.src = isDifferentColor ? differentButterflyImageSrc : butterflyImageSrc;
  butterfly.appendChild(butterflyImage);

  butterfly.style.left = `${Math.random() * 80}%`;
  butterfly.style.top = `${Math.random() * 80}%`;
  butterfly.style.animation = 'fly 2s ease-in-out infinite';

  butterfly.onclick = () => {
    if (isDifferentColor) {
      score++;
      scoreElement.textContent = `Stars: ${score}`;
      document.getElementById("succ").play();
      messageElement.textContent = 'Great job! Keep playing!';
      messageElement.style.color = "#0d954f";
      if (score === 20) {
        clearInterval(spawnInterval);
        endGame();
      } else {
        levelUp();
      }
    } else {
      document.getElementById("wrong").play();
      messageElement.textContent = 'Oops! Try again.';
      messageElement.style.color = "red";
    }
  };

  return butterfly;
}

function levelUp() {
  level++; // Increase level after every correct answer
  messageElement.textContent = `New Level! Level: ${level}`;
  // Increase difficulty by reducing the time between butterfly spawns
  clearInterval(spawnInterval);
  clearButterflies();  // Clear current butterflies
  swapButterflyImages();  // Swap butterfly images
  spawnButterflies();
}

function swapButterflyImages() {
  // Swap the images for the butterflies (the different butterfly becomes the normal one and vice versa)
  const temp = butterflyImageSrc;
  butterflyImageSrc = differentButterflyImageSrc;
  differentButterflyImageSrc = temp;
}

function clearButterflies() {
  butterflies.forEach(butterfly => butterfly.remove());
  butterflies = [];
}

function updateGame() {
  if (score >= 20 || timer <= 0) {
    clearInterval(gameInterval);
    endGame();
  }
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  messageElement.textContent = `Congratulations! You got ${score} stars.`;
  
  // Calculate lazy eye percentage
  let lazyEyePercentage = Math.max(0, Math.min(100, (20 - score) * 5)); // Max score is 20
  certificateElement.textContent = `Excellence! You have a lazy eye percentage of ${lazyEyePercentage}%`;

  playAgainButton.style.display = 'inline-block';
}

function reloadPage() {
  window.location.reload();
}

startGame();
