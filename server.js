
const express = require("express");
const socket = require('socket.io');
const cors = require("cors");
const app = express();
app.use(cors());

var rooms = [];
rooms[0]=0;
rooms[1]=0;

app.use(express.static("public"));

const server = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + server.address().port);
});

var io = socket(server);
var count=0;
io.on('connection',function(socket){
    count++;
    console.log("Player Connected...." + socket.id + " /count: "+ count);
        if(count<=2){
            socket.send(count);
        }



            //Int Array data
        socket.on('myMoves', function(data){
            console.log(data);
            socket.broadcast.emit('myMoves', data);//this is for everyone BUT the sender
            //socket.emit('myMoves', data);
        });

        socket.on('disconnect', function(){
            console.log("Player Disconnected");
            count=0;
        });
});






// app.get("/checkR1", (request, response) => {
//   //console.log(request.query.email+"  "+request.query.name);

//   response.setHeader('Content-Type', 'application/json');
//   rooms[0]++;
//   console.log("Room1 Query..."+ rooms[0]);

//   if(rooms[0]<=2)
//     {
//         response.send(JSON.stringify({message: 'Access Granted'}));
//     }
//     else
//     {
//         response.send(JSON.stringify({message: 'Access Denied'}));
//     }
// });

// // listen for requests :)
// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });

