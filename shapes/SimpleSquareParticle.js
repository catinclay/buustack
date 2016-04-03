// Simple class example

function SimpleSquareParticle(fromLeft, index, width, speed, theCanvas, yPos) {
	this.width = width;
	this.height = theCanvas.height/9;
	this.fromLeft = fromLeft;
	if(fromLeft){
		this.x = -this.width/2;
		this.velX = speed/100;
	}else{
		this.x = theCanvas.width + this.width/2;
		this.velX = -speed/100;
	}

	this.offset = index>5? 5:index;
	if(index <= 5){
		this.y = theCanvas.height - this.height/2 -(this.offset * this.height);
	}else{
		this.y = yPos;
	}
	this.yDistance = 0;
	this.velY = 0;
	this.color = "#333333";
	this.targetLeft = this.x - this.width/2;
	this.targetRight = this.x + this.width/2;
}

SimpleSquareParticle.prototype.inflate = function(left, right){
	this.targetLeft = left;
	this.targetRight = right;
}

SimpleSquareParticle.prototype.move = function() {
	this.x += this.velX;
	this.y += this.velY;
	this.yDistance -= this.velY;
	if(this.yDistance < 0){
		this.y += this.yDistance;
		this.yDistance = 0;
		this.velY = 0;
	}
	var targetWid = this.targetRight-this.targetLeft;
	this.width = this.width+0.3*(targetWid-this.width);
	if(targetWid-this.width <10){
		this.width = targetWid;
	}
}

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
// SimpleSquareParticle.prototype.hitTest = function(hitX,hitY) {
// 	return((hitX > this.x - this.radius)&&(hitX < this.x + this.radius)&&(hitY > this.y - this.radius)&&(hitY < this.y + this.radius));
// }

//A function for drawing the particle.
SimpleSquareParticle.prototype.drawToContext = function(theContext) {
	theContext.fillStyle = this.color;
	theContext.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
	// theContext.fillRect(100, 100, 200, 200);
}