var React = require('react');

var PlayViewLabel = require('./PlayViewLabel');
var PlayActions = require('./../flux/actions/PlayActions');
var PlayStore = require('./../flux/stores/PlayStore');
var PlayConstants = require('./../flux/constants/PlayConstants');


var PlayPane = React.createClass({

  render: function() {
    var Display = PlayStore.getDisplayModule(this.props.id);
    var styleName = PlayStore.getPlayViewStyleName(this.props.id);

    /**
     *  passing correct styleName to children, and
     *  classnames to to containing div.
     */
    var focus = this.props.focus ? " focused" : " unfocused";
    var playMode = this.props.focus ? PlayConstants.PLAY_PLAY_FAST : PlayConstants.PLAY_PLAY_SLOW;

    return (
      <div className={styleName} onMouseEnter={this._onMouseEnter}>
        <Display displayInfo={this.props.displayInfo}
                 height={this.props.splitView.height}
                 width={this.props.splitView.width}
                 onScriptHover={this.props.onScriptHover}
                 id={this.props.id}
                 focus={focus}
                 playMode={playMode}
                 play="true"/>

        <PlayViewLabel focus={focus} name={this.props.displayInfo.name} description={this.props.displayInfo.text}/>
      </div>
    );
  },

  /**
   * call action to focus on this particular pane.
   */
  _onMouseEnter: function(){
    PlayActions.focusDisplayIndex(this.props.id);
  }
});

module.exports = PlayPane;
