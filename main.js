const canvas = document.getElementById('main_screen');
const context = canvas.getContext("2d");
var pressedKeys = {};
window.onkeyup   = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

const titleScreen = document.getElementById("title-screen");

// Parallax layers
const layers = [
    document.getElementById("parallax-mountain-bg"),
    document.getElementById("parallax-mountain-montain-far"),
    document.getElementById("parallax-mountain-mountains"),
    document.getElementById("parallax-mountain-trees"),
    document.getElementById("parallax-mountain-foreground-trees")
];

const tiles = document.getElementById("tiles");

// Hero Animations
const heroIdleAnimationLeft     = document.getElementById("hero-idle-left");
const heroIdleAnimationRight    = document.getElementById("hero-idle-right");
const heroRunAnimationLeft      = document.getElementById("hero-run-left");
const heroRunAnimationRight     = document.getElementById("hero-run-right");
const heroJumpAnimationLeft     = document.getElementById("hero-jump-left");
const heroJumpAnimationRight    = document.getElementById("hero-jump-right");
const heroAttackAnimationLeft   = document.getElementById("hero-attack-left");
const heroAttackAnimationRight  = document.getElementById("hero-attack-right");
const heroCrouchAnimationLeft   = document.getElementById("hero-crouch-left");
const heroCrouchAnimationRight  = document.getElementById("hero-crouch-right");
const heroHurtAnimationLeft     = document.getElementById("hero-hurt-left");
const heroHurtAnimationRight    = document.getElementById("hero-hurt-right");

let heroAnimations = [
    [heroIdleAnimationLeft,     4],
    [heroIdleAnimationRight,    4],
    [heroRunAnimationLeft,      6],
    [heroRunAnimationRight,     6],
    [heroJumpAnimationLeft,     4],
    [heroJumpAnimationRight,    4],
    [heroAttackAnimationLeft,   5],
    [heroAttackAnimationRight,  5],
    [heroCrouchAnimationLeft,   1],
    [heroCrouchAnimationRight,  1],
    [heroHurtAnimationLeft,     1],
    [heroHurtAnimationRight,    1],
];

let hero = {
    spriteWidth: 100,
    spriteHeight: 59,
    levelX: 140,
    levelY: 480 - 32 - 59,
    renderX: 100,
    renderY: 480 - 32 - 59,
    velocityY: 0,
}

let heroDirection = 1;
let heroJumping = false;
let jumpPressedLastFrame = false;
let hoverjump = false;

let scrollX = 0;

let points = 0;

let gameStarted = false;
let gameOver = false;
let demoComplete = false;

var levels = [
    [
        // Level data
    ],
];

const SCREEN_WIDTH = 816;
const SCREEN_HEIGHT = 480;
const TILE_SIZE = 32;
let distanceFromFloor = 0;
let nearestFloorHeight = -59;
let newJumpPress = false;
let attackCompleted = false;

// For drawing level tiles
var drawTile = function(x, y, tileIndex) {
    var sx = (tileIndex*32) - (64*Math.floor(tileIndex/64)*32);
    var sy = Math.floor(tileIndex/64)*32;
    context.drawImage(tiles, sx, sy, 32, 32, x, y, 32, 32);
}

// Render Level Tiles
var drawLevelTiles = function(level, hTiles, vTiles, scrollX) {
    for (var i = 0; i < hTiles; i++) {
        for (var j = 0; j < vTiles; j++) {
            let tileIndex = level[j][i];
            let x = (i * TILE_SIZE) - scrollX;
            let y = j * TILE_SIZE;
            drawTile(x, y, tileIndex);
        }
    }
}

// Handle Parallax Scrolling
var updateParallax = function() {
    layers.forEach((layer, index) => {
        let parallaxSpeed = (index + 1) * 0.2; // Adjust speed for each layer
        layer.style.transform = `translateX(${scrollX * parallaxSpeed}px)`;
    });
}

// Jump Mechanics
var updateJump = function() {
    if (pressedKeys[32] && !heroJumping && !jumpPressedLastFrame) {  // Space bar to jump
        hero.velocityY = -15; // Jump force
        heroJumping = true;
    }

    if (heroJumping) {
        hero.velocityY += 0.5; // Gravity
        hero.levelY += hero.velocityY;
        if (hero.levelY > SCREEN_HEIGHT - TILE_SIZE - hero.spriteHeight) {
            hero.levelY = SCREEN_HEIGHT - TILE_SIZE - hero.spriteHeight;
            heroJumping = false;
        }
    }

    jumpPressedLastFrame = pressedKeys[32];
}

// Camera Follow Logic
var updateCamera = function() {
    let playerX = hero.levelX;
    let cameraSpeed = 5;
    scrollX = Math.max(0, Math.min(playerX - SCREEN_WIDTH / 2, (SCREEN_WIDTH * levels[0].length / TILE_SIZE) - SCREEN_WIDTH));
}

// Game Loop
function gameLoop() {
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // Clear screen

    // Update Camera and Parallax
    updateCamera();
    updateParallax();

    // Update Jump
    updateJump();

    // Draw level
    drawLevelTiles(levels[0], levels[0].length, levels.length, scrollX);

    // Draw Hero (Add animations based on current state)
    context.drawImage(heroAnimations[heroAnimationIndex][0], hero.levelX - scrollX, hero.levelY);

    // Repeat the game loop
    requestAnimationFrame(gameLoop);
}

// Start the Game
gameLoop();
