var theCanvas = document.getElementById("mainCanvas");
var theCanvasHeight = theCanvas.height; 
var theCanvasWidth = theCanvas.width;
var gameOverLabel = document.getElementById("gameOverLabel");
var restartButton = document.getElementById("restartButton");
var scoreLabel = document.getElementById("scoreLabel");
var context = theCanvas.getContext("2d");
var memorySaver = 10;
var failedSound = new Audio('sounds/faildSound.mp3');


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
	speed = 800;
	speedUpRatio = 35;
	fromLeft = true;
	perfectCriteria = 20;
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
	drawStacks();
	drawVanishSquares();
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
	var currentStack = stacks[stacks.length-1];
	if(currentStack.x + currentWidth/2< leftEdge || currentStack.x - currentWidth/2 > rightEdge){
		gameOver();
	}

	if(Math.abs(currentStack.x - currentWidth/2 - leftEdge) < perfectCriteria
		&& ((fromLeft && currentStack.x - currentWidth/2 < leftEdge) || 
			(!fromLeft &&currentStack.x - currentWidth/2 > leftEdge))){
		currentStack.x = (rightEdge+leftEdge)/2;
		currentStack.color = "#0000FF"; 
		++combo;
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
		failedSound.play();
	}
	currentStack.velX = 0;
	fromLeft = !fromLeft;
	var yPos = currentStack.y - currentStack.height;
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