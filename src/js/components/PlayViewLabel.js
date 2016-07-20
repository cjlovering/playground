var React = require('react');

var PlayViewLabel = React.createClass({
  render: function() {
    var label = (this.props.name).toLowerCase().replace('play','');
    return (
      <div className="playViewLabel"><h2> {label} </h2></div>
    );
  }
});

module.exports = PlayViewLabel;
