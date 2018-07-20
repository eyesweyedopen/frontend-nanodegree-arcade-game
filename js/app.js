// Enemies our player must avoid
   // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks


// ENEMY CLASS
class Enemy{
    constructor() {
        this.sprite = 'images/enemy-bug.png';
    }

    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Draw the enemy on the screen, required method for game

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player{
    constructor(){
        this.sprite = 'images/char-boy.png';
    }

    update(dt) {

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
    }

    handleInput(usrinput) {
        switch (usrinput) {
            case "left":
                this.x -= 1;
                break;
            case "right":
                this.x += 1;
                break;
            case "up":
                this.y -= 1;
                break;
            case "down":
                this.y += 1;
        }
    }
}

// instantiate player character
const player = new Player();

// instantiate enemies
let rand = Math.floor(Math.random() * 5);
const allEnemies = [];

for (let i = 0; i < rand; i++) {
    allEnemies.push(new Enemy())
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
