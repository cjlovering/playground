var React = require('react');
var PlayConstants = require('./../flux/constants/PlayConstants');

var PlayDisplayAPI = {
  /**
   * gets the canvas object with correct style and width/height
   * @param {object} props the properties of the display
   */
  getCanvasDisplay: function(props){
    var styleName = "playViewCanvas" + props.focus;
    var c =
      <canvas id={props.displayInfo.canvasId}
              className={styleName}
              width={props.width}
              height={props.height}>
      </canvas>;
      return c;
  },
  /**
   * The render function for playPanes
   * return {object} the JSX display
   */
  renderDisplay: function(props){
    var c = this.getCanvasDisplay(props);
    return ( c );
  },
  getSettingDefaults: function(i){
    var settings;
    switch (i) {
      case 2:
        settings = {
          rate:  200,
          boardWidth: 100,
          boardHeight: 75,
          hexagonAngle: 30,
          overpopulation: 4,
          starvation: 1,
          growth: 3
        };
        break;
      case 3:
        settings = {
          start: "0000FF",
          end: "88FF00",
          play: PlayConstants.PLAY_PLAY_SLOW,
          boost: 26,
          increment: 0.10,
          rate: 100,
          playing: true
        };
        break;
      default:
        break;//no op
    }
    return settings;
  },


};

module.exports = PlayDisplayAPI;
