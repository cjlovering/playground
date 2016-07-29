var React = require('react');

var PlayPane = require('./PlayPane');
var PlayActions = require('./../flux/actions/PlayActions');

var PlayView = React.createClass({
  formPlayPane: function(di){
    var focus = this.props.focusDisplayIndex == di.id;
    return (
      <PlayPane focus={focus}
                key={di.id}
                id={di.id}
                displayInfo={di}
                sizing={this.props.sizing}
                viewMode={this.props.viewMode}/>
    );
  },
  render: function() {
    var me = this;
    var playPaneList = this.props.displayInfo.map(function(di) {
      return me.formPlayPane(di);
    });
    return (
        <div className="playListPane">
          {playPaneList}
        </div>
    );
  }
});

module.exports = PlayView;
