var React = require('react');

var PlayTitlePane = React.createClass({


  render: function() {
    var title = ": " +  this.props.name;
    return (
      <div className="playTitlePane">
        <h1 className="title">playground</h1>
      </div>
    );
  }
});

module.exports = PlayTitlePane;
