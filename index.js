const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

for (let i = 0; i < collisions.length; i+=70) {
    collisions.slice(0, 70)
}

const image = new Image();
image.src = './MapSources/PelletTown.png';

const playerImage = new Image();
playerImage.src = './PokemonGameSources/Images/playerDown.png';

class Sprite {
    constructor({position, image}){
        this.position = position
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({
    position:{
        x: -425,
        y: -375
    },
    image: image
})

const player = new Sprite({
    position:{
        x:canvas.width/2 - playerImage.width/4/2,
        y:canvas.height/2 - playerImage.height/2
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let playerSpeed = 1;

function animate() {
    window.requestAnimationFrame(animate)
    background.draw();
    c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width/4,
        playerImage.height,
        canvas.width/2 - playerImage.width/4/2,
        canvas.height/2 - playerImage.height/2,
        playerImage.width/4,
        playerImage.height,
    );
    if (keys.w.pressed && lastKey === 'w'){background.position.y += playerSpeed;} 
    if (keys.a.pressed && lastKey === 'a'){background.position.x += playerSpeed;}
    if (keys.s.pressed && lastKey === 's'){background.position.y -= playerSpeed;}
    if (keys.d.pressed && lastKey === 'd'){background.position.x -= playerSpeed;}
}
animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
        break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
        break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
        break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
        break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'w':
            keys.w.pressed = false

        break
        case 'a':
            keys.a.pressed = false

        break
        case 's':
            keys.s.pressed = false

        break
        case 'd':
            keys.d.pressed = false

        break
    }
})