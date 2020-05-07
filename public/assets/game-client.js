var State = {
  'game': {
    'players': [],
    'shots': [],
  },
  'me': {
    'id': null,
    'pressedKeys': [],
    'player': []
  }

};
const GameSize = 600;
const PlayerWidth = playerHeight = GameSize / 6;

function getMyIndex() {
  for (var i = 0; i < State.game.players.length; i++)
    if (State.game.players[i].id == State.me.id)
      return i;
}

function refreshInputs(my) {
  $('#x').val(my.x);
  $('#y').val(my.y);
  $('#az').val(my.az);
  $('#r').val(my.r);
  $('#g').val(my.g);
  $('#b').val(my.b);
  $('#h').val(my.h);
  $('#red').slider('value', my.r);
  $('#green').slider('value', my.g);
  $('#blue').slider('value', my.b);
  $('#alpha').slider('value', my.h*10);
}

function go(i,dir,modifier) {
  //movement operations
  if (dir == 'left')
    State.game.players[i].x = State.game.players[i].x-modifier;
  else if (dir == 'up')
    State.game.players[i].y = State.game.players[i].y-modifier;
  else if (dir == 'down')
    State.game.players[i].y = State.game.players[i].y+modifier;
  else if (dir == 'right')
    State.game.players[i].x = State.game.players[i].x+modifier;
  //boundary checks
  if (State.game.players[i].x < 0)
    State.game.players[i].x = 0;
  else if (State.game.players[i].x > GameSize)
    State.game.players[i].x = GameSize
    if (State.game.players[i].y < 0)
      State.game.players[i].y = 0;
  else if (State.game.players[i].y > GameSize)
    State.game.players[i].y = GameSize;
}

function look(i,dir) {
  // if (State.game.players[i].az >= ((dir+180)%360) && State.game.players[i].az < ((dir+360)%360)
  //   State.game.players[i].az = ((State.game.players[i].az + 2) + 360) % 360;
  // else if (State.game.players[i].az % 360 != dir)
  //   State.game.players[i].az = ((State.game.players[i].az - 2) + 360) % 360;

  if (dir == 0) {
    if (State.game.players[i].az >= 180 && State.game.players[i].az < 360)
      State.game.players[i].az = ((State.game.players[i].az + 2) + 360) % 360;
    else if (State.game.players[i].az % 360 != 0)
      State.game.players[i].az = ((State.game.players[i].az - 2) + 360) % 360;
  } else if (dir == 90) {
    if (State.game.players[i].az >= 270 || State.game.players[i].az < 90)
      State.game.players[i].az = ((State.game.players[i].az + 2) + 360) % 360;
    else if (State.game.players[i].az % 360 != 90)
      State.game.players[i].az = ((State.game.players[i].az - 2) + 360) % 360;
  } else if (dir == 180) {
    if (State.game.players[i].az >= 0 && State.game.players[i].az < 180)
      State.game.players[i].az = ((State.game.players[i].az + 2) + 360) % 360;
    else if (State.game.players[i].az % 360 != 180)
      State.game.players[i].az = ((State.game.players[i].az - 2) + 360) % 360;
  } else if (dir == 270) {
    if (State.game.players[i].az > 270 || State.game.players[i].az < 90)
      State.game.players[i].az = ((State.game.players[i].az - 2) + 360) % 360;
    else if (State.game.players[i].az % 360 != 270)
      State.game.players[i].az = ((State.game.players[i].az + 2) + 360) % 360;
  }
}

function shoot(id) {
  console.log('shoot('+id+')!');
}

//process keystroke input if needed
//draw players on the screen
function play() {

  var i = getMyIndex();
  if (i === null) {
    console.log('ERROR: Cannot find myself in players list!');
    return;
  }

  //------------------------
  //keyloggs frosted flakes
  //------------------------
  var updateMe = false; //update if keys are pressed
  //console.log('updateMe is false');
  var shift = 1; //movement speed depending if shift is pressed
  //if the message box is in focus, we want to write stuff, not have our keys logged for movement
  if (!$('#m').is(':focus')) {

    //so log play keys

    //shift key speed
    if(State.me.pressedKeys[16]) {
      //console.log('shift pressed');
      shift = 2;
    } else {
      //console.log('shift unpressed');
      shift = 1;
    }

    //azimuth directional
    if(State.me.pressedKeys[37]) {
      //console.log('left pressed');
      look(i,270);
      updateMe = true;
    }
    if(State.me.pressedKeys[38]) {
      //console.log('up pressed');
      look(i,0);
      updateMe = true;
    }
    if(State.me.pressedKeys[39]) {
      //console.log('right pressed');
      look(i,90);
      updateMe = true;
    }
    if(State.me.pressedKeys[40]) {
      //console.log('down pressed');
      look(i,180);
      updateMe = true;
    }

    //movement directional
    if (State.me.pressedKeys[87]) {
      //console.log('w pressed');
      go(i,'up', shift);
      updateMe = true;
    }
    if (State.me.pressedKeys[65]) {
      //console.log('a pressed');
      go(i,'left', shift);
      updateMe = true;
    }
    if (State.me.pressedKeys[83]) {
      //console.log('s pressed ');
      go(i,'down', shift);
      updateMe = true;
    }
    if (State.me.pressedKeys[68]) {
      //console.log('d pressed');
      go(i,'right', shift);
      updateMe = true;
    }
    if (State.me.pressedKeys[32]) {
      //shoot accepts i, which is this player's id
      shoot(i);
    }
  }

  if (updateMe) {
    var arr = toArr(
      State.me.id,
      State.game.players[i].x,
      State.game.players[i].y,
      State.game.players[i].az,
      State.game.players[i].r,
      State.game.players[i].g,
      State.game.players[i].b,
      State.game.players[i].h
    );
    //send
    arr.forceUpdate = false;
    socket.emit('update', arr);
    //put my new position values in my input elements
    refreshInputs(arr);
  }


  //--------------------------
  //draw players on the canvas
  //--------------------------
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  function drawRotatedRect(x, y, width, height, degrees) {
    //console.log('drawrotated');
    // first save the untranslated/unrotated context
    ctx.save();
    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x + width / 2, y + height / 2);
    // rotate the rect
    ctx.rotate(degrees * Math.PI / 180);
    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fill();
  }


  ctx.save();
  ctx.clearRect(0,0,GameSize,GameSize);

  for (var i = 0; i < State.game.players.length; i++) {

    var player = State.game.players[i];
    //this sets the context back into the corner so we can work from that point again to display the next player
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(250,250,250,1)" + player.h + ")";

    drawRotatedRect(Math.abs(player.x), Math.abs(player.y), PlayerWidth, playerHeight, Math.abs(player.az));
    ctx.fillStyle ="rgb("
      + player.r
      + ","
      + player.g
      + ","
      + player.b
      + ")";
    ctx.font = "60px Orbitron";
    ctx.fillText(player.id.toString(),-25,25);
  }
  //ctx.fillRect(x, y,100,100);
  ctx.restore();

  if ($('#myonoffswitch').is(":checked"))
    setTimeout(function() {play()}, 20);
} //end play function


//---------------------

var socket = io({transports: ['websocket'], upgrade: false});
$(document).ready(function() {

/*
  color swatch
*/

function refreshSwatch() {
  var red = $( "#red" ).slider( "value" ).toString(),
      green = $( "#green" ).slider( "value" ).toString(),
      blue = $( "#blue" ).slider( "value" ).toString(),
      alpha = ($("#alpha").slider("value")/10).toString();
  $( "#swatch" ).css("background-color", "rgba(" + red + "," + green + "," + blue + "," + alpha + ")");
  $('#r').val(red);
  $('#g').val(green);
  $('#b').val(blue);
  $('#h').val(alpha);
}

$(function() {
  $( "#red, #green, #blue" ).slider({
    orientation: "horizontal",
    range: "min",
    max: 255,
    value: 127,
    slide: refreshSwatch,
    change: refreshSwatch
  });
});
$(function() {
  $("#alpha").slider({
    orientation: "horizontal",
    range: "min",
    max: 10,
    value: 10,
    slide: refreshSwatch,
    change: refreshSwatch
  });
});


});





  function escPressed() {
    if ($('.menu-container.is-active').length) {
      $('#closeChat').click();
    } else {
      $('#openChat').click();
    }
  }
  //$('#m').shiftenter();
  // $("#messages").mCustomScrollbar({
  //   setWidth: '300px',
  //   setHeight: '200px',
  // });
  $('.scrollbar-macosx').scrollbar();
  // $("#myonoffswitch").onoff();

  $(document.body).keydown(function (evt) {
      //not esc that was pressed
      if (evt.keyCode !== 27) {
        State.me.pressedKeys[evt.keyCode] = true;
      //handle esc presses differently
      } else {
        escPressed();
      }
  });
  $(document.body).keyup(function (evt) {
    if (evt.keyCode !== 27) {
      State.me.pressedKeys[evt.keyCode] = false;
    }
  });


/*
* SOCKET RECEIVE FUNCTIONS
*/

function toArr(id, x, y, az, r, g, b, h) {
  return {'id': id, 'x': x, 'y': y, 'az': az, 'r': r, 'g': g, 'b': b, 'h': h};
}

//if you connect
socket.on('connect', function () {
  console.log('socket.connect');
});
socket.on('you', function(player) {
  console.log('socket.you');
  State.me.id = player.id;
});
//if you receive your id
socket.on('server update', function (state) {
  //handle State.game.players
  //console.log('socket.server update');
  State.game = state;
  State.game.players[State.me.id] = State.me.player;
  //console.log('game state follows');
  //console.log(State.game);

  $('.chat-info').first().text('Player Count: ' + State.game.players.length);

  //todo why is this here
  $('#myonoffswitch').on('change', function(e) {
    if($(this).is(":checked")) {
      play();
      $('body').addClass('no-flow');
      $('.play-game-btn').remove();
    } else {
      $('body').removeClass('no-flow');
    }
  });

  for (var i = 0; i < State.game.players.length; i++) {
    $('.players')
      .append(
        $('<li></li>')
          .addClass('list-group-item')
          .attr('data-id',State.game.players[i].id)
          .text(State.game.players[i].id)
      );
  }

});

//if server sends you notice of new player
socket.on('new player', function (player) {
  console.log('socket.new player');
  console.log(player);
  State.game.players.push(player);
  $('.chat-info').first().text('Player Count: ' + State.game.players.length);
  $('.panel-chat').first().append($('<li />').css('font-style','italic').css('color','#5c5').css('text-align','center').text("Player " + player.id + " connected"));
  $('.panel-chat').first().scrollTop($('.panel-chat').first().prop('scrollHeight'));
  $('.players')
    .append(
      $('<li></li>')
        .addClass('list-group-item')
        .attr('data-id',State.game.players[(State.game.players.length -1)].id)
        .text(State.game.players[(State.game.players.length -1)].id)
    );
  var myIndex = getMyIndex();
  if (player.id === State.game.players[myIndex].id) {
    $('#x').val(State.game.players[myIndex].x);
    $('#y').val(State.game.players[myIndex].y);
    $('#az').val(State.game.players[myIndex].az);
    $('#r').val(State.game.players[myIndex].r);
    $('#g').val(State.game.players[myIndex].g);
    $('#b').val(State.game.players[myIndex].b);
    $('#h').val(State.game.players[myIndex].h);
    $('#red').slider('value', State.game.players[myIndex].r);
    $('#green').slider('value', State.game.players[myIndex].g);
    $('#blue').slider('value', State.game.players[myIndex].b);
    $('#alpha').slider('value', State.game.players[myIndex].h*10);
  }

});

//if server sends you notice of player disconnected
socket.on('player disconnect', function (id) {
  console.log('socket.player disconnect');
  for (var i = 0; i < State.game.players.length; i++) {
    if (State.game.players[i].id == id) {
      //remove this from State.game.players
      State.game.players.splice(i, 1);
      $('.players li')
        .filter('[data-id="' + id + '"]')
        .remove();
      break;
    }
  }
  $('.chat-info').first().text('Player Count: ' + State.game.players.length);
  $('.panel-chat').first().append($('<li />').css('font-style','italic').css('color','#55c').css('text-align','center').text("Player " + id + " disconnected"));
  $('.panel-chat').first().scrollTop($('.panel-chat').first().prop('scrollHeight'));
});

//if server sends you data to update player
socket.on('update player', function (player) {
  if (player.id == State.me.id && !player.forceUpdate) {
    //console.log('not updating, player is me!');
    return;
  }
  //console.log('before update player State.game.players=');
  //console.log(State.game.players);
  console.log('socket.update player');
  //var arr = toArr(player.id, player.x, player.y, player.az, player.r, player.g, player.b, player.h);
  for (var i = 0; i < State.game.players.length; i++) {
    if (State.game.players[i].id == player.id) {
      State.game.players[i].x = player.x;
      State.game.players[i].y = player.y;
      State.game.players[i].az = player.az;
      State.game.players[i].r = player.r;
      State.game.players[i].g = player.g;
      State.game.players[i].b = player.b;
      State.game.players[i].h = player.h;
      console.log(State.game.players[i]);
      break;
    }
  }
  //$('.player'+player.id).html(JSON.stringify(arr, null, 2));
});

socket.on('chat message', function(arr) {
  var li = $('<li />');
  var span = $('<span />').text(arr.id.toString() + ':').css({'padding-right': '5px','color': 'rgb(' + arr.r + ',' + arr.g + ',' + arr.b + ')', 'font-weight': 'bold'});
  var msg = $('<span />').text(arr.msg);
  span.appendTo(li);
  msg.appendTo(li);
  var panelLi = li.clone();
  $('#messages').append(li);
  $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  $('.panel-chat').first().append(panelLi);
  $('.panel-chat').first().scrollTop($('.panel-chat').first().prop('scrollHeight'));
});
//if you disconnect
socket.on('disconnected', function (socket) {
  console.log('socket.disconnected');
});


/*
 * SOCKET SEND FUNCTIONS
 */

//if you submit the update form
$('#update').submit(function(e) {
  e.preventDefault();
  //if values arent empty
  var posValues = $('#x').val().length > 0 && $('#y').val().length > 0 && $('#az').val().length > 0;
  var appValues = $('#r').val().length > 0 && $('#g').val().length > 0 && $('#b').val().length > 0 && $('#h').val().length > 0;
  if (posValues && appValues) {
    //make values into arr, and into json to send
    var arr = toArr(State.me.id, $('#x').val(), $('#y').val(), $('#az').val(), $('#r').val(), $('#g').val(), $('#b').val(), $('#h').val());
    //since we dont usually update ourselves on our own screen via server, we force update here
    arr.forceUpdate = true;
    //send
    socket.emit('update', arr);
  } else {
    alert('Make sure you have filled out all fields');
  }

});

//if you submit the chat form
$('.chat').submit(function(e){
  e.preventDefault();
  if ($('#m').val().length > 0) {
    var pR;
    var pG;
    var pB;
    for (var i = 0; i < State.game.players.length; i++) {
      if (State.game.players[i].id == State.me.id) {
        pR = State.game.players[i].r;
        pG = State.game.players[i].g;
        pB = State.game.players[i].b;
        break;
      }
    }
    var arr = {
      id: State.me.id,
      msg: $('#m').val(),
      r: pR,
      g: pG,
      b: pB
    }
    socket.emit('chat message', arr);
    $('#m').val('').focus();
  }
  return false;
});

$('#random').submit(function(e) {
  e.preventDefault();
  var az = Math.floor((Math.random() * 360) + 1);
  if (az % 2 == 1) {
    az = (az + 1) % 360;
  }
  var me = toArr(
      State.me.id,
      Math.floor((Math.random() * 700) + 1).toString(),
      Math.floor((Math.random() * 700) + 1).toString(),
      az.toString(),
      Math.floor((Math.random() * 255) + 1).toString(),
      Math.floor((Math.random() * 255) + 1).toString(),
      Math.floor((Math.random() * 255) + 1).toString(),
      (((Math.random() * 100) + 1)/100).toFixed(1).toString()
    );
    //since we dont usually update ourselves on our own screen via server, we force update here
    me.forceUpdate = true;
    //add me to my own state
    GameState.me.player = me;
    //send
    socket.emit('update', me);
    //put my new position values in my input elements
    refreshInputs(me);
});

$('#randomBtn').click(function() {
  $('#random').submit();
});

$('.chatBtn').on('click', function() {
  $('.chat').submit();
});

$('h4.panel-title a').first().on('click', function () {
  $('#m').focus();
});

$('.chat-bar .menu-toggle').on("click", function(e) {
  e.preventDefault();
  $('.menu-container').addClass('is-active');
  $('.page-container').addClass('is-active');
});

$('.menu-container .menu-toggle').on("click", function(e) {
  e.preventDefault();
  $('.menu-container').removeClass('is-active');
  $('.page-container').removeClass('is-active');
});

$('#openChat').on('click', function() {
  $('#myonoffswitch').prop('checked', false).trigger('change');
  $('#m').focus();
});
$('#closeChat').on('click', function() {
  $('#myonoffswitch').prop('checked', true).trigger('change');
  $('#m').blur();
});
$('.play-game-btn').on('click', function() {
  $('#myonoffswitch').prop('checked', true).trigger('change');
  $(this).remove();
});
