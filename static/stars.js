// Create static stars (twinkling stars)
function createStars() {
    const starfield = document.createElement('div');
    starfield.classList.add('starfield');
    document.body.appendChild(starfield);

    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDuration = `${Math.random() * 1 + 1.5}s`;
        star.style.animationDelay = `${Math.random() * 1}s`;
        starfield.appendChild(star);
    }
}

// Create shooting stars
function createShootingStars() {
    setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        shootingStar.style.top = `${Math.random() * 100}vh`;
        shootingStar.style.left = `${Math.random() * 100}vw`;
        document.body.appendChild(shootingStar);

        // Randomize duration for shooting star animation
        const duration = Math.random() * 1 + 1;
        shootingStar.style.animationDuration = `${duration}s`;

        // Remove the shooting star after animation
        setTimeout(() => {
            shootingStar.remove();
        }, duration * 1000);
    }, 1000); // Shooting star every second
}

// Initialize the stars and shooting stars
window.onload = () => {
    createStars();
    createShootingStars();
}
