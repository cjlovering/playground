//react
var React = require('react');
var $     = require('jquery'); //installed with node
var PlayDisplayAPI = require('./PlayDisplayAPI');
var PlayConstants = require('./../flux/constants/PlayConstants');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var PlayActions = require('./../flux/actions/PlayActions');

//script variables
var canvas, ctx;
var canvasHeight, canvasWidth;

var resizeId;
var stars = [];

//constants
var BASE_SIZE = 4;
var LIGHT = ["#ccff66","#FFD700", "#66ccff", "#ff6fcf", "#ff6666", "#72E6DA"];
var VIBRANT = ["#7FFF00", "#0276FD", "#00FFFF", "#FF1493", "#FF0000"];
var TWOPI = Math.PI * 2;
var ANGLE = Math.PI / 180;
var N_CUTOFF = 6;
var SPEED = 2;

var settings;

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

      ANGLE = Math.PI / settings.angle;

      //get two-d context (as opposed to 3d)
      ctx = canvas.getContext('2d');

      this.drawStars();
      this.loop();
  },
  loop: function(){
    requestAnimationFrame(this.loop);

    ANGLE = Math.PI / settings.angle;

		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, this.props.width, this.props.height);

		var l = settings.star_num;
		var ll = stars.length;

    if (l > ll)      this.createStars(1);
    else if (ll > l) this.reduceStars (1);

		this.moveStars();
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
      var x  = Math.floor(Math.random() * this.props.width);
      var y  = Math.floor(Math.random() * this.props.height);
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
  componentWillMount: function(){
    settings = PlayDisplayAPI.getSettingDefaults(this.props.id);
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
    var t = (settings.threshold) * Math.sqrt(util.square(this.props.width) + util.square(this.props.height));
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

    var canvasJSX = PlayDisplayAPI.getCanvasDisplay(this.props);

    var iconGit = "fa fa-github fa-lg settingIcon" + this.props.focus;
    var iconCompress = "fa fa-compress fa-lg settingIcon" + this.props.focus;
    var iconRefresh = "fa fa-refresh fa-lg settingIcon" + this.props.focus;
    var iconClear = "fa fa-eraser fa-lg settingIcon" + this.props.focus;

    var forms = this.props.settingsVisible ?
    <div className="settingsDiv">
      <div className="settingsDivTitle">
       <h2>{this.props.name}</h2>
      </div>

      <div className="settingsDivSlider">
        <h3 className="settingSectionH">
          <a href={this.props.displayInfo.gitLink} target="_blank">
            <i className={iconGit}></i>
          </a>
          <i className={iconRefresh}
             onClick={this._reset}>
          </i>
          <i className={iconCompress}
             onClick={this._collapse}>
          </i>
        </h3>
      </div>

      <div className="form">
       <div className="settingsDivSlider">
         <h3 className="settingSectionH">Bridge Threshold</h3>
         <input
           id="slider1"
           type="range"
           max={1.0}
           min={0.0}
           step={0.01}
           value={settings.threshold}
           onChange={this.handleBridgeThresholdChange} />
         <output id="range1">{settings.threshold * 100}%</output>
       </div>
       <div className="settingsDivSlider">
         <h3 className="settingSectionH">Star Count</h3>
         <input
           id="slider2"
           type="range"
           max={200}
           min={1}
           step={5}
           value={settings.star_num}
           onChange={this.handleStarNumChange}/>
         <output id="range2">{settings.star_num}</output>
       </div>
       <div className="settingsDivSlider">
         <h3 className="settingSectionH">Angle</h3>
         <input
           id="slider3"
           type="range"
           max={360}
           min={1}
           step={1}
           value={settings.angle}
           onChange={this.handleAngleChange}/>
         <output id="range3">{settings.angle}</output>
       </div>
     </div>
   </div>  : null;

   return ( <div>
             <ReactCSSTransitionGroup
                    transitionName="settingsDiv"
                    transitionEnterTimeout={550}
                    transitionLeaveTimeout={550}
                  >
               {forms}
             </ReactCSSTransitionGroup>
             {canvasJSX}

            </div>
          );
  },
  handleStarNumChange: function( e ) {
    settings.star_num = e.target.value;
    this.forceUpdate();
  },
  handleBridgeThresholdChange: function( e ) {
    settings.threshold = e.target.value;
    this.forceUpdate();
  },
  handleAngleChange: function( e ) {
    settings.angle = e.target.value;
    this.forceUpdate();
  },
  /**
   * call action to focus on this particular pane.
   */
  _reset: function(){
    settings = PlayDisplayAPI.getSettingDefaults(this.props.id);
    this.forceUpdate();
  },
  /**
   * call action to focus on this particular pane.
   */
  _collapse: function(){
    PlayActions.goSplitViewMode(this.props.id);
  }

});

module.exports = PlayHubs;
