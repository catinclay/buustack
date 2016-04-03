// Simple class example

function VanishSquareParticle(xPos, yPos, width, theCanvas) {
	this.width = width;
	this.height = theCanvas.height/9;
	this.offset = index>5? 5:index;

	this.y = yPos;
	this.x = xPos;
	this.yDistance = 0;
	this.velY = 0;
	this.r = this.g = this.b = 0;
	this.a = 1;
	this.color = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	
	this.isVanishing = true;
	this.vanishEase = 0.85;
}

VanishSquareParticle.prototype.move = function() {
	this.y += this.velY;
	this.yDistance -= this.velY;
	if(this.yDistance < 0){
		this.y += this.yDistance;
		this.yDistance = 0;
		this.velY = 0;
	}
}

VanishSquareParticle.prototype.vanish = function (){
	this.width*= this.vanishEase;
	this.height*= this.vanishEase;
	this.a *= this.vanishEase;
	if(this.width <= 10){
		isVanishing = false;
	}
}

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
// SimpleSquareParticle.prototype.hitTest = function(hitX,hitY) {
// 	return((hitX > this.x - this.radius)&&(hitX < this.x + this.radius)&&(hitY > this.y - this.radius)&&(hitY < this.y + this.radius));
// }

//A function for drawing the particle.
VanishSquareParticle.prototype.drawToContext = function(theContext) {
	theContext.fillStyle = this.color;
	theContext.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
	// theContext.fillRect(100, 100, 200, 200);
}