var React = require('react');

var PlayTitlePane = require('./PlayTitlePane');
var PlayView = require('./PlayView');

//todo: move into comments, use $.ajax to pull em in
var d = [
    {
        "id": 1,
        "name": "PlayStars",
        "canvasId": "starZone",
        "text": "Smooth interactive system of stars."
    },
    {
        "id": 2,
        "name": "PlayHubs",
        "canvasId": "hubWay",
        "text": "Set of hubs interconnected and moving."
    },
    {
        "id": 3,
        "name": "PlayHexLife",
        "canvasId": "hexMap",
        "text": "Game of life on a hexagonal grid"
    },
    {
        "id": 4,
        "name": "PlayGradients",
        "canvasId": "pixelMap",
        "text": "A continuous stream of gradients covering a canvas between random colors."
    }
];

var splitView = {
  width: "250px",
  height: "600px",
  live: true
};

var sizing = {
  width: ((window.innerWidth * (0.99 - (0.03 + 0.03 + 0.02)- (0.02 * ( d.length - 2)) )) / d.length) + "px",
  height: (window.innerHeight * 0.80) + "px"
}

var hoverScript = -1;

function onScriptHover(i) {
  console.log("script is being focused on");
  hoverScript = i;
}

function setSplitViewActive(i) {
  console.log(splitView.live);
  splitView.live = false;
  return i; //i is the index of the active script
}

var PlayGround = React.createClass({
  render: function() {
    return (
      <div className="playGround">
        <PlayTitlePane name="stars" />
        <PlayView displayInfo={d} splitView={sizing} toggleMode={setSplitViewActive} onScriptHover={onScriptHover}/>
      </div>
    );
  }
});
//Width="250px" splitViewHeight="600px" splitView="true"
module.exports = PlayGround;
