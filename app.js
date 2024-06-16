const cells = document.querySelectorAll('[data-cell]');
const gameBoard = document.getElementById('game-board');
const playerTurnText = document.getElementById('player-turn');
const resetButton = document.getElementById('reset-button');
const player1WinsText = document.getElementById('player1-wins');
const player2WinsText = document.getElementById('player2-wins');

let isPlayerOneTurn = true;
let player1Wins = 0;
let player2Wins = 0;
let gameState = Array(9).fill(null);
let gameActive = true; // To track if the game is active

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize the game
function initGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleClick, { once: true });
    });
    resetButton.addEventListener('click', resetGame);
    loadScores();
    updateTurnText();
}

function handleClick(e) {
    if (!gameActive) return; // Ignore clicks if the game is over

    const cell = e.target;
    const currentPlayer = isPlayerOneTurn ? 'X' : 'O';

    placeMark(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateTurnText();
    }
}

function placeMark(cell, currentPlayer) {
    const cellIndex = Array.from(cells).indexOf(cell);
    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
}

function swapTurns() {
    isPlayerOneTurn = !isPlayerOneTurn;
}

function updateTurnText() {
    playerTurnText.textContent = `Player ${isPlayerOneTurn ? '1' : '2'}'s Turn (${isPlayerOneTurn ? 'X' : 'O'})`;
}

function checkWin(currentPlayer) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

function isDraw() {
    return gameState.every(cell => cell !== null);
}

function endGame(draw) {
    gameActive = false; // Stop the game

    if (draw) {
        playerTurnText.textContent = "It's a Draw!";
    } else {
        const winner = isPlayerOneTurn ? '1' : '2';
        playerTurnText.textContent = `Player ${winner} Wins!`;
        if (winner === '1') {
            player1Wins++;
            player1WinsText.textContent = player1Wins;
        } else {
            player2Wins++;
            player2WinsText.textContent = player2Wins;
        }
    }
    setTimeout(resetBoard, 5000);
}

function resetBoard() {
    gameState.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
    gameActive = true; // Restart the game
    updateTurnText();
}

function resetGame() {
    if (confirm("Are you sure you want to reset the game?")) {
        player1Wins = 0;
        player2Wins = 0;
        player1WinsText.textContent = player1Wins;
        player2WinsText.textContent = player2Wins;
        resetBoard();
    }
}

function loadScores() {
    const savedPlayer1Wins = localStorage.getItem('player1Wins');
    const savedPlayer2Wins = localStorage.getItem('player2Wins');
    if (savedPlayer1Wins) {
        player1Wins = parseInt(savedPlayer1Wins, 10);
        player1WinsText.textContent = player1Wins;
    }
    if (savedPlayer2Wins) {
        player2Wins = parseInt(savedPlayer2Wins, 10);
        player2WinsText.textContent = player2Wins;
    }
}

function saveScores() {
    localStorage.setItem('player1Wins', player1Wins);
    localStorage.setItem('player2Wins', player2Wins);
}

window.onload = initGame;
window.onbeforeunload = saveScores;
