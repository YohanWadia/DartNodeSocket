
const express = require("express");
const socket = require('socket.io');
const cors = require("cors");
const app = express();
app.use(cors());

var roomss = [];
roomss[0]=0;
roomss[1]=0;
roomss[2]=0;

var toBsent = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];//0-11 need 12 elements


app.use(express.static("public"));

const server = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + server.address().port);
});

var io = socket(server);
io.on('connection',function(socket){    
    console.log("Player Connected...." + socket.id );//Not sending anything back cz by default a connected event is raised at the client... so i'll know 
    
    var myOwnRoom;//a seperate copy of this variable will belong to individual sockets

  socket.on('RoomJoining', function(data){
        console.log("JoiningRequest from " + data);            
        socket.join(data);
        console.log("Server rooms variable:"+socket.rooms);
          //for (const room of socket.rooms) { console.log("===> " + room);} //room only contains its own socketId and the name of the room that this socket connected to  
        socket.emit('RoomJoining', "Joined room #"+data);    
        myOwnRoom = data;//used incase of sudden disconnection
    
        //for 2x2's all players to start when room is full
        if(data==2 && roomss[2]==4){console.log('GO GO GO');
          io.in(myOwnRoom).emit('RoomJoining', "Go"); 
        }
 });

            //Int Array data 1x1
        socket.on('myMoves', function(data){
            console.log(data);
            socket.to(data[3]).emit('myMoves', data);//data[3]will always be roomNo
            //socket.to(data[3]).emit('myMoves', data);//send to all clients in ROOM except the sender
            //socket.broadcast.emit('myMoves', data);//this is for everyone BUT the sender
            //socket.emit('myMoves', data); // back only to sender
            //io.in("gameRoomId").emit("big-announcement", "the game will start soon");//everyone in room including sender
            if(data[0]===999){roomss[data[3]] = 0;}//reset it to 0 after last move
        });
  
  
      //Int Array data 2x2 server receives arr[0-4] and sendsback[1,2,3]cz plyNum & RoomNum doesnt need to be sentback
        socket.on('myMoves2x2', function(data){
            console.log(data);//[plyNum,what,move,taken,room]
           
          var start = data[0]*3;
          toBsent[start]=data[1];toBsent[start+1]=data[2];toBsent[start+2]=data[3];
          
          if( toBsent.includes(-1) == false){//only if all the -1 dont exist that means all players moves are filled in
            io.in(data[4]).emit('myMoves2x2', toBsent);//everyone in room including sender 
            console.log('sent to ALL: ' + toBsent);
            toBsent = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];//after it is filled by all you can reset it
          }
            //if(data[0]===999){roomss[data[3]] = 0;}//reset it to 0 after last move
           
        });
  
  
  

        socket.on('disconnect', function(){
          console.log("Player Disconnected x-x-x-x-x-x from Room#"+myOwnRoom);           
          roomss[myOwnRoom] = 0;//reset it to 0 after last move in case it dint make it to move 999
          console.log(socket.rooms); 
          
        });
  
});





app.get("/checkR", (request, response) => {
 console.log("RoomReq #" + request.query.number);
 const para = parseInt(request.query.number,10);//cause QueryStr is always a string

  response.setHeader('Content-Type', 'application/json');
  roomss[para]++;
  console.log("Room count..."+ roomss[para]);

  if(para<2){
    if(roomss[para]<=2)
    {response.send(JSON.stringify({message: 'Access Granted',ply: roomss[para]}));}
    else
    {response.send(JSON.stringify({message: 'Access Denied',ply:-1})); }//-1 means nothing
  }
  else if(para==2){
    if(roomss[para]<=4)
    {response.send(JSON.stringify({message: 'Access Granted'}));}
    else
    {response.send(JSON.stringify({message: 'Access Denied'})); }
  }
});


