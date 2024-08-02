function createRandomShape() {
    const shape = document.createElement('div');
    const size = Math.random() * 50 + 20; // Size between 20 and 70
    const xPos = Math.random() * window.innerWidth;

    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.position = 'absolute';
    shape.style.left = `${xPos}px`;
    shape.style.top = '-50px'; // Start above the screen

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#F3FF33'];
    shape.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Randomly assign a shape type
    if (Math.random() > 0.5) {
        shape.style.borderRadius = '50%'; // Circle
    } else {
        shape.style.borderRadius = '0'; // Square
    }

    document.getElementById('container').appendChild(shape);

    let fallSpeed = Math.random() * 3 + 2; // Speed between 2 and 5
    function fall() {
        const currentTop = parseFloat(shape.style.top);
        shape.style.top = `${currentTop + fallSpeed}px`;

        if (currentTop < window.innerHeight) {
            requestAnimationFrame(fall);
        } else {
            shape.remove();
        }
    }

    requestAnimationFrame(fall);
}

function generateShapes() {
    createRandomShape();
    setTimeout(generateShapes, Math.random() * 1000);
}

generateShapes();
