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
					<div className="area-name">Prototype #1</div>
				</div>
				<div className="seats-block">
					<div className="empty-seats">
						<p className="empty-seats-number">8</p>
						<p className="empty-seats-label">EMPTY</p>
					</div>
					<div className="occupied-seats">
						<p className="occupied-seats-number">0</p>
						<p className="occupied-seats-label">OCCUPIED</p>
					</div>
				</div>
				<div className="visualised-seats"></div>
			</div>
		);
	}
});

React.render(<App/>, document.getElementById('app'));
