'use strict';

var React = require('react');
var axios = require('axios');
var ReactHighcharts = require ('react-highcharts');

var App = React.createClass({
	getInitialState: function() {
    return {
      occupancyChart: {},
    }
  },

  componentDidMount: function() {
    var _this = this;
    this.serverRequest =
      axios
        .get("/seat-data-highchart")
        .then(function(result) {
          _this.setState({
            occupancyChart: result.data
          });
        })
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    console.log(this.state.occupancyChart);
		if (!this.state.occupancyChart) {
			return (
				<div>
	        <div className="loading"></div>
	      </div>
			);
		}
    return (
      <div className="admin-container">
        <ReactHighcharts className="occupancy-graph" config = {this.state.occupancyChart}></ReactHighcharts>
      </div>
    )
  }
});

React.render(<App/>, document.getElementById('app'));
