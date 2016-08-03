//react
var React = require('react');
var $     = require('jquery'); //installed with node
var PlayConstants = require('./../flux/constants/PlayConstants');
var PlayDisplayAPI = require('./PlayDisplayAPI');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var PlayActions = require('./../flux/actions/PlayActions');

/** ENUMS **/
var RAND = {
  LEFT : {value: 0, name: "Small", code: "S"},
  RIGHT: {value: 1, name: "Medium", code: "M"},
  NORM : {value: 2, name: "Large", code: "L"}
};

/** VARS **/
var canvas, ctx;
var pixels;
var width, height;
var xposition, yposition;
var ffx, ffy;
var tx, ty;

var sr, sg, sb, er, eg, eb, cr, cg, cb, shiftr, shiftg, shiftb;

var count = 0;
var finish;

/* prev ractive variables: gonna store em together for ease */
var settings = {
  start: "0000FF",
  end: "88FF00",
  play: PlayConstants.PLAY_PLAY_SLOW,
  boost: 26,
  increment: 0.10,
  rate: 100,
  playing: true
};

//for now we're not gonna make the control box visible

var PlayGradients = React.createClass({
  play: function(){
    canvas = document.getElementById('pixelMap');

    if (canvas.getContext)
    {
      ctx = canvas.getContext('2d');
      this.configureCanvas(settings.start, settings.end);
      configureColor();
      this.loop();
    } else console.log("Canvas context not found");
  },
  loop: function(){
    //to start, we're just gonna let it run as fast as it can and see
    //gonna experiment keeping this boost factor vs not.

    if(settings.playing)
    for(var i = 0; i < (settings.boost < 20 ? settings.boost : (settings.boost * 10)); i++)
    {
        paint();
        count += 1;
        if (count >= finish){
            //ctx.clearRect(0, 0, height, width);
            //console.log("count:", count);
            //console.log("finish:", finish);

            randomColor();
            this.configureCanvas();
            count = 1;
            break;
        }
    }

    if (settings.rate > 0){
      setTimeout(this.loop, settings.rate);
    } else {
      requestAnimationFrame(this.loop);
    }
  },
  configureCanvas: function(){
    /*
    var h = $(window).height();
    var w = $(window).width();

    canvas.width = w;
    canvas.height = h;
    */
    width = canvas.width;
    height = canvas.height;

    finish = width * height;

    pixels = [];
    for ( var i = 0; i < width; i++) pixels[i] = Array(height);
    for ( var i = 0; i < width; i++){
         for ( var j = 0; j < height; j++){
            pixels[i][j] = "EMPTY";
         }
    }

    /* getting things restarted */
    xposition = Math.floor(width  * Math.random());
    yposition = Math.floor(height * Math.random());
    ffx = xposition;
    ffy = yposition;
    var p = new Pixel(xposition, yposition);
    var c = 0;

    /*
    //gonna try out not coloring it black
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.fill();
    */

    pixels[xposition][yposition] = p;
    p.Draw(xposition, yposition);

    return p;
  },
  //react life cycle:
  componentDidMount: function(){
    finish = window.innerHeight * window.innerWidth;
    count = 0;
    this.play();
  },
  componentWillUnmount: function(){

  },
  handleBoostChange: function( e ) {
    //document.getElementById('range1').innerHTML = e.target.value;
    settings.boost = e.target.value;
    this.forceUpdate();
  },
  handleIncrementChange: function( e ) {
    settings.increment = e.target.value;
    this.forceUpdate();
    //this.setState({ alpha: value });
  },
  render: function() {
    if (this.props.viewMode == PlayConstants.PLAY_SPLIT_SCREEN)
    switch (this.props.playMode) {
      case PlayConstants.PLAY_PLAY_FAST:
        //normal continue
        settings.boost = 26;
        settings.rate  = 0;
        break;
      case PlayConstants.PLAY_PLAY_SLOW:
        settings.boost = 15;
        settings.rate  = 50;
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
    var canvasJSX = PlayDisplayAPI.getCanvasDisplay(this.props);

    var iconGit = "fa fa-github fa-lg settingIcon" + this.props.focus;
    var iconDownload = "fa fa-download fa-lg settingIcon" + this.props.focus;
    var iconCompress = "fa fa-compress fa-lg settingIcon" + this.props.focus;
    var iconPausePlay = settings.playing ? "fa fa-pause fa-lg settingIcon" + this.props.focus :
                                           "fa fa-play fa-lg settingIcon" + this.props.focus;
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
           <i className={iconDownload}
              onClick={this._download}>
           </i>
           <i className={iconPausePlay}
              onClick={this._togglePlay}>
           </i>
           <i className={iconRefresh}
              onClick={this._reset}>
           </i>
           <i className={iconClear}
              onClick={this._clear}>
           </i>
           <i className={iconCompress}
              onClick={this._collapse}>
           </i>

         </h3>
       </div>

       <div className="form">
        <div className="settingsDivSlider">
          <h3 className="settingSectionH">Acceleration</h3>
          <input
            id="slider1"
            type="range"
            max={100}
            min={0}
            step={1}
            value={settings.boost}
            onChange={this.handleBoostChange}
          />
          <output id="range">{settings.boost}</output>
        </div>
        <div className="settingsDivSlider">
          <h3 className="settingSectionH">Color Increment</h3>
          <input
            id="slider2"
            type="range"
            max={1.00}
            min={0.01}
            step={0.01}
            value={settings.increment}
            onChange={this.handleIncrementChange}
          />
          <output id="range">{settings.increment}</output>
        </div>
      </div>
    </div>  : null;
    //download, a pause/play, clear && reset

    return ( <div>
              <ReactCSSTransitionGroup
                     transitionName="settingsDiv"
                     transitionEnterTimeout={350}
                     transitionLeaveTimeout={350}
                   >
                {forms}
              </ReactCSSTransitionGroup>
              {canvasJSX}

             </div>
           );


  //  return PlayDisplayAPI.renderDisplay(this.props);
  },
  /**
   * download canvas as image
   */
  _download: function(){
    var dataURL = canvas.toDataURL('image/png');
    var link = document.createElement("a");
    link.download = "canvas.png";
    link.href = dataURL;
    link.click();
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
  _clear: function(){
    ctx.clearRect(0, 0, width, height);
    count = 0;
    this.configureCanvas();
  },
  /**
   * call action to focus on this particular pane.
   */
  _togglePlay: function(){
    settings.playing = !settings.playing;
    this.forceUpdate();
  },
  /**
   * call action to focus on this particular pane.
   */
  _collapse: function(){
    PlayActions.goSplitViewMode(this.props.id);
  }
});

//when pause increase rate, and playing to false
//when play, reset rate, and playing to true

/** CLASSES **/
function Pixel(fromX, fromY) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.r = 0;
    this.g = 0;
    this.b = 0;

    this.Draw = function(x, y){
        this.r = cr;
        this.g = cg;
        this.b = cb;
        ctx.fillStyle = nextColor();
        ctx.fillRect(x,y,1,1);
    }

    this.FromXX = function(x){ this.fromX = x;}
    this.FromYY = function(y){ this.fromY = y;}
    this.FromX =  function(){ return this.fromX;}
    this.FromY =  function(){ return this.fromY;}
    this.FromR =  function(){ return this.r;}
    this.FromG =  function(){ return this.g;}
    this.FromB =  function(){ return this.b;}
}

/** FUNCTIONS **/
function paint() {
    var p = new Pixel(xposition, yposition);
    //xposition = Math.floor(width  * Math.random());
    //yposition = Math.floor(height * Math.random());
    p = setValidLocation(p);
    pixels[xposition][yposition] = p;
    p.Draw(xposition, yposition);
}

function setValidLocation(p) {
  var xx = xposition;
  var yy = yposition;
  var xxx, yyy;
  var pp;

  while(true)
  {

      pp = pixels[xx][yy];

      if(pp == "EMPTY")
      {
          //xposition = Math.floor(width  * Math.random());
          //yposition = Math.floor(height * Math.random());
          return;
      }
      var r;
      var openspots = [];
      if ((xx + 1 < width) && pixels[xx + 1][yy] == "EMPTY"){
          openspots.push(0);
      }
      if ((yy + 1 < height) && pixels[xx][yy + 1] == "EMPTY"){
          openspots.push(1);
      }
      if ((xx - 1 >= 0) && pixels[xx - 1][yy] == "EMPTY"){
          openspots.push(2);
      }
      if ((yy - 1 >= 0) && pixels[xx][yy - 1] == "EMPTY"){
          openspots.push(3);
      }


      if ( openspots.length > 0 ){
          r = openspots[Math.floor((Math.random() * openspots.length))];
         // if ()
          switch(r)
          {
              case 0:
                  if ((xx + 1 < width) && pixels[xx + 1][yy] == "EMPTY"){
                      xxx = xx;
                      yyy = yy;
                      xx += 1;
                      c = 9;
                  }
                  break;
              case 1:
                  if ((yy + 1 < height) && pixels[xx][yy + 1] == "EMPTY"){
                      xxx = xx;
                      yyy = yy;
                      yy += 1;
                      c = 9;
                      }
                  break;
              case 2:
                  if ((xx - 1 >= 0) && pixels[xx - 1][yy] == "EMPTY"){
                      xxx = xx;
                      yyy = yy;
                      xx -= 1;
                      c = 9;
                  }
                  break;
              case 3:
                  if ((yy - 1 >= 0) && pixels[xx][yy - 1] == "EMPTY"){
                      xxx = xx;
                      yyy = yy;
                      yy -= 1;
                      c = 9;
                 }
                 break;
          }

          xposition = xx;
          yposition = yy;
          p.FromXX(xxx); //is this correct = pp.FromX();
          p.FromYY(yyy);
          return p;
      }
      else
      {
          xx = pp.FromX();
          yy = pp.FromY();
          cr = pp.FromR();
          cb = pp.FromB();
          cg = pp.FromG();
          if (xx == ffx && yy == ffy)
          {
              xposition = Math.floor(width  * Math.random());
              yposition = Math.floor(height * Math.random());
              ffx = xposition;
              ffy = yposition;
              p.FromXX(ffx);
              p.FromYY(ffy);
              return p;
              //ctx.clearRect(0, 0, width, height);
              //count = 0;
              //return configureCanvas();
          }
      }
  }
}

function floor(i){ return i | 0; }

function nextColor()
{
    //to start we'll one at a time
    if (floor(cr) != er)
    {
        cr += settings.increment * shiftr;
    }
    else if (floor(cg) != eg)
    {
        cg += settings.increment * shiftg;
    }
    else if (floor(cb) != eb)
    {
        cb += settings.increment *  shiftb;
    }
    else
    {
        /* flip start and end */
        // var temp = start;
        // start = end;
        // end = start;
        // var swap = ractive.get('end');
        // ractive.set('end', ractive.get('start'));
        // ractive.set('start', swap);
        // configureColor();
        reverseColor();
        //cr = sr;
        //cg = sg;
        //cb = sb;
    }
    //console.log(floor(cr), floor(cg), floor(cb));
    return rgb(floor(cr), floor(cg), floor(cb));
}

function rgb(r, g, b) { return ["rgb(",r,",",g,",",b,")"].join(""); }

function reverseColor()
{
  var tempR = sr;
  var tempG = sg;
  var tempB = sb;
  sr = er;
  sg = eg;
  sb = eb;
  cr = sr;
  cg = sg;
  cb = sb;
  er = tempR;
  eg = tempG;
  eb = tempB;
  shiftr = (-1) * shiftr;
  shiftg = (-1) * shiftg;
  shiftb = (-1) * shiftb;
}

function configureColor()
{
    var s = parseInt(settings.start,  16);
    var e = parseInt(settings.end, 16);
    //sr, sg, sb
    sr = (s >> 16) & 0xFF;
    sg = (s >> 8)  & 0xFF;
    sb = (s)       & 0xFF;
    //cr, cg. cb
    cr = sr;
    cg = sg;
    cb = sb;
    //er, eb, eg
    er = (e >> 16) & 0xFF;
    eg = (e >> 8)  & 0xFF;
    eb = (e)       & 0xFF;

    //shiftr, shiftg, shiftb
    shiftr = (er > sr) ? 1 : -1;
    shiftg = (eg > sg) ? 1 : -1;
    shiftb = (eb > sb) ? 1 : -1;
}

function randomColor()
{
    //start = parseInt(start, 16);
    //end   = parseInt(end, 16);
    //sr, sg, sb

    sr = Math.floor(Math.random() * 255);
    sg = Math.floor(Math.random() * 255);
    sb = Math.floor(Math.random() * 255);
    //cr, cg. cb
    cr = sr;
    cg = sg;
    cb = sb;
    //er, eb, eg
    er = Math.floor(Math.random() * 255);
    eg = Math.floor(Math.random() * 255);
    eb = Math.floor(Math.random() * 255);

    //shiftr, shiftg, shiftb
    shiftr = (er > sr) ? 1 : -1;
    shiftg = (eg > sg) ? 1 : -1;
    shiftb = (eb > sb) ? 1 : -1;
}

function fadeOut(){
  var timer = setTimeout(function(){
      //if r is playing
      var p = pixels[xposition][yposition];
      ctx.fillStyle = 'black';
      ctx.fillRect(xposition,yposition,1,1);

      xposition = p.FromX();
      yposition = p.FromY();

      count -= 1;
      if (count == 0) { return; }
      else fadeOut();
  }, 100); //ractive.get... r.get('rate')
}

module.exports = PlayGradients;
