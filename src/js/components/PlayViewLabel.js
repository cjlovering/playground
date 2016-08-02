var React = require('react');

var PlayViewLabel = React.createClass({
  render: function() {
    var label = (this.props.name).toLowerCase().replace('play','');
    var styleName = "playViewLabelDiv" + this.props.focus;
    var iconClassNameGit = "fa fa-github fa-lg" + this.props.focus;
    var iconClassNameExpand = "fa fa-expand fa-lg" + this.props.focus;
    var iconCogs = "fa fa-cogs fa-lg" + this.props.focus;


    return (
      <div className={styleName}>
        <span className="labelSize">
          {label}
        </span>
        <span>
          <i className={iconCogs}
             onClick={this.props.openSettingsView}>
          </i>
          <a href={this.props.gitLink} target="_blank">
            <i className={iconClassNameGit}></i>
          </a>
          <i className={iconClassNameExpand}
             onClick={this.props.fullScreenEvent}>
          </i>
        </span>
      </div>
    );
  }
});

module.exports = PlayViewLabel;
