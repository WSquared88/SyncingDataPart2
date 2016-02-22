var app = require("http").createServer(handler);
var io = require("socket.io")(app);
var fs = require("fs");
var PORT = process.env.PORT || process.env.NODE_PORT || 3000;

app.listen(PORT);

var squares = {};

function handler(req, res)
{
	fs.readFile(__dirname + "/../client/client.html", function(err, data)
	{
		if(err)
		{
			throw err;
		}
		
		res.writeHead(200);
		res.end(data);
	});
}

io.on("connection", function(socket)
{
	socket.join("room1");
	
	socket.on("init", function(data)
	{
		squares[data.time] = data.data;
		var message = 
		{
			message: "",
			data: squares
		};
		console.log("throwing squares" + squares);
		io.sockets.in("room1").emit("allSquares", message);
	});
	
	socket.on("leaving", function(data)
	{
		console.log("leaving");
		delete squares[data.time];
	});
	
	socket.on("disconnect", function(data)
	{
		socket.leave("room1");
	});
});

console.log("Listening on port "+PORT);