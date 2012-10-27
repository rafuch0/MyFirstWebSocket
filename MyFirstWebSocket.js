var http = require('http');
var io = require('socket.io');

function ServerMain(req, res)
{
	res.writeHead(200, {'Content-Type': 'text/html'});

	var pageData = '';

	pageData += '\
		<html><head> \
		<script src="/socket.io/socket.io.js"></script> \
		</head><body> \
		<script> \
			var socket = io.connect("/"); \
\
			function SendPong(data) \
			{ \
				console.log("Recieved PING!  Sending PONG."); \
				socket.emit("message", {data: "PONG"} ); \
			} \
\
			function ServerMessage(data) \
			{ \
				console.log("Server says: "+data.data); \
			} \
\
			function sendPing() \
			{ \
				socket.emit("ping", {data: "PING"} ); \
			} \
\
			socket.on("ping", SendPong); \
			socket.on("message", ServerMessage); \
\
			socket.emit("message", { data: ": DATA from Client"} ); \
		</script> \
		<input type="button" onClick="sendPing();" value="SendPing"></input> \
		</body></html>\
	';

	res.end(pageData);
}

function NewClient(client)
{
	function ClientMessage(data)
	{
		console.log('Client says: '+data.data);
	}
	function ClientDisconnect(data)
	{
		console.log('Client Disconnected');
	}
	function SendPong(data)
	{
		console.log('Recieved PING!  Sending PONG.');
		client.emit('message', {data: 'PONG'} );
	}

	client.on('message', ClientMessage);
	client.on('disconnect', ClientDisconnect);
	client.on('ping', SendPong);

	client.emit('message', { data: ": DATA from Server"} );
	setInterval(function(){client.emit('ping', {data: "PING"} );}, 1000);
}

server = http.createServer(ServerMain);
server.listen('8800');

var socket = io.listen(server);
socket.on('connection', NewClient);
