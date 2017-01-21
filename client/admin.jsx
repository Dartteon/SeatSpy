'use strict';

var React = require('react');
var socket = io.connect();

var MerchantStatus = React.createClass({
	sendDecreaseTimeRequestToBackend() {
		socket.emit('changetimeperticket:decrement', null);
	},
	sendIncreaseTimeRequestToBackend() {
		socket.emit('changetimeperticket:increment', null);
	},
	sendDequeueRequestToBackend() {
		socket.emit('dequeue:nextticket', null);
	},
	render() {
		return (
			<div>
			{
				this.props.merchantData == null ?
					<div className="loading"></div>
				: <div className="merchant">
						<div className="merchant-status">
							<div className="merchant-status-text">
								Total in Queue:
								<div className="merchant-status-number">
									{this.props.merchantData.total_cust_in_queue}
								</div>
							</div>
							<div className="merchant-status-text">
								Estimated Waiting Time (Mins):
								<div className="merchant-status-number">
									{this.props.merchantData.total_est_waiting_time}
								</div>
							</div>
						</div>
						<div className="merchant-controls">
							<div className="merchant-controls-box"></div>
							<div className="merchant-controls-time-header">Time Per Ticket</div>
							<div className="merchant-controls-time">
								<button className="merchant-controls-arrow" onClick={this.sendDecreaseTimeRequestToBackend}>&#9664;</button>
								<div className="merchant-controls-arrow-text">{this.props.merchantData.time_per_ticket}</div>
								<button className="merchant-controls-arrow" onClick={this.sendIncreaseTimeRequestToBackend}>&#9654;</button>
							</div>
							<div className="merchant-controls-dequeue">
								<div className="merchant-controls-dequeue-text">{this.props.merchantData.next_ticket_num}</div>
								<button className="merchant-controls-dequeue-button" onClick={this.sendDequeueRequestToBackend}>Pop Next Ticket</button>
							</div>
						</div>
					</div>
			}
			</div>
		);
	}
});

var App = React.createClass({
	getInitialState() {
		return {
			merchantData: null
		};
	},

	componentDidMount() {
		socket.on('send:merchantdata', this._receiveMerchantData);
		this.sendMerchantIdToBackend();
	},

	_receiveMerchantData(data) {
		var merchantData = data;
		this.setState({merchantData: merchantData});
	},

	sendMerchantIdToBackend() {
		socket.emit('receive:merchantid', null);
	},

	render() {
		return (
			<MerchantStatus
				merchantData={this.state.merchantData}
			/>
		);
	}
});

React.render(<App/>, document.getElementById('app'));
