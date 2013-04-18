/*
*	CMU-15237-F12 HW7
*   Bingying Xia (bxia), Zi Wang (ziw)
*/
var io = require('socket.io').listen(3000);
var players = 0;

io.sockets.on('connection', function(socket){
	//listen for accelerometer updates and forward the data to display-client
	socket.on('update', function(data) {

		io.sockets.emit('receive',data);

	});

	//listen for final score update
	socket.on('score',function(data){
		io.sockets.emit('updateScore',data);
	});

	//listen for client connection to the game
	//if game is full, reject the connection, otherwise assign a playerId (left or right)
	socket.on('login',function(data){
		if(players === 2){
			socket.emit('reject',{
				status : false,
				msg : "Sorry, game full."
			});
			return;
		}
		players++;
		socket.emit('accept',{
			status : true,
			msg : "Game connected. You are player "+ players,
			id  : players
		});
		//if both players are in, the game is ready to start
		if(players === 2){
			io.sockets.emit('gameStart',undefined);
		}

	});

	//listen for quit action from player. Stop the current game and display the score
	socket.on('quit',function(data){
		players = 0;
		var message;
		if(data === undefined || data === null){
			message = "Game has been reset.";
		}
		else{
			message = "Player " + data.id +" ended the game.";
		}
		io.sockets.emit('gameStop',{
			msg : message
		});
	});
});