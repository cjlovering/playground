var React = require('react');
var $ = require('jQuery');
var PlayViewLabel = require('./PlayViewLabel');
var PlayActions = require('./../flux/actions/PlayActions');
var PlayStore = require('./../flux/stores/PlayStore');
var PlayConstants = require('./../flux/constants/PlayConstants');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Display;
var PlayFullView = React.createClass({
  componentWillMount: function(){
    //when it first mounts, check to see if it should be opened by a cog click
    this.setState({"settingsVisible": this.props.settingsOpen});
  },
  render: function() {
    Display = PlayStore.getDisplayModule(this.props.id);
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
      <div className={styleName}
           onMouseMove={this._onMouseMove}
           onDoubleClick={this._onDoubleClick}>
        <Display displayInfo={this.props.displayInfo}
                 name={this.props.displayInfo.name}
                 height={this.props.sizing.height}
                 width={this.props.sizing.width}
                 onScriptHover={this.props.onScriptHover}
                 id={this.props.id}
                 focus={true}
                 playMode={PlayConstants.PLAY_PLAY_FAST}
                 viewMode={PlayConstants.PLAY_FULL_SCREEN}
                 play="true"
                 settingsVisible={this.state.settingsVisible}/>
      </div>
    );
  },

  /**
   * if mouse moves in the top 15% of the page, pull down menu
   */
  _onMouseMove: function(e){

    var x = e.nativeEvent.x;
    var w = window.innerWidth;

    if((!this.state.settingsVisible)&&(x < 0.10 * w) || this.props.settingsOpen){
      this.setState({"settingsVisible" : true});
      if (x < 0.15 * w) { PlayActions.setSettingsOpen(false); }
    } else if ((this.state.settingsVisible)&&(x > 0.25 * w)) {

      this.setState({"settingsVisible" : false});
    }

  },

  /**
   * go back to split view
   */
  _onDoubleClick: function(){
    PlayActions.goSplitViewMode(this.props.id);
  }
});

module.exports = PlayFullView;
