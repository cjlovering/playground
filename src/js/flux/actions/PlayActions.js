
var AppDispatcher = require('./../dispatcher/AppDispatcher');
var PlayConstants = require('./../constants/PlayConstants');

var PlayActions = {
  /**
   * @param  {number} index
   */
  focusDisplayIndex: function(index) {
    AppDispatcher.dispatch({
      actionType: PlayConstants.PLAY_FOCUS_INDEX,
      id: index
    });
  }
};

module.exports = PlayActions;
