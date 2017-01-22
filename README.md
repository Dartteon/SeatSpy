## Inspiration
Ever scoured a hawker center, wait by a table like a voucher for other customers to finish their food? Ever walked in circles in the library hoping to find a vacant seat? We have, and hated it. We built this solution to allow users to find seats easily.

## What it does
This solution consists of sensors that monitor seat occupancy rates and transmit the data to a server. 

Users (seat-finders) can visit a website to find out the current state of the seats, and triangulate the closest vacant seat. As the frontend is built with React, the UI appears nicely on mobile, which the users are most likely using.

Stakeholders (owners of the seats) can use seat vacancy data to study the behavior of the users, and also to decide if he needs more or less seats. The vacancy state of the seats is polled regularly, and stored into an online database. We even implemented an admin page which displays the graph of occupancy rates for the past 24 hours.

## How we built it
Hardware (sensors) - A camera is attached to a Raspberry-Pi (Python), which periodically processes (opencv) the captured images and updates the server wirelessly via a HTTP request through an API endpoint. 

Backend Server - The node.js server is connected to all clients via socket.io, such that it can then immediately push the updated data to the clients, removing the need for them to continuously refresh their browser for the latest updates. 

Database - Every few minutes, the server stores the current states of the seats into an online database (MongoDB) - allowing us to poll the data and plot a chart of the occupancy rate for the stakeholders to study.

Front-End - Built on React, this allows us to update elements on the user's screen quickly and easily, and also have responsive behavior for all view sizes, whether on web or mobile.

## Challenges we ran into
Initially, we wanted two different types of sensors - thermal (Arduino) and vision (Raspberry-Pi). However, we failed to secure a reliable wireless communications module for the Arduino, preventing us from utilizing it. The pictures taken by the camera for the Raspberry-Pi is also very low in resolution, making it harder to use it to detect shapes.

## Accomplishments that we're proud of
Having the patience to download the OS and dependencies for the Raspberry-Pi. This process took way longer than expected. 

And also implementing a solution that utilized both web development and hardware - the mark of real Computer Engineers!

## What I learned
Download libraries before the hackathon...

## What's next for SeatSpy
Implement the seat detection via machine learning, and train it to more accurately detect vacant seats. We would also like to group the seats together, which is important for the hawker center context (strangers don't usually share the same table).
