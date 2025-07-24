const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const intro = document.getElementById("intro");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, dx, dy, food, gameInterval, score;
let isGameOver = false;
let isPlaying = false;

function startGame() {
  intro.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

  isGameOver = false;
  isPlaying = true;

  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  score = 0;

  clearInterval(gameInterval);
  gameInterval = setInterval(draw, 100);
}

function draw() {
  if (!isPlaying || isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect(food.x, food.y, "red");

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } else {
    snake.pop();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      showGameOver();
      return;
    }
  }

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount
  ) {
    showGameOver();
    return;
  }

  snake.forEach(segment => drawRect(segment.x, segment.y, "#0f0"));
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);
}

function showGameOver() {
  clearInterval(gameInterval);
  isGameOver = true;
  isPlaying = false;

  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

document.addEventListener("keydown", (e) => {
  if (!isPlaying && !isGameOver && e.code === "Space") {
    startGame();
    return;
  }

  if (isGameOver && e.code === "Space") {
    startGame();
    return;
  }

  if (!isPlaying) return;

  switch (e.key) {
    case "ArrowUp": if (dy !== 1) { dx = 0; dy = -1; } break;
    case "ArrowDown": if (dy !== -1) { dx = 0; dy = 1; } break;
    case "ArrowLeft": if (dx !== 1) { dx = -1; dy = 0; } break;
    case "ArrowRight": if (dx !== -1) { dx = 1; dy = 0; } break;
  }
});

restartBtn.addEventListener("click", () => {
  startGame();
});
