var React = require('react');

var PlayViewLabel = require('./PlayViewLabel');

var PlayPane = React.createClass({
  //todo: test var di = props.displayInfo

  render: function() {
    var Display;
    var styleName;
    switch(this.props.id){
      case 1:
        Display = require("./../displays/PlayStars");
        styleName = "playViewLeftEdge";
        break;
      case 2:
        Display = require("./../displays/PlayHubs");
        styleName = "playView";
        break;
      case 3:
        Display = require("./../displays/PlayHexLife");
        styleName = "playView";
        break;
      case 4:
        Display = require("./../displays/PlayGradients");
        styleName = "playViewRightEdge";
        break;
    }

    return (
      <div className={styleName}>
        <Display displayInfo={this.props.displayInfo}
                 height={this.props.splitView.height}
                 width={this.props.splitView.width}
                 onScriptHover={this.props.onScriptHover}
                 id={this.props.id}
                 play="true"/>

        <PlayViewLabel name={this.props.displayInfo.name} description={this.props.displayInfo.text}/>
      </div>
    );
  }
});

module.exports = PlayPane;
