var score;

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.y = randomYPosition(); //Gets the row for the enemy to follow.
    this.x = 0;
    this.speed = (Math.floor((Math.random() * 200)+50));
}

// Creates 3 rows for the enemies to follow. A random row is created for the path.
var randomYPosition = function() {
    var enemyRow = [78, 161, 244];
    var yIndex = (Math.floor((Math.random() * enemyRow.length)));
    return enemyRow[yIndex];
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Return enemy to the left side of the screen when it reaches
// the right side of canvas
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.x = -100;
        this.y = randomYPosition()
    }
    checkCollisions();
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player class for image file and start location
var Player = function() {
    this.sprite ='images/char-boy.png'
    this.x = 202; // initial x location
    this.y = 410; // initial y location
    score = 0;
}

// Resets player touching the water
Player.prototype.update = function() {
    if (this.y == -5) {
        playerScore(10); // add 10 points to the score every time player reaches water
        player.reset()
    }
}

//Receives reset command from update function
//sends player back to start position
Player.prototype.reset = function(){
    this.x = 202;
    this.y = 410;
}

// Moves player in direction of keyboard command
Player.prototype.handleInput = function(keyCode) {
    if(keyCode === 'left' && this.x > 0) {
        this.x -= 101
    } else if(keyCode ==='up' && this.y > 0) {
        playerScore(1); //add 1 point to score for every move forward
        this.y -= 83
    } else if(keyCode === 'right' && this.x < 404) {
        this.x += 101
    } else if(keyCode === 'down' && this.y < 410) {
        this.y += 83
    }
}

// Adds player image and the score to the canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "18pt Impact";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 350, 550);
}

// Place all enemy objects in an array called allEnemies
function createEnemies() {
    var enemyCount = 6;
    for (var i = 0; i < enemyCount; i++) {
        var newEnemy = new Enemy();
        allEnemies.push(newEnemy);
    }
}

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

// Check for collisions with enemies and gems
// When an enemy and player occupy the same square return player to start position
function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        if (player.y === enemy.y) {
            if (((player.x + 20) < (enemy.x + 20) && ((player.x + 80) > (enemy.x + 20))) || 
                ((player.x  > enemy.x) && (player.x < (enemy.x + 90)))) {
                player.reset();
            }
        };
    });
// When a player reaches a gem create another gem at a random location and add points to score.
    if (player.y + 42 === gem.y && player.x + 20 === gem.x) {
        gem = new Gem();
        playerScore(gem.points);
    }
}

// Adds to the current score
function playerScore(point) {
    score = score + point;
}

//Create a Gem object and add a point total to each gem color
var Gem = function() {
    var gemColors = ["green", "orange", "blue"];
    var gemIndex = (Math.floor((Math.random() * gemColors.length)));
    switch(gemIndex) {
        case 0:
        this.sprite = 'images/Gem-Green.png';
        this.points = 10
        break;
        case 1:
        this.sprite = 'images/Gem-Orange.png';
        this.points = 20
        break;
        case 2:
        this.sprite = 'images/Gem-Blue.png';
        this.points = 30
        break;
    } 
    var gemRow = [120, 203, 286];
    var gemCol = [20, 121, 222, 323, 424];
    this.x = gemCol[(Math.floor((Math.random() * gemCol.length)))];
    this.y = gemRow[(Math.floor((Math.random() * gemRow.length)))];
}

// Adds gem to canvas
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 60, 80);
}


// Instantiates the objects
var allEnemies = [];
createEnemies();
var player = new Player();
var gem = new Gem();