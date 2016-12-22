'use strict';

//set sound effects toggle functionality
function toggleSound() {
    if (soundEffectsOn) {
      soundEffectsOn = false;
      $("#controls__toggle--sound").css("background-position-y", "32px").attr("title", "Sound Effects On");
  } else {
      soundEffectsOn = true;
      $("#controls__toggle--sound").css("background-position-y", "").attr("title", "Sound Effects Off");
      if (isMobile && !document.getElementById('music').paused) {
          toggleMusic();
      }
  }
}

//set music toggle functionality
function toggleMusic() {
    var music =document.getElementById('music');
  if (music.paused == false) {
      music.pause();
      $("#controls__toggle--music").css("background-position-y", "32px").attr("title", "Music On");
  } else {
      music.play();
      $("#controls__toggle--music").css("background-position-y", "").attr("title", "Music Off");
      if (isMobile && soundEffectsOn) {
          toggleSound();
      }
  }
}

//animate the logos in the opening splash modal
function splashAnimation() {
	var animateTicTacToe;
	var animationInterval = 674; //674 is beat of opening music
	var logoStates = [
		'<img class="ttt-logo__element ttt-logo__element--tic" id="ttt-logo__element--tic" src="https://preview.c9users.io/dsto/tic-tac-toe/img/logos/tic-logo-390.png"/><img class="ttt-logo__element ttt-logo__element--tac u-hidden" id="ttt-logo__element--tac" src="https://preview.c9users.io/dsto/tic-tac-toe/img/logos/tac-logo-390.png"/>',
		'<img class="ttt-logo__element ttt-logo__element--tac" id="ttt-logo__element--tac" src="https://preview.c9users.io/dsto/tic-tac-toe/img/logos/tac-logo-390.png"/><img class="ttt-logo__element ttt-logo__element--toe u-hidden" id="ttt-logo__element--toe" src="https://preview.c9users.io/dsto/tic-tac-toe/img/logos/toe-logo-390.png"/>',
		'<img class="ttt-logo__element ttt-logo__element--toe" id="ttt-logo__element--toe" src="https://preview.c9users.io/dsto/tic-tac-toe/img/logos/toe-logo-390.png"/>'
	];
	var i = 0;

	function animateTicTacToeFn() {
		$("#ttt-logo").html(logoStates[i]);

		if (i == 2) {
			clearInterval(animateTicTacToe);
		}
		i++;
	}

    console.log($("#ttt-logo__element--board"))
	$("#ttt-logo__element--board").slideDown(animationInterval / 4, function() {

		animateTicTacToe = window.setInterval(animateTicTacToeFn, animationInterval);

		setTimeout(function() {
			$('#pokemon-logo').removeClass('u-hidden').addClass('animated bounceIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(this).removeClass("animated bounceIn");
			});
		}, animationInterval * 4);

	});
}

$(function() {
    var isMobile = false;
    
    function setMobileSettings() {
        if (!isMobile) { //if this is the first time tapping the page
            document.getElementById('music').play();
        }
        
        isMobile = true;
        
        var el = document.documentElement,
          rfs = el.requestFullscreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullscreen 
        ;
    
        rfs.call(el);
        
        //lock portrait orientation on mobile
        screen.orientation.lock("portrait");
        screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
        screen.lockOrientationUniversal("portrait");
    }
    
    // for mobile, activate music, set fullscreen, lock portrait orientation
    $('#view').bind("touchstart tap", setMobileSettings);
    
    // Music and sound effects settings
    var soundEffectsOn = true;
    $("#controls__toggle--music").click(toggleMusic);
    $("#controls__toggle--sound").click(toggleSound);
    
    //load background map image
    new Promise(function(resolve) {
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
        if (viewHeight > 1080) {
            var backgroundSource = "./img/johto-kanto-map-3000x1316.jpg";
        } else if (viewHeight > 680) {
            var backgroundSource = "./img/johto-kanto-map-3000x1062.jpg";
        } else {
            var backgroundSource = "./img/johto-kanto-map-1921x680.jpg";
        }
        
        var background = document.createElement('img') ;
        background.src = backgroundSource;
        background.id = "background";
        background.className = "background";
        background.onload = resolve;
        $("#view").prepend(background);
        $("#background").attr('alt', "A map of the Pokemon world in the background")
        
    }) // then set horizontal scrolling animation
        .then(function() {
        
    	var backgroundScrollSpeed = 150;//higher number is slower
    	var backgroundTiming; //time in ms for full scroll of one direction
    	var backgroundTransition; //css transition value used for animation
    	var backgroundMargin; //number of horizontal pixels to scroll each direction
    	var animateBackground; //a setInterval function
    	
    	function updateBackgroundTiming() {	//triggered on load and resize.  also starts/restarts animation
    		backgroundMargin = Math.floor($("#background").width() - document.documentElement.clientWidth);
    		backgroundTiming = backgroundMargin * backgroundScrollSpeed;
    		
    		var backgroundTransition = "transform "+backgroundTiming+"ms linear"
    		var backgroundTransitionObj = {
    			transition: backgroundTransition,
    			"-webkit-transition": backgroundTransition
    		};
    		
    		$("#background").css(backgroundTransitionObj);		
    		
    		clearInterval(animateBackground);		
    		animateBackgroundFn()
    		animateBackground = window.setInterval(animateBackgroundFn, backgroundTiming * 2);
    	}
    	
    	function animateBackgroundFn(reverse) {
    		var backgroundTranslate = "translate3d(-"+backgroundMargin+"px, 0px, 0px)"
    		if (reverse) {
    			var backgroundTransform = {
    				transform: "",
    				"-webkit-transform": ""
    			}	
    		} else {
    			var backgroundTransform = {
    				transform: backgroundTranslate,
    				"-webkit-transform": backgroundTranslate
    			}	
    		}
    		$("#background").css(backgroundTransform)
    	
    		
    		if (!reverse) {
    			setTimeout(function() {
    				animateBackgroundFn(true);	
    			}, backgroundTiming)
    					
    		}
    
    	} // end animateBackgroundFn
    	
    	updateBackgroundTiming()
    	$(window).on("resize", updateBackgroundTiming);

    }); // end "then" attached to background image load promise
    
    splashAnimation();
    

	
})
