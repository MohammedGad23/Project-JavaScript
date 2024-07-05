class gamePlay{ // create the game Player
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.player = new playerChar(this); // create object from Player
        this.input = new inputHandler(this);
        this.ui = new UI(this);
        this.background = new backgroundGame(this);
        this.keysDown_ = []; // user down key
        this.ammo = 10;
        this.maxAmmo = 25;
        this.ammoTimer = 0;
        this.ammoInterval = 300;
        this.enemys = []; // store the enemy
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // create enemy evere 1s  
        this.gameOver = false;
        this.score = 0;
        this.winningScore = 10000;
        this.gameTime = 0;
        this.timeLimit = 500000;
        this.speed = 1.0;
        this.debug = false;
        this.particles = [];
    }
    update(deltaTime){
        // update background
        this.background.update();
        this.background.layer4.update();
        // update time
        if(!this.gameOver)this.gameTime += deltaTime;
        let ss= 20000;
        if(this.gameTime > ss) {
            ss*=2;
            if(this.speed < 2)this.speed +=0.2;
            //this.enemys = this.enemys.filter(enemy => enemy.makeForDeleteEnemy);
        }
        this.player.update(deltaTime);
        // update Time to give shootes
        if(this.ammoTimer > this.ammoInterval){
            if(this.maxAmmo > this.ammo){
                this.ammo++;
            }
            this.ammoTimer = 0;
        }
        else{
            this.ammoTimer += deltaTime;
        }
        // update particles
        this.particles.forEach(particle_ => particle_.update());
        this.particles = this.particles.filter(particle_ => !particle_.markDeletion);
        if(this.gameOver){
            this.particles = this.particles.filter(particle_ => !particle_.markDeletion);
        }

        // update time to create new enemy
        this.enemys.forEach(enemy => {
            enemy.update();
            if(this.checkCollision(this.player, enemy)){
                enemy.makeForDeleteEnemy = true;
                for(let i=0;i<enemy.score;i++){
                    this.particles.push(new particle(this, enemy.x, enemy.width *0.5,
                         enemy.y + enemy.height *0.5));
                }
                if(enemy.type == 'lucky' && !this.gameOver){
                    this.player.enterPowerUp();
                }
                else{
                    this.score -= 5;
                    if(this.score < 0) this.score =0;
                }
                if(enemy.type != 'lucky' && !this.player.effectLuky)this.ui.powerChar -= (enemy.score *10);
                else if(enemy.type == 'lucky'){this.ui.powerChar = 200;}
                if(this.ui.powerChar < 1){
                    this.gameOver = true;
                }
            }
            else if(this.gameOver){
                enemy.makeForDeleteEnemy = true;
                for(let i=0;i<enemy.score;i++){
                    this.particles.push(new particle(this, enemy.x, enemy.width *0.5,
                         enemy.y + enemy.height *0.5));
                }
            }
            this.player.shoots.forEach(shoot =>{
                if(this.checkCollision(shoot, enemy)){
                    shoot.makeForDeleteProdectile = true;
                    enemy.live--;
                    this.particles.push(new particle(this, enemy.x, enemy.width *0.5,
                         enemy.y + enemy.height *0.5));
                    if(enemy.live < 1){
                        for(let i=0 ; i<enemy.score ; i++){
                            this.particles.push(new particle(this, enemy.x, enemy.width *0.5,
                                 enemy.y + enemy.height *0.5));
                        }
                        enemy.makeForDeleteEnemy = true;
                        if(enemy.type == 'hiveWhale'){
                            for(let i=0 ;i < 5 ; i++){
                                this.enemys.push(new drone(this, enemy.x + Math.random()*enemy.width
                                , enemy.y + Math.random()*this.height *0.5));
                            }
                        }
                        if(!this.gameOver){
                            this.score += enemy.score;
                        }
                        if(this.score >= this.winningScore){
                            this.gameOver = true;
                        }
                    }

                }
            })
        })
        this.enemys = this.enemys.filter(enemy => !enemy.makeForDeleteEnemy);
        if(this.enemyTimer > this.enemyInterval && !this.gameOver){
            this.enemyTimer = 0;
            this.addEnemys();
        }
        else{
            this.enemyTimer += deltaTime;
        }

    }
    draw(context){
        this.background.draw(context); // draw background 
        this.player.draw(context); // draw player
        this.particles.forEach(particle_ => particle_.draw(context)); // draw particle
        this.enemys.forEach(enemy =>{ // draw Enemies
            enemy.draw(context);
        })
        this.ui.draw(context); // draw projectile
        this.background.layer4.draw(context);
    }

    addEnemys(){
        const randEnemy = Math.random();
        if(randEnemy < 0.40){
            this.enemys.push(new anglerEnemy(this));
        }
        else if(randEnemy < 0.7){
            this.enemys.push(new anglerEnemy2(this));
        }
        else if(randEnemy < 0.8){
            this.enemys.push(new hiveWhale(this));
        }
        else{
            this.enemys.push(new luckyFish(this));
        }

    }

    checkCollision(rectP, rectE){
        return (
                rectP.x +30 < rectE.x + rectE.width &&
                rectE.x +30< rectP.x + rectP.width &&
                rectP.y +30< rectE.y + rectE.height &&
                rectE.y +30< rectP.y + rectP.height
        )
    }
}
class inputHandler{
    constructor(game){
        this.game = game;
        addEventListener('keydown', e => {
            //console.log(e.key);
            let access = this.game.gameOver;
            if((e.key == 'ArrowUp' 
                || e.key == 'ArrowDown')
                && this.game.keysDown_.indexOf(e.key) === -1){
                this.game.keysDown_.push(e.key);
            }
            else if(e.key == 's' && !access){ // used to shoot the projectile
                this.game.player.shootPlayer();
            }
            else if(e.key == 'd'){
                this.game.debug = !this.game.debug;
            }
        });
        addEventListener('keyup', e =>{
            if( this.game.keysDown_.indexOf(e.key)> -1){
                this.game.keysDown_.splice(this.game.keysDown_.indexOf(e.key), 1);
            }
        })
    }
}