var React = require('react');

var PlayViewLabel = React.createClass({
  render: function() {
    var label = (this.props.name).toLowerCase().replace('play','');
    var styleName = "playViewLabel" + this.props.focus;
    return (
      <div ><h2 className={styleName}> {label} </h2></div>
    );
  }
});

module.exports = PlayViewLabel;
