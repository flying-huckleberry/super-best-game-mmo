/**
 * Module dependencies.
 */
var express = require('express');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');

var logger = require('morgan');
var errorHandler = require('errorhandler');

//var MongoStore = require('connect-mongo/es5')(session);

var path = require('path');

var expressValidator = require('express-validator');

/**
 * Create Express server.
 */
var app = express();



/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

//socket.io
app.use('/assets', express.static(__dirname + '/node_modules/socket.io-client/dist'));
//jquery
app.use('/assets', express.static(__dirname + '/node_modules/jquery/dist/'));
//jquery toggles
app.use('/assets', express.static(__dirname + '/node_modules/jquery-toggles/'));
app.use('/assets', express.static(__dirname + '/node_modules/jquery-toggles/css/'));
app.use('/assets', express.static(__dirname + '/node_modules/jquery-toggles/css/themes/'));
//jquery ui
app.use('/assets', express.static(__dirname + '/node_modules/jquery-ui-dist/'));
//jquery onoff
app.use('/assets', express.static(__dirname + '/node_modules/jquery.onoff/dist/'));
//jquery scrollbar
app.use('/assets', express.static(__dirname + '/node_modules/jquery.scrollbar/'));
//bootstrap
app.use('/assets', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/assets', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
//bootstrap switch
app.use('/assets', express.static(__dirname + '/node_modules/bootstrap-switch/dist/js'));
app.use('/assets', express.static(__dirname + '/node_modules/bootstrap-switch/dist/css/bootstrap3'));

// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     url: process.env.MONGODB || process.env.MONGOLAB_URI,
//     autoReconnect: true
//   })
// }));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * URL Request Routing
 */
app.get('/', function(req, res) {
  res.render('game', {
    title: 'Super Best Game MMO!'
  });
});

/**
 * Error Handler.
 */
app.use(errorHandler());


/**
 * Start Express server.
 */
// app.listen(app.get('port'), function() {
//   console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
// });



/**
 * Super Best Game Server
 */

var Clients = [];

var GameState = {
  'players': [],
  'shots': [],
};

var index = 0;
var gameServer  = require('http').createServer(app);
var io      = require('socket.io').listen(gameServer);

//someone connected
io.on('connection', function(socket){
  console.log('someone connected');
  let az = Math.floor((Math.random() * 360) + 1);
  if (az % 2 == 1) {
    az = (az + 1) % 360;
  }
  //set up the new player
  var player = {
    'id': (index++).toString(),
    'x': (Math.floor((Math.random() * 500) + 1)).toString(),
    'y': (Math.floor((Math.random() * 500) + 1)).toString(),
    'az': az.toString(),
    'r': (Math.floor((Math.random() * 255) + 1)).toString(),
    'g': (Math.floor((Math.random() * 255) + 1)).toString(),
    'b': (Math.floor((Math.random() * 255) + 1)).toString(),
    'h': "1"
  };
  //i shall call him index
  socket.id = player.id;
  socket.player = player;
  Clients.push(socket);
  GameState.players.push(player);
  socket.emit('you', player);
  //everyone now has him
  io.emit('new player', socket.player);


  /*
   * SOCKET RECEIVE FUNCTIONS
   */

  //someone sent a chat message
  socket.on('chat message', function(arr){
    io.emit('chat message', arr);//i should probably sanitize this or something?
  });

  //someone disconnected
  socket.on('disconnect', function(){
    var i = Clients.indexOf(socket);
    console.log(i+' disconnected');
    io.emit('player disconnect', Clients[i].player.id);
    Clients.splice(i, 1);
  });

  //someone updated themselves
  socket.on('update', function(player) {
    //find the player in the master list of clients
    var i = Clients.indexOf(socket);
    //update the player to what this update sends us
    GameState.players[i] = player;

    //broadcast to all clients so they can update the player too
    //io.emit('update player', player);
  });

  //someone shot their gun
  socket.on('shot', function(player){

    var i = Clients.indexOf(socket);
    console.log(i+' shot their gun');
    shots.push({
      "player": player,
      "time": new Date()
    });
    //io.emit('player shot', Clients[i].player.id);
  });

}); // end of player connection scope


/**
 *  Server Loop
 *  Every few milliseconds, broadcast player data
 */

 setInterval(function() {
   io.emit('server update', GameState);
 }, 60);

gameServer.listen(3000, function() {
  console.log('Game server listening on port %d in %s mode', 3000, 'no');
});


module.exports = app;
