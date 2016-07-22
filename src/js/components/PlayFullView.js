var React = require('react');
var $ = require('jQuery');
var PlayViewLabel = require('./PlayViewLabel');
var PlayActions = require('./../flux/actions/PlayActions');
var PlayStore = require('./../flux/stores/PlayStore');
var PlayConstants = require('./../flux/constants/PlayConstants');


var PlayFullView = React.createClass({
  componentWillMount: function(){
    this.setState({"title": false});
  },
  render: function() {
    var Display = PlayStore.getDisplayModule(this.props.id);
    var styleName = PlayStore.getPlayViewStyleName(this.props.id);

    /**
     *  passing correct styleName to children, and
     *  classnames to to containing div.
     */
    var focus = this.props.focus ? " focused" : " unfocused";

    var title = this.state.title ? <div id="fullTitle" display="none">
      <h1 className="banner"> playground: <span className="sub-banner">{this.props.displayInfo.name}</span></h1>
    </div> : null;


    /**
     *  TODO: going to have to change it later, so when switching from
     *  focus to full, you keep the same settings
     */
    return (
      <div className={styleName} onMouseMove={this._onMouseMove} onDoubleClick={this._onDoubleClick}>
        {title}
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
    var y = e.nativeEvent.y;
    var h = window.innerHeight;
    if ( y < 0.20 * h) {
      this.setState({"title": true});
    } else if ( y > 0.23 * h) {
      this.setState({"title": false});
    }
  },

  /**
   * go back to sp
   */
  _onDoubleClick: function(){
    PlayActions.goSplitViewMode(this.props.id);
  }
});

module.exports = PlayFullView;
