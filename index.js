require('dotenv').config();

// create express instance
const express = require('express');
const app = express();

// create connection
var http = require('http').createServer(app);

// some basic security
const helmet = require('helmet');
var cors = require('cors')

// for being able to access the body
var bodyParser = require('body-parser')

// socket stuff
var io = require('socket.io')(http);

// middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet());

// basic route to base of everything
app.get('/', function(req, res) {
  res.status(200).send('socket app')
});

// socket connection handling
io.on('connection', (socket) => {
    socket.on('subscribeToTimer', (interval) => {
        console.log('socket is subscribing to timer with interval ', interval);
        setInterval(() => {
          socket.emit('timer', new Date());
        }, interval);
    });

    socket.on('message', (theMessage) => {
        console.log(theMessage)
        socket.broadcast.emit('message', theMessage)
    })
});


// have it listen to the localhost port
var server = http.listen(process.env.PORT || 3000);

module.exports = server;