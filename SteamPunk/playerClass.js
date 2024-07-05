class playerChar{ // creat Player
    constructor(game){
        this.game = game;
        this.width = 120;
        this.height = 190;
        this.x = 40;
        this.y = 150;
        this.frameX = 0; // anmate char 
        this.frameY = 0;
        this.maxFrame = 37;
        this.speedY = 0; // move player
        this.maxSpeed = 3;
        this.shoots = [];
        this.imagePlayer = document.getElementById('player');
        this.isPowerUp = false; // get power to player
        this.powerUpTimer = 0;
        this.powerUpLimit = 10000;
        this.effectLuky = false;
    }
    update(deltaTime){
        // update character position
        if (this.game.keysDown_.includes('ArrowUp')){
            this.speedY = -1 * this.maxSpeed;
        }
        else if(this.game.keysDown_.includes('ArrowDown')){
            this.speedY = this.maxSpeed;
        }
        else {
            this.speedY = 0;
        }
        this.y += this.speedY; // update player movement
        // hold if out of boundaries
        if(this.y > this.game.height - this.height * 0.7){
            this.y = this.game.height - this.height * 0.7;
        }
        else if(this.y <= 0){
            this.y = 0
        }
        // update Projectiles
        this.shoots.forEach(projectiles =>{
            projectiles.update(); // fun update in projectile class
        })
        // destroy the shooter
        this.shoots = this.shoots.filter(projectile_ => !projectile_.makeForDeleteProdectile);

        if(this.frameX < this.maxFrame &&!this.game.gameOver){
            this.frameX++;
        }
        else{
            this.frameX = 0;
        }
        // power UP
        if(this.isPowerUp){
            this.effectLuky = true; 
            if(this.powerUpTimer > this.powerUpLimit){  
                this.powerUpTimer = 0;
                this.isPowerUp = false;
                this.effectLuky = false; 
                this.frameY =0;
                this.game.ammo = this.game.maxAmmo + 20;
            }
            else{
                this.powerUpTimer += deltaTime;
                this.frameY = 1;
                this.game.ammo += 0.1;
            }
        }
    }
    draw(context){
        // draw player and update it
        context.fillStyle = 'black';
        if(this.game.debug){
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        this.shoots.forEach(projectiles =>{
            projectiles.draw(context); // fun Draw the projectile
        })
        context.drawImage(this.imagePlayer,this.frameX * this.width,this.frameY * this.height
                        ,this.width,this.height, this.x, this.y, this.width, this.height);

    }
    shootPlayer(){ 
        if(this.game.ammo > 0){ 
            this.shoots.push(new projectile(this.game, this.x+65, this.y +25));
            this.game.ammo--;
        }
        if(this.isPowerUp){
            this.shootPlayerButtom();
        }
    }
    shootPlayerButtom(){ 
        if(this.game.ammo > 0){ 
            this.shoots.push(new projectile(this.game, this.x+65, this.y +175));
        }
    }
    enterPowerUp(){
        this.powerUpTimer = 0;
        this.isPowerUp = true;
        this.game.ammo = this.game.maxAmmo + 10;
    }
}


class projectile{
    constructor(game, x, y){
        this.game = game;
        this.x = x; 
        this.y = y;
        this.width = 25;
        this.height = 10;
        this.speed = 10;
        this.makeForDeleteProdectile = false;
        this.image = document.getElementById('projectile'); 
        this.sound = new Audio();
        this.sound.src = 'source/shootSound.mp3';
        this.soundMaker = true;
    }
    update(){
        if(this.soundMaker){
            this.soundMaker = false;
            this.sound.play();
        }
        this.x += this.speed;
        if(this.x > this.game.width * 0.94){
            this.makeForDeleteProdectile = true; // to destory the projectile
        }
    }
    draw(context){ // draw projectiles
        context.drawImage(this.image, this.x, this.y);
    }
}