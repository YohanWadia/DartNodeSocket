const express = require("express");
const socket = require('socket.io');


const app = express();
app.use(express.static('public'));


const server = app.listen(4000, () => {
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
