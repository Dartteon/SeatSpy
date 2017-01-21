'use strict';

var React = require('react');
var axios = require('axios');

var App = React.createClass({
	getInitialState: function() {
    return {
      jobs: {}
    }
  },

  componentDidMount: function() {
    var _this = this;
    this.serverRequest =
      axios
        .get("/seat-data-highchart")
        .then(function(result) {
          _this.setState({
            jobs: result.data
          });
        })
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    console.log(this.state.jobs);
    return (
      <div>
        <div className="loading"></div>
      </div>
    )
  }
});

React.render(<App/>, document.getElementById('app'));
