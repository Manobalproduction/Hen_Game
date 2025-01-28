const canvas = document.getElementById('main_screen');
const context = canvas.getContext("2d");
var pressedKeys = {};
window.onkeyup   = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

const titleScreen = document.getElementById("title-screen");
const layers = [
    document.getElementById("parallax-mountain-bg"),
    document.getElementById("parallax-mountain-montain-far"),
    document.getElementById("parallax-mountain-mountains"),
    document.getElementById("parallax-mountain-trees"),
    document.getElementById("parallax-mountain-foreground-trees")
];

const tiles = document.getElementById("tiles");

const heroIdleAnimationLeft = document.getElementById("hero-idle-left");
const heroIdleAnimationRight = document.getElementById("hero-idle-right");

// Initial state
let gameStarted = false;

// Start the game when the user clicks anywhere or presses a key
window.addEventListener('click', startGame);
window.addEventListener('keydown', startGame);

// Control Buttons Events
document.getElementById('left-btn').addEventListener('click', function() {
    pressedKeys[37] = true;  // Left arrow
});
document.getElementById('right-btn').addEventListener('click', function() {
    pressedKeys[39] = true;  // Right arrow
});
document.getElementById('jump-btn').addEventListener('click', function() {
    pressedKeys[32] = true;  // Space (Jump)
});

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        titleScreen.style.display = 'none';  // Hide the title screen
        setupGame();
    }
}

function setupGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Lock the game to portrait mode
    if (window.innerHeight < window.innerWidth) {
        alert('Please rotate your device to portrait mode!');
        return;
    }

    // Start the game loop
    gameLoop();
}

function gameLoop() {
    if (gameStarted) {
        // Clear screen and redraw background
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#87CEEB';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Example: Draw Hero Animation (just an idle animation for now)
        context.drawImage(heroIdleAnimationLeft, 100, 100, 100, 100);

        // Call gameLoop again (this creates an animation loop)
        requestAnimationFrame(gameLoop);
    }
}
