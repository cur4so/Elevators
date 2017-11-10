function Elevator(num_elevators, num_floors){
    this.num_floors = num_floors;
    this.on_floor = 1;
    this.moving_to = null;
    this.num_trips = 0;
    this.passed_floors = 0;
    this.maintenance = false;
}

Elevator.prototype.move = function(start, finish, callback) {
    if (start < 1){
        start = 1;
    }
    if (finish > this.num_floors){
        finish = this.num_floors;
    }
    this.moving_to = finish;
    if (start < finish){
        for (i=start+1; i<=finish; i++){
            this.on_floor=i;
            this.passed_floors++;
            console.log("floor: "+i);
        }
    } else {
        for (i=start-1; i>=finish; i--){
            this.on_floor=i;
            this.passed_floors++;
            console.log("floor: "+i);
        }
    }
    callback('open');
};

Elevator.prototype.doors = function(action, callback) {
    console.log(action+" door at "+this.on_floor+" floor");
    if (action == 'open'){
        this.moving_to = null;
        this.num_trips++;
        if (this.num_trips == 100) { this.maintenance = true; }
    }
    // in essence callback is called when action='close'
    if (callback && typeof callback == "function") {
        callback();
    }
};

