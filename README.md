# ticketr

ticketr uses socket.io to push updates about the queue to merchants and customers. The merchant simply has to provide a link to the customers, and the customers simply have to click a button to join the queue. The customer will be able to see the number of people in front of him, and also the estimated time he will have to wait for. The estimated time can be varied by the merchant.

## Running it

First, grab the dependencies:

	npm install
	npm run build
	npm run buildadmin
	npm start

Go to `localhost:5000` as a customer or `localhost:5000/admin` as admin!

## Inspiration
I hate wasting time in a queue. Time that could have been spent coding and making apps like these. This app aims to remove the need to physically wait for your turn at the shop you are queuing for, and monitor the status of your queue in real time.

## How we built it
Using node.js and hosted on heroku, this app primarily uses socket.io and react.js. The queue backend system is managed via the node.js webserver, which pushes updates to frontend clients via socket.io, which react.js will then update the view that the clients see. This way, the client customer will be able to be updated each time there is a change in the queue status.

## Challenges we ran into
Uploading to heroku was a primary source of difficulty as the starter pack we used as a framework for wasn't configured to be hosted on heroku; we had to configure manual build commands for the different routed pages. Afterwards, we had to learn socket.io from scratch as we have not used it before.

## Accomplishments that we're proud of
We learnt socket.io and hosted a working react project on heroku - something that we have tried multiple times in our spare time and failed!

## What we learned
socket.io is a very strong and flexible framework - we will definitely use it in the future.

## What's next for Ticketr
Saving customers and their tickets into an external database (mLabs by heroku), and integrate Twilio so customers can receive an SMS alert when their ticket is called.
