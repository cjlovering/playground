var React = require('react');

var PlayViewLabel = require('./PlayViewLabel');
var PlayActions = require('./../flux/actions/PlayActions');
var PlayStore = require('./../flux/stores/PlayStore');
var PlayConstants = require('./../flux/constants/PlayConstants');


var PlayFullView = React.createClass({

  render: function() {
    var Display = PlayStore.getDisplayModule(this.props.id);
    var styleName = PlayStore.getPlayViewStyleName(this.props.id);

    /**
     *  passing correct styleName to children, and
     *  classnames to to containing div.
     */
    var focus = this.props.focus ? " focused" : " unfocused";

    /**
     *  TODO: going to have to change it later, so when switching from
     *  focus to full, you keep the same settings
     */
    return (
      <div className={styleName} onMouseEnter={this._onMouseEnter} onDoubleClick={this._onDoubleClick}>
        <Display displayInfo={this.props.displayInfo}
                 height={this.props.splitView.height}
                 width={this.props.splitView.width}
                 onScriptHover={this.props.onScriptHover}
                 id={this.props.id}
                 focus={true}
                 playMode={PlayConstants.PLAY_PLAY_FAST}
                 viewMode={PlayConstants.PLAY_FULL_SCREEN}
                 play="true"/>
      </div>
    );
  },

  /**
   * if mouse moves in the top 15% of the page, pull down menu
   */
  _onMouseMove: function(e){
    /*
    var x = e.event.x;
    var y = e.event.y;

    PlayActions.focusDisplayIndex(this.props.id);
    */
  },
  /**
   * go full view mode on this index. really the index
   * isn't needed, but whatever for now.
   */
  _onDoubleClick: function(){
    PlayActions.goSplitViewMode(this.props.id);
  }
});

module.exports = PlayFullView;
