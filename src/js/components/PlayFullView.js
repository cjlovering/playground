var React = require('react');
var $ = require('jQuery');
var PlayViewLabel = require('./PlayViewLabel');
var PlayActions = require('./../flux/actions/PlayActions');
var PlayStore = require('./../flux/stores/PlayStore');
var PlayConstants = require('./../flux/constants/PlayConstants');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var PlayFullView = React.createClass({
  componentWillMount: function(){
    this.setState({"title": false});
    this.setState({"note": false});
  },
  render: function() {
    var Display = PlayStore.getDisplayModule(this.props.id);
    var styleName = PlayStore.getPlayViewStyleName(this.props.id);

    /**
     *  passing correct styleName to children, and
     *  classnames to to containing div.
     */
    var focus = this.props.focus ? " focused" : " unfocused";

    var title = this.state.title ? <div className="fullTitleBannerDiv" display="none">
      <h1 className="fullTitleBannerH"> playground: <span className="subFullTitleBannerH">{this.props.displayInfo.name}</span></h1>
    </div> : null;

    var note = this.state.note ?
                  <div className="noteBannerDiv" key="2">
                    <h3 className="noteBannerH"> double click to see all displays</h3>
                  </div> : null;

    /**
     *  TODO: going to have to change it later, so when switching from
     *  focus to full, you keep the same settings
     */
    return (
      <div className={styleName} onMouseMove={this._onMouseMove} onDoubleClick={this._onDoubleClick}>
      <ReactCSSTransitionGroup
               transitionName="banner"
               transitionEnterTimeout={550}
               transitionLeaveTimeout={550}
             >
        {title}
        </ReactCSSTransitionGroup>

        <Display displayInfo={this.props.displayInfo}
                 height={this.props.sizing.height}
                 width={this.props.sizing.width}
                 onScriptHover={this.props.onScriptHover}
                 id={this.props.id}
                 focus={true}
                 playMode={PlayConstants.PLAY_PLAY_FAST}
                 viewMode={PlayConstants.PLAY_FULL_SCREEN}
                 play="true"/>
                 <ReactCSSTransitionGroup
                          transitionName="noteTransition"
                          transitionEnterTimeout={550}
                          transitionLeaveTimeout={550}
                        >
                   {note}
                   </ReactCSSTransitionGroup>
      </div>


    );
  },



  /**
   * if mouse moves in the top 15% of the page, pull down menu
   */
  _onMouseMove: function(e){
    var y = e.nativeEvent.y;
    var h = window.innerHeight;

    if ((!this.state.title)&&(y < 0.20 * h)) {
      this.setState({"title": true});
      this.setState({"note": false});
    } else if ((this.state.title || this.state.note)&&(y > 0.20 * h && y < 0.77 * h )) {
      this.setState({"title": false});
      this.setState({"note": false});
    }  else if ((!this.state.note)&&( y > 0.77 * h )) {
      this.setState({"title": false});
      this.setState({"note": true});
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
