var canvas = document.querySelector("canvas");
var scoreEl = document.querySelector("#scoreEl");
// console.log(scoreEl)
var c = canvas.getContext("2d");
canvas.width = 500 ;
canvas.height = 600;
// generate map boundary
class Boundary {
  static width = 40;
  static height = 40;
  constructor({ position, image }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
  }
  draw() {
    // c.fillStyle = "blue";
    // c.fillRect(this.position.x, this.position.y,
    //    this.width, this.height);
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
// add player and movement
class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.radians = 0.75;
    this.openRate = 0.12;
    this.rotattion = 0;
  }
  darw() {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotattion);
    c.translate(-this.position.x, -this.position.y);
    c.beginPath();
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    c.lineTo(this.position.x, this.position.y);
    c.fillStyle = "yellow";
    c.fill();
    c.closePath();
    c.restore();
  }
  update() {
    this.darw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate;
    this.radians += this.openRate;
  }
}
//greate ghost of coumputer with color
class Ghost {
  static speed = 2;
  constructor({ position, velocity, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.pervCollisions = [];
    this.speed = 2;
    this.scared = false;
  }
  darw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.scared ? "blue" : this.color;
    c.fill();
    c.closePath();
  }
  update() {
    this.darw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
// cearte pointes white
class Pellet {
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
  }
  darw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }
}

class PowerUp {
  constructor({ position }) {
    this.position = position;
    this.radius = 10;
  }
  darw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }
}

const pellets = [];
var boundaries = [];
var powerUps = [];
var ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    color: "pink",
  }),
];
var player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});
// to use only keys (w,a,s,d)
var keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
var lastkey = "";
var scour = 0;

function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

//create array of boundaries map
var map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];
// call generate map
map.forEach(function (row, i) {
  row.forEach(function (symbol, j) {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeVertical.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/block.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/capBottom.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/capTop.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeCross.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeConnectorTop.png"),
          })
        );
        break;
      case "6":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeConnectorRight.png"),
          })
        );
        break;
      case "7":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./images/pipeConnectorBottom.png"),
          })
        );
        break;
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: Boundary.width * j + Boundary.width / 2,
              y: Boundary.height * i + Boundary.height / 2,
            },
          })
        );
        break;
      case "p":
        powerUps.push(
          new PowerUp({
            position: {
              x: Boundary.width * j + Boundary.width / 2,
              y: Boundary.height * i + Boundary.height / 2,
            },
            image: createImage("./images/pipeConnectorTop.png"),
          })
        );
        break;
    }
  });
});

function circleCollidesWithReactangle({ circle, rectangle }) {
  const padding = Boundary.width / 2 - circle.radius - 1;
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width + padding
  );
}

var animateId;
function animate() {
  animateId = requestAnimationFrame(animate);
  // console.log(animateId);
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (keys.w.pressed && lastkey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -5;
      }
    }
  } else if (keys.a.pressed && lastkey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
    player.velocity.x = -5;
  } else if (keys.s.pressed && lastkey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  } else if (keys.d.pressed && lastkey === "d"
  ) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  }
  // delect collisions between ghosts and player
  for (var i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i];
    // ghost touches player
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1);
      } else {
        cancelAnimationFrame(animateId);
        alert("you lose");
      }
    }
  }
  // win condaition hers
  if (pellets.length === 0) {
    alert("you win");
    cancelAnimationFrame(animateId);
  }

  // power up go
  for (var i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i];
    powerUp.darw();
    //  player collisions with powerUp
    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      powerUps.splice(i, 1);
      // make ghosts scared
      ghosts.forEach(function (ghost) {
        ghost.scared = true;
        // console.log(ghost.scared);
        setTimeout(function () {
          ghost.scared = false;
          // console.log(ghost.scared);
        }, 5000);
      });
    }
  }
  //to put points white on map
  for (var i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i];
    pellet.darw();
    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      // console.log("taching");
      pellets.splice(i, 1);
      scour += 10;
      scoreEl.innerHTML = scour;
    }
  }

  // pellets.forEach(function (Pellet) {
  //   Pellet.darw();
  // })

  boundaries.forEach(function (boundary) {
    boundary.draw();
    // to stop pac man to move out canvas
    if (
      circleCollidesWithReactangle({
        circle: player,
        rectangle: boundary,
      })
    ) {
      //   console.log("stop");
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });
  player.update();
  ghosts.forEach(function (ghost) {
    ghost.update();
    // ghost touches player
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
        ghost.radius + player.radius &&
      !ghost.scared
    ) {
      cancelAnimationFrame(animateId);
      alert("you lose");
    }

    const collisions = [];
    boundaries.forEach(function (boundary) {
      if (
        !collisions.includes("rigth") &&
        circleCollidesWithReactangle({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("right");
      }
      if (
        !collisions.includes("left") &&
        circleCollidesWithReactangle({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("left");
      }
      if (
        !collisions.includes("up") &&
        circleCollidesWithReactangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("up");
      }
      if (
        !collisions.includes("down") &&
        circleCollidesWithReactangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("down");
      }
    });
    if (collisions.length > ghost.pervCollisions.length) {
      ghost.pervCollisions = collisions;
    }
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.pervCollisions)) {
      {
        // console.log('gogo')
        if (ghost.velocity.x > 0) {
          ghost.pervCollisions.push("right");
        } else if (ghost.velocity.x < 0) {
          ghost.pervCollisions.push("left");
        } else if (ghost.velocity.y > 0) {
          ghost.pervCollisions.push("down");
        } else if (ghost.velocity.y < 0) {
          ghost.pervCollisions.push("up");
        }
        // console.log(collisions);
        // console.log(ghost.pervCollisions);

        const pathways = ghost.pervCollisions.filter(function (collision) {
          return !collisions.includes(collision);
        });
        const dircection =
          pathways[Math.floor(Math.random() * pathways.length)];

        switch (dircection) {
          case "down":
            ghost.velocity.y = ghost.speed;
            ghost.velocity.x = 0;
            break;
          case "up":
            ghost.velocity.y = -ghost.speed;
            ghost.velocity.x = 0;
            break;
          case "right":
            ghost.velocity.y = 0;
            ghost.velocity.x = ghost.speed;
            break;
          case "left":
            ghost.velocity.y = 0;
            ghost.velocity.x = -ghost.speed;
            break;
        }
        ghost.pervCollisions = [];
        // console.log({ pathways });
        // console.log({ dircection });
      }
    }
    // console.log(collisions)
  });
  if (player.velocity.x > 0) player.rotattion = 0;
  else if (player.velocity.x < 0) player.rotattion = Math.PI;
  else if (player.velocity.y > 0) player.rotattion = Math.PI / 2;
  else if (player.velocity.y < 0) player.rotattion = Math.PI * 1.5;
} //end of animate

 

addEventListener("keydown", function ({ key }) {
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastkey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastkey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastkey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastkey = "d";
      break;
  }
});
addEventListener("keyup", function ({ key }) {
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
var contantGame=document.getElementById('contantGame');
var startpage=document.getElementById("startpage");
var PlayGame=document.getElementById('PlayGame');

PlayGame.addEventListener('click',function() {
  // cancelAnimationFrame(animateId);
  contantGame.style.opacity='1';
  startpage.style.opacity='0';
  animate(); 
}) 
var check = true;

var back=document.getElementById('continueGame');
back.addEventListener('click',function() {
  contantGame.style.opacity='0';
  startpage.style.opacity='1';
  // cancelAnimationFrame(animateId);
  window.location.reload();
})
var replay=document.getElementById('Replay');
// replay.addEventListener('click',function() {
//   window.location.reload();
//   startpage.style.opacity=0;
//   contantGame.style.opacity=1;
// })
var pouseGame=document.getElementById('pouseGame');
pouseGame.addEventListener('click',function() {
  if(check){
    cancelAnimationFrame(animateId);
    pouseGame.innerText = 'Continue';
  }else{
    pouseGame.innerText = 'Pause';
    animate();
  }
  check = !check;
})

var closeGame=document.getElementById('closeGame');
closeGame.addEventListener('click',function() {
  contantGame.style.opacity='1';
  startpage.style.opacity='0';
})