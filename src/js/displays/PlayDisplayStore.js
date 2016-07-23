var gradientStore = {
  pause: {

  },
  slow: {

  },
  fast: {

  }
}
var slowStart = [
  {
    paramName: "playing",
    dataType: "PlayConstants",
    options: [
      PlayConstants.PLAY_PLAY_STOP,
      PlayConstants.PLAY_PLAY_FAST,
      PlayConstants.PLAY_PLAY_SLOW
    ],
    current: PlayConstants.PLAY_PLAY_STOP,
    default: PlayConstants.PLAY_PLAY_FAST
  },
  {
    paramName: "boost",
    dataType: "number",
    details: {
      min: 0,
      max: 100,
      inc: 5
    },
    current: 15,
    default: 15
  },
  {
    paramName: "start",
    dataType: "color",
    current: '0000FF',
    default: '0000FF'
  },
  {
    paramName: "end",
    dataType: "color",
    current: '88FF00',
    default: '88FF00'
  },
  {
    paramName: "increment",
    dataType: "number",
    details: {
      min: 0.0,
      max: 1,
      inc: 0.01
    },
    current: 0.10,
    default: 0.10
  }
]
