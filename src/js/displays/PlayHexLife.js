//react
var React = require('react');
var $     = require('jquery'); //installed with node
var PlayDisplayAPI = require('./PlayDisplayAPI');
var PlayConstants = require('./../flux/constants/PlayConstants');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var PlayActions = require('./../flux/actions/PlayActions');

//script variables
var Rules, SetA, SetB, SetC;
var color = 0;
var right = true;
var counter = 0;
var canvas;
var resizeId;

var ctx, currentHex = new Hexagon();

var hexHeight,
    hexRadius,
    hexRectangleHeight,
    hexRectangleWidth,
    hexagonAngle = 0.523598776, // 30 degrees in radians
    sideLength;

var keepCurrentSettings = true;//false

// var tempSettings = {
//   overpopulation: 4,
//   starvation: 2,
//   growth: 3
// }

// var tempSettings = {
//   overpopulation: 5,
//   starvation: 2,
//   growth: 1
// }
var tempSettings = {
  overpopulation: 5,
  starvation: 2,
  growth: 1
}

var settings = {
  rate:  200,
  boardWidth: 100,
  boardHeight: 75,
  hexagonAngle: 30,
  overpopulation: 5,
  starvation: 2,
  growth: 1
}

var cells = createCellArray();

//hex class
function Hexagon(x,y) {
    this.x = x;
    this.y = y;
    this.live = false;
    this.next = false;
    this.n = 0;
    this.lastN = -1;
    this.lastLive = true;

    this.Play = function(){
        this.next = Rules(this.Neighbors(), this.live);
    }

    this.Kill = function(){ this.next = false; }

    this.Live = function(){ this.next = true; }

    this.Alive = function(){ return this.live; }

    this.Neighbors = function(){

        var test, n = 0;

        if(this.y%2 == 0){

            test = [[0, -1], [1, -1], [1, 0], [ 0, 1], [ -1, 0], [-1, 1], [-1, -1]]; //[0, 0 ],

        } else {

            test = [[0, -1], [1, -1], [1, 0], [ 0, 1], [-1, 0], [ 1, 1] ]; //[0, 0 ],

        }


        for (var i = 0; i < test.length; i++){
            if ( this.x + test[i][0] >= 0 && this.x + test[i][0] < settings.boardWidth && this.y + test[i][1] >= 0 && this.y + test[i][1] < settings.boardHeight )
            {
                if (cells[ this.x + test[i][0] ][ this.y + test[i][1] ].Alive()) n += 1;
            }
        }

        this.n = n;
        return n;
    }

    this.Draw = function(){
        if(this.live == this.lastLive && this.n == this.lastN) return;
        else {
        this.lastN = this.n;
        this.lastLive = this.lastLive;
        }
        var screenX = this.x * hexRectangleWidth + ((this.y % 2) * hexRadius);
        var screenY = this.y * (hexHeight + sideLength);
        ctx.fillStyle = getColor(this.n);
        if (this.live) drawHexagon(ctx, screenX, screenY);        //Rules(this.Neighbors(), this.live)
        else clearHexagon(ctx, screenX, screenY);
        this.live = this.next;
    }
}

function Rules(n, l){

    if(l)
    {
        if (n >= settings.overpopulation || n <= settings.starvation) return false;
        else return true;
    }
    else if (n == settings.growth) return true;

}
/* no change */
function SetA(n, l){

    if(l)
    {
        if (n > 4) return false;
        else if (n > 1)return true;
        else return false;
    }
    else if (n > 2) return true;

}
/* die fast */
function SetB(n, l){



    if(l)
    {
        if (n > 3) return false;
        else if (n > 1)return true;
        else return false;
    }
    else if (n > 3) return true;

}
/* groups maintain easy, new ones not */
function SetC(n, l){

    if(l)
    {
        if (n > 5) return false;
        else if (n > 1)return true;
        else return false;
    }
    else if (n > 4) return true;
}

//click input
function inject(eventInfo){

    var x,
        y,
        xx,
        yy,
        test,
        test2,
        i;

    x = eventInfo.offsetX || eventInfo.layerX;
    y = eventInfo.offsetY || eventInfo.layerY;

    yy = Math.floor(y / (hexHeight + sideLength));
    xx = Math.floor((x - (yy % 2) * hexRadius) / hexRectangleWidth);

    if (yy%2 == 0) {

        test2 = [[0, -1], [1, -1], [1, 0], [ 0, 1], [ -1, 0], [0, 0 ], [-1, 1], [-1, -1]];

        test = [[-1, -2], [0, -2], [1, -2], [1, -1], [1, 1], [1, 2], [0, 2], [-1, 2], [-2, 1], [-2, 0], [-2, -1], [2, 0]];

    } else {

        test2 = [[0, -1], [1, -1], [1, 0], [ 1, 1], [ 0, 1], [0, 0 ], [-1, 0]];

        test = [[-2, 0], [-1, -1], [-1, -2], [0, -2], [1, -2], [2, -1], [2, 0], [2, 1], [1, 2], [0, 2], [-1, 2], [-1, 1]];
    }

    for (i = 0; i < test2.length; i++){
        if ( xx + test2[i][0] >= 0 && xx + test2[i][0] < settings.boardWidth && yy + test2[i][1] >= 0 && yy + test2[i][1] < settings.boardHeight )
        {
            cells[ xx + test2[i][0] ][ yy + test2[i][1] ].Kill();
        }
    }

    for (i = 0; i < test.length; i++){
        if ((xx + test[i][0] >= 0 && xx + test[i][0] < settings.boardWidth) && ( yy + test[i][1] >= 0 && yy + test[i][1] < settings.boardHeight))
            {
                cells[xx + test[i][0]][yy + test[i][1]].Live();
            }
    }

    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(ctx, settings.boardWidth, settings.boardHeight);
}
//intial set-up
function createCellArray(){
    var arr = [];
    for ( var i = 0; i < settings.boardWidth; i++) arr[i] = []
    return arr;
}

function populateCellArray(){
    for ( var i = 0; i < settings.boardWidth; i++)
        for ( var j = 0; j < settings.boardHeight; j++)
            cells[i][j] = new Hexagon(i,j);
}


function onResizeDraw(){

  cells = [];
  cells = createCellArray();
  populateCellArray();


  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  configureHexagonParameters();
  drawBoard(ctx, settings.boardWidth, settings.boardHeight);

}

function mouseMoveResponse(eventInfo){

    var x,
        y,
        hexX,
        hexY,
        screenX,
        screenY;

    x = eventInfo.offsetX || eventInfo.layerX;
    y = eventInfo.offsetY || eventInfo.layerY;

    hexY = Math.floor(y / (hexHeight + sideLength));
    hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth);

   if((hexX >= 0 && hexX < settings.boardWidth) && (hexY >= 0 && hexY < settings.boardHeight)) {
        if(currentHex != cells[hexX][hexY]){
            currentHex = cells[hexX][hexY];
            currentHex.Live();
            currentHex.Draw();
        }
    }
}

function getColor(n){
    var colors    = [ "#ccff66", "#FFD700","#66ccff", "#ff6fcf", "#ff6666", "#ff921a"];
    n %= colors.length;
    return colors[n];
}

function drawBoard(canvasContext, width, height) {

    canvasContext.fillStyle = "#000000";
    canvasContext.strokeStyle = "#CCCCCC";
    canvasContext.lineWidth = 1;

    var i,
        j;

    for(i = 0; i < width; ++i) {
        for(j = 0; j < height; ++j) {
            cells[i][j].Draw();
        }
    }
}

function clearHexagon(canvasContext, x, y) {

  canvasContext.fillStyle = "#fff";//EDITOR = #000

  // canvasContext.beginPath();
  // canvasContext.moveTo(x + hexRadius, y);
  // canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
  // canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
  // canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
  // canvasContext.lineTo(x, y + sideLength + hexHeight);
  // canvasContext.lineTo(x, y + hexHeight);
  // canvasContext.closePath();
  drawHexagon(canvasContext, x, y);

  canvasContext.stroke();
  //ctx.fillStyle = "#fff";//EDITOR = #000
  //canvasContext.fill();
}

function drawHexagon(canvasContext, x, y) {

    canvasContext.beginPath();
    canvasContext.moveTo(x + hexRadius, y);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
    canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
    canvasContext.lineTo(x, y + sideLength + hexHeight);
    canvasContext.lineTo(x, y + hexHeight);
    canvasContext.closePath();
    canvasContext.fill();
}

function configureHexagonParameters(){
    sideLength = canvas.height > canvas.width ? canvas.height / settings.boardHeight : canvas.width / settings.boardWidth ;
    hexHeight = Math.sin(hexagonAngle) * sideLength;
    hexRadius = Math.cos(hexagonAngle) * sideLength;
    hexRectangleHeight = sideLength + 2 * hexHeight;
    hexRectangleWidth = 2 * hexRadius;
}

function loop(){
    setTimeout(function() {
        requestAnimationFrame(loop);
        // Drawing code goes here

        for ( var i = 0; i < settings.boardWidth; i++)
          for ( var j = 0; j < settings.boardHeight; j++){
            cells[i][j].Play();
          }

        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard(ctx, settings.boardWidth, settings.boardHeight);

    }, settings.rate);
}

var PlayHexLife = React.createClass({
  play: function(){
    canvas = document.getElementById('hexMap');

    if (canvas.getContext){

        configureHexagonParameters();

        ctx = canvas.getContext('2d');

        populateCellArray();
        drawBoard(ctx, settings.boardWidth, settings.boardHeight);

        //this makes the assumption that mouse move was the last event
        //as in, mouse up and then mouse up won't happen

        canvas.addEventListener("mousemove", function(eventInfo) {
            mouseMoveResponse(eventInfo);

            //if (last)
            // settings.growth = tempSettings.growth;
            // settings.overpopulation = tempSettings.overpopulation;
            // settings.growth = tempSettings.growth;
        });

        canvas.addEventListener("mouseup", function(eventInfo){
            inject(eventInfo);

            // tempSettings.growth = settings.growth;
            // tempSettings.overpopulation = settings.overpopulation;
            // tempSettings.starvation = settings.starvation;
            //
            // settings.growth = 4;
            // settings.overpopulation = 6;
            // settings.starvation = 2;

        });

        canvas.addEventListener("mouseout", function(eventInfo){

            inject(eventInfo);

            tempSettings.growth = settings.growth;
            tempSettings.overpopulation = settings.overpopulation;
            tempSettings.starvation = settings.starvation;

            settings.growth = 3;
            settings.overpopulation = 4;
            settings.starvation = 2;

        });

        canvas.addEventListener("mouseenter", function(eventInfo){

          settings.growth = tempSettings.growth;
          settings.overpopulation = tempSettings.overpopulation;
          settings.starvation = settings.starvation;

        });

        loop();
    }
  },
    //react life cycle:
    componentDidMount: function(){
      this.play();
    },
    componentWillMount: function() {
      //cells = createCellArray();
    },
    componentWillUnmount: function(){
      //cells = [];
    },
    render: function() {

      var canvasJSX = PlayDisplayAPI.getCanvasDisplay(this.props);

      var iconGit = "fa fa-github fa-lg settingIcon" + this.props.focus;
      var iconCompress = "fa fa-compress fa-lg settingIcon" + this.props.focus;
      var iconRefresh = "fa fa-refresh fa-lg settingIcon" + this.props.focus;
      //TODO make a lock boolean so it only saves after either
      //editing a value or moving, or rather specifically NOT after
      //a click
      //get growth to work
      var settingsJSX = this.props.settingsVisible ?
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
          <h3 className="settingSectionH">growth</h3>
          <input
            id="slider2"
            type="range"
            max={6}
            min={0}
            step={1}
            value={settings.growth}
            onChange={this.handleGrowthChange}
          />
          <output id="range">{settings.growth}</output>
        </div>
         <div className="settingsDivSlider">
           <h3 className="settingSectionH">overpopulation</h3>
           <input
             id="slider2"
             type="range"
             max={6}
             min={0}
             step={1}
             value={settings.overpopulation}
             onChange={this.handleOverpopulationChange}
           />
           <output id="range">{settings.overpopulation}</output>
         </div>
         <div className="settingsDivSlider">
           <h3 className="settingSectionH">starvation</h3>
           <input
             id="slider3"
             type="range"
             max={6}
             min={0}
             step={1}
             value={settings.starvation}
             onChange={this.handleStarvationChange}
           />
           <output id="range">{settings.starvation}</output>
         </div>
         <div className="settingsDivSlider">
           <h3 className="settingSectionH">time</h3>
           <input
             id="slider4"
             type="range"
             max={1000}
             min={0}
             step={10}
             value={settings.rate}
             onChange={this.handleRateChange}
           />
           <output id="range">{settings.rate / 1000}</output>
         </div>
         <div className="settingsDivSlider">
           <h3 className="settingSectionH">height</h3>
           <input
             id="slider4"
             type="range"
             max={200}
             min={0}
             step={1}
             value={settings.boardHeight}
             onChange={this.handleBoardheightChange}
           />
           <output id="range">{settings.boardHeight}</output>
         </div>
         <div className="settingsDivSlider">
           <h3 className="settingSectionH">width</h3>
           <input
             id="slider4"
             type="range"
             max={200}
             min={0}
             step={1}
             value={settings.boardWidth}
             onChange={this.handleBoardwidthChange}
           />
           <output id="range">{settings.boardWidth}</output>
         </div>
       </div>

        </div>  : null;




      return ( <div>
                <ReactCSSTransitionGroup
                       transitionName="settingsDiv"
                       transitionEnterTimeout={350}
                       transitionLeaveTimeout={350}
                     >
                  {settingsJSX}
                </ReactCSSTransitionGroup>
                {canvasJSX}

               </div>
             );
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
    },
    /**
     * growth setting needs to be updated
     */
    handleGrowthChange: function( e ) {
      settings.growth = e.target.value;
      tempSettings.growth = e.target.value;
      this.forceUpdate();
    },
    /**
     * overpopulation setting needs to be updated
     */
    handleOverpopulationChange: function( e ) {
      settings.overpopulation = e.target.value;
      tempSettings.overpopulation = e.target.value;
      this.forceUpdate();
    },
    /**
     * starvation setting needs to be updated
     */
    handleStarvationChange: function( e ) {
      settings.starvation = e.target.value;
      tempSettings.starvation = e.target.value;
      this.forceUpdate();
    },
    /**
     * starvation setting needs to be updated
     */
    handleRateChange: function( e ) {
      settings.rate = e.target.value;
      tempSettings.rate = e.target.value;
      this.forceUpdate();
    },
    /**
     * boardWidth setting needs to be updated
     */
    handleBoardwidthChange: function( e ) {

      clearTimeout(resizeId);
      resizeId = setTimeout(function(o){
        settings.boardWidth = o.val;
        onResizeDraw();
        o.r.forceUpdate();
      }, 100, { val: e.target.value, r: this} );

    },
    /**
     * boardHeight setting needs to be updated
     */
    handleBoardheightChange: function( e ) {

      clearTimeout(resizeId);
      resizeId = setTimeout(function(o){
        settings.boardHeight = o.val;
        onResizeDraw();
        o.r.forceUpdate();
      }, 100, { val: e.target.value, r: this});


    },
});

module.exports = PlayHexLife;
