const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X'; 
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[cellIndex] !== "" || !gameActive || currentPlayer === 'O') {
        return;
    }

    makeMove(clickedCell, cellIndex, 'X');

    if (gameActive) {
        currentPlayer = 'O'; 
        setTimeout(computerTurn, 500); 
    }
}

function makeMove(cell, index, player) {
    gameState[index] = player;
    cell.innerText = player;
    checkWinOrDraw();
}

function computerTurn() {
    if (!gameActive) return;

    let emptyCells = [];
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") emptyCells.push(i);
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const computerMoveIndex = emptyCells[randomIndex];
        const cell = document.querySelector(`[data-index='${computerMoveIndex}']`);
        
        makeMove(cell, computerMoveIndex, 'O');
        
        if (gameActive) currentPlayer = 'X';
    }
}

function checkWinOrDraw() {
    let roundWon = false;
    let winningSquares = []; // Keep track of the winning boxes

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;
        
        if (a === b && b === c) {
            roundWon = true;
            winningSquares = winCondition; // Save the winning row/column/diagonal
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        
        // Apply the animation based on who won
        if (currentPlayer === 'X') {
            winningSquares.forEach(index => {
                document.querySelector(`[data-index='${index}']`).classList.add('win-anim');
            });
            setTimeout(() => alert("You won! 🎉"), 600); // 600ms gives the 500ms animation time to finish
        } else {
            winningSquares.forEach(index => {
                document.querySelector(`[data-index='${index}']`).classList.add('lose-anim');
            });
            setTimeout(() => alert("The computer won! 😔"), 600);
        }
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        gameActive = false;
        // Optionally grey out the board for a draw
        cells.forEach(cell => cell.style.backgroundColor = "#e2e3e5"); 
        setTimeout(() => alert("Game ended in a draw! 🤝"), 100);
        return;
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));