Elevator simulator
===============

An elevator app simulates a system of elevators movement, where an 
elevator outside (building floor) call is done on the endpoint /elevator 
and inside (from within the  elevator) call is done on 
/elevator/:elevator_number endpoint. It's able to handle multiple 
occupants simultaneously. `Floor` parameter is required, which specifies 
the destination floor. 
 
Getting Started
---------------
* Install node.js and supplemental libraries
* `npm install`
* Start the server 
* `npm start`
* In a separate terminal make the app call for outside elevator call: 
* `curl http://0.0.0.0:3000/elevator?floor=<floor_number>`
* or for inside call:
* `curl http://0.0.0.0:3000/elevator/<elevator_number>?floor=<destination_floor_number>`


server.js: runs an Express server on localhost port 3000.

app.js: the main app (elevators' handling controller)

elevator.js: the elevator class 


