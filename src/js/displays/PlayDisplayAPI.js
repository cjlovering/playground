var React = require('react');
var PlayConstants = require('./../flux/constants/PlayConstants');

/**
 *  stores and exports some general functionality
 *  across the displays to a an API
 */

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
  getSettingDefaults: function(i, j){
    var settings;
    switch (i) {
      case 0:
        //stars
        switch (j) {
          case 0:
            settings =   {
              starNum: 100,
              alpha: 0.5,
              baseSize: 25,
              explode: 4,
              escapeThresh: 35,
              swarmThreshold: 3
            };
            break;
          case 1:
            settings =   {
              starNum: 100,
              alpha: 0.15,
              baseSize: 240,
              explode: 4,
              escapeThresh: 35,
              swarmThreshold: 3
            };
            break;
          case 2:
            settings =   {
              starNum: 250,
              alpha: 1.50,
              baseSize: 20,
              explode: 4,
              escapeThresh: 35,
              swarmThreshold: 3
            };
            break;
          default:
            //no op
        }
        break;
      case 1:
        settings = {
          threshold: 0.21,
          star_num: 25,
          rate: 5,
          angle: 180
        };
        break;
      case 2:
        settings = {
          rate:  200,
          boardWidth: 45,
          boardHeight: 30,
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
  }
};

module.exports = PlayDisplayAPI;
