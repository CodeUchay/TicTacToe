//Declaring variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

// Array of winning combinations
const winningCombinations = [
  [0, 1, 2], //Straight
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], //Diagonal
  [1, 4, 7],
  [2, 5, 8], //Horizontal
  [0, 4, 8],
  [2, 4, 6],
];

// Function to make a move
function select(cellIndex) {
  if (!gameOver && board[cellIndex] === "") {
    board[cellIndex] = currentPlayer;
    document.getElementsByClassName("cell")[cellIndex].innerText =
      currentPlayer;
    checkGameOver();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (!gameOver && currentPlayer === "O") {
      makeAIPlay();
    }
  }
}

// Function to check if the game is over
function checkGameOver() {
  for (let combination of winningCombinations) {
    let [a, b, c] = combination;
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      gameOver = true;
      //highlightCells([a, b, c]);
      setTimeout(() => {
        if (board[a] === "X") {
          alert("You have won!!!");
        } else {
          alert("Uche's AI wins!!! Haha");
        }
        resetGame();
      }, 100);
      break;
    }
  }
  if (!gameOver && board.indexOf("") === -1) {
    gameOver = true;
    var elements = document.getElementsByClassName("replay");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    }
  }
}

// Function to reset the game
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;
  const cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].classList.remove("highlight");
  }
  var elements = document.getElementsByClassName("replay");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
}

// Function to make a move for the computer player using the Alpha-Beta search algorithm
function makeAIPlay() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = alphaBetaMinimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  select(move);
}

function toggle() {
  var elements = document.getElementsByClassName("replay");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
  resetGame();
}
// Function to evaluate the score of the current board state
function evaluate(board) {
  for (let combination of winningCombinations) {
    let [a, b, c] = combination;
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      if (board[a] === "O") {
        return 1;
      } else {
        return -1;
      }
    }
  }
  return 0;
}

// Alpha-Beta search algorithm
function alphaBetaMinimax(board, depth, isMaximizingPlayer) {
    let score = evaluate(board); // Evaluate the current board state
  
    if (score === 1 || score === -1) {
      return score; // Return the score if the game is already won or lost
    }
  
    if (board.indexOf("") === -1) {
      return 0; // Return 0 if the game is a draw
    }
  
    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "O"; // Make a move for the maximizing player (AI)
          let score = alphaBetaMinimax(board, depth + 1, false); // Recursively call alphaBetaMinimax for the minimizing player (human)
          board[i] = ""; // Undo the move
          bestScore = Math.max(score, bestScore); // Update the best score
        }
      }
      return bestScore; // Return the best score for the maximizing player
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "X"; // Make a move for the minimizing player (human)
          let score = alphaBetaMinimax(board, depth + 1, true); // Recursively call alphaBetaMinimax for the maximizing player (computer)
          board[i] = ""; // Undo the move
          bestScore = Math.min(score, bestScore); // Update the best score
        }
      }
      return bestScore; // Return the best score for the minimizing player
    }
  }
  