var React = require('react');

var PlayFocusView = require('./PlayPane');

var PlayView = React.createClass({
  formPlayPane: function(di){
    return (
      <PlayPane key={di.id} id={di.id} displayInfo={di} splitView={this.props.splitView} onScriptHover={this.props.onScriptHover}/>
    );
  },
  render: function() {
    var me = this;
    var playPaneList = this.props.displayInfo.map(function(di) {
      return me.formPlayPane(di);
    });
    return (
        <div className="playListPane">
          <div>

          </div>
        </div>
    );
  }
});

module.exports = PlayFocusView;
