// TODO: add rocks as obstacles randomly strewn throughout.

/**
* @description Create the enemies
* @constructor
* @param {number} x - the horizontal location of the enemy
* @param {number} y - the vertical location of the enemy
*/
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;

    // The speed is randomized, and optimized for player difficulty.
    this.speed = Math.floor(Math.random() * (220 - 40) + 40);

    // The image/sprite for the enemies; the app uses
    // a helper to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// This method updates the enemy's position.
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // The x value is calculated by multiplying any movement by the dt
    // parameter, which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    if(this.x > 505) {
        this.x = -70;
    };
}

// A method to draw the enemy on the screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
* @description Create a player
* @constructor
* @param {number} x - the horizontal location of the player
* @param {number} y - the vertical location of the player
*/
var Player = function(x, y) {
    // The image/sprite for the player; the app uses
    // a helper to easily load images
    this.sprite = 'images/char-boy.png';

    this.x = x;
    this.y = y;

    // The points variable tracks the player's score and level. The app
    // uses this variable to calculate how many rows, bugs, and gems to add.
    // The other two variables help to display the score and record score
    // to the user.
    this.points = 0;
    this.pointsGrande = 0;
    this.highScore = 0;
}

// This method updates the player's position.
Player.prototype.update = function() {
    // This updates the current and high score, below the canvas.
    document.querySelector('#wordbar').innerHTML = '<h1>SCORE: '
     + this.pointsGrande + '</h1>';
    document.querySelector('#wordbar2').innerHTML = '<h2>HIGH SCORE: '
     + this.highScore + '</h2>';
}

// This method renders the player on screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
* @description Create the gems
* @constructor
* @param {number} x - the horizontal location of the gems
* @param {number} y - the vertical location of the gems
*/
var Gem = function(x, y) {
    this.x = x;
    this.y = y;

    // The speed of the gems is in a similar range as that of the enemies.
    this.speed = Math.floor(Math.random() * (220 - 40) + 40);

    // The image/sprite for the gems; the app uses
    // a helper to easily load images
    this.sprite = 'images/GemOrangeSmall.png';
}

// This method renders the gems on the screen.
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// This method updates the gem's position based on time.
Gem.prototype.update = function(dt) {
    // The gems move back and forth, and so when a gem arrives at a certain
    // x value, their movement switches to the opposite direction.

    if (this.x > 445) {
        this.east = false;
    } else if (this.x < 15) {
        this.east = true;
    };

    if (this.east === true) {
    // The gems move up in x value when they move "east".
        this.x += dt * this.speed;
    } else {
    // The gems move down in x value when they move west, or not "east".
        this.x -= dt * this.speed;
    };
    // I wanted to implement the conditional ternary operator here, but
    // I thought it would overcomplicate the commenting.

    // This chunk of code was added to fix the bug that
    // occurs when the game window is not the active
    // window on the browser, which causes the gems to fling
    // far right or left (as no above updates are made). When the
    // game window would become active again, the gems would
    // slowly make their way back to the canvas. With the code
    // below, if the gems are found far away from the canvas, the
    // app teleports them back to the canvas.
    if (this.x > 600 || this.x < -1500) {
        this.x = -70;
    };
}

// Objects are instatiated below.
// All enemy objects are placed in an array called allEnemies.
// All gem objects are created in an aray called allGems.
// A single player is built with an object variable called player.
var allEnemies = [
    new Enemy(-70, 54),
    new Enemy(-70, 54),
    new Enemy(-70, 137),
    new Enemy(-70, 137),
    new Enemy(-70, 220),
    new Enemy(-70, 220)
];

var allGems = [new Gem(-70, 119), new Gem(-70, 202), new Gem(-70, 285)];

var player = new Player (200, 386);


// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}) // Does this count as a function that doesn't need an ending semicolon?

// This sets the tile dimensions as variables for calculating row add-ons
// and player movements.
var tileWidth = 101;
var tileHeight = 83;

// This method takes in the key inputs from the user and moves the player
// accordingly. It also outlines certain consequences to specific movements.
Player.prototype.handleInput = function(key){
    switch(key) {
        case 'left':
            // This blocks the player from traveling to the left of the canvas space.
            if(this.x === -2) {
                this.x = -2;
            } else {
                this.x -= tileWidth;
            }
        break;

        case 'right':
            // This blocks the player from traveling to the right of the canvas space.
            if(this.x === 402) {
             this.x = 402;
            } else {
                this.x += tileWidth;
            }
        break;

        case 'up':
            // If user presses "up" while at this tile, then he has crossed victoriously
            // to the water. All consequences listed below.
            if(this.y === 54) {
                // The player returns to start point, which y changes as canvas grows.
                this.y = 386 + ((player.points + 1) * tileHeight);
                this.x = 200;

                // The points variable tracks the player's score and level. The app
                // uses this variable to calculate how many rows, bugs, and gems to add.
                this.points++;

                // The pointsGrande variable calculates the score, which is the points
                //value multiplied by 100, making the game more game-like and fun.
                this.pointsGrande = this.points * 100

                // This if statement updates the high score record to reflect the highest
                // score achieved by the user.
                if (this.pointsGrande > this.highScore) {
                    this.highScore = this.pointsGrande;
                }

                // This line automatically scrolls the browser window down to the bottom
                // of the screen, for ease of view of the avatar that has returned to the
                // start position in a vertically expanded canvas.
                window.scrollTo(0,document.body.scrollHeight);
            } else {
                this.y -= tileHeight;
            }
        break;

        case 'down':
            // This blocks the player from traveling below the canvas space.
            if(this.y === 386 + ((player.points) * tileHeight)) {
                this.y = 386 + ((player.points) * tileHeight);
            } else {
                this.y += tileHeight;
            }
        break;
    };
}
// I experimented with implementing the conditional ternary operator for the above if else
// statements, but it made them very hard to read. I kept the original if else format.


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
        };
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
        };
    });
}