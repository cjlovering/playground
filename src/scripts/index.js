var ReactDOM = require('react-dom');
var React = require('react');
 
var PlayGround = require('./PlayGround');

ReactDOM.render(
  <PlayGround url="/api/comments" pollInterval={2000} />,  
  document.getElementById('content')
);

