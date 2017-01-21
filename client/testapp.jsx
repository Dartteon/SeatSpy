'use strict';

import React from 'react';
import { Component } from 'react';
import { PropTypes } from 'react';

var socket = io.connect();

export default class ChatApp extends Component {
    
    // componentDidMount(){
    //     var customer_id = localStorage.getItem("customer_id");
    //     socket.emit('retrieve:info', { customer_id : customer_id}, (result) => {
    //         if (!result){
    //             console.log('No result from componentWillMount using retrieve:info.');
    //         }
	// 	});
        
	// 	socket.on('init', this._initialize);
    //     socket.on('send:ticketData', this._unpackTicketData);
    
    // }

    // _initialize(data){
    //     _unpackTicketData(data);
    // }

    // _unpackTicketData(data){
    //     var queueData = data.queueData;
    //     var ticketData = data.ticketData;
    //     this.setState({
    //         queue: queueData,
    //         ticket: queueData
    //     });
    // }

    constructor(props){
        super(props);
        this.state = {
            queue: null,
            ticket: null,
            error: null
        }
    }

    render (){
        return (
            <div>Hello world</div>
            // <div>
            //     {
            //         if (this.state.ticket) {
            //             //  <div>
            //             //     <p>No. of people in front: {this.state.ticket.num_customers_in_front}</p>
            //             //     <br />
            //             //     <p>Estimated waiting time: {this.state.ticket.est_wait_time}</p>
            //             // </div>
            //             <div>I have ticket info</div>
            //         } else if (this.state.queue) {
            //             // <div>
            //             //     <p>No. of people in front: {this.state.queue.num_customers_in_front}</p>
            //             //     <br />
            //             //     <p>Estimated waiting time: {this.state.queue.est_wait_time}</p>
            //             // </div>
            //             <div>I have queue info</div>
            //         } else {
            //             <div>
            //                 <p> Loading </p>
            //             </div>
            //         }
            //     }
            // </div>
        );
    }
}

