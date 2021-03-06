// "use strict"
/* Engine.js
  
/*Intro sequence*/
const intro = (function introSeq() {

    const modalBack = document.querySelector('.modalBackground');
    const introModal = document.querySelector('.introModal');

    introModal.classList.toggle('initIntro');

    this.callback = function(e) {
        e.preventDefault();
        introModal.classList.toggle('initIntro');
        modalBack.style.opacity = 0;
        this.introDone = true;
    }

    document.querySelector('.start').addEventListener('click', callback.bind(this));

})();

/* Game loop */
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        // introDone, // time delay for levels display
        start, // time delay for level 1 display
        level = 1; // current level
        

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    (function() {this.PosDetails = new PosDetails()})(global);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        if (!player.collision && !player.reachedEnd) {
            win.requestAnimationFrame(main);
        } else {
            if (player.reachedEnd) {
                level++
                if (maxEnemies < 6) {
                    maxEnemies++;
                }
                custSpeed += 5;
                init();
            } else {
                endGameDisplay.bind(endGameDisplay)();
            };
        };
    }

    /* to display the end game modal */
    function endGameDisplay() {
        this.endModal = document.querySelector(".endGameModal");
        this.modalBack = document.querySelector('.modalBackground');

        this.endModal.classList.toggle('initEnd');
        this.endModal.innerHTML = `
        <h1>Level ${level}</h1>
        <p>You Died!</p>
        <p>Thanks for playing!  Hope you enjoyed!</p>
        <p>Go again?</p>
        <div class="button restart">
            <p>Restart</p>
        </div>`
        this.modalBack.style.opacity = 1;

        
        this.restart = document.querySelector('.restart');
        this.restart.addEventListener('click', endGameToggle.bind(endGameDisplay));
    };

    /* to remove the end game modal and reset the game */
    function endGameToggle() {
        this.endModal.classList.toggle('initEnd');
        this.modalBack.style.opacity = 0;
        this.restart.removeEventListener('click', endGameToggle);
        level = 1; // reset to level 1
        maxEnemies = 1; // reset to initial state in app.js
        custSpeed = 20; // reset to initial state in app.js   
        init();
    };



    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset(); 
        lastTime = Date.now();
        start = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        PosDetails.allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
            width = 101;
            height = 83;
        
        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * width, row * height);
            }
        }

        delayMovement();

        renderEntities();
    }

    function delayMovement() {
        if (!this.introDone) {
            start = Date.now();
        }

        if (lastTime - start < 3000) {
            this.player.active = false; // prevents movement during level display (handleInput())
            displayLevel();
        }
    }

    function displayLevel() {
        let time = ("0000" + (lastTime - start)).substr(-4,4);  //formatted countdown var;
        ctx.textAlign = 'center';
        ctx.font = '3em calibri';
        ctx.strokeStyle = 'black';
        ctx.strokeText(`Level ${level}`, 101*5/2, (83*4)+(83/2));
        ctx.strokeText(`${3 - time[0]}`, (101*5)/2, (83*3)+(83/2));
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        PosDetails.allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    function reset() {  
        this.player = new Player();
        PosDetails.allEnemies.length = 0;
        initEnemies();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/enemy-bug-reverse.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
