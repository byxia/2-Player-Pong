
var Character = function(config){
    this.style = config.style || '#edad5b';
    this.width = config.width;
    this.height = config.height;

    this.speed = 0;

    // this.damping = config.damping || 1.5;

    this.x = config.x;
    this.y = config.y;

    this.maxX = config.maxX;
    this.maxY = config.maxY;

}

Character.prototype.update = function(timeDiff){
    this.y += this.speed*timeDiff/20;

    if (this.y < 0){
        this.y = 0;
    }
    else if (this.y + this.height > this.maxY){
        this.y = this.maxY - this.height;
    }

}

Character.prototype.draw = function(scaledPage){
    scaledPage.fillRect(this.x, this.y, this.width, this.height, this.style);
}