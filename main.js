const canvas = document.getElementById('main_screen');
const context = canvas.getContext("2d");
var pressedKeys = {};
window.onkeyup = function (e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function (e) { pressedKeys[e.keyCode] = true; }

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
        // Example Level 1 (You can add your level data here)
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        // Add more level rows as needed
    ]
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

/* Load Game Music */
var audioElement = document.getElementById("theAudio");
audioElement.load();
audioElement.volume = 0.6;
var audioPlaying = false;

/* For Safari Audio Compatibility */
var enterPressedInitially = false;
var beyondTitleScreen = false;
onInitialEnterPress = function (e) {
    if (e.key == "Enter") {
        enterPressedInitially = true;
        audioElement.play();
    }
}
document.addEventListener('keypress', onInitialEnterPress);

/* Draw Single Level Tile, 32x32 pixels */
var drawTile = function (x, y, tileIndex) {
    var sx = (tileIndex * 32) - (64 * Math.floor(tileIndex / 64) * 32);
    var sy = Math.floor(tileIndex / 64) * 32;
    context.drawImage(tiles, sx, sy, 32, 32, x, y, 32, 32);
};

/* Render Level Tiles */
var drawLevelTiles = function (level, hTiles, vTiles, scrollX) {
    for (var i = 0; i < hTiles; i++) {
        for (var j = 0; j < vTiles; j++) {
            var tileIndex = level[j][i];
            if (tileIndex !== 0) {
                drawTile(i * TILE_SIZE - scrollX, j * TILE_SIZE, tileIndex);
            }
        }
    }
};

/* Draw Parallax Background */
var drawParallaxBackground = function () {
    layers.forEach(function (layer, index) {
        var speed = index + 1; // Adjust parallax speed
        context.drawImage(layer, -scrollX / speed, 0);
    });
};

/* Update Hero Position and Animation */
var updateHero = function () {
    if (pressedKeys[37] && hero.levelX > 0) { // Left arrow
        hero.levelX -= 5;
        heroDirection = -1;
        heroAnimationIndex = 2; // Running left
    }
    if (pressedKeys[39] && hero.levelX < SCREEN_WIDTH - hero.spriteWidth) { // Right arrow
        hero.levelX += 5;
        heroDirection = 1;
        heroAnimationIndex = 3; // Running right
    }
    if (pressedKeys[38] && !heroJumping && !jumpPressedLastFrame) { // Up arrow
        hero.velocityY = -12;
        heroJumping = true;
    }

    // Update Y velocity due to gravity
    hero.velocityY += 0.5;
    hero.levelY += hero.velocityY;

    // Prevent the hero from falling through the floor
    if (hero.levelY > SCREEN_HEIGHT - TILE_SIZE - hero.spriteHeight) {
        hero.levelY = SCREEN_HEIGHT - TILE_SIZE - hero.spriteHeight;
        hero.velocityY = 0;
        heroJumping = false;
    }

    // Set the hero's animation based on direction
    if (heroJumping) {
        heroAnimationIndex = (heroDirection === 1) ? 4 : 5; // Jumping right/left
    }

    // Switch between idle and running animation if no keys are pressed
    if (!pressedKeys[37] && !pressedKeys[39]) {
        heroAnimationIndex = (heroDirection === 1) ? 0 : 1; // Idle animation right/left
    }

    // Draw the hero
    var heroAnimation = heroAnimations[heroAnimationIndex];
    var currentAnimation = heroAnimation[0];
    var animationFrame = Math.floor(Date.now() / 100) % heroAnimation[1];
    context.drawImage(currentAnimation, animationFrame * hero.spriteWidth, 0, hero.spriteWidth, hero.spriteHeight, hero.levelX, hero.levelY, hero.spriteWidth, hero.spriteHeight);
};

/* Main Game Loop */
var gameLoop = function () {
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    drawParallaxBackground();
    drawLevelTiles(levels[0], 40, 15, scrollX);
    updateHero();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
};

gameLoop();
