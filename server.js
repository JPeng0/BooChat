const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express()

//server instance
const server = http.createServer(app)

//socket instance
const io = socketIO(server)

app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.set('port', process.env.PORT || 5000);

io.on('connection', socket => {
  console.log(socket.id)
  
  //callback
  socket.on('SEND_MESSAGE', function(data){
    io.emit('RECEIVE_MESSAGE', data);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(app.get('port'), () => console.log(`Listening on port `+ app.get('port')))