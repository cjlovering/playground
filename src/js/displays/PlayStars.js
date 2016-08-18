//react
var React = require('react');
var $     = require('jquery'); //installed with node
var PlayDisplayAPI = require('./PlayDisplayAPI');
var PlayConstants = require('./../flux/constants/PlayConstants');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var PlayActions = require('./../flux/actions/PlayActions');

//var InputRange =  require('react-input-range');

//script variables
var canvas, ctx;
var resizeId;

var stars = [];       //create stars
var target; //move towards target
var seek = true;     //move away from
var lagger = 0;
var colorIndex = 0;
var canvasWidth, canvasHeight, diagonal;
var settingIconIndex = 0;

//waiting on figuring out fix
var settings =   {
    starNum: 100,
    alpha: 0.5,
    baseSize: 25,
    explode: 4,
    escapeThresh: 35,
    swarmThreshold: 3
  };


//star class
function Star(i){

    this.x = Math.floor((Math.random() * canvasWidth) + 1);
    this.y = Math.floor((Math.random() * canvasHeight) + 1);
    this.lag = Math.random() < 0.8 ? Math.floor((Math.random() * 13) + 2) : ( Math.random() * 48 + 2 );//Math.floor((Math.random() * 48) + 2);
    this.r = 5;
    this.color = getColor();
    this.t;
    this.i = 1;
    this.t = {x: Math.floor((Math.random() * canvasWidth) + 1), y: Math.floor((Math.random() * canvasHeight) + 1)};

    this.React = function(){

        //abrupt change from resting to this
        var ratio = (Math.sqrt( square(target.x - this.x) + square(target.y - this.y) )) / diagonal;
        if (this.i == 2) {
            this.r = ((Math.floor ( settings.baseSize * ratio ) + 1) + this.r * 3) / 4;
        } else {
            this.r =  Math.floor  ( settings.baseSize * ratio ) + 1;
        }

        //going towards mouse
        if (seek){

            //if we're close enough
            if (this.i == 0){

                //move randomly
                this.x += (Math.round(Math.random()) * 2 - 1) * (Math.floor((Math.random() * 5) + 1)) * .5 /  ( this.r );
                this.y += (Math.round(Math.random()) * 2 - 1) * (Math.floor((Math.random() * 5) + 1)) * .5 /  ( this.r );

                //escape?
                if (Math.abs(target.x - this.x) > settings.escapeThresh || Math.abs(target.y - this.y) > settings.escapeThresh ){
                    this.i = 1;
                }

            //go towards the mouse
            } else {

                //.5 -> .6
                this.x += (target.x - this.x) * settings.alpha / (this.r + this.lag + lagger);
                this.y += (target.y - this.y) * settings.alpha / (this.r + this.lag + lagger);

                //if we get really close, star to swarm
                if (Math.abs(target.x - this.x) < settings.swarmThreshold && Math.abs(target.y - this.y) < settings.swarmThreshold){
                    this.i = 0;
                }

            }

        //going out explode out!

        } else {

            //difference between the click
            var xx = (target.x - this.x);
            var yy = (target.y - this.y);

            //finding resting place
            if (this.i == 2 || xx > canvasWidth / 4 || yy > canvasHeight / 4){


                this.i = 2;

                var ratio = (Math.sqrt( square(this.t.x - this.x) + square(this.t.y - this.y) )) / diagonal;
                this.r =  Math.floor ( settings.baseSize * ratio ) + 1;

                this.x += (this.t.x - this.x) * settings.alpha / (this.r + this.lag);
                this.y += (this.t.y - this.y) * settings.alpha / (this.r + this.lag);

            //moving out
            } else {

                this.t = {x: Math.floor((Math.random() * canvasWidth) + 1), y: Math.floor((Math.random() * canvasHeight) + 1)};

                //4 -> 0.5 -> 1.2
                this.x += settings.explode * (xx + 5);
                this.y += settings.explode * (yy + 5);

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
  defaultSettings: function(){
    settings =  {
        starNum: 100,
        alpha: 0.5,
        baseSize: 25,
        explode: 4,
        escapeThresh: 35,
        swarmThreshold: 3
      };
  },
  play: function() {
        canvas = document.getElementById(this.props.displayInfo.canvasId);

        if (canvas.getContext){

            ctx = canvas.getContext('2d');

            //configureCanvas();

            //target = {x: Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)};
            //default is congregate in the middle
            target = {x: Math.floor(0.5 * canvasWidth + 1), y: Math.floor(0.5 * canvasHeight + 1)};

            this.createStars(settings.starNum);

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

    var l  = settings.starNum;
    var ll = stars.length;

    if (l > ll)      this.createStars(l - ll);
    else if (ll > l) this.reduceStars (ll - l);
    // if (l > ll)      this.createStars(1);
    // else if (ll > l) this.reduceStars (1);

    requestAnimationFrame(this.loop);

    this.drawStars();
    if (seek && lagger > 0) lagger -= 10;
  },
  reduceStars: function(x){
    for (var i = 0; i < x; i++) stars.pop();
  },
  drawStars: function() {
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      //todo: for performance, draww all stars modulo the same at the same time (to do the same color)
      for (s in stars) {
          stars[s].React();
      }
  },
  onResizeReConfigure: function(x, y){
    //rather than calculate parameters based on current width
    //   and height,
    // var c = document.getElementById(this.props.displayInfo.canvasId);
    // var newSize = {
    //   width: x + "px",
    //   height: y + "px"
    // };
    // c.classlist.add(newSize);
    //canvas.width = x;
    //canvas.height = y;

  },
  componentWillReceiveProps: function(nextProps){
    if(this.props.width  != nextProps.width || this.props.height != nextProps.height){
      canvasWidth  = nextProps.width;
      canvasHeight = nextProps.height;
      diagonal = Math.sqrt( square(nextProps.width) + square(nextProps.height) );
      this.onResizeReConfigure(nextProps.width, nextProps.height);
    }
  },
  componentWillMount: function(){
    //set settings to defaults;

  },
  //react life cycle:
  componentDidMount: function(){

    diagonal = Math.sqrt( square(this.props.width) + square(this.props.height) );
    canvasWidth  = this.props.width;
    canvasHeight = this.props.height;

    this.play();

    // if (this.props.viewMode == PlayConstants.PLAY_FULL_SCREEN){
    //   this.setState({starNum : 175, rate : 0});
    // } else if (this.props.viewMode == PlayConstants.PLAY_SPLIT_SCREEN)
    // switch (this.props.playMode) {
    //   case PlayConstants.PLAY_PLAY_FAST:
    //     //normal continue
    //     this.setState({starNum : 50, rate : 0});
    //     break;
    //   case PlayConstants.PLAY_PLAY_SLOW:
    //     this.setState({starNum : 25, rate : 5});
    //     //slow continue
    //     break;
    //   case PlayConstants.PLAY_PLAY_STOP:
    //     this.pause();
    //     return;
    //   case PlayConstants.PLAY_DELETE:
    //     this.cleanUp();
    //     this.deleteData();
    //   default:
    //     break;//hopefully doesn't happen
    // };


    //this.play();
  },
  componentWillUnmount: function(){
    //this.state.play = "false";
    stars = [];
  },
  render: function() {
    var canvasJSX = PlayDisplayAPI.getCanvasDisplay(this.props);

    var iconGit = "fa fa-github fa-lg settingIcon" + this.props.focus;
    var iconCompress = "fa fa-compress fa-lg settingIcon" + this.props.focus;
    var iconRefresh = "fa fa-refresh fa-lg settingIcon" + this.props.focus;

    var iconSetting = settingIconIndex == 0 ? "fa fa-plane fa-lg settingIcon" + this.props.focus :
                      settingIconIndex == 1 ? "fa fa-truck fa-lg settingIcon" + this.props.focus :
                                              "fa fa-fighter-jet fa-lg settingIcon" + this.props.focus

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
          <i className={iconSetting}
             onClick={this._nextSetting}>
          </i>
          <i className={iconCompress}
             onClick={this._collapse}>
          </i>

        </h3>
      </div>

      <div className="form">
       <div className="settingsDivSlider">
         <h3 className="settingSectionH">Star Count</h3>
         <input
           id="slider1"
           type="range"
           max={1000}
           min={0}
           step={25}
           value={settings.starNum}
           onChange={this.handleStarNumChange}
         />
         <output id="range1">{settings.starNum}</output>
       </div>
       <div className="settingsDivSlider">
         <h3 className="settingSectionH">Velocity</h3>
         <input
           id="slider2"
           type="range"
           max={2.00}
           min={0.01}
           step={0.01}
           value={settings.alpha}
           onChange={this.handleAlphaChange}
         />
         <output id="range1">{settings.alpha}</output>
       </div>
       <div className="settingsDivSlider">
         <h3 className="settingSectionH">Star Size</h3>
         <input
           id="slider4"
           type="range"
           max={300}
           min={1}
           step={1}
           value={settings.baseSize}
           onChange={this.handleBaseSizeChange}
         />
         <output id="range1">{settings.baseSize}</output>
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

    //PlayDisplayAPI.renderDisplay(this.props);
      // (<canvas id={this.props.displayInfo.canvasId}
      //         className={styleName}
      //         width={this.props.width}
      //         height={this.props.height}>
      // </canvas>);
  },
  handleStarNumChange: function( e ) {
    //document.getElementById('range1').innerHTML = e.target.value;
    settings.starNum = e.target.value;
    this.forceUpdate();
  },
  handleAlphaChange: function( e ) {
    settings.alpha = e.target.value;
    this.forceUpdate();
    //this.setState({ alpha: value });
  },
  handleBaseSizeChange: function( e ) {
    settings.baseSize = e.target.value;
    this.forceUpdate();
  },
  /**
   * call action to focus on this particular pane.
   */
  _reset: function(){
    settings = PlayDisplayAPI.getSettingDefaults(this.props.id, 0);
    this.forceUpdate();
  },
  /**
   * call action to focus on this particular pane.
   */
  _collapse: function(){
    PlayActions.goSplitViewMode(this.props.id);
  },
  /**
   * call action to focus on this particular pane.
   */
  _nextSetting: function(){
    settingIconIndex = settingIconIndex == 0 ? 1 : settingIconIndex == 1 ? 2 : 0;
    settings = PlayDisplayAPI.getSettingDefaults(this.props.id, settingIconIndex);
    this.forceUpdate();
  },

});
module.exports = PlayStars;
