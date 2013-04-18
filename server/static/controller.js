/*
*	CMU-15237-F12 HW7
*   Bingying Xia (bxia), Zi Wang (ziw)
*/
var socket = io.connect('http://192.168.1.19:3000/');
var gameId;
var connected = false;
var playerId = -1;

//called when game starts. Send accelerometer data to the socket server
function start () {
	if(!connected) return;
	var acc = new Accelerometer();
	acc.startListening();
	gameId = setInterval(function(){
		var last = acc.getLast();
		socket.emit('update',
			{
				id : playerId,
				acc    : last
			}
		);
	},100);


}

//called when player quits a game
function stop() {
	if(!connected){
		alert("You are not in a game.");
		return;
	}
	clearInterval(gameId);
	socket.emit('quit',
	{
		id : playerId
	});
}

//check for login
function hasSessionCookie(){
    var cookieArray = document.cookie.split(';');
    var cookies = {};
    for (var i = 0; i < cookieArray.length; i++){
        var parts = cookieArray[i].split('=');
        var key = parts[0].trim();
        var value = parts[1];
        cookies[key] = value;
    }
    //user will be an id if they're logged in
    return cookies['user'] !== 'none';
}


window.onload = function(){

	var clickEventName = 'click';
	//if logged in
    if (hasSessionCookie()){
    	$("#login").hide();
    	$("#start").show();
    	$("#in-game").hide();
    	$("#game-end").hide();
    	$("#reset").hide();
        $("#startButton").bind(clickEventName,function(){

			if(!connected){
				socket.emit('login',undefined);
			}
			else{
				alert("You are already in a game");
			}		
		});

		$("#stopButton").bind(clickEventName,function(){
			stop();
		});

		$("#resetButton").bind(clickEventName,function(){
			$("#start").show();
			$("#reset").hide();
			socket.emit("quit",undefined);
		});

		socket.on('reject', function(data) {
			if(data===undefined || data===null)
				return;
			alert(data.msg);
			connected = false;
	    	$("#reset").show();
	    	$("#start").hide();
		});

		socket.on('accept',function(data){
			if(data === undefined || data === null)
				return;

			$("#in-game").show();
			$("#not-in-game").hide();

			playerId = data.id;
			$('#player').html("P"+playerId);
			// alert(data.msg);
			if(playerId === 1){
				$("#score").hide();
			}
			connected = true;
		});

		socket.on('updateScore',function(data){
			console.log(data);
			if(data === undefined || data === null)
				return;
			var left = data.left;
			var right = data.right;
			$("#end-score").html("P1: " + left + " / " + "P2: " + right)
		});

		//game starts
		socket.on('gameStart',function(data){
			start();
			$("#score").show();
			$("#waiting").hide();
		});

		//game stops
		socket.on('gameStop',function(data){
			connected = false;
			if(data === undefined || data=== null)
				return;
			$("#game-end").show();
			$("#end-message").html(data.msg);
			$("#in-game").hide();
			$("#not-in-game").show();
		});
    }
    else{
    	//not logged in. Show login form
    	$("#start").hide();
    	$("#game-end").hide();
    	$("#in-game").hide();
    	$("#reset").hide();

    }


	
}