var React = require('react');
var $ = require('jQuery');
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
      <div className={styleName} onMouseMove={this._onMouseMove} onDoubleClick={this._onDoubleClick}>
        <div id="fullTitle" display="none" onMouseLeave={this._onMouseLeave}>
          <h1> {this.props.displayInfo.name} </h1>
        </div>
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
    var y = e.y;
    var h = window.innerHeight;
    if ( y < 0.15 * h) {
      var title = $.getElementById("#fullTitle");
      title.css("display", "true");
    };
  },
  /**
   * if mouse moves in the top 15% of the page, pull down menu
   */
  _onMouseLeave: function(e){
      var title = $.getElementById("#fullTitle");
      title.css("display", "none");
  },

  /**
   * go back to sp
   */
  _onDoubleClick: function(){
    PlayActions.goSplitViewMode(this.props.id);
  }
});

module.exports = PlayFullView;
