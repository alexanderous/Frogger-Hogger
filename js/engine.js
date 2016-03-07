/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on the player and enemy objects (defined in app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When the player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* This gets our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* This calls our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* This sets our lastTime variable which is used to determine the time
         * delta for the next time this function is called.
         */
        lastTime = now;

        /* This uses the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /** This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update the entity's data. Here,
     * it checks for gem "pickups" and enemy collisions. It also updates
     * the canvas height.
     */
    function update(dt) {
        updateEntities(dt);
        checkPickups();
        checkCollisions();
        // The game adds a row every single time the player reaches the water.
        // In order to accommodate this growth, the canvas height increases.
        canvas.height = 606 + (player.points * 83);
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        allGems.forEach(function(gem) {
            gem.update(dt);
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

            // The player.points variable adds another row per every successful journey
            // to the water.
            numRows = player.points + 6,
            numCols = 5,
            original, row, col;

        /* This adds an additional stone row (along with two bugs and a gem) every time
         * the player reaches the water. For some reason, this causes an endless number
         * of enemies to be created, so I truncate the array in the next chunk of code.
        */
        for (original = 0; original < player.points; original++) {
            // This inserts a stone row in between the water row and the first stone row.
            rowImages.splice(2, 0, 'images/stone-block.png');
            // These two lines of code add enemies and a gem to the bottom-most stone road.
            allEnemies.push(new Enemy(-70, 220 + (83 * (player.points))),
                new Enemy(-70, 220 + (83 * (player.points))));
            allGems.push(new Gem(-70, 285 + (83 * (player.points))));
        }

        /* These two lines truncate the array to the expected length, so that there are
         * two bugs and one gem for every lane.
        */
        allEnemies.length = 6 + (player.points * 2);
        allGems.length = 3 + player.points;


        /* This loops through the number of rows and columns defined above
         * and, using the rowImages array, draws the correct image for that
         * portion of the "grid".
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * This uses our Resources helpers to refer to the images
                 * so that the user gets the benefits of caching these images,
                 * since the game displays them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js.
     */
    function renderEntities() {
        /* This loops through all of the objects within the allEnemies and allGems
         * array and calls the render function.
         */

        // allGems is rendered first, so that the gems slide below the bugs.
        allGems.forEach(function(gem) {
            gem.render();
        });

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This loads all of the images to draw the game level. It then sets init as
     * the callback method, so that when all of these images are properly loaded
     * the game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        // The original orange gem file was too large and distracting, so I created
        // a new smaller one.
        'images/GemOrangeSmall.png'
    ]);
    Resources.onReady(init);

    /* This assigns the canvas' context object to the global variable (the window
     * object when run in a browser) so that it can be used more easily
     * from within the app.js files.
     */
    global.ctx = ctx;


    // This function checks whether the player has collided with an enemy, and
    // then outlines the consequences.
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            // This line defines what constitutes as a "collision." The actual images
            // of the enemy and player both have quite large transparent backgrounds,
            // so I added and subtracted some values to ensure that the images looked
            // like they touched/collided.
            if(enemy.x + 75 > player.x && enemy.x - 30 <= player.x && enemy.y ===
                player.y) {

                // This launches a modal with a "Game Over" notification.
                $(function() {
                    $( '#gameover' ).dialog({
                        modal: true
                    });
                });

                // This is the content within the "Game Over" modal.
                document.querySelector('#gameover').innerHTML =
                    '<h1>Game Over!</h1><img src="images/Star-cropped.png" alt="Star"' +
                    ' height="80" width="80"><h3>Your Score: ' + player.pointsGrande +
                    '</h3><p>High Score: ' + player.highScore + '</p>';

                // The code below resets the player to the starting point and the scores
                // and additional stone rows back to zero.
                player.x = 200;
                player.points = 0;
                player.pointsGrande = 0;

                // This line ensures that the player's start position is on the bottom-
                // most row, which y value changes as more stone rows are added after
                // every victorious crossing.
                player.y = 386 + (player.points * 83);
            }
        });
    }

    // This is the function to check if player has collected a gem, and outlines the
    // attendant consequences.
    function checkPickups() {
        allGems.forEach(function(gem) {
            // Similar to the enemy collisions, I wanted to ensure that the player looked
            // like he/she actually bumped up against a gem before "pickup."
            if(gem.x + 20 > player.x && gem.x - 50 < player.x && gem.y - 65 === player.y) {
                // After a gem is collected, it disappears for a while. The gem teleports
                // to off-canvas left, and gradually makes its way back to the canvas.
                gem.x = -1400;

                // After a gem is collected, both bugs on that row disappear for a while.
                // They teleport to off-canvas left, but appear back on canvas shortly
                // before the gems reappear, to make the game slightly more challenging.
                allEnemies[allGems.indexOf(gem) * 2].x = -900;
                allEnemies[(allGems.indexOf(gem) * 2) + 1].x = -900;
            }
        });
    }
})(this);



