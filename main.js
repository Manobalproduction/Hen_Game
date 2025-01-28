document.getElementById('start-button').addEventListener('click', startGame);

function startGame() {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'block';
    document.getElementById('game-text').innerText = 'You started the game! Now perform an action.';
}

document.getElementById('action-button').addEventListener('click', performAction);

function performAction() {
    document.getElementById('game-text').innerText = 'Action performed! Game continues...';
    setTimeout(endGame, 2000); // End game after 2 seconds
}

function endGame() {
    document.getElementById('game-page').style.display = 'none';
    document.getElementById('end-page').style.display = 'block';
}

document.getElementById('restart-button').addEventListener('click', restartGame);

function restartGame() {
    document.getElementById('end-page').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
}
