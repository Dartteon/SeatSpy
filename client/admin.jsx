'use strict';

var React = require('react');
var axios = require('axios');

var App = React.createClass({
	getInitialState: function() {
    return {
      jobs: []
    }
  },

  componentDidMount: function() {
    var _this = this;
    this.serverRequest =
      axios
        .get("http://codepen.io/jobs.json")
        .then(function(result) {
          _this.setState({
            jobs: result.data.jobs
          });
        })
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (
      <div>
        <div className="loading"></div>
      </div>
    )
  }
});

React.render(<App/>, document.getElementById('app'));
