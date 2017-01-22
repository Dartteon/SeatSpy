'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
var ReactHighcharts = require ('react-highcharts');

var App = React.createClass({
	getInitialState: function() {
    return {
      occupancyChart: null,
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
				<div className="chart-container">
					<div className="chart">
      			<ReactHighcharts config={this.state.occupancyChart}></ReactHighcharts>
					</div>
				</div>
      </div>
    )
  }
});

ReactDOM.render(<App/>, document.getElementById('app'));
