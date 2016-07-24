//react
var React = require('react');
var $     = require('jquery'); //installed with node
var PlayDisplayAPI = require('./PlayDisplayAPI');
var PlayConstants = require('./../flux/constants/PlayConstants');

//script variables
var canvas, ctx;
var canvasHeight, canvasWidth;

var resizeId;
//    var star_num = 40;
var stars = [];       //create stars

//constants
//var RATE =  10;//100
var BASE_SIZE = 4;
var LIGHT = ["#ccff66","#FFD700", "#66ccff", "#ff6fcf", "#ff6666", "#72E6DA"];
var VIBRANT = ["#7FFF00", "#0276FD", "#00FFFF", "#FF1493", "#FF0000"];
var TWOPI = Math.PI * 2;
var ANGLE = Math.PI / 180;
var N_CUTOFF = 6;
var SPEED = 2;

//edge requirements  - defined in configure canvas
var build_threshold;

//dynamic data (keeping it static for now for simplicty)
//i used to use ractive here, but gonna just not for now
var data = {
  threshold: 0.21,
  star_num: 25,
  rate: 5,
  angle: 180,
  visible: false
};



//this is going to be a slightly simplified version, probably will reduce interactions
//AND colors for now.


//basic math and utility funcitons
var util = {
  /**
   * random :: num num num -> num
   * generates a random number from min to max (with optional step val)
   */
  random: function(min, max, step) {
    step = step || 1;
    return (Math.round(Math.random() * ((max - min) / step)) * step) + min;
  },
  /**
    * distance :: num num num num -> num
    * calculates the distance between the points
    */
  distance: function(x, y, xx, yy){
    return Math.round(Math.sqrt(this.square(xx - x) + this.square(yy - y)));
  },
  /**
    * square :: num -> num
    * squares the number
    */
  square: function(i){
    return i * i;
  }
}

/**
 * Star :: num num num num -> lambda (object)
 * x -> vert location
 * y -> horz location
 * vx -> vert velocity
 * vy -> horz velocity
 */
function Star(x, y, vx, vy) {
  //stars in random locations that are passed in
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.GetX = function(){ return this.x; };
  this.GetY = function(){ return this.y; };

  //move
  this.Move = function(){

    //if out of bounds, move towards inbounds - note: this may be unnesscesarily expensive
    //the other option would be spawning anew
    if ((this.x > canvasWidth) && (this.vx > 0)) this.vx *= -1;
    if ((this.y > canvasHeight) && (this.vy > 0)) this.vy *= -1; //it was canvas.width - mistake?
    if ((this.x < 0) && (this.vy < 0)) this.vy *= -1;
    if ((this.y < 0) && (this.vy < 0)) this.vy *= -1;

    //goal: stop just going in ducking circles
    this.x += Math.round(this.vx * Math.cos( ANGLE * this.y));
    this.y += Math.round(this.vy * Math.cos( ANGLE * this.x));

  };

  //draw
  this.Draw = function(n){

    ctx.fillStyle = paint.color(n);
    ctx.globalAlpha = (.30 + .17 * n);
    ctx.beginPath();

    //option -> switch on n: 2*n, polygon
    //it may be considerably faster to draw triangles over circles
    ctx.arc(Math.round(this.x), Math.round(this.y), paint.size(n), 0, TWOPI, true);
    ctx.closePath();
    ctx.fill();
  };
}

//colors, size, and other painting helpers
var paint = {

  /**
  * paint.color :: num -> color
  * gets the color
  */
  color: function(n){
    return VIBRANT[((Math.round(n/2))%VIBRANT.length)];
    //light
    if ( n < N_CUTOFF ) {
  return LIGHT[n]
    //vibrant
    } else {
    }
  },
  /**
  * paint.radius :: num -> num
  * computes the size of the hub/star
  */
  size: function(n){
    return BASE_SIZE;
  }
}

var PlayHubs = React.createClass({
  play: function(){
      canvas = document.getElementById('hubWay');//update canvas

      ANGLE = Math.PI / data.angle;

      //get two-d context (as opposed to 3d)
      ctx = canvas.getContext('2d');

      //configure the size of the canvas + thresholds
      //this.configureCanvas();

      //create all the stars, pseudo randomly
      // phase 1: draw hubs
      this.drawStars();
      // phase 2: draw edges
      //drawEdges();

      //loops
      this.loop();
  },
  loop: function(){
    requestAnimationFrame(this.loop);

    ANGLE = Math.PI / data.angle;

		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, this.props.width, this.props.height);

		var l = data.star_num;
		var ll = stars.length;

	  //if (l > ll)      this.createStars(l - ll);
		//else if (ll > l) this.reduceStars (ll - l);
    if (l > ll)      this.createStars(1);
    else if (ll > l) this.reduceStars (1);
		// phase 1: move stars
		this.moveStars();

		// phase 2: draw stars & edges
		this.drawStars();
  },
  /**
  * createStars :: (void) -> (void)
  * fills `array` with new stars at random locations
  * in the inner 1/3 box of the canvas
  */
  createStars: function(x){
    for ( var i = 0; i < x; i++)
    {
      var x  = util.random(0, this.props.width);
      var y  = util.random(0, this.props.height);
      var vx = util.random(1, SPEED, .1);
      var vy = util.random(1, SPEED, .1);

      stars.push( new Star(x, y, vx, vy) );
    }
  },
  moveStars: function(){
    for (s in stars) stars[s].Move();
  },
  reduceStars: function(x){
    for (var i = 0; i < x; i++) stars.pop();
  },
  componentWillReceiveProps: function(nextProps){
    if(this.props.width != nextProps.width || this.props.height != nextProps.height){
      canvasWidth  = nextProps.width;
      canvasHeight = nextProps.height;
      //this.configureCanvas(nextProps.width, nextProps.height);
    }
  },
  componentDidMount: function(){
    //this.createStars(data.star_num);
    this.play();
  },
  componentWillUnmount: function(){
    stars.length = 0;
  },
  /**
   *  configureCanvas :: (void) -> (void)
   *  sizes canvas to be the size of the window
   *  sizes thresholds
   */
  configureCanvas: function(x, y){
    //compare this with just letting css do its job.
    canvas.width = x;
    canvas.height = y;
  },
  drawStars: function() {
    var t = (data.threshold) * Math.sqrt(util.square(this.props.width) + util.square(this.props.height));
    var n;
    var ss, zz;

    for (s in stars) {
      ss = stars[s];
      n = 0;
      for (z in stars) {
        zz = stars[z];
        var d = util.distance(ss.GetX(), ss.GetY(), zz.GetX(), zz.GetY());
        var o = (t - d)/t;
        if (o > 0 && o != 1) {
          ctx.beginPath();
          ctx.moveTo(ss.GetX(), ss.GetY());
          ctx.lineTo(zz.GetX(), zz.GetY());
          ctx.strokeStyle = 'rgba(0, 0, 0, ' + o + ')';
          ctx.stroke();
          n+=1;
        }
      }
      ss.Draw(n);
    }
  },
  render: function() {

    if (this.props.viewMode == PlayConstants.PLAY_FULL_SCREEN){
      data.threshold = 0.15;
      data.star_num = 30;
    }
    else if (this.props.viewMode == PlayConstants.PLAY_SPLIT_SCREEN)
    switch (this.props.playMode) {
      case PlayConstants.PLAY_PLAY_FAST:
        //normal continue
        data.threshold = 0.20;
        //data.rate = 5;
        data.star_num = 20;
        break;
      case PlayConstants.PLAY_PLAY_SLOW:
        data.threshold = 0.15;
        //data.rate = 20;
        data.star_num = 20;
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

module.exports = PlayHubs;
