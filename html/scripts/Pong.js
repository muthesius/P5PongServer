$(function(){
	
	function getHost(){
		var a = document.URL.split("//"); // split at protocol
		a = (a[1] ? a[1] : a[0]).split("/"); 
		return a[0].split(":")[0];
	}
	
	var ws = null;
	var host = getHost();
	var port = 3000;
	var socket = "pongsocket";
	
	
	function openSocket(){
		if(ws!=null)closeSocket();
		
		host = getHost();
		console.log(host)
		
		console.log("trying to open a websocket on "+host)
		var _socket = (undefined==socket)?"":"/"+socket
		
		ws = new WebSocket("ws://"+host+":"+port+_socket)
		// When the connection is open, send some data to the server
		ws.onopen = function () {
		  console.log("opened")
		  ws.send('Ping'); // Send the message 'Ping' to the server
		};

		// oh, it did close
		ws.onclose = function (e) {
		  console.log('WebSocket did close ',e);
		  stopBall();
		  hideBall();
		};
	
		// Log errors
		ws.onerror = function (error) {
		  console.log('WebSocket Error ' + error);
		};

		// Nacrichten, die von dem server kommen werden hier verarbeitet:
		ws.onmessage = onMessage
		
		// sende einen login-versuch:
    // ws.send("login:jens")
	}
	
	function closeSocket(){
		hideBall();
		if(!ws)return; // FIXED: kleiner Fehler beim neuladen der Seite, falls ws null: einfach return
		ws.send('byebye');
		ws.onclose = function () {}; // disable onclose handler first
	  ws.close()
	}
	
	/**
	 * Verarbeite die Nachrichten vom Server:
	 */
	function onMessage(e){
		console.log(e.data);
	  if (e.data.split("!")[0]=="go") {
			//console.log("bang!")
      // console.log(e.data.split("!")[1]);
			var ball = jQuery.parseJSON(e.data.split("!")[1])
			shootBall(ball);
		}
		else if (e.data=="stop!") {
			// stoppe das spiel
			stopBall();
		}
		else if (e.data=="spieler_weg!") {
			// ein spieler ist weg!
		}
	}
	
	
	var hit_fuse = false;
	var hitEvent = jQuery.Event('hit');
	hitEvent.hit = false;
	
	var ballStep = jQuery.Event('ballStep');
	var yy = 0;
	var yspeed = 0;
	
	function hideBall(){
	  $('#ball').addClass('hidden');
	}
	
	function stopBall(){
	  $('#ball').stop().clearQueue();
	}
	
	function resetBall(ball){
		hit_fuse = false;
    stopBall();
		
		// wir holen die y relevanten werte aus dem ball objekt
		yspeed = ball.yspeed;
		yy     = ball.y*$('#spielfeld').height();
		
		// berechne die x-position
    var setleft = (ball.direction>0) ? 0: $('#spielfeld').width()+"px";
    
    // setze den ball
		$('#ball').css({left:setleft,top:yy+"px"})
	}
	
	function shootBall(ball){
		resetBall(ball)
		showBall();
		var dur = 2000; // die hälfte, wenn der spieler den ball trifft!
		$('#ball').animate(
		  {
        left: (ball.direction<0) ? 0 : $('#spielfeld').width()+"px"
      },
      {
    		duration: dur,
    		easing: 'linear',

    		step: function(){
    			updateYpos();
			
    			// Der Ball trifft auf den Spieler:
    			if ( !hit_fuse &&
    			    ( $('#ball').position().left > $('#spieler').position().left -10 &&
    			      $('#ball').position().left < $('#spieler').position().left +10) )
    			{
    				// Hat der Spieler den Ball gefangen?
    				var hit = $('#ball').position().top > $('#spieler').position().top && $('#ball').position().top < $('#spieler').position().top + $('#spieler').height();
				
    				hitEvent.hit = hit;
    				$(this).trigger(hitEvent);
				
    				hit_fuse = true;
    				if (hit) {
    				  $(this).stop().clearQueue()
    				  .animate({
    				      left: (ball.direction>0) ? 0: $('#spielfeld').width()+"px"
    				    },{
    					    duration: dur/2,
    					    easing:   'linear',
    						  step:     updateYpos,
    					    complete: ballIstRaus,
    					    queue:    false
    				    }
    				  ) // ENDE animate funktion bei hit
    			  } // ENDE if hit true
    			} // ENDE if hit stattgefunden
    		}, // ENDE standard step für den ball
    		complete: ballIstRaus,
    		queue: false
    	}
    ) // ENDE standard ball animation
	} // ENDE shootBall()
	
	function ballIstRaus(){
		stopBall(); // stoppe die animation
		hideBall(); // verstecke den Ball
		
		// erstelle ein profil des Balls:
		var y_pos = $('#ball').position().top/$('#spielfeld').height() || 0.5; // normalize y position
		var y_speed = yspeed; // send over the y speed
		
	  var which_side = $('#ball').position().left>$('#spieler').position().left; // normalize x-position
		var direction = (which_side)?1:-1; // where do wwe go?
		
		var paket = [y_pos,y_speed,direction];
		
		// und schicke das paket mit den ball daten an den server. von dort geht es an den richtigen nachbarn
		ws.send("finished!"+paket.join(","))
	}
	
	function updateYpos(){
		$('#ball').css('top', yy);
		if(yy >= $('#spielfeld').height()){
		  yspeed *= -1;
		}
		else if(yy <0){
			yspeed = Math.abs(yspeed);
		}
	  yy += yspeed;
	}
		
	$('#spielfeld').bind('mousemove',function(mouseevent){
		if(mouseevent.target!=$('#spielfeld')[0]) return;
		mouseevent.stopPropagation();
		mouseevent.stopImmediatePropagation();
		var set_height = mouseevent.offsetY/$(this).height()*100
		$('#spieler').css('top',set_height+"%")
		return false;
	})
	
	$('#open').click(function(){
		openSocket();
	})
	
	$('#close').click(function(){
		closeSocket();
	})
	
	window.onbeforeunload = function() {
		closeSocket()
	};
	
	// $(document).click(shootBall)
	
	/**
	 * Fertig mit deklarieren: und ab geht die post:
	 */
	//resetBall();
	
	/// ENDE Script
});