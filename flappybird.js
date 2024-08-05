// Game variables
let canvas;
let ctx;
const boardWidth = 360;
const boardHeight = 640;
const birdWidth = 34;
const birdHeight = 24;
const pipeWidth = 64;
const pipeHeight = 512;
const gravity = 0.4;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let topPipeImg;
let bottomPipeImg;
let pipeArray = [];
let velocityX = -2;
let velocityY = 0;
let gameOver = false;
let score = 0;

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = boardWidth;
    canvas.height = boardHeight;
    ctx = canvas.getContext("2d");

    // Load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png"; // Ensure this image path is correct
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png"; // Ensure this image path is correct
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png"; // Ensure this image path is correct

    birdImg.onload = () => {
        requestAnimationFrame(update);
    };
    setInterval(placePipes, 1500);

    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener("keydown", moveBird);
};

function update() {
    requestAnimationFrame(update);

    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    velocityY += gravity;
    birdY = Math.max(birdY + velocityY, 0);
    ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

    if (birdY > canvas.height) {
        gameOver = true;
    }

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && birdX > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision({ x: birdX, y: birdY, width: birdWidth, height: birdHeight }, pipe)) {
            gameOver = true;
        }
    }

    // Clear off-screen pipes
    pipeArray = pipeArray.filter(pipe => pipe.x >= -pipeWidth);

    // Draw score and game over
    ctx.fillStyle = "white";
    ctx.font = "45px sans-serif";
    ctx.fillText(Math.floor(score), 5, 45);

    if (gameOver) {
        ctx.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = -pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = canvas.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: canvas.width,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: canvas.width,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function handleTouchStart(e) {
    e.preventDefault();
    handleJump();
}

function handleMouseDown(e) {
    handleJump();
}

function handleJump() {
    if (gameOver) {
        birdY = boardHeight / 2;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
    velocityY = -6;
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        handleJump();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

