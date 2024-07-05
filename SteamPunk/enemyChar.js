class enemyChar{
    constructor(game){
        this.game = game;
        this.x = this.game.width;
        this.s = -5.5;
        this.speedX = (Math.random()* this.s); // create diff speed
        this.makeForDeleteEnemy = false;
        this.live = Math.ceil(Math.random() * 4 );
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 37;
    }
    update(){
        // update movement of enemy
        if(!this.game.gameOver){ this.x += (this.speedX - this.game.speed);}
        if(this.x + this.width < 0 ){
            this.makeForDeleteEnemy = true;
        }
        if(this.frameX < this.maxFrame){
            this.frameX++;
        }
        else{
            this.frameX = 0;
        }
    }
    draw(context){// draw Enemy
        if(this.game.debug){
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(this.imageAngler,this.frameX *this.width, this.frameY*this.height,
                          this.width,this.height,this.x, this.y,this.width, this.height);
        if(this.game.debug){
            context.font = '20px Helvetica';
            context.fillStyle = 'white';
            context.fillText(this.live, this.x, this.y); 
        }   
    }
}

class anglerEnemy extends enemyChar{
    constructor(game){
        super(game);
        this.width = 228;
        this.height = 169;
        this.score = 3;
        this.y = Math.random() * (this.game.height * 0.95 - this.height); 
        if(this.y < 40){
            this.y = 50;
        }
        this.imageAngler = document.getElementById('angler1');
        this.frameY = Math.floor(Math.random()*3);
    }
}

class anglerEnemy2 extends enemyChar{
    constructor(game){
        super(game);
        this.width = 213;
        this.height = 165;
        this.score = 2;
        this.y = Math.random() * (this.game.height * 0.99 - this.height); 
        if(this.y < 40){
            this.y = 50;
        }
        this.imageAngler = document.getElementById('angler2');
        this.frameY = Math.floor(Math.random()*2);
    }
}
class luckyFish extends enemyChar{
    constructor(game){
        super(game);
        this.width = 99;
        this.height = 95;
        this.score = 10;
        this.y = Math.random() * (this.game.height * 0.99 - this.height); 
        if(this.y < 40){
            this.y = 50;
        }
        this.imageAngler = document.getElementById('lucky');
        this.frameY = Math.floor(Math.random()*2);
        this.type = 'lucky';
    }
}

class hiveWhale extends enemyChar{
    constructor(game){
        super(game);
        this.width = 400;
        this.height = 277;
        this.score = 15;
        this.live = 15;
        this.y = Math.random() * (this.game.height * 0.85 - this.height); 
        if(this.y < 40){
            this.y = 50;
        }
        this.imageAngler = document.getElementById('hivewhale');
        this.frameY = 0;
        this.type = 'hiveWhale';
        this.speedX = Math.random() * -1.2 - 0.2;
    }
}

class drone extends enemyChar{
    constructor(game, x, y){
        super(game);
        this.width = 115;
        this.height = 95;
        this.score = 3;
        this.live = 3;
        this.y = y; 
        this.x = x;
        this.imageAngler = document.getElementById('drone');
        this.frameY = Math.floor(Math.random() *2 );
        this.type = 'drone';
        this.speedX = Math.random() * -4.2 - 0.5;
    }
}