var React = require('react');
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
  }
};

module.exports = PlayDisplayAPI;
