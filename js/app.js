"use strict"

/* Position Details global Object initialized in engine.js */
function PosDetails() {
    this.leftOrRight = [-101, 505],             // bug spawn x-location for random generator 
    this.yStartHeight = 83/2,                                             // offset for the y-coordinates 
    this.yHeight = 83,                                                    // row height
    this.xWidth = 101,                                                    // column width
    this.startYPos = [0, this.yHeight, this.yHeight * 2].map(y => y + this.yStartHeight),  // bug spawn y-location for random generator
    this.allEnemies = [];  // holds all enemy objects
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
        this.createEnemy();
    }

    createEnemy() {
        this.x = PosDetails.leftOrRight[Math.floor(Math.random() + 1/2)];
        this.firstX = this.x;
        this.y = PosDetails.startYPos[Math.floor(Math.random() * PosDetails.startYPos.length)];
        this.speed = custSpeed + Math.floor(Math.random() * 100);
        this.active = true;
        this.lastPos = this.x;

        /* make enemies go backwards */
        if (this.x == PosDetails.leftOrRight[1]) {
            this.speed *= -1;
            this.sprite = 'images/enemy-bug-reverse.png';
        }

        /* make enemies first spawn at random times */
        if (!this.repopped) {
            window.setTimeout(function() {this.active = true;}, (Math.random() * 2500));
            this.repopped = true;
        } else {
            this.active = true;
        }
    }

    // createEnemy(name, x=PosDetails.leftOrRight[Math.floor(Math.random()+1/2)], y=PosDetails.startYPos[Math.floor(Math.random()*PosDetails.startYPos.length)], speed=custSpeed+Math.floor(Math.random()*100), repopped=false, active=false) {
        
    //     if (Number(name) !== 0) {
    //         const enemy = new Enemy(name);
    //         enemy.active = active;
    //         enemy.speed = speed;
    //         enemy.x = x;
    //         enemy.firstX = x;
    //         enemy.y = y;
    //         enemy.lastPos = enemy.x; // lastPos to be used in Enemy.update()
    //         if (enemy.x == PosDetails.leftOrRight[1]) {
    //             enemy.speed *= -1;  //change enemy direction
    //             enemy.sprite = 'images/enemy-bug-reverse.png';
    //         }
    //         PosDetails.allEnemies.splice(Number(name)-1, 0, enemy);

    //         /* add to allEnemies at random times if new enemy */
    //         if (!repopped) { 
    //             window.setTimeout(function() {enemy.active = true;}, (Math.random() * 2500)); 
    //         } else {
    //             enemy.active = true;
    //         }
    //     }

    // }
    

    rePop() {
        if (this.x > 505 || this.x < -101) {
            this.lastPos = this.firstX;
            this.repopped = true;
        }
    }

    update(dt) {
        if (this.active) {    
            this.repopped = false;
            this.x = (this.speed * dt) + this.lastPos;
            this.lastPos = this.x;
            this.rePop();
        }
    }
}


// PLAYER CLASS
class Player extends Character {
    constructor(sprite='images/char-boy.png'){
        super(undefined, sprite);
        this.x = 2 * PosDetails.xWidth;
        this.y = (5 * PosDetails.yHeight) - PosDetails.yStartHeight;
        this.collision = false;
        this.reachedEnd = false;
    }

    dieSequence() {
        this.active = false;
    }

    checkCollision() {
        PosDetails.allEnemies.forEach(function(el) {       
            if ( ((this.x>=(el.x-101/2))&&(this.x<=(el.x+101/2))) && ((this.y>=(el.y-101/2))&&(this.y<=(el.y+101/2))) ) {
                this.collision = true;
                this.dieSequence();
            };
        }.bind(this));
    }

    update() {
        this.active = true;  //allow player movement
        this.checkCollision();
    }

    handleInput(usrinput) {
        if (this.active) {
            switch (usrinput) {
                case "left":
                    if (this.x > 0) {
                        this.x = this.x - PosDetails.xWidth;
                    }
                    break;
                case "right":
                    if (this.x < 404) {
                        this.x = this.x + PosDetails.xWidth;
                    }
                    break;
                case "up":
                    if (this.y > PosDetails.yStartHeight) {
                        this.y = this.y - PosDetails.yHeight;
                    } else {
                        this.reachedEnd = true;
                    }
                    break;
                case "down":
                    if (this.y < 415 - PosDetails.yStartHeight) {
                        this.y = this.y + PosDetails.yHeight;
                    }
            }
        }
    }
}


// player Player() instantiated dynamically from reset()

// instantiate enemies
function initEnemies() {
    let rand = Math.floor(1 + (Math.random() * maxEnemies)); //create random number of bugs var

    PosDetails.allEnemies.forEach(function(){   // reset allEnemies for the reset() callback
        PosDetails.allEnemies.pop();
    });   
    for (let i = 0; i < rand; i++) { 
        const enemy = new Enemy(String(PosDetails.allEnemies.length+1));
        PosDetails.allEnemies.push(enemy);
     };
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
