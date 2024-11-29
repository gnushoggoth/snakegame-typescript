
const width = 800;
const height = 600;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

// Colors
const black = "#000000";
const white = "#FFFFFF";
const red = "#FF0000";

// Snake properties
const snakeBlock = 20;
const snakeSpeed = 15;

// Game state variables
let gameOver = false;
let gameClose = false;

let x1 = width / 2;
let y1 = height / 2;
let x1Change = 0;
let y1Change = 0;

let snakeList: Array<{ x: number; y: number }> = [];
let lengthOfSnake = 1;

let foodX = Math.round(Math.random() * (width - snakeBlock) / 20) * 20;
let foodY = Math.round(Math.random() * (height - snakeBlock) / 20) * 20;

// Utility functions
function drawSnake(snakeList: Array<{ x: number; y: number }>) {
    snakeList.forEach((segment) => {
        context.fillStyle = white;
        context.fillRect(segment.x, segment.y, snakeBlock, snakeBlock);
    });
}

function showMessage(msg: string, color: string) {
    context.fillStyle = color;
    context.font = "50px Arial";
    context.fillText(msg, width / 6, height / 3);
}

function resetGame() {
    gameOver = false;
    gameClose = false;
    x1 = width / 2;
    y1 = height / 2;
    x1Change = 0;
    y1Change = 0;
    snakeList = [];
    lengthOfSnake = 1;
    foodX = Math.round(Math.random() * (width - snakeBlock) / 20) * 20;
    foodY = Math.round(Math.random() * (height - snakeBlock) / 20) * 20;
}

function gameLoop() {
    if (gameOver) return;

    if (gameClose) {
        context.fillStyle = black;
        context.fillRect(0, 0, width, height);
        showMessage("You Lost! Press Q-Quit or C-Play Again", red);
        return;
    }

    context.fillStyle = black;
    context.fillRect(0, 0, width, height);

    // Update position
    x1 += x1Change;
    y1 += y1Change;

    // Check boundaries
    if (x1 >= width || x1 < 0 || y1 >= height || y1 < 0) {
        gameClose = true;
    }

    // Draw food
    context.fillStyle = red;
    context.fillRect(foodX, foodY, snakeBlock, snakeBlock);

    // Update snake
    const snakeHead = { x: x1, y: y1 };
    snakeList.push(snakeHead);

    if (snakeList.length > lengthOfSnake) {
        snakeList.shift();
    }

    // Check collision with itself
    for (let i = 0; i < snakeList.length - 1; i++) {
        if (snakeList[i].x === snakeHead.x && snakeList[i].y === snakeHead.y) {
            gameClose = true;
        }
    }

    drawSnake(snakeList);

    // Check if food is eaten
    if (x1 === foodX && y1 === foodY) {
        foodX = Math.round(Math.random() * (width - snakeBlock) / 20) * 20;
        foodY = Math.round(Math.random() * (height - snakeBlock) / 20) * 20;
        lengthOfSnake++;
    }

    // Loop the game at a set speed
    if (!gameClose) {
        setTimeout(gameLoop, 1000 / snakeSpeed);
    }
}

// Input handling
window.addEventListener("keydown", (event) => {
    if (gameClose) {
        if (event.key === "q") {
            gameOver = true;
        } else if (event.key === "c") {
            resetGame();
            gameLoop();
        }
        return;
    }

    switch (event.key) {
        case "ArrowLeft":
            x1Change = -snakeBlock;
            y1Change = 0;
            break;
        case "ArrowRight":
            x1Change = snakeBlock;
            y1Change = 0;
            break;
        case "ArrowUp":
            x1Change = 0;
            y1Change = -snakeBlock;
            break;
        case "ArrowDown":
            x1Change = 0;
            y1Change = snakeBlock;
            break;
    }
});

// Start the game
resetGame();
gameLoop();