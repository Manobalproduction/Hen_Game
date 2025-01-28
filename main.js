const canvas = document.getElementById('main_screen');
const context = canvas.getContext("2d");

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
const heroRunAnimationLeft = document.getElementById("hero-run-left");
const heroRunAnimationRight = document.getElementById("hero-run-right");
const heroJumpAnimationLeft = document.getElementById("hero-jump-left");
const heroJumpAnimationRight = document.getElementById("hero-jump-right");
const heroAttackAnimationLeft = document.getElementById("hero-attack-left");
const heroAttackAnimationRight = document.getElementById("hero-attack-right");
const heroCrouchAnimationLeft = document.getElementById("hero-crouch-left");
const heroCrouchAnimationRight = document.getElementById("hero-crouch-right");
const heroHurtAnimationLeft = document.getElementById("hero-hurt-left");
const heroHurtAnimationRight = document.getElementById("hero-hurt-right");

let heroAnimations = [
    [heroIdleAnimationLeft, 4],
    [heroIdleAnimationRight, 4],
    [heroRunAnimationLeft, 6],
    [heroRunAnimationRight, 6],
    [heroJumpAnimationLeft, 4],
    [heroJumpAnimationRight, 4],
    [heroAttackAnimationLeft, 5],
    [heroAttackAnimationRight, 5],
    [heroCrouchAnimationLeft, 1],
    [heroCrouchAnimationRight, 1],
    [heroHurtAnimationLeft, 1],
    [heroHurtAnimationRight, 1],
];

let heroAnimationIndex = 1;
let heroDirection = 1;
let heroJumping = false;
let heroPeakJumping = false;
let jumpPressedLastFrame = false;
let hoverjump = false;

var scrollX = 0;

var resetAnimationTime = Date.now();
var previousHeroAnimationIndex = 1;
let currentLevel = [];

let points = 0;

let gameStarted = false;
let gameOver = false;

let demoComplete = false;

var levels = [
    [
        // Level 1 data as previously
    ],
];

const SCREEN_WIDTH = 816;
const SCREEN_HEIGHT = 480;
const TILE_SIZE = 32;
let distanceFromFloor = 0;
let nearestFloorHeight = -59;
let newJumpPress = false;
let attackCompleted = false;

let hero = {
    spriteWidth: 100,
    spriteHeight: 59,
    levelX: 140,
    levelY: 480 - 32 - 59,
    renderX: 100,
    renderY: 480 - 32 - 59,
    velocityY: 0,
};

// Camera-related code
const camera = {
    x: 0,
    y: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
};

const levelWidth = 2048; // Width of your level (for scrolling)
const levelHeight = 512; // Height of your level

// Audio setup
var audioElement = document.getElementById("theAudio");
audioElement.load();
audioElement.volume = 0.6;
var audioPlaying = false;

var enterPressedInitially = false;
var beyondTitleScreen = false;

onInitialEnterPress = function(e) {
    if (e.key == "Enter") {
        enterPressedInitially = true;
        audioElement.play();
    }
};

document.addEventListener('keypress', onInitialEnterPress);

// Function to draw the level tiles
var drawTile = function(x, y, tileIndex) {
    var sx = (tileIndex * 32) - (64 * Math.floor(tileIndex / 64) * 32);
    var sy = Math.floor(tileIndex / 64) * 32;
    context.drawImage(tiles, sx, sy, 32, 32, x, y, 32, 32);
};

// Function to render the level tiles with scroll
var drawLevelTiles = function(level, hTiles, vTiles, scrollX) {
    for (var i = 0; i < hTiles; i++) {
        for (var j = 0; j < vTiles; j++) {
            let tileIndex = level[j][i];
            drawTile(i * TILE_SIZE - scrollX, j * TILE_SIZE, tileIndex);
        }
    }
};

// Adjust the camera position based on hero's position
function updateCamera() {
    camera.x = Math.max(0, Math.min(hero.levelX - SCREEN_WIDTH / 2, levelWidth - SCREEN_WIDTH));
    camera.y = Math.max(0, Math.min(hero.levelY - SCREEN_HEIGHT / 2, levelHeight - SCREEN_HEIGHT));
}

// Function to update the game each frame
function gameLoop() {
    // Update camera position
    updateCamera();

    // Clear the screen
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw background layers
    for (let i = 0; i < layers.length; i++) {
        context.drawImage(layers[i], camera.x * (i * 0.05), camera.y);
    }

    // Draw level tiles
    drawLevelTiles(currentLevel, Math.floor(levelWidth / TILE_SIZE), Math.floor(levelHeight / TILE_SIZE), scrollX);

    // Draw the hero at the correct position
    context.drawImage(heroAnimations[heroAnimationIndex][0], hero.renderX - camera.x, hero.renderY);

    requestAnimationFrame(gameLoop);
}

gameLoop(); // Start the game loop
