
class layers{
    constructor(game, image, speedLayer){
        this.game = game;
        this.image = image;
        this.speedLayer = speedLayer;
        this.width = 1500;
        this.height = 500;
        this.x = 0;
        this.y = 0;
    }
    update(){
        if(this.x <= -this.width){
            this.x = 0;
        }
        else {
            if(!this.game.gameOver)this.x -= (this.game.speed * this.speedLayer);
        }
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y);
        context.drawImage(this.image, this.x + this.width, this.y);
    }
}

class backgroundGame{
    constructor(game){
        this.game = game;
        this.image1 = document.getElementById('layer1');
        this.image2 = document.getElementById('layer2');
        this.image3 = document.getElementById('layer3');
        this.image4 = document.getElementById('layer4');

        this.layer1 = new layers(this.game, this.image1, 0.15);
        this.layer2 = new layers(this.game, this.image2, 0.3);
        this.layer3 = new layers(this.game, this.image3, 0.6);
        this.layer4 = new layers(this.game, this.image4, 1.1);

        this.layers_ = [this.layer1, this.layer2, this.layer3]
    }
    update(){
        this.layers_.forEach(layer_=> layer_.update());
    }
    draw(context){
        this.layers_.forEach(layer_=> layer_.draw(context));
    }
}

class UI{
    // to show prjoctile, ScoreBoard on my screen
    constructor(game){
        this.game = game;  
        this.powerChar = 200;      
    }
    draw(context){
        context.save();
        // power char
        context.fillStyle = 'white';
        context.font = '28px Bangers';
        if(this.powerChar > 0){context.fillText((this.powerChar/2) + ' %' , this.powerChar +310, 37);}
        else {context.fillText(0 + ' %' , 310, 37);}
        context.fillText('Power ' , 220, 37)
        context.fillStyle = 'green';
        if(this.powerChar<140){context.fillStyle = 'yellow';}
        if(this.powerChar < 100){context.fillStyle = 'red';}

        if(this.powerChar > 0){context.fillRect(300, 16 , this.powerChar, 20);}
        else {context.fillRect(300, 16 , 1, 20);}
        // ScoreBoard
        context.fillStyle = 'white';
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowColor = 'black';
        context.font = '28px Bangers';
        context.fillText('Score : '+this.game.score, 30, 35);
        // draw time
        const formateTime = (this.game.gameTime * 0.001).toFixed(1);
        context.fillText('Timer ' + formateTime, this.game.width - 150, 37)
        // game Over
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'white';
            let massage1, massage2, massege3= 'to play again press replay';
            if(this.game.score >= this.game.winningScore){
                massage1 = 'Congrats You win';
                massage2 = 'Well done';
            }
            else{
                massage1 = 'Sorray You Lose';
                massage2 = 'press Replay to Try again';
            }
            context.font = '100px Bangers';
            context.fillText(massage1, this.game.width *0.5, this.game.height *0.5 -40);
            context.font = '60px Bangers';
            context.fillText(massage2, this.game.width *0.5, this.game.height *0.5 +40);
            context.font = '40px Bangers';
            context.fillText(massege3, this.game.width *0.5, this.game.height *0.5 +120);
        }
        // draw ammos
        if(this.game.player.isPowerUp){
            context.fillStyle = 'yellow'
        }
        for(let i = 0; i < this.game.ammo; i++){ // recharge player projectile
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.fillRect(650 + (i*5), 15 , 3, 22);
        }
        context.restore();
    }
}