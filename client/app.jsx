'use strict';

var React = require('react');
var socket = io.connect();

var App = React.createClass({
	getInitialState() {
		return {
			seats: null,
			numEmpty: 0,
			numFull: 0,
		};
	},

	componentDidMount() {
		socket.on('init', this._initialize);
		socket.on('send:data', this._receiveData);
		this.createSocket();
	},

	_initialize(data) {
		var { seats, numEmpty, numFull } = data;
		this.setState({ seats: seats, numEmpty: numEmpty, numFull: numFull });
	},

	_receiveData(data) {
		console.log("Data received " + JSON.stringify(data));
		var { seats, numEmpty, numFull } = data;
		this.setState({ seats: seats, numEmpty: numEmpty, numFull: numFull });
	},

	createSocket() {
		var data = {};
		socket.emit('receive:newConnection', data);
	},

	render() {
		console.log('myState', this.state);
		return (
			<div className="app-container">
				<div className="area-name-block">
					<div className="area-name">Koufu</div>
				</div>
				<div className="seats-block-container">
					<div className="seats-block empty-seats-color">
						<div className="seats-number">{this.state.numEmpty}</div>
						<div className="seats-label">EMPTY</div>
					</div>
					<span className="space-filler" />
					<div className="seats-block occupied-seats-color">
						<div className="seats-number">{this.state.numFull}</div>
						<div className="seats-label">OCCUPIED</div>
					</div>
				</div>
				<div className="visualised-seats-container">
					<div className="visualised-seats-block">
						<div className="seat top left"></div>
						<div className="seat top right"></div>
						<div className="table"></div>
						<div className="seat bottom left"></div>
						<div className="seat bottom right"></div>
					</div>
					<span className="space-filler" />
					<div className="visualised-seats-block">
						<div className="seat top left"></div>
						<div className="seat top right"></div>
						<div className="table"></div>
						<div className="seat bottom left"></div>
						<div className="seat bottom right"></div>
					</div>
				</div>
			</div>
		);
	}
});

React.render(<App/>, document.getElementById('app'));
