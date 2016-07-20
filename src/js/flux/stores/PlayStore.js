/*
 * PlayStore
 */

var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var PlayConstants = require('./../constants/PlayConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

/*
 *  data
 */
 var d = [
     {
         "id": 0,
         "name": "PlayStars",
         "canvasId": "starZone",
         "text": "Smooth interactive system of stars."
     },
     {
         "id": 1,
         "name": "PlayHubs",
         "canvasId": "hubWay",
         "text": "Set of hubs interconnected and moving."
     },
     {
         "id": 2,
         "name": "PlayHexLife",
         "canvasId": "hexMap",
         "text": "Game of life on a hexagonal grid"
     },
     {
         "id": 3,
         "name": "PlayGradients",
         "canvasId": "pixelMap",
         "text": "A continuous stream of gradients covering a canvas between random colors."
     }
 ];

 var sizing = {
   width: ((window.innerWidth * (1.00 - (0.03 + 0.03 + 0.02)- (0.02 * ( d.length - 2)) )) / d.length) + "px",
   height: (window.innerHeight * 0.80) + "px"
 }


/**
 * index of focus
 * -1   -> no focus
 * else -> focused on index
 */
 var displayIndex = -1;

 /**
  * index of view
  * (I am using PlayConstants for multiple things, but i think the meaning is
  * is consistent and clear.)
  */
 var viewMode = PlayConstants.PLAY_SPLIT_SCREEN;


function setDisplayIndex(index) {
  displayIndex = index;
}

/**
 * TODO: double check this
 * Update a TODO item.
 * @param  {string} id
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  d[id] = assign({}, d[id], updates);
}

var PlayStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the details on the displays
   * @return {object}
   */
  getScriptInfo: function() {
    return d;
  },

  /**
   * Get the sizing info
   * @return {object}
   */
  getSizingInfo: function() {
    return sizing;
  },

  /**
   * Get the index of the script being focused on
   * @return {number}
   */
  getDisplayIndex: function() {
    return displayIndex;
  },

  /**
   * Get the view mode
   * @return {number}
   */
  getViewMode: function() {
    return viewMode;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case PlayConstants.PLAY_FOCUS_INDEX:
      id = action.id;
      if (id !== displayIndex){
        setDisplayIndex(id);
        PlayStore.emitChange();
      }
      break;

    default:
      // no op
  }
});

module.exports = PlayStore;
