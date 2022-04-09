//extension: I have added two extensions which is platform and sound. For platforms extension I have learned how to write a constructor function, I have found it to be confusing at first about the 'this' keyword but once I understood the code. I think I am confident writing this type of function in the future. For the second extension I have choosen sound. I have learnt to import sound and organizing folder so that the sound is enabled. I have learned about p5.js sound library as well.  

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var collectables;
var mountains;
var clouds; 
var canyons;

var game_score;
var flagpole;
var flagWidth;
var flagHeight;
var lives;

//extension
var platforms; 
var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
	lives = 3;
	startGame();
}

function startGame()
{
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	scrollPos = 0;
	gameChar_world_x = gameChar_x - scrollPos;
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	isFound = false;
	game_score = 0;
	flagHeight = 10;
	flagWidth = 10;
	flagpole = {isReached: false, x_pos: 2200};
	trees_x = [
		100,
		300,
		450,
		1000,
		1200,
		1550,
		1800,
		1900
	];
	collectables = [
		{pos_x:250, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:550, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:665, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:800, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:980, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:1200, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:1360, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:1400, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:1600, pos_y: floorPos_y - 15, size: 40, isFound: false},
		{pos_x:1800, pos_y: floorPos_y - 15, size: 40, isFound: false}
	];
	mountains = [
		900,
		1000,
		500,
		200
	];
	clouds = [
		{pos_x: 200, pos_y: 150},
		{pos_x: 160, pos_y: 150},
		{pos_x: 240, pos_y: 150},
		{pos_x: 400, pos_y: 120},
		{pos_x: 360, pos_y: 120},
		{pos_x: 440, pos_y: 120},
		{pos_x: 650, pos_y: 130},
		{pos_x: 610, pos_y: 130},
		{pos_x: 690, pos_y: 130},
		{pos_x: 820, pos_y: 150},
		{pos_x: 790, pos_y: 150},
		{pos_x: 860, pos_y: 150},
		{pos_x: 920, pos_y: 120},
		{pos_x: 880, pos_y: 120},
		{pos_x: 960, pos_y: 120},
		{pos_x: 1200, pos_y: 130},
		{pos_x: 1000, pos_y: 130},
		{pos_x: 1260, pos_y: 130},
		{pos_x: 1400, pos_y: 150},
		{pos_x: 1350, pos_y: 150},
		{pos_x: 1460, pos_y: 150},
		{pos_x: 1600, pos_y: 120},
		{pos_x: 1550, pos_y: 120},
		{pos_x: 1600, pos_y: 120},
		{pos_x: 1900, pos_y: 130},
		{pos_x: 1850, pos_y: 130},
		{pos_x: 1960, pos_y: 130}
	];
	canyon = [
		{pos_x: 100, width: 50},
		{pos_x: 600, width: 50},
		{pos_x: 700, width: 50},
		{pos_x: 900, width: 50},
		{pos_x: 1100, width: 50},
		{pos_x: 1300, width: 50},
		{pos_x: 1500, width: 50},
		{pos_x: 1700, width: 50}
	];
	platforms = [];
	platforms.push(createPlatforms(350,floorPos_y - 80,100));
	platforms.push(createPlatforms(750,floorPos_y - 80,100));
	platforms.push(createPlatforms(1200,floorPos_y - 80,100));
	platforms.push(createPlatforms(750,floorPos_y - 80,100));
}

function draw()
{
	background(100, 155, 255);
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 
	//screen scrolling
	push();
	translate(scrollPos, 0)
	drawClouds();
	drawMountains();
	drawTrees();
	
	for(var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}

	for(var i = 0; i < canyon.length; i++)
	{
		drawCanyon(canyon[i]);
	    checkCanyon(canyon[i]);
	}

	for(var i = 0; i < collectables.length; i++) 
	{
		if(!collectables[i].isFound)
		{
			drawCollectable(collectables[i]);
		    checkCollectable(collectables[i]);
		}
	}
	
	renderFlagpole(); 
	pop();
	drawGameChar();
	drawGameScore();
	drawLivesToken();
	checkFlagpole();
	checkPlayerDie();
	
	if(lives < 1)
	{
		fill(255,215,0);
		textSize(100);
		text("Game over!", 250,200);
		fill(255,69,0);
		textSize(20);
		text("Press space to continue", 400, 230);
		return;
	}
	
	if(flagpole.isReached)
	{
		fill(255,218,185);
		textSize(70);
		text("Level complete!", 250,200);
		fill(255,69,0);
		textSize(20);
		text("Press space to continue", 400, 230);
		return;
	} 
	
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; 
		}
	}
	
	if(gameChar_y < floorPos_y)
	{
		var isContact = false; 
		for(var i = 0; i < platforms.length; i++) 
		{
			if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
			{
				isContact = true;
				break;
			}
		}
		if(isContact == false)
		{
			gameChar_y += 2;
			isPlummeting = true; 	
		}
	}
	else 
		{
			isPlummeting = false;
		}
	gameChar_world_x = gameChar_x - scrollPos;
}

function keyPressed()
{

	if(key == 'A' || keyCode == 37)
	{
		isLeft = true;
	}
	
	if(key == 'D' || keyCode == 39)
	{
		isRight = true;
	}
	
	if(key == ' ' || key == 'W')
	{
		if(!isFalling)
		{
			gameChar_y -= 100;
			jumpSound.play();
		}
	}
} 

function keyReleased()
{
	if(key == 'A' || keyCode == 37)
	{
		isLeft = false;
	}
	
	if(key == 'D' || keyCode == 39)
	{
		isRight = false;
	}
}

function checkPlayerDie()
{
	if(gameChar_y > height && lives > 0)
	{
		lives -= 1;
		if(lives > 0)
		{
			startGame();
		}
	}
}

function drawGameChar()
{
	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x +13, gameChar_y -30, 2,15,3)
		rect(gameChar_x +10, gameChar_y -26, 2,15,3)
	
		//ninja's red band
		fill(230,43,43)
		ellipse(gameChar_x +11, gameChar_y -30, 9)
		
		//leg (left)
		fill(0)
		rect(gameChar_x -13,gameChar_y -6, 6,10)
	
		//leg (right)
		fill(31,48,80)
		rect(gameChar_x -3 , gameChar_y -6,6,10)
	
		//body
		fill(31,48,80)
		rect(gameChar_x -20, gameChar_y -35, 30,30,7)
	
		//eyes
		fill(255,255,255)
		ellipse(gameChar_x -13, gameChar_y -23, 10)
		ellipse(gameChar_x -5, gameChar_y -23, 10)
	
		//eyeballs
		fill(44,56,99)
		ellipse(gameChar_x -15, gameChar_y -23, 3)
		ellipse(gameChar_x -7, gameChar_y -23, 3)
	
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x -21, gameChar_y -33, 32,7)

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x -15, gameChar_y -30, 2,15,3)
		rect(gameChar_x -12, gameChar_y -26, 2,15,3)
	
		//ninja's red band
		fill(230,43,43)
		ellipse(gameChar_x -11, gameChar_y -30, 9)
		
		//leg (left)
		fill(0)
		rect(gameChar_x +7,gameChar_y -6, 6,10)
	
		//leg (right)
		fill(31,48,80)
		rect(gameChar_x -4, gameChar_y -6,6,10)
	
		//body
		fill(31,48,80)
		rect(gameChar_x -10, gameChar_y -35, 30,30,7)
	
		//eyes
		fill(255,255,255)
		ellipse(gameChar_x +12, gameChar_y -23, 10)
		ellipse(gameChar_x +5, gameChar_y -23, 10)
	
		//eyeballs
		fill(44,56,99)
		ellipse(gameChar_x +14, gameChar_y -23, 3)
		ellipse(gameChar_x +6, gameChar_y -23, 3)
	
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x -11, gameChar_y -33, 32,7)

	}
	else if(isLeft)
	{
		// add your walking left code
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x +13, gameChar_y -27, 2,15,3)
		rect(gameChar_x +10, gameChar_y -23, 2,15,3)
	
		//ninja's red band
		fill(230,43,43)
		ellipse(gameChar_x +11, gameChar_y -27, 9)
		
		//leg (left)
		fill(0)
		rect(gameChar_x -13,gameChar_y -3, 6,6)
	
		//leg (right)
		fill(31,48,80)
		rect(gameChar_x -3 , gameChar_y -3,6,6)
	
		//body
		fill(31,48,80)
		rect(gameChar_x -20, gameChar_y -32, 30,30,7)
	
		//eyes
		fill(255,255,255)
		ellipse(gameChar_x -13, gameChar_y -20, 10)
		ellipse(gameChar_x -5, gameChar_y -20, 10)
	
		//eyeballs
		fill(44,56,99)
		ellipse(gameChar_x -15, gameChar_y -20, 3)
		ellipse(gameChar_x -7, gameChar_y -20, 3)
	
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x -21, gameChar_y -30, 32,7)

	}
	else if(isRight)
	{
		// add your walking right code
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x -15, gameChar_y -27, 2,15,3)
		rect(gameChar_x -12, gameChar_y -23, 2,15,3)
		
		//ninja's red band
		fill(230,43,43)
		ellipse(gameChar_x -11, gameChar_y -27, 9)
		
		//leg (left)
		fill(0)
		rect(gameChar_x +7,gameChar_y -3, 6,6)
	
		//leg (right)
		fill(31,48,80)
		rect(gameChar_x -4, gameChar_y -3,6,6)
	
		//body
		fill(31,48,80)
		rect(gameChar_x -10, gameChar_y -32, 30,30,7)
	
		//eyes
		fill(255,255,255)
		ellipse(gameChar_x +12, gameChar_y -20, 10)
		ellipse(gameChar_x +5, gameChar_y -20, 10)
	
		//eyeballs
		fill(44,56,99)
		ellipse(gameChar_x +14, gameChar_y -20, 3)
		ellipse(gameChar_x +6, gameChar_y -20, 3)
	
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x -11, gameChar_y -30, 32,7)
		
	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x +13, gameChar_y -30, 2,15,3)
		rect(gameChar_x +10, gameChar_y -26, 2,15,3)
	
		//ninja's red band
		fill(230,43,43)
		ellipse(gameChar_x +11, gameChar_y -30, 9)
		
		//leg (left)
		fill(0)
		rect(gameChar_x -13,gameChar_y -6, 6,10)
	
		//leg (right)
		fill(31,48,80)
		rect(gameChar_x -3 , gameChar_y -6,6,10)
	
		//body
		fill(31,48,80)
		rect(gameChar_x -20, gameChar_y -35, 30,30,7)
	
		//eyes
		fill(255,255,255)
		ellipse(gameChar_x -10, gameChar_y -23, 10)
		ellipse(gameChar_x, gameChar_y -23, 10)
	
		//eyeballs
		fill(44,56,99)
		ellipse(gameChar_x -10, gameChar_y -23, 3)
		ellipse(gameChar_x, gameChar_y -23, 3)
	
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x -21, gameChar_y -33, 32,7)

	}
	else
	{
		// add your standing front facing code
		//ninja's orange band
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x +13, gameChar_y -27, 2,15,3)
		rect(gameChar_x +10, gameChar_y -23, 2,15,3)
	
		//ninja's red band
		fill(230,43,43)
		ellipse(gameChar_x +11, gameChar_y -27, 9)
		
		//leg (left)
		fill(0)
		rect(gameChar_x -13,gameChar_y -3, 6,6)
	
		//leg (right)
		fill(31,48,80)
		rect(gameChar_x -3 , gameChar_y -3,6,6)
	
		//body
		fill(31,48,80)
		rect(gameChar_x -20, gameChar_y -32, 30,30,7)
	
		//eyes
		fill(255,255,255)
		ellipse(gameChar_x -10, gameChar_y -20, 10)
		ellipse(gameChar_x, gameChar_y -20, 10)
	
		//eyeballs
		fill(44,56,99)
		ellipse(gameChar_x -10, gameChar_y -20, 3)
		ellipse(gameChar_x, gameChar_y -20, 3)
	
		//ninja's orange band
		fill(249,129,42)
		rect(gameChar_x -21, gameChar_y -30, 32,7)
	}
}

function drawClouds()
{
	for(var i = 0; i < clouds.length; i++) 
	{
		fill(255);
		//#1 cloud
		ellipse(clouds[i].pos_x,clouds[i].pos_y,80,80)
		ellipse(clouds[i].pos_x,clouds[i].pos_y,60,60)
		ellipse(clouds[i].pos_x,clouds[i].pos_y,60,60)
		//#2 cloud
		ellipse(clouds[i].pos_x,clouds[i].pos_y,80,80)
		ellipse(clouds[i].pos_x,clouds[i].pos_y,60,60)
		ellipse(clouds[i].pos_x,clouds[i].pos_y,60,60)
	 	//#3 cloud
		ellipse(clouds[i].pos_x,clouds[i].pos_y,80,80)
		ellipse(clouds[i].pos_x,clouds[i].pos_y,60,60)
		ellipse(clouds[i].pos_x,clouds[i].pos_y,60,60)
	}
}

function drawMountains()
{
	for(var i = 0; i < mountains.length; i++) 
	{
		fill(140,109,98)		
		triangle(mountains[i] + 700, -95/50 + floorPos_y, 
				 mountains[i] + 780, -300 + floorPos_y, 
				 mountains[i] + 900, -95/50 + floorPos_y)	
	}
}

function drawTrees() 
{
	for (var i = 0; i < trees_x.length; i++) 
	{
		fill(77, 51, 45);
		rect(75 + trees_x[i], -200/2 + floorPos_y, 50,200/2);
		fill(45, 124, 49)
		triangle(trees_x[i] + 25, -200/2 + floorPos_y, 
				 trees_x[i] + 100,-200 + floorPos_y, 
				 trees_x[i] + 175, -200/2 + floorPos_y);
		triangle(trees_x[i] , -200/4 + floorPos_y,
				 trees_x[i] + 100, -200*3/4 + floorPos_y,
				 trees_x[i] + 200, -200/4 + floorPos_y);
	}
}

function drawCanyon(t_canyon)
{
	fill(76,207,224);
	noStroke();
	rect(t_canyon.pos_x,floorPos_y,t_canyon.width, 318)
}

function checkCanyon(t_canyon)
{
	if(gameChar_world_x > t_canyon.pos_x && gameChar_world_x < t_canyon.pos_x + t_canyon.width && gameChar_y >= t_canyon.width)
	{
		isPlummeting = true; 
		gameChar_y += 5;
		console.log('fall')
	}
}

function renderFlagpole()
{
	push();
	strokeWeight(5);
	stroke(180)
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
	
	fill(255,0,255)
	noStroke();
	if(flagpole.isReached)
	{
		fill(0,0,0)
		rect(flagpole.x_pos, floorPos_y - 250, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 10, floorPos_y - 250, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 20, floorPos_y - 250, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 30, floorPos_y - 250, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 40, floorPos_y - 250, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 50, floorPos_y - 250, flagWidth, flagHeight)
				
	    fill(255,255,255)
		rect(flagpole.x_pos, floorPos_y - 240, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 10, floorPos_y - 240, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 20, floorPos_y - 240, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 30, floorPos_y - 240, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 40, floorPos_y - 240, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 50, floorPos_y - 240, flagWidth, flagHeight)
				
		fill(0,0,0)
		rect(flagpole.x_pos, floorPos_y - 230, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 10, floorPos_y - 230, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 20, floorPos_y - 230, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 30, floorPos_y - 230, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 40, floorPos_y - 230, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 50, floorPos_y - 230, flagWidth, flagHeight)
				
		fill(255,255,255)
		rect(flagpole.x_pos, floorPos_y - 220, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 10, floorPos_y - 220, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 20, floorPos_y - 220, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 30, floorPos_y - 220, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 40, floorPos_y - 220, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 50, floorPos_y - 220, flagWidth, flagHeight)
				
		fill(0,0,0)
		rect(flagpole.x_pos, floorPos_y - 210, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 10, floorPos_y - 210, flagWidth, flagHeight)
		fill(0,0,0)
		rect(flagpole.x_pos + 20, floorPos_y - 210, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 30, floorPos_y - 210, flagWidth, flagHeight)
	    fill(0,0,0)
		rect(flagpole.x_pos + 40, floorPos_y - 210, flagWidth, flagHeight)
		fill(255,255,255)
		rect(flagpole.x_pos + 50, floorPos_y - 210, flagWidth, flagHeight)

	}
	else
		{
			fill(0,0,0)
		    rect(flagpole.x_pos, floorPos_y - 50, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 10, floorPos_y - 50, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 20, floorPos_y - 50, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 30, floorPos_y - 50, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 40, floorPos_y - 50, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 50, floorPos_y - 50, flagWidth, flagHeight)
				
			fill(255,255,255)
			rect(flagpole.x_pos, floorPos_y - 40, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 10, floorPos_y - 40, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 20, floorPos_y - 40, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 30, floorPos_y - 40, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 40, floorPos_y - 40, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 50, floorPos_y - 40, flagWidth, flagHeight)
				
			fill(0,0,0)
			rect(flagpole.x_pos, floorPos_y - 30, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 10, floorPos_y - 30, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 20, floorPos_y - 30, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 30, floorPos_y - 30, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 40, floorPos_y - 30, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 50, floorPos_y - 30, flagWidth, flagHeight)
				
			fill(255,255,255)
			rect(flagpole.x_pos, floorPos_y - 20, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 10, floorPos_y - 20, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 20, floorPos_y - 20, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 30, floorPos_y - 20, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 40, floorPos_y - 20, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 50, floorPos_y - 20, flagWidth, flagHeight)
				
			fill(0,0,0)
			rect(flagpole.x_pos, floorPos_y - 10, flagWidth, flagHeight)
			fill(255,255,255)
	    	rect(flagpole.x_pos + 10, floorPos_y - 10, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 20, floorPos_y - 10, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 30, floorPos_y - 10, flagWidth, flagHeight)
			fill(0,0,0)
			rect(flagpole.x_pos + 40, floorPos_y - 10, flagWidth, flagHeight)
			fill(255,255,255)
			rect(flagpole.x_pos + 50, floorPos_y - 10, flagWidth, flagHeight)
		}
  pop();	
}

function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);
	if(d < 15)
	{
		flagpole.isReached = true; 
	}
}

function drawGameScore()
{
	fill(255);
	noStroke();
	textFont('Arial');
	textSize(20);
	text("score: " + game_score, 30,40);
}

function drawLivesToken()
{
	for(var i = 0; i < lives; i++)
	{
		push();
		translate(20 + i * 50, 40);
		stroke(199,21,133);
		color(199,21,199);
		fill(199,21,133);
		textSize(32);
		text("❤️", 10,40);
		pop();
	}
}

function drawCollectable(t_collectable)
{
	fill(255,215,0);
	noStroke();
	ellipse(t_collectable.pos_x,t_collectable.pos_y,20,20);
	fill(232,234,5);
	noStroke();
	ellipse(t_collectable.pos_x,t_collectable.pos_y,15,15);
}

function checkCollectable(t_collectable)
{
	if(dist(gameChar_world_x, gameChar_y, t_collectable.pos_x, t_collectable.pos_y) < t_collectable.size)
	{
		t_collectable.isFound = true;
		console.log('yay')
		game_score += 1;
	}
}

function createPlatforms(x,y,length)
{
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function()
		{
			fill(220,20,60);
			rect(this.x, this.y, this.length, 20);
		},
		checkContact: function(gc_x, gc_y)
		{
			if(gc_x > this.x && gc_x < this.x + this.length)
			{
				var d = this.y - gc_y;
				console.log(d)
				if(d >= 0 && d < 5)
				{
					return true;	
				}
			}
			return false;
		}
	}
	return p;
}
