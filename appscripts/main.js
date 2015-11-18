// To use the sound on a web page with its current parameters (and without the slider box):
require.config({
    paths: {"jsaSound": "http://animatedsoundworks.com:8001"}
});

//http://speckyboy.com/demo/windmill-demo/index.html
require(
    [],
    function () {

        console.log("yo, I'm alive!");

        var paper = new Raphael(document.getElementById("mySVGCanvas"));
        //set background as a ballpit gif
        var bgRect = paper.rect(0,0,paper.canvas.offsetWidth, paper.canvas.offsetHeight); //rectangle where the dots will be moving in
        bgRect.attr({"fill": "url(http://i.imgur.com/IB6yKkA.gif)"});
        var pWidth = paper.canvas.offsetWidth;
        var pHeight = paper.canvas.offsetHeight;



//------- Buttons & Counters to keep track of time and score----------//
        
        //to start game using start button, and fill it with a picture 
        var startButton = paper.circle(300, 200, 50);
        startButton.attr({
            fill: "url(http://i.imgur.com/xQcT1WP.png)", stroke: "none" 
        });

        //set the different difficulty levels
        var easyButt = document.getElementById('diffEasy');
        var medButt = document.getElementById('diffMed');
        var hardButt = document.getElementById('diffHard');

        var scoreCounter = 0; //to keep track of score
        var timeLeft = 10;

        var gameMode = false; 

        var starttime; 
        var totaltime;

        //a list of x and y-coordinates and an arrray to hold the coordinates
        var ypos1 = 3/5*pHeight;
        var ypos2 = 4/5*pHeight;
        var xpos1 = 3/10*pWidth;
        var xpos2 = 1/2*pWidth;
        var xpos3 = 7/10*pWidth;
        var xposArray = [xpos1, xpos2, xpos3];
        var yposArray = [ypos1, ypos2];
        
        //a map to generate a random number for picking the x and y coordinates 
        var map = function(x,a,b,m,n) { //mapping the function which takes variable x in the range [a,b] 
            return Math.floor(m+(n-m)*(x-a)/(b-a)); //function returns a value mapped into the range [m,n]
        }; 



//----------- Game Object: Pug---------//

        var pug = paper.circle(-100, -100, 70);
        pug.attr({
            fill: "url(http://i.imgur.com/iMZ93QV.gif)", stroke: "none" //Change rabbit image here //Remove border line --> stroke: "none"
         });

        pug.node.addEventListener('click', function(){
            scoreCounter++
            enableClick();
            document.getElementById("clickCounter").innerHTML = "SCORE: " + scoreCounter;
            x = Math.random()*1;
            y = Math.random()*1;
            newXPos = map(x,0,1,0,3);
            newYPos = map(y,0,1,0,2);
            console.log(newXPos +" "+ newYPos);
            pug.attr({
                'cx': xposArray[newXPos],
                'cy': yposArray[newYPos]
            })
        });

        var changePos = function(){
            x = Math.random()*1;
            y = Math.random()*1;
            newXPos = map(x,0,1,0,3);
            newYPos = map(y,0,1,0,2);
            pug.attr({
                'cx': xposArray[newXPos],
                'cy': yposArray[newYPos]
            })
        };



//---------- Event Listener for Game Mode Selection -----------//
        
        var gameTime;

        //set the different levels for user
        //the pug will be moving at different speed in different levels (easy = slower, medium = normal, hard = faster)
        easyButt.addEventListener('click',function(){
            console.log('easy mode')
            gameTime=1200;
            gameMode=true;
            alert("You have selected the EASY mode! All the best!");
        });

        medButt.addEventListener('click',function(){
            console.log('medium mode')
            gameTime=800;
            gameMode=true;
            alert("You have selected the MEDIUM mode! All the best!");
        });

        hardButt.addEventListener('click',function(){
            console.log('hard mode')
            gameTime=500;
            gameMode=true;
            alert("You have selected the HARD mode! All the best!");
        });



//----------------- Emitter ----------------//

        //create var to hold the number of elements in list
        var numDots=40;

        //initialize array to empty
        var dot = [];
        var i=0;
        while(i<numDots){
            dot[i]=paper.circle(pWidth/5, pHeight/2, 30);

            dot[i].colorString = "hsl(" + Math.random()+ ",1, .75)";
            dot[i].attr({"fill": dot[i].colorString,  "fill-opacity" : 1.0 });

            //adding properties to dot just to keep track of it's "state"
            dot[i].xpos=pWidth/5;
            dot[i].ypos=pHeight/2;

            //add properties to keep track of the rate the dot is moving
            dot[i].xrate= -5+10*Math.random();
            dot[i].yrate= -7+14*Math.random();
            i++;
        }

        var count=0;
        var dist; // temp variable used inside loop
    
        //add gravity to the emitted balls so that they fall into the ballpit
        var gravity = .4;
        
        //our drawing routine, will use as a callback for the interval timer
        var draw = function(){

            //count and keep track of the number of times this function is called
            count++;
            //console.log("count = " + count);
            //console.log("dot pos is ["+dot.xpos + "," + dot.ypos + "]");

            i=0;
            while(i<numDots){
                    dot[i].ypos += dot[i].yrate;
                    dot[i].xpos += dot[i].xrate;
                    dot[i].yrate += gravity;
                    dot[i].attr({'cx': dot[i].xpos, 'cy': dot[i].ypos});


            i++;

            };
        };

        var e=0;
        var emitter = function(){
                if (e < numDots){
                    dot[e].xpos = pWidth/5;
                    dot[e].ypos = pHeight/2;
                    dot[e].yrate= -7+14*Math.random();
                    dot[e].attr({'cx': dot[e].xpos, 'cy': dot[e].ypos});
                    e++;
                } else {
                    e=0;
                };
            };
        
        setInterval(draw, 20);
        setInterval(emitter,400);

 

//------------ Set time counter and click counter ----------------//
        
        var ready = function(){
            startButton.show();
            pug.hide();
            timeLeft=0;
            document.getElementById("timeCounter").innerHTML = "TIME LEFT: " + timeLeft;
            counter = 0;
            document.getElementById("clickCounter").innerHTML = "SCORE: " + counter;
        };
        
        var timer = function(){
            if (timeLeft>0){
                timeLeft--;
                console.log(timeLeft)
                document.getElementById("timeCounter").innerHTML = "TIME LEFT:   " + timeLeft;
                };
        };


        var start = function (){
            //game will not start UNTIL the user clicks on the difficulty level of game
            if (gameMode===false){
                alert('Please select the difficulty level.');
            } else {
                console.log("game is starting");
                console.log(gameTime)
                startButton.hide();
                pug.show();

                timeLeft=10;
                //give the game a 10seconds time limit 
                countdown = setInterval(timer,1000);

                scoreCounter = 0;
                starttime = Date.now();
                setInterval(changePos, gameTime);
                setTimeout(endGame, 10000);
            };
        };

        startButton.node.addEventListener('click', start);
        
        var endGame = function(){
            clearInterval(changePos);
            clearInterval(countdown);
            ready();
            //give user a confirmation of how many points they scored 
            confirm("Congratulations, you've scored a total of " + scoreCounter + " points!!!!! Gee double oh dee jay oh bee good job!! Good job! :)");
        };
    


//--------------- Setting Music -------------//

        //set a click sound where every time the pug is clicked, there is a sound
        var clickMusic = new Audio("resources/dog.mp3");
        function enableClick(){
            clickMusic.autoplay = true;
            clickMusic.load();
        }

        //set a peaceful and lively background music for game
        var backgroundMusic = new Audio("resources/song.mp3");
        backgroundMusic.play();
        backgroundMusic.loop = true
        
        //calls the ready function when the game ends, restarting the game
        ready();        
        


//-----------------------------------------
/*
        var rect1 = paper.rect(-100,-100,100, 100);
        rect1.attr({
            'fill': "hsl(240, 50, 50)",
            'stroke': '#3b4449',
            'stroke-width': 10,
            'stroke-linejoin': 'round',
            'opacity': .75
        });
        

        bgRect.node.addEventListener('click', function(ev){
            console.log(paper.canvas.offsetWidth);
            console.log(paper.canvas.offsetHeight);
            console.log(ev.offsetX);
        })

*/
        /*
        var randInt = function( m, n ) {
            var range = n-m+1;
            var frand = Math.random()*range;
            return m+Math.floor(frand);
        }

        var moveSquare = function(){
            var posX, posY;

            counter++;
            console.log("your square move count is now " + counter);

            if (counter>maxCount) {
                totaltime = (Date.now()-starttime)/1000;
                confirm("You completed the task in " + totaltime + " seconds");
                rect1.attr({
                    x: -100,
                    y: -100
                });
                ready();

            } else {
                posX = randInt(0,5);
                posY = randInt(0,3);
                rect1.attr({
                    x: posX*100,
                    y: posY*100
                });
            }
        }

        rect1.node.addEventListener('click', moveSquare);

        ready(); // Put the start button on the screen 
        */
    }
);