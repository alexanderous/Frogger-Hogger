

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * (220 - 40) + 40);
    this.sprite = 'images/enemy-bug.png';

};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += dt * this.speed;
    if(this.x > 505) {
        this.x = -70;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';

    this.x = x;
    this.y = y;
    this.points = 0;
    this.pointsGrande = this.points;
    this.highScore = 0;

};

Player.prototype.update = function() {
    //this.score = this.points +
    document.querySelector("#wordbar").innerHTML = "SCORE: " + this.pointsGrande;
    document.querySelector("#wordbar2").innerHTML = "HIGH SCORE: " + this.highScore;
    //document.querySelector("#gameover").innerHTML = '<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"><p>Game Over!</p><p>Your Score: '
    //+ this.pointsGrande + "</p><p>High Score: " + this.highScore + "</p>";
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Gem = function(x, y) {
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * (220 - 40) + 40);
/*     var gemImages = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ];
    var blueImage = ""
    var greenImage = "" */
};


Gem.prototype.render = function() {
    this.sprite = 'images/GemOrangeSmall.png';
    /* var gemImages = [
            'images/Gem Blue.png',
            'images/Gem Green.png',
            'images/Gem Orange.png'
        ],
        colu; */

    //for (colu = 0; colu < 4; colu++) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    //};
};

Gem.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //this.x += dt * this.speed;
    if (this.x > 445) {
        this.east = false;
    } else if (this.x < 15) {
        this.east = true;
    };

    if (this.east === true) {
        this.x += dt * this.speed;
    } else {
        this.x -= dt * this.speed;
    };



    /*this.y += dt * this.speed;
    if(this.y > 300 + (player.points * 83)) {
        this.y = dt * this.speed;
    };
    if(this.y < 0) {
        this.y += dt * this.speed;
    } */

};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

/* var BlueGem = function (x, y) {
    Gem.call(this, (x, y));
    this.sprite = 'images/Gem Blue.png';
};

BlueGem.protoype = Object.create(Gem.prototype);
BlueGem.prototype.constructor = BlueGem;
BlueGem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
*/

//var OrangeGem

//var GreenGem





var allEnemies = [new Enemy(-70, 54), new Enemy(-70, 54), new Enemy(-70, 137),
                    new Enemy(-70, 137), new Enemy(-70, 220), new Enemy(-70, 220)];

var allGems = [new Gem(-70, 119), new Gem(-70, 202), new Gem(-70, 285)];

/* var allGems = [new Gem(25, -70), new Gem(126, -70), new Gem(227, -70),
                new Gem(328, -70), new Gem(429, -70)]; */
//var blueGem = new Gem(-2, -70);
//var allOrangeGems = [new Gem(99, -70), new Gem(200, -70), new Gem(301, -70)];
//var greenGem = new Gem(402,-70);


var player = new Player (200, 386);




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

var tileWidth = 101;
var tileHeight = 83;

Player.prototype.handleInput = function(key){
    switch(key) {
        case 'left':
            if(this.x === -2) {
                this.x = -2;
            } else {
                this.x -= tileWidth;
            }
        break;

        case 'right':
            if(this.x === 402) {
             this.x = 402;
            } else {
                this.x += tileWidth;
            }
        break;

// reset player to original position after reaching water

        case 'up':
            if(this.y === 54) {
                this.y = 386 + ((player.points + 1) * tileHeight);
                this.x = 200;
                this.points++;
                this.pointsGrande = this.points * 100
                if (this.pointsGrande > this.highScore) {
                    this.highScore = this.pointsGrande;
                }
                // When the canvas expands downward, this makes
                // the site scroll down to the bottom of the page
                // for ease of view of the avatar (which returned
                // to the start location).
                $( "#scorenotice" ).fadeIn( "slow");
                window.scrollTo(0,document.body.scrollHeight);

            } else {
                this.y -= tileHeight;
            }
        break;

        case 'down':
            if(this.y === 386 + ((player.points) * tileHeight)) {
                this.y = 386 + ((player.points) * tileHeight);
            } else {
                this.y += tileHeight;
            }
        break;
    };
};




/* if(Player.x) */

/*console.log(ctx); */

/* var Person = function(name) {
    this.name = name;
};

Person.prototype.display = function(greeting)
{
    console.log(greeting + " " + this.name);
};

var new_person = new Person("Poornima");
new_person.display("Good evening") ;
} */

/* function draw() {
    // request to execute this function at the next earliest convenience
    requestAnimationFrame(draw);
    processInput();
    moveObjectsAndEnemies();
    drawAllTheThings();
}; */


//document.querySelector("#wordbar").innerHTML = "SCORE: "// + player.score;​