//react
var React = require('react');
var $     = require('jquery'); //installed with node
var PlayDisplayAPI = require('./PlayDisplayAPI');
var PlayConstants = require('./../flux/constants/PlayConstants');

//script variables
var canvas, ctx;
var resizeId;
var star_num = 100;
var stars = [];       //create stars
var target; //move towards target
var seek = true;     //move away from
var lagger = 0;
var rate = 0;
var colorIndex = 0;

//*** api

//set state.play = true/false

function reset(){

}
function reConfigureCanvas(w, h){

}
function exposeParameters(){

}


//*** source:

//star class
function Star(i){

    this.x = Math.floor((Math.random() * canvas.width) + 1);
    this.y = Math.floor((Math.random() * canvas.height) + 1);
    this.lag = Math.random() < 0.8 ? Math.floor((Math.random() * 13) + 2) : ( Math.random() * 48 + 2 );//Math.floor((Math.random() * 48) + 2);
    this.r = 5;
    this.color = getColor();
    this.t;
    this.i = 1;
    this.t = {x: Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)};

    this.React = function(){

        //abrupt change from resting to this
        var ratio = (Math.sqrt( square(target.x - this.x) + square(target.y - this.y) ) / (canvas.width));
        if (this.i == 2) {
            this.r = ((Math.floor ( 25 * ratio ) + 1) + this.r * 3) / 4;
        } else {
            this.r =  Math.floor ( 25 * ratio ) + 1;
        }

        //going towards mouse
        if (seek){

            if (this.i == 0){

                this.x += (Math.round(Math.random()) * 2 - 1) * (Math.floor((Math.random() * 5) + 1)) * .5 /  ( this.r );
                this.y += (Math.round(Math.random()) * 2 - 1) * (Math.floor((Math.random() * 5) + 1)) * .5 /  ( this.r );

                if (Math.abs(target.x - this.x) > 35 || Math.abs(target.y - this.y) > 35 ){
                    this.i = 1;
                }

            } else {

                //.5 -> .6
                this.x += (target.x - this.x) * 0.6 / (this.r + this.lag + lagger);
                this.y += (target.y - this.y) * 0.6 / (this.r + this.lag + lagger);

                if (Math.abs(target.x - this.x) < 3 && Math.abs(target.y - this.y) < 3){
                    this.i = 0;
                }

            }

        //going out explode!
        } else {

            var xx = (target.x - this.x);
            var yy = (target.y - this.y);

            if (this.i == 2 || xx > canvas.width / 4 || yy > canvas.height / 4){


                this.i = 2;

                var ratio = (Math.sqrt( square(this.t.x - this.x) + square(this.t.y - this.y) ) / (canvas.width));
                this.r =  Math.floor ( 25 * ratio ) + 1;

                this.x += (this.t.x - this.x) * 0.5 / (this.r + this.lag);
                this.y += (this.t.y - this.y) * 0.5 / (this.r + this.lag);


            } else {

                this.t = {x: Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)};

                //4 -> 0.5
                this.x += 0.5 * xx;
                this.y += 0.5 * yy;

            }

        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        //closer to hide -> faster move away

        //closer to target -> faster move in

        //closer to target -> smaller

        //further from target -> more colorful
    }
};

function getColor(){
  var colors    = [ "#ccff66", "#FFD700","#66ccff", "#ff6fcf", "#ff6666", "#F70000", "#D1FF36", "#7FFF00", "#72E6DA", "#1FE3C7", "#4DF8FF", "#0276FD", "#FF00FF"];
  var z = colorIndex % colors.length;
  colorIndex += 1;
  return colors[z];
};

function square(i){
  return i * i;
}

//module
var PlayStars = React.createClass({
  //usage, post render run this i think
  play: function() {
        canvas = document.getElementById(this.props.displayInfo.canvasId);

        if (canvas.getContext){

            ctx = canvas.getContext('2d');

            //configureCanvas();

            //target = {x: Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)};
            //default is congregate in the middle
            target = {x: Math.floor(0.5 * canvas.width + 1), y: Math.floor(0.5 * canvas.height + 1)};

            this.createStars(star_num);

            this.drawStars();

            canvas.addEventListener("mousemove", function(eventInfo) {
                //added logic for growth
                //this.props.onScriptHover(1);//this.props.id

                //endNewLogic

                seek = true;
                target = {x: eventInfo.offsetX || eventInfo.layerX, y:eventInfo.offsetY || eventInfo.layerY};
            });

            canvas.addEventListener("mouseup", function(eventInfo){

                //may want to do more here ... EXPLODE
                seek = false;
                i = 2;
                lagger = 150;
                target = {x: eventInfo.offsetX || eventInfo.layerX, y:eventInfo.offsetY || eventInfo.layerY};

            });

            canvas.addEventListener("mouseout", function(eventInfo){
                seek = false;
                i = 2;
            });
            /*
            //todo: comeback to resizeing later, let
            $(window).resize(function(){
                clearTimeout(resizeId);
                resizeId = setTimeout(onResizeDraw, 500);
            });
            */

            this.loop();
        }
  },
  createStars: function(x){
    for ( var i = 0; i < x; i++)
      stars.push( new Star(i) );
  },
  loop: function(){
    //if (this.props.play == "true")

    var l = star_num;
    var ll = stars.length;

    //if (l > ll)      this.createStars(l - ll);
    //else if (ll > l) this.reduceStars (ll - l);
    if (l > ll)      this.createStars(1);
    else if (ll > l) this.reduceStars (1);

    requestAnimationFrame(this.loop);

    this.drawStars();
    if (seek && lagger > 0) lagger -= 10;
  },
  reduceStars: function(x){
    for (var i = 0; i < x; i++) stars.pop();
  },
  drawStars: function() {
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //todo: for performance, draww all stars modulo the same at the same time (to do the same color)
      for (s in stars) {
          stars[s].React();
      }
  },
  onResizeDraw: function(){
      this.configureCanvas();
      this.drawStars();
  },
  configureCavas: function(w, h){
        canvas.width = w;
      canvas.height = h;
  },
  //react life cycle:
  componentDidMount: function(){
    this.play();
  },
  componentWillUnmount: function(){
    //this.state.play = "false";
  },
  render: function() {
    if (this.props.viewMode == PlayConstants.PLAY_FULL_SCREEN){
      star_num = 175;
    } else if (this.props.viewMode == PlayConstants.PLAY_SPLIT_SCREEN)
    switch (this.props.playMode) {
      case PlayConstants.PLAY_PLAY_FAST:
        //normal continue
        star_num = 50;
        break;
      case PlayConstants.PLAY_PLAY_SLOW:
        star_num = 25;
        //slow continue
        break;
      case PlayConstants.PLAY_PLAY_STOP:
        this.pause();
        return;
      case PlayConstants.PLAY_DELETE:
        this.cleanUp();
        this.deleteData();
      default:
        break;//hopefully doesn't happen
    }
    return PlayDisplayAPI.renderDisplay(this.props);
  }
});

module.exports = PlayStars;
