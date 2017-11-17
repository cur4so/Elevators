const express = require("express");
const EventEmitter = require("events");
const Elevator = require("./elevator");

const app = express();
const num_elevators = 2;
const max_num_floors = 10;

const elevators = [];
for (i = 0; i < num_elevators; i++){
    elevators[i] = new Elevator(max_num_floors);
}

const emitter = new EventEmitter();
const queue = [];
const calls = new Array(max_num_floors);

app.get('/elevator', (req, res) => {
    if (req.query.floor) {
        let floor = req.query.floor;
        if (parseInt(floor) == floor) {
            floor = (floor > max_num_floors) ? max_num_floors : floor;
            floor = (floor < 1) ? 1 : floor;
            get_closest(floor, (closest) => {
                if (parseInt(closest) != closest) {
                    // in case all elevators need maintenance, return a message
                    res.send(closest);
                } else {
                    elevators[closest].move(elevators[closest].on_floor,
                        floor, (action) => {
                            elevators[closest].doors(action);
                            res.send('you are in elevator:' + closest);
                            elevators[closest].occupied++;
                    });
                }
            });
        } else {
            res.send('an integer is required, got:'+floor);
        }
    } else {
        res.send('a floor is required, got nothing');
    }
});

app.get('/elevator/:closest', (req, res) => {
    let closest = req.params.closest
    if (parseInt(closest) == closest && closest >= 0 && closest < num_elevators){
        if (req.query.floor) {
            let floor = req.query.floor;
            if (parseInt(floor) == floor) {
                floor = (floor > max_num_floors) ? max_num_floors : floor;
                elevators[closest].doors('close', () => {
                    elevators[closest].move(elevators[closest].on_floor,
                        floor, (action) => {
                            elevators[closest].doors(action);
                            res.send('you are out of elevator');
                            elevators[closest].occupied--;
                            if (elevators[closest].occupied == 0){
                                emitter.emit('free', closest);
                            }
                    });
                });
            } else {
                res.send('an integer is required, got:'+floor);
            }
          } else {
            res.send('a floor is required, got nothing');
          }
    } else {
        res.send('wrong request');
    }
});

get_closest = (floor, callback) => {
    let which = null;
    let dist = max_num_floors;
    let active = 0;
    for (i = 0; i < num_elevators; i++){
        if (!elevators[i].maintenance) {
            active++;
            // elevator is already stopped at that floor,
            // then it will always have the highest priority
            if (elevators[i].on_floor == floor) { which=i; break; }
            else {
                // elevator is moving and will pass that floor on its way
                // to save time and taking into account that in the task, it's not
                // pointed still to find closest, we break on the 1st found
                if (elevators[i].moving_to !== null){
                    if ((floor - elevators[i].on_floor > 0 &&
                        elevators[i].moving_to - floor >= 0) ||
                        (elevators[i].on_floor - floor > 0 &&
                        floor - elevators[i].moving_to >= 0)){ which=i; break; }
                // get free closest
                } else if (elevators[i].occupied == 0 && dist > Math.abs(elevators[i].on_floor - floor)){
                    dist = Math.abs(elevators[i].on_floor - floor);
                    which = i;
                }
            }
        }
    }
    if (which !== null) {
        callback(which);
    } else if (active == 0) {
        callback('all elevators need service');
    } else {
        // all elevators are busy we need to wait
        if (calls[floor].length == 0) {
            queue.push(floor);
        }
        calls[floor].push(callback);
    }
}

emitter.on('free', (which) => {
    let cb;
    if (queue.length > 0) {
        let floor = queue.shift();
        while (calls[floor].lenght > 0) {
            cb = calls[floor].shift();
            cb(which);
        }
    }
});

module.exports.app = app;
