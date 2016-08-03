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
      <div className={styleName}
           onMouseEnter={this._onMouseEnter}
           onMouseLeave={this._onMouseLeave}
           onDoubleClick={this._goFullViewMode}>
        <Display displayInfo={this.props.displayInfo}
                 height={this.props.sizing.height}
                 width={this.props.sizing.width}
                 onScriptHover={this.props.onScriptHover}
                 id={this.props.id}
                 focus={focus}
                 playMode={playMode}
                 viewMode={this.props.viewMode}
                 play="true"/>

        <PlayViewLabel gitLink={this.props.displayInfo.gitLink}
                       fullScreenEvent={this._goFullViewMode}
                       openSettingsView={this._openSettingsView}
                       focus={focus}
                       name={this.props.displayInfo.name}
                       description={this.props.displayInfo.text}/>
      </div>
    );
  },

  /**
   * call action to focus on this particular pane.
   */
  _onMouseEnter: function(){
    PlayActions.focusDisplayIndex(this.props.id);
  },
  /**
   * remove focus on leave for responsive feel
   */
  _onMouseLeave: function(){
    PlayActions.focusDisplayIndex(-1);
  },
  /**
   * go full view mode on this index. really the index
   * isn't needed, but whatever for now.
   */
  _goFullViewMode: function(){
    PlayActions.goFullViewMode(this.props.id);
  },
  /**
   * go full view and open settings
   */
  _openSettingsView: function(){
    PlayActions.setSettingsOpen(true);
    PlayActions.goFullViewMode(this.props.id);
  },

});

module.exports = PlayPane;
