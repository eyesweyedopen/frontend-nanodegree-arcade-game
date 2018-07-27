

/* Position Details global Object initialized in engine.js */
function posDetails() {
    this.leftOrRight = [-101, 505],             // bug spawn x-location for random generator 
    this.yStartHeight = 83/2,                                             // offset for the y-coordinates 
    this.yHeight = 83,                                                    // row height
    this.xWidth = 101,                                                    // column width
    this.startYPos = [0, this.yHeight, this.yHeight * 2].map(y => y + this.yStartHeight),  // bug spawn y-location for random generator
    this.allEnemies = []  // holds all enemy objects
}
    


let maxEnemies = 1; //changes in engine.js depending on level
let custSpeed = 20; //changes in engine.js depending on level


/*
 *CHARACTER CLASS
 */

class Character {
    constructor(name, sprite) {
        this.sprite = sprite;
        this.name = name;
        this.width = 101;
        this.height = 171;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    }
}

/*
 *ENEMY CLASS
 */

class Enemy extends Character {
    constructor(name, sprite='images/enemy-bug.png') {
        super(name, sprite);
        this.speed = 1;
    }

    createEnemy(name, x=posDetails.leftOrRight[Math.floor(Math.random()+1/2)], y=posDetails.startYPos[Math.floor(Math.random()*posDetails.startYPos.length)], speed=custSpeed+Math.floor(Math.random()*100), repopped=false) {
        
        const enemy = new Enemy(name);
        enemy.speed = speed;
        enemy.x = x;
        enemy.firstX = x;
        enemy.y = y;
        enemy.lastPos = enemy.x; // lastPos to be used in Player.update()
        if (enemy.x == posDetails.leftOrRight[1]) {
            enemy.speed *= -1;  //change enemy direction
            enemy.sprite = 'images/enemy-bug-reverse.png';
        };
        repopped ? posDetails.allEnemies.push(enemy) : window.setTimeout(function() {posDetails.allEnemies.push(enemy)}, (Math.random() * 2500));  // add to allEnemies at random times
    }
    

    rePop(el) {
        if (el.x >= 505 || el.x <= -101) {
            let index = posDetails.allEnemies.indexOf(el);
            posDetails.allEnemies.splice(index, 1);
            this.createEnemy(String(index), posDetails.leftOrRight[posDetails.leftOrRight.indexOf(el.firstX)], el.y, el.speed, true);
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
// This class requireposDetails.s an update(), render() and
// a handleInput() method.

// PLAYER CLASS
class Player extends Character {
    constructor(sprite='images/char-boy.png'){
        super(undefined, sprite);
        this.x = 2 * posDetails.xWidth;
        this.y = (5 * posDetails.yHeight) - posDetails.yStartHeight;
        this.collision = false;
        this.reachedEnd = false;

        this.dx = this.x;
        this.dy = this.y;
    }

    dieSequence() {
        this.active = false;
    }

    checkCollision() {
        posDetails.allEnemies.forEach(singleCheckCollision.bind(player));
        function singleCheckCollision(el) {
            if ( ((this.x>=(el.x-101/2))&&(this.x<=(el.x+101/2))) && ((this.y>=(el.y-101/2))&&(this.y<=(el.y+101/2))) ) {
                this.collision = true;
                this.dieSequence();
            };
        };
    }

    update() {
        this.active = true;  //allow player movement
        this.x = this.dx;
        this.y = this.dy;
        this.checkCollision();
    }

    handleInput(usrinput) {
        if (this.active) {
            switch (usrinput) {
                case "left":
                    if (this.x > 0) {
                        this.dx = this.x - posDetails.xWidth;
                    }
                    break;
                case "right":
                    if (this.x < 404) {
                        this.dx = this.x + posDetails.xWidth;
                    }
                    break;
                case "up":
                    if (this.y > posDetails.yStartHeight) {
                        this.dy = this.y - posDetails.yHeight;
                    } else {
                        this.reachedEnd = true;
                    }
                    break;
                case "down":
                    if (this.y < 415 - posDetails.yStartHeight) {
                        this.dy = this.y + posDetails.yHeight;
                    }
            }
        }
    }
}


// player Player() instantiated dynamically from reset()

// instantiate enemies
function initEnemies() {
    let rand = Math.floor(1 + (Math.random() * maxEnemies)); /*create random number of bugs var*/

    // reset allEnemies for the reset() callback
    posDetails.allEnemies.length = 0;
    for (let i = 0; i < rand; i++) { Enemy.prototype.createEnemy(String(i+1)) };
}

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
