

const scoreEL = document.querySelector('#scoreEL');

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
console.log(scoreEL);

canvas.width = innerWidth;
canvas.height = innerHeight;


class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0;

        this.opacity = 1;

        const image = new Image()
        image.src = "img/spaceship.png"

        image.onload = () => {
            const scale = 0.15;
            this.image = image
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }
    drow() {
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // console.log("draw wothout image")

        c.save();
        c.globalAlpha = this.opacity;
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation);
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        c.restore()

    }

    update() {
        if (this.image) {
            this.drow();
            this.position.x += this.velocity.x;
        }
    }

}




class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.redius = 4;
    }
    drow() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.redius, 0, 2 * Math.PI);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();


    }

    update() {
        this.drow();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

}

class Particle {
    constructor({ position, velocity, redius, color, fades }) {
        this.position = position;
        this.velocity = velocity;

        this.redius = redius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades


    }
    drow() {
        c.save()

        c.globalAlpha = this.opacity;
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.redius, 0, 2 * Math.PI);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();

        c.restore();


    }

    update() {
        this.drow();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.fades) {
            this.opacity -= 0.01
        }
    }

}

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.width = 3;
        this.height = 10;

    }
    drow() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

    }

    update() {
        this.drow();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

}

class Invader {
    constructor({ position }) {

        this.velocity = {
            x: 0,
            y: 0
        }


        const image = new Image()
        image.src = "img/invader.png"

        image.onload = () => {
            const scale = 1;
            this.image = image
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }
    drow() {
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // console.log("draw wothout image")

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

    }

    update({ velocity }) {
        if (this.image) {
            this.drow();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }

}

class Gride {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 2,
            y: 0
        }

        this.invaders = [];

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)
        this.width = columns * 30;

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {

                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 30,
                            y: y * 30
                        }
                    }))
            }
        }
        // console.log(this.invaders)

    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
        }
    }
}

const player = new Player();
const projectiles = [];
const grids = []
const invadersProjectiles = [];
const particles = [];


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0;
let randomIntarval = Math.floor(Math.random() * 500 + 500);
let game = {
    ovre: false,
    active: true
}

let score = 0;

for (let i = 0; i < 100; i++) {

    particles.push(new Particle({
        position:
        {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },

        velocity:
        {
            x: 0,
            y: 0.3
        },

        redius: Math.random() * 3,
        color: 'white',
        fades: false
    }))
}

function createParticles({ opject, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position:
            {
                x: opject.position.x + opject.width / 2,
                y: opject.position.y + opject.height / 2
            },

            velocity:
            {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },

            redius: Math.random() * 3,
            color: color || "#BAA0DE",
            fades: fades
        }))
    }
}

function animate() {
    if (!game.active) return

    requestAnimationFrame(animate)
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    // invader.update(); 

    particles.forEach((particle, i) => {

        if (particle.position.y - particle.redius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.redius
        }

        if (particle.opacity < 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            })
        }
        else {
            particle.update()
        }
    });


    invadersProjectiles.forEach((invadersProjectile, index) => {
        if (invadersProjectile.position.y + invadersProjectile.height >= canvas.height) {
            setTimeout(() => {
                invadersProjectiles.splice(index, 1);
            }, 0)
        }
        else { invadersProjectile.update() }

        if (invadersProjectile.position.y + invadersProjectile.height >= player.position.y &&
            invadersProjectile.position.x + invadersProjectile.width >= player.position.x &&
            invadersProjectile.position.x <= player.position.x + player.width
        ) {
            console.log("you are lose")
            createParticles({
                opject: player,
                color: 'white',
                fades: true

            })
            setTimeout(() => {
                invadersProjectiles.splice(index, 1);
                game.ovre = true;
                player.opacity = 0;
            }, 0)

            setTimeout(() => {
                game.active = false;
            }, 2000)
        }
    })


    projectiles.forEach((projectile, index) => {

        if (projectile.position.y + projectile.redius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0)
        }
        else {
            projectile.update()
        }

    })

    grids.forEach((grid, gredIndex) => {
        grid.update()

        //spawn projectiles 
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invadersProjectiles)
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });

            //projectals hit enemy
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.redius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.redius >= invader.position.x &&
                    projectile.position.x - projectile.redius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.redius >= invader.position.y) {


                    //push particles



                    //make shure invader and projectile is found and removing invader and projectile
                    setTimeout(() => {

                         

                        const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

                        //removing invader and projectile
                        if (invaderFound && projectileFound) {

                            
                            createParticles({
                                opject: invader,
                                fades: true
                                
                            })
                            
                            score += 100;
                            console.log(score)
                            scoreEL.innerHTML=score

                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);


                        }

                        //to change postion of grid after removing invaders => for changing directin of grin in the right place
                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0];
                            const lastInvader = grid.invaders[grid.invaders.length - 1]
                            grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                            grid.position.x = firstInvader.position.x;
                        }
                        else {
                            grids.splice(gredIndex, 1)
                        }



                    }, 0);

                }
            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7;
        player.rotation = -0.15;
    }
    else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7;
        player.rotation = 0.15;
    }
    else {
        player.velocity.x = 0;
        player.rotation = 0;
    }


    // console.log(frames);

    // spawning gride
    if ((frames % randomIntarval) == 0) {
        grids.push(new Gride);
        randomIntarval = Math.floor(Math.random() * 500 + 500);
        // console.log(frames);
        // console.log(randomIntarval);
        frames = 0;
    }

    frames++;


}

animate();

addEventListener('keydown', ({ key }) => {

    if (game.ovre) return
    switch (key) {
        case 'ArrowLeft':
            // console.log("left");
            keys.a.pressed = true;
            break;
        case 'ArrowRight':
            // console.log("right");
            keys.d.pressed = true;
            break;
        case ' ':
            // console.log("space");
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }
            ))
            // console.log(projectiles)
            break;
        case 'p':
            game.active = false;
            break
        case 'c':
            if (!game.active) {
                console.log("contenu")
                game.active = true;
                animate(); 
            }
            break;
    }
    // console.log(key);
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            // console.log("left");
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            // console.log("right");
            keys.d.pressed = false;
            break;
        case ' ':
            // console.log("space");
            break;
    }
    // console.log(key);
})