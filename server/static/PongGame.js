var PongGame = function(){
    this.setup();
    window.util.deltaTimeRequestAnimationFrame(this.draw.bind(this));
}
var socket = io.connect('http://192.168.1.19:3000/');

// character (paddle) and ball settings
var CHAR_WIDTH = 10;
var CHAR_HEIGHT = 60;
var CHAR_VEL = 4;
var BALL_VEL = 3;
var BALL_RADIUS = 12;

var LEFT =0;
var RIGHT = 1;

var leftScore = 0;
var rightScore = 0;

var reflect = false;
var leftY=0;
var rightY=0;
var gameOver = false;

// possible colors for balls
var ballColors = ['#f25a5a', '#e9f25a', '#85f25a', '#5af2c2', '#5ac2f2', 
        '#5a65f2', '#c07af6', '#f67ae9'];

// starts game
function start(){
    window.game.newBall(LEFT);
}

// helper; gives random int in given range
function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 



//==============================================
//SETUP
//==============================================

PongGame.prototype.setup = function(){
    window.util.patchRequestAnimationFrame();
    window.util.patchFnBind();
    this.initCanvas();
    this.initLeftCharacter();
    this.initRightCharacter();
}

PongGame.prototype.initCanvas = function(){
    this.body = $(document.body);
    this.body.width(document.body.offsetWidth);
    this.body.height(window.innerHeight - 20);
    this.width = $(window).width();
    this.height = $(window).height();
    this.canvas = window.util.makeAspectRatioCanvas(this.body, this.width/this.height);
    this.page = new ScaledPage(this.canvas, this.width);
};

PongGame.prototype.initLeftCharacter = function(){
    this.leftChar = new Character({'x': 0, 'y': this.height/2,
                            'width': CHAR_WIDTH, 'height': CHAR_HEIGHT,
                            'maxX': this.width, 'maxY': this.height});
    this.leftChar.speed = 0;
}

PongGame.prototype.initRightCharacter = function(){
    this.rightChar = new Character({'x': this.width-CHAR_WIDTH-0, 'y': this.height/2,
                            'width': CHAR_WIDTH, 'height': CHAR_HEIGHT,
                            'maxX': this.width, 'maxY': this.height});
    this.rightChar.speed = 0;
}

// makes a new ball (replaces previous ball and fires it)
PongGame.prototype.newBall = function(dir){
    reflect = false;

    if (dir == null){   // fire to the left if no direction specified
        dir = LEFT;
    }

    var randY = randomInt(50, this.height-70);
    var radius = BALL_RADIUS;
    var velX = BALL_VEL;

    if (dir == LEFT){   // set direction to fire to the left
        velX = -velX;
    }

    var velY = BALL_VEL;
    var randColor = ballColors[randomInt(0, ballColors.length-1)];

    this.ball = new Ball({'style': randColor, 'x': this.width/2, 'y': randY, 'radius': radius, 
        'maxX': this.width, 'maxY': this.height});
    this.ball.velx = velX;
    this.ball.vely = velY;
}

//==============================================
//DRAWING
//==============================================

PongGame.prototype.draw = function(timeDiff){
    // update stuff every frame
    this.clearPage();
    this.showScore();
    this.drawDivider();
    this.drawBall(timeDiff, this.ball);
    this.drawChar(timeDiff);
    this.updateChar();
    this.detectCrash();
    this.detectScore();
}

PongGame.prototype.clearPage = function(){
    this.page.fillRect(0, 0, this.width, this.height, '#fff');
}

// draw characters
PongGame.prototype.drawChar = function(timeDiff){
    this.leftChar.update(timeDiff);
    this.leftChar.draw(this.page);
    this.rightChar.update(timeDiff);
    this.rightChar.draw(this.page);
}

// update character speeds with input from accelerometer
PongGame.prototype.updateChar = function(){
    leftY = (leftY === undefined || leftY === null) ? 0 : leftY;
    rightY =(rightY=== undefined || rightY=== null) ? 0 : rightY;
    this.leftChar.speed = CHAR_VEL * (leftY === 0 ? 0 : leftY < 0 ? -1 : 1) * 2 * (Math.abs(leftY)/10);
    this.rightChar.speed = CHAR_VEL *(rightY=== 0 ? 0 : rightY< 0 ? -1 : 1) * 2 * (Math.abs(rightY)/10);
}


// draw ball
PongGame.prototype.drawBall = function(timeDiff, ball){
    var update = ball.update(timeDiff);
    if (update === true){
        ball.draw(this.page);
    }
}

// see if paddle hits ball and reverse ball direction when hit
PongGame.prototype.detectCrash = function(){
    var leftX = this.leftChar.x;
    var leftTop = this.leftChar.y;
    var leftBottom = this.leftChar.y+this.leftChar.height;

    var rightX = this.rightChar.x;
    var rightTop = this.rightChar.y;
    var rightBottom = this.rightChar.y+this.rightChar.height;


    if (this.ball.x-this.ball.radius <= leftX+this.leftChar.width && this.ball.y > leftTop && this.ball.y < leftBottom){
        this.ball.reverseX();
    }
    if (this.ball.x+this.ball.radius >= rightX && this.ball.y > rightTop && this.ball.y < rightBottom){
        this.ball.reverseX();
    }
}

// see if one player scored and update score
PongGame.prototype.detectScore = function(){
    if (this.ball.x - this.ball.radius < 0){
        rightScore++;
        this.newBall(LEFT);
    }
    else if(this.ball.x + this.ball.radius > this.ball.maxX){
        leftScore++;
        this.newBall(RIGHT);
    }
}

// display score and player number
PongGame.prototype.showScore = function() {
    this.page.writeText(leftScore, this.width/4-30, 80, "#666", "80px Arial", "left");
    this.page.writeText(rightScore, this.width/4*3-30, 80, "#666", "80px Arial", "left");

    this.page.writeText("P1", this.width/4-200, this.height/2+this.height/5, "#ddd", "300px Arial", "left");
    this.page.writeText("P2", this.width/4*3-200, this.height/2+this.height/5, "#ddd", "300px Arial", "left");
}

// draw divider line between 2 halves of court
PongGame.prototype.drawDivider = function(){
    this.page.fillRect(this.width/2, 0, 2, this.height, '#ddd');
}

