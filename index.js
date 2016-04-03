var theCanvas = document.getElementById("mainCanvas");
if(screen.width < 400){
	theCanvas.width *=2;
	theCanvas.height *=2;
}
var theCanvasHeight = theCanvas.height; 
var theCanvasWidth = theCanvas.width;
var gameOverLabel = document.getElementById("gameOverLabel");
var restartButton = document.getElementById("restartButton");
var scoreLabel = document.getElementById("scoreLabel");
var context = theCanvas.getContext("2d");
var memorySaver = 10;
var orginalSpeed =  2.5*theCanvasWidth;
var failedSound = new Audio('sounds/faildSound.mp3');
var comboSounds = [new Audio('sounds/combo1.mp3'),
					new Audio('sounds/combo2.mp3'),
					new Audio('sounds/combo3.mp3'),
					new Audio('sounds/combo4.mp3'),
					new Audio('sounds/combo5.mp3'),
					new Audio('sounds/combo6.mp3'),
					new Audio('sounds/combo7.mp3'),
					new Audio('sounds/combo8.mp3')];
failedSound.volume = .2;
for(se in comboSounds){
	se.volume = 1;
}

var stacks;
var currentWidth;
var leftEdge;
var rightEdge;
var speed;
var fromLeft;
var index;
var speedUpRatio;
var perfectCriteria;
var combo;
var vanishSquares;

function init(){
	combo = 0;
	theCanvas.style.display = "block";
	restartButton.style.display = "none";
	gameOverLabel.style.display = "none";
	scoreLabel.style.display = "none";
	currentWidth = theCanvasWidth;
	leftEdge = 0;
	rightEdge = theCanvasWidth;
	speed = orginalSpeed;
	speedUpRatio = theCanvasWidth/20;
	fromLeft = true;
	perfectCriteria = theCanvasWidth/20;
	addListeners();
	index = 0;
	stacks = [];
	vanishSquares = [];
	stacks.push(new SimpleSquareParticle(fromLeft, index++,currentWidth, speed, theCanvas, 0));
	timer = setInterval(onTimerTick, 1000/30);
}


function addListeners(){
	theCanvas.addEventListener('mousedown', mouseDownListener, false);
	theCanvas.addEventListener('touchstart', touchDownListener, false);
}

function moveStack() {
	var i;
	for(i=stacks.length-1; i>=0 && i > stacks.length-memorySaver; --i){
		stacks[i].move();
	}
	for(i = vanishSquares.length-1; i>=0 && i >vanishSquares.length-memorySaver; --i){
		if(vanishSquares[i].isVanishing){
			vanishSquares[i].vanish();
		}
		vanishSquares[i].move();
	}
}

function drawScreen() {
	context.fillStyle = "#FFFFFF";
	context.fillRect(0,0,theCanvasWidth,theCanvasHeight);
	writeScore();
	drawStacks();
	drawVanishSquares();
}

function writeScore(){
	context.font = "60px Comic Sans MS";
	context.fillStyle = "black";
	context.textAlign = "center";
	context.fillText(index-1,theCanvasWidth/2,theCanvasHeight/6.5);
}

function drawVanishSquares(){
	var i;
	for(i = vanishSquares.length-1; i>=0 && i >vanishSquares.length-memorySaver; --i){
		vanishSquares[i].drawToContext(context);
	}
}

function drawStacks(){
	var i;
	for(i = stacks.length-1; i>=0 && i >stacks.length-memorySaver; --i){
		stacks[i].drawToContext(context);
	}
}

function mouseDownListener(evt){
	var bRect = theCanvas.getBoundingClientRect();
	touchX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
	touchY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);
	inputDownLinstener(touchX, touchY);
}

function touchDownListener(evt){
	evt.preventDefault();	evt.stopPropagation();
	var bRect = theCanvas.getBoundingClientRect();
	var touches = evt.changedTouches;
	touchX = (touches[0].pageX - bRect.left)*(theCanvas.width/bRect.width);
	touchY = (touches[0].pageY - bRect.top)*(theCanvas.height/bRect.height);
	inputDownLinstener(touchX, touchY);
}

function inputDownLinstener(touchX, touchY){
	speed+=speedUpRatio;
	// if(speed > theCanvasWidth*5.5){
	// 	speed = 2.5*theCanvasWidth;
	// 	speedUpRatio*1.3;
	// }
	var currentStack = stacks[stacks.length-1];
	if(currentStack.x + currentWidth/2< leftEdge || currentStack.x - currentWidth/2 > rightEdge){
		gameOver();
	}

	if(Math.abs(currentStack.x - currentWidth/2 - leftEdge) < perfectCriteria
		&& ((fromLeft && currentStack.x - currentWidth/2 < leftEdge+perfectCriteria/4) || 
			(!fromLeft &&currentStack.x - currentWidth/2 > leftEdge-perfectCriteria/4))
		){
		currentStack.x = (rightEdge+leftEdge)/2;
		currentStack.color = "#0000FF"; 
		var comboIndex = combo>7?7:combo;
		comboSounds[comboIndex].play();
		++combo;
		if(combo > 5){
			var TargetLeft = Math.max(leftEdge-theCanvas.width/25,0);
			var TargetRight = Math.min(rightEdge+theCanvas.width/25,theCanvas.width);
			leftEdge = TargetLeft;
			rightEdge = TargetRight;
			currentStack.inflate(TargetLeft, TargetRight);
			currentWidth = TargetRight-TargetLeft;
		}
	}else{
		combo = 0;
		var vanishSquare;
		var xPos;
		var wid;
		//xPos, yPos, width, theCanvas
		if(currentStack.x - currentWidth/2 < leftEdge){
			xPos = (currentStack.x - currentWidth/2 + leftEdge)/2;
			wid = (leftEdge-xPos)*2;
		}else{
			xPos = (currentStack.x + currentWidth/2 + rightEdge)/2;
			wid = (xPos-rightEdge)*2;
			
		}
		vanishSquare = new VanishSquareParticle(xPos, currentStack.y, wid, theCanvas);
		vanishSquares.push(vanishSquare);
		leftEdge = Math.max(leftEdge, currentStack.x - currentWidth/2);
		rightEdge = Math.min(rightEdge, currentStack.x + currentWidth/2);
		currentWidth = rightEdge -leftEdge;
		currentStack.x = (rightEdge+leftEdge)/2;
		currentStack.width = currentWidth;
		currentStack.inflate(leftEdge,rightEdge);
		failedSound.play();
	}
	currentStack.velX = 0;
	fromLeft = !fromLeft;
	var yPos = currentStack.y - currentStack.height;
	if((index-1)%50==0){
		speed = orginalSpeed;
		speedUpRatio *= 1.1;
	}
	stacks.push(new SimpleSquareParticle(fromLeft, index++, currentWidth, speed, theCanvas, yPos));
	stacks[stacks.length-1].yDistance += currentStack.yDistance;
	cameraUp();
}

function cameraUp(){
	if(stacks.length <=5){ return; }
	var i;
	for(i=stacks.length-1; i>=0 && i > stacks.length-memorySaver; --i){
		stacks[i].yDistance += theCanvas.height/9;
		stacks[i].velY = stacks[i].yDistance/15;
	}
	for(i = vanishSquares.length-1; i>=0 && i > vanishSquares.length-memorySaver; --i){
		vanishSquares[i].yDistance += theCanvas.height/9;
		vanishSquares[i].velY = vanishSquares[i].yDistance/15;
	}
}

function gameOver(){
	theCanvas.style.display = "none";
	gameOverLabel.style.display = "block";
	restartButton.style.display = "block";
	scoreLabel.innerHTML = index;
	scoreLabel.style.display = "block";
	clearInterval(timer);
}

function onTimerTick(){
	moveStack();
	drawScreen();
}


init();