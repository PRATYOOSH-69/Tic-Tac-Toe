const startScreen = document.getElementById("startScreen");
const modeScreen = document.getElementById("modeScreen");
const gameScreen = document.getElementById("gameScreen");
const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");

let board;
let currentPlayer;
let gameActive;
let singlePlayer;
let playerCanPlay = true;

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function goToMode() {
  startScreen.classList.add("hidden");
  modeScreen.classList.remove("hidden");
}

function startGame(single) {
  singlePlayer = single;
  modeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  init();
}

function init() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  playerCanPlay = true;
  boardEl.innerHTML = "";
  board.forEach((_, i) => createCell(i));
  updateMessage();
}

function createCell(i) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.onclick = () => handleMove(i);
  boardEl.appendChild(cell);
}

function handleMove(i) {
  if (!gameActive || !playerCanPlay || board[i]) return;

  place(i, currentPlayer);
  if (checkEnd()) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateMessage();

  if (singlePlayer && currentPlayer === "O") {
    playerCanPlay = false;
    setTimeout(() => {
      aiMove();
      playerCanPlay = true;
    }, 400);
  }
}

function aiMove() {
  if (!gameActive) return;

  const move =
    findWinningMove("O") ??
    findWinningMove("X") ??
    takeCenter() ??
    takeCorner() ??
    takeSide();

  place(move, "O");

  if (checkEnd()) return;

  currentPlayer = "X";
  updateMessage();
}

function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = player;
      if (checkWin(player)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  return null;
}

function takeCenter() {
  return board[4] === "" ? 4 : null;
}

function takeCorner() {
  const corners = [0,2,6,8].filter(i => !board[i]);
  return corners.length ? corners[Math.floor(Math.random()*corners.length)] : null;
}

function takeSide() {
  const sides = [1,3,5,7].filter(i => !board[i]);
  return sides[Math.floor(Math.random()*sides.length)];
}

function place(i, player) {
  board[i] = player;
  boardEl.children[i].textContent = player;
}

function checkWin(player) {
  return WINS.some(p => p.every(i => board[i] === player));
}

function checkEnd() {
  if (checkWin(currentPlayer)) {
    messageEl.textContent = `🎉 ${currentPlayer} wins`;
    gameActive = false;
    return true;
  }

  if (board.every(v => v)) {
    messageEl.textContent = "Draw";
    gameActive = false;
    return true;
  }
  return false;
}

function updateMessage() {
  messageEl.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
  init();
}
