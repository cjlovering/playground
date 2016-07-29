var React = require('react');
var PlayStore = require('./../flux/stores/PlayStore');
var PlayTitlePane = require('./PlayTitlePane');
var PlayView = require('./PlayView');
var PlayConstants = require('./../flux/constants/PlayConstants');
var PlayFullView = require('./PlayFullView');
var PlayActions = require('./../flux/actions/PlayActions');
var $ = require('jQuery');

//resize id kept track of
var resizeId;

/**
 * Retrieve the current data from the store
 * @return {object}
 */
function getPlayState() {
  return {
    scriptData: PlayStore.getScriptInfo(),
    sizing: PlayStore.getSizingInfo(),
    viewMode: PlayStore.getViewMode(),
    displayIndex: PlayStore.getDisplayIndex()
  };
}

/**
 * The PlayGround is the view-controller of the site, all changes in state
 * will propopgate from it, down.
 * TODO: worry about how transitions will look/work
 */
var PlayGround = React.createClass({
  getInitialState: function() {
    return getPlayState();
  },
  /**
   * Event handler for 'change' events coming from the PlayStore
   */
   _onChange: function() {
     this.setState(getPlayState());
   },
   componentDidMount: function() {
     window.addEventListener('resize', this._eventListenerResize);
     PlayStore.addChangeListener(this._onChange);
   },
   componentWillUnmount: function() {
     PlayStore.removeChangeListener(this._onChange);
   },
   render: function() {
     var value = null;
     switch (this.state.viewMode){
       case PlayConstants.PLAY_SPLIT_SCREEN:
        value = (
          <div className="playGround">
            <PlayTitlePane name="stars" />
            <PlayView displayInfo={this.state.scriptData}
                      sizing={this.state.sizing}
                      focusDisplayIndex={this.state.displayIndex}
                      viewMode={this.state.viewMode}/>
          </div>
        );
        break;
       /**
        * A particular display is being focused on, with its 'parameters' open to be changed.
        * One can switch between the different displays.
        */
       case PlayConstants.PLAY_FOCUS_SCREEN:
        value = (
         <div>
            <div className="innerContainer">
              <PlayFocusView />
            </div>
          </div>
        );
        break;
       case PlayConstants.PLAY_FULL_SCREEN:
        value = (
          <PlayFullView focus={true}
                        id={this.state.displayIndex}
                        displayInfo={this.state.scriptData[this.state.displayIndex]}
                        sizing={this.state.sizing}
                        viewMode={this.props.viewMode}/>
        );
        break;
       default:
        value = null;
        //hopefully un-reachable
     }

    return value;
  },
  _eventListenerResize: function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._onResizeAction, 250);
  },

  /**
   * go full view mode on this index. really the index
   * isn't needed, but whatever for now.
   */
  _onResizeAction: function(){
    PlayActions.goCalcuateSizes();
  }
});

module.exports = PlayGround;
