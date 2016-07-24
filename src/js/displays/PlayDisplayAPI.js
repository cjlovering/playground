var React = require('react');
var PlayDisplayAPI = {
  /**
   * The render function for playPanes
   * return {object} the JSX display
   */
  renderDisplay: function(props){
    var styleName = "playViewCanvas" + props.focus;
    var c =
      <canvas id={props.displayInfo.canvasId}
              className={styleName}
              width={props.width}
              height={props.height}>
      </canvas>;
    return (
        c
    );
  }
};

module.exports = PlayDisplayAPI;
