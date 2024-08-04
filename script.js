const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
    element: document.getElementById('container'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#282c34'
    }
});


Engine.run(engine);


Render.run(render);


const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 10, window.innerWidth, 20, { 
    isStatic: true,
    render: {
        fillStyle: '#ffffff'
    }
});
World.add(world, ground);


const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
World.add(world, mouseConstraint);


render.mouse = mouse;

let shapeCount = 0;
const shapes = [];

function createRandomShape() {
    const size = Math.random() * 50 + 20; 
    const xPos = Math.random() * window.innerWidth;

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#F3FF33'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    
    let shape;
    if (Math.random() > 0.5) {
        shape = Bodies.circle(xPos, -50, size / 2, {
            render: {
                fillStyle: color
            },
            restitution: 0.8, 
            friction: 0.1
        });
    } else {
        shape = Bodies.rectangle(xPos, -50, size, size, {
            render: {
                fillStyle: color
            },
            restitution: 0.8, 
            friction: 0.1
        });
    }

    World.add(world, shape);
    shapes.push(shape);

    
    shapeCount++;
    document.getElementById('shapes-counter').innerText = `Shapes: ${shapeCount}`;
}

function generateShapes() {
    createRandomShape();
    setTimeout(generateShapes, Math.random() * 1000);
}


Events.on(engine, 'collisionStart', event => {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;

        if (bodyA.render.fillStyle === bodyB.render.fillStyle) {
            const newColor = bodyA.render.fillStyle;

            
            const sizeA = bodyA.circleRadius ? bodyA.circleRadius * 2 : bodyA.bounds.max.x - bodyA.bounds.min.x;
            const sizeB = bodyB.circleRadius ? bodyB.circleRadius * 2 : bodyB.bounds.max.x - bodyB.bounds.min.x;
            const sizeFactor = 0.5; 
            const newSize = (sizeA + sizeB) * sizeFactor; 
            const newX = (bodyA.position.x + bodyB.position.x) / 2;
            const newY = (bodyA.position.y + bodyB.position.y) / 2;

            
            let newShape;

            if (bodyA.circleRadius && bodyB.circleRadius) {
                
                newShape = Bodies.circle(newX, newY, newSize / 2, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            } else if (bodyA.label === 'Rectangle Body' && bodyB.label === 'Rectangle Body') {
                
                newShape = Bodies.rectangle(newX, newY, newSize, newSize, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            } else if (bodyA.circleRadius && bodyB.label === 'Rectangle Body') {
                
                newShape = Bodies.polygon(newX, newY, 6, newSize / 2, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            } else if (bodyB.circleRadius && bodyA.label === 'Rectangle Body') {
                
                newShape = Bodies.polygon(newX, newY, 6, newSize / 2, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            } else if (bodyA.label === 'Polygon Body' && bodyB.circleRadius) {
                
                const sides = Math.max(bodyA.vertices.length - 1, 3); 
                newShape = Bodies.polygon(newX, newY, sides, newSize / 2, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            } else if (bodyB.label === 'Polygon Body' && bodyA.circleRadius) {
                
                const sides = Math.max(bodyB.vertices.length - 1, 3); 
                newShape = Bodies.polygon(newX, newY, sides, newSize / 2, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            } else if (bodyA.label === 'Polygon Body' && bodyB.label === 'Rectangle Body') {
                
                const sides = bodyA.vertices.length + 1;
                newShape = Bodies.polygon(newX, newY, sides, newSize / 2, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            } else if (bodyB.label === 'Polygon Body' && bodyA.label === 'Rectangle Body') {
                
                const sides = bodyB.vertices.length + 1;
                newShape = Bodies.polygon(newX, newY, sides, newSize / 2, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            } else if (bodyA.label === 'Polygon Body' && bodyB.label === 'Polygon Body') {
                
                const newSides = Math.min(bodyA.vertices.length + bodyB.vertices.length, 20); 
                newShape = Bodies.polygon(newX, newY, newSides, newSize / 2, {
                    render: {
                        fillStyle: newColor
                    },
                    restitution: 0.8, 
                    friction: 0.1
                });
            }

            World.add(world, newShape);
            World.remove(world, bodyA);
            World.remove(world, bodyB);
            shapes.splice(shapes.indexOf(bodyA), 1);
            shapes.splice(shapes.indexOf(bodyB), 1);
            shapes.push(newShape);

            
            shapeCount--;
            document.getElementById('shapes-counter').innerText = `Shapes: ${shapeCount}`;
        }
    }
});


setTimeout(() => {
    document.getElementById('overlay').style.display = 'none';
    generateShapes();
}, 1000);
