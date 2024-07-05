class particle{
    constructor(game , x,y){
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = document.getElementById('gear');
        this.frameX = Math.floor(Math.random()*3);
        this.frameY = Math.floor(Math.random()*3);
        this.spriteSize = 50; 
        this.sizeModifier = (Math.random()*0.5 + 0.5).toFixed(1);
        this.size = this.spriteSize * this.sizeModifier;
        this.speedX = Math.random()*6 - 3;
        this.speedY = Math.random()*  -15;
        this.gravity = 0.5;
        this.markDeletion = false;
        this.bounced = 0;
        this.buttomBounced = Math.random() * 100 + 50;
    }
    update(){
        this.speedY += this.gravity;
        this.x -= this.speedX;
        this.y += this.speedY;
        if(this.y > this.game.height + this.size || this.x <-1*this.size){
            this.markDeletion = true;
        }
        if(this.y > this.game.height - this.buttomBounced && this.bounced < 2){
            this.bounced++;
            this.speedY *= -0.6;
        }
    }
    draw(context){
        context.drawImage(this.image, this.frameX*this.spriteSize, this.frameY*this.spriteSize,
                          this.spriteSize, this.spriteSize, this.x,this.y,this.size,this.size);
    }
}