// Enemies our player must avoid
   // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks


// CHARACTER CLASS
class Character {
    constructor(name, sprite) {
        this.sprite = sprite;
        this.name = name;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// ENEMY CLASS
class Enemy extends Character {
    constructor(name, sprite='images/enemy-bug.png') {
        super(name, sprite);
        this.speed = 1;
    }

    rePop(el) {
        if (el.x >= 505 || el.x <= -101) {
            let index = allEnemies.indexOf(el);
            allEnemies.splice(index, 1);
            createEnemy(String(index), leftOrRight[leftOrRight.indexOf(el.firstX)], el.y, el.speed);
        }
    }

    update(dt) {
        this.x = (this.speed * dt) + this.lastPos;
        this.lastPos = this.x;
        this.rePop(this);
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
    }
}

// Draw the enemy on the screen, required method for game

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// PLAYER CLASS
class Player extends Character {
    constructor(sprite='images/char-boy.png'){
        super(undefined, sprite);
        this.x = 2 * 101;
        this.y = (5 * 83) - (83/2);
        this.collision = false;
        this.reachedEnd = false;

        this.dx = this.x;
        this.dy = this.y;
    }

    checkCollision() {
        allEnemies.forEach(singleCheckCollision.bind(player));
        function singleCheckCollision(el) {
            if ( ((this.x>=(el.x-101/2))&&(this.x<=(el.x+101/2))) && ((this.y>=(el.y-101/2))&&(this.y<=(el.y+101/2))) ) {
                this.collision = true;
            };
        };
    }

    update() {
        this.x = this.dx;
        this.y = this.dy;
        this.checkCollision();
    }

    handleInput(usrinput) {
        switch (usrinput) {
            case "left":
                if (this.x > 0) {
                    this.dx = this.x - 101;
                }
                break;
            case "right":
                if (this.x < 404) {
                    this.dx = this.x + 101;
                }
                break;
            case "up":
                if (this.y > yStartHeight) {
                    this.dy = this.y - 83;
                } else {
                    this.reachedEnd = true;
                }
                break;
            case "down":
                if (this.y < 415 - yStartHeight) {
                    this.dy = this.y + 83;
                }
        }
    }
}


// instantiate player character
// player Player() instantiated dynamically from reset()

// instantiate enemies

const allEnemies = [];

const yStartHeight  = 83/2;
const yHeight = 83;
const YPos = [0, yHeight, yHeight * 2];
const startYPos = YPos.map( y => y + yStartHeight );
const leftOrRight = [-101, 505];


let maxEnemies = 1; //changes in engine.js depending on level
let custSpeed = 20; //changes in engine.js depending on level

function initEnemies() {
    let rand = Math.floor(1 + (Math.random() * maxEnemies)); /*create random number of bugs var*/

    // reset allEnemies for the reset() callback
    allEnemies.length = 0;
    for (let i = 0; i < rand; i++) { createEnemy(String(i)) };
}


function createEnemy(name, x=leftOrRight[Math.floor(Math.random()+1/2)], y=startYPos[Math.floor(Math.random()*startYPos.length)], speed=custSpeed+Math.floor(Math.random()*100)) {
    const enemy = new Enemy(name);
    enemy.speed = speed;
    enemy.x = x;
    enemy.firstX = x;
    enemy.y = y;
    // lastPos to be used in Player.update()
    enemy.lastPos = enemy.x;
    if (enemy.x == leftOrRight[1]) {
        enemy.speed *= -1;
        enemy.sprite = 'images/enemy-bug-reverse.png';
    };
    allEnemies.push(enemy);
}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
