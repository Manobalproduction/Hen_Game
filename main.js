// Access the camera
const videoElement = document.getElementById('camera');
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    .then((stream) => {
        videoElement.srcObject = stream;
    })
    .catch((error) => {
        console.error("Camera access denied or not available.", error);
    });

// Chicken Game Controls
const walkBtn = document.getElementById('walk-btn');
const jumpBtn = document.getElementById('jump-btn');
const chicken = document.getElementById('chicken');

walkBtn.addEventListener('click', () => {
    chicken.style.transform = 'translateX(200px)'; // Move the chicken to the right
    setTimeout(() => {
        chicken.style.transform = 'translateX(0)'; // Move back to the original position
    }, 500);
});

jumpBtn.addEventListener('click', () => {
    chicken.style.transform = 'translateY(-100px)'; // Move chicken up
    setTimeout(() => {
        chicken.style.transform = 'translateY(0)'; // Move back down
    }, 300);
});
