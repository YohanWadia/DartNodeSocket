
const express = require("express");
const socket = require('socket.io');
const cors = require("cors");
const app = express();
app.use(cors());

var roomss = [];
roomss[0]=0;
roomss[1]=0;

app.use(express.static("public"));

const server = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + server.address().port);
});

var io = socket(server);
io.on('connection',function(socket){    
    console.log("Player Connected...." + socket.id );//Not sending anything back cz by default a connected event is raised at the client... so i'll know 
    

      socket.on('RoomJoining', function(data){
        console.log("JoiningRequest from " + data);            
        socket.join(data);
        console.log("Server rooms variable:"+socket.rooms);
        socket.emit('RoomJoining', "Joined room #"+data);    
        });

            //Int Array data
        socket.on('myMoves', function(data){
            console.log(data);
            socket.to(data[3]).emit('myMoves', data);//data[3]will always be roomNo
            //socket.broadcast.emit('myMoves', data);//this is for everyone BUT the sender
            //socket.emit('myMoves', data);
            if(data[0]===999){roomss[data[3]] = 0;}//reset it to 0 after last move
        });

        socket.on('disconnect', function(){
          console.log("Player Disconnected x-x-x-x-x-x"); 
          console.log(socket.rooms);
        });
  
});






app.get("/checkR", (request, response) => {
 console.log(request.query.number);
 const para = parseInt(request.query.number,10);//cause QueryStr is always a string

  response.setHeader('Content-Type', 'application/json');
  roomss[para]++;
  console.log("Room1 Query..."+ roomss[para]);

  if(roomss[para]<=2)
    {
        response.send(JSON.stringify({message: 'Access Granted',ply: roomss[para]}));
    }
    else
    {
        response.send(JSON.stringify({message: 'Access Denied',ply:-1}));//-1 means nothing
    }
});


