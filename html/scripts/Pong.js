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
		ws.onerror = function (e) {
		  console.log('WebSocket did close ',e);
		};
	
		// Log errors
		ws.onerror = function (error) {
		  console.log('WebSocket Error ' + error);
		};

		// Nacrichten, die von dem server kommen werden hier verwaltet:
		ws.onmessage = function (e) {
			console.log(e.data);
		  if (e.data.split("!")[0]=="go") {
				//console.log("bang!")
				console.log(e.data.split("!")[1]);
				
				shootBall(jQuery.parseJSON(e.data.split("!")[1]));
			}
			else if (e.data=="stop!") {
				// stoppe das spiel
				
			}
			else if (e.data=="spieler_weg!") {
				// stoppe das spiel
				
			}
			
		};
		
		// sende einen login-versuch:
    // ws.send("login:jens")
	}
	
	
	function closeSocket(){
		hideBall();
		ws.send('byebye');
		ws.onclose = function () {}; // disable onclose handler first
	  ws.close()
	}
	
	
	
	var hit_fuse = false;
	var hitEvent = jQuery.Event('hit');
	hitEvent.hit = false;
	
	var ballStep = jQuery.Event('ballStep');
	
	
	$(this).bind('hit',function(event){
		console.log("hit! successful?",event.hit)
	})
	
	function hideBall(){
	  $('#ball').addClass('hidden');
	}
	
	function stopBall(){
	  $('#ball').stop().clearQueue();
	}
	
	function resetBall(ball){
		hit_fuse = false;

    // left:"-1.5%",
    // top:$('#spielfeld').height()/2+"px"
    var setleft = (ball.direction>0) ? 0: $('#spielfeld').width()+"px";
    
    stopBall();
		$('#ball').css({
		  left:setleft,
		  top:ball.y*$('#spielfeld').height()+"px"
		})
		
	}
	
	var yy = 0;
	var yspeed = 2;
	
	function shootBall(ball){
    // console.log(ball)
	  
		resetBall(ball)
		yspeed = ball.yspeed;
		
		var gotox = (ball.direction<0) ? 0: $('#spielfeld').width()+"px";
    
		
		$('#ball').removeClass('hidden')
		.animate({
		            left: gotox
		         },
		         {
								duration: 2000,
								easing: 'linear',
								
								step: function(){
									
									$(this).css({top:yy+"px"});
									if (yy >=  $('#spielfeld').height() ) {yspeed *= -1;}
                  else if (yy < 0 ) yspeed = Math.abs(yspeed);
									yy += yspeed;
									
									// Der Ball trifft auf den Spieler:
									if ( !hit_fuse &&
									    ( $('#ball').position().left > $('#spieler').position().left -10 &&
									      $('#ball').position().left < $('#spieler').position().left +30) )
									{
										// Hat der Spieler den Ball gefangen?
										var hit = $('#ball').position().top > $('#spieler').position().top && $('#ball').position().top < $('#spieler').position().top + $('#spieler').height();
										
										hitEvent.hit = hit;
										$(this).trigger(hitEvent);
										
										hit_fuse = true;
										if (hit) {
										  
										  $(this).stop()
										  .animate({
										      left: (ball.direction>0) ? 0: $('#spielfeld').width()+"px"
										    },{
										    duration:1000,
										    easing: 'linear',
										    complete: ballIstRaus,
										    step: function(){
										      
										      $(this).css({top:yy+"px"});
        									if ( yy >=  $('#spielfeld').height() ) {yspeed *= -1;}
                          else if ( yy < 0 ) yspeed = Math.abs(yspeed);
        									yy += yspeed;
        									
										    },
										    queue: false
										  })
									  } // ende hit true
									}
								},
								queue: false,
								complete: ballIstRaus
							}) // ENDE animate left (aka x)
				
	}
	
	
	function ballIstRaus(){
		stopBall();
		
	  var which_side = $('#ball').position().left>$('#spieler').position().left
		var y_pos = $('#ball').position().top/$('#spielfeld').height()
		var x_pos = $('#ball').position().left/$('#spielfeld').width()
		var spieler = "testspieler"
		var xspeed = (which_side)?1:-1;
		
		var yspeed = 1;
		var angle = yspeed;
		
		var paket = [x_pos,y_pos,xspeed,yspeed,xspeed,spieler];
		
		ws.send("finished!"+paket.join(","))
		
		
		
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