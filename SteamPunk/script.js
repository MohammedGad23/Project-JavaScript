var startPlay_ = false;
var control = document.getElementById('control');
var btnControl = document.getElementById('continue');
var reStart_ = false;
function startPlay(){
    startPlay_ = true;
    control.style.display = 'none';
}
function reStart(){
    reStart_ = true;
}
function pause(){
    control.style.display = 'inline';
    if(startPlay_)btnControl.innerHTML = 'Continue'
    startPlay_ = false;
}

window.addEventListener('load',function(){
    //initiate the canvas
    var canvas = document.getElementById("board");
    var ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height =500;
    var backgroundSound = document.getElementById('backgrondSound');
    control.style.display = 'inline'
   
    
    const gamePlayer = new gamePlay(canvas.width, canvas.height);
    
    let lastTime = 0;
    backgroundSound.play();
    function animatePlayer(timeStamp){
        backgroundSound.play();
        const deltaTime = timeStamp - lastTime; // 16.6 FramePerSecond
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height )
        if(startPlay_){
            gamePlayer.update(deltaTime);
        }
        if(reStart_){
            window.location.reload();
            reStart_ = false;
        }
        gamePlayer.draw(ctx);
        // tells the browser that you wish to perform an animation
        // requests from browser update an animation before repaint.
        requestAnimationFrame(animatePlayer);
    }
    animatePlayer(0);
    

})