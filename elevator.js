class Elevator {
  constructor(num_floors) {
    this.num_floors = num_floors;
    this.on_floor = 1;
    this.moving_to = null;
    this.num_trips = 0;
    this.passed_floors = 0;
    this.maintenance = false;
    this.occupied = 0;
  }

  move(start, finish, callback) {
    if (start < 1){
        start = 1;
    }
    if (finish > this.num_floors){
        finish = this.num_floors;
    }
    if (this.occupied < 2) {
        this.moving_to = finish;

        if (start < finish){
            for (let i=start+1; i<=finish; i++){
                this.on_floor = i;
                this.passed_floors++;
                console.log("floor: "+i);
            }
        } else {
            for (let i=start-1; i>=finish; i--){
                this.on_floor=i;
                this.passed_floors++;
                console.log("floor: "+i);
            }
        }
    } else {
    // multiple occupants case
        // we're going up
        if ((this.moving_to > start && start < finish && this.moving_to < finish ) ||
        // we're going down
            (this.moving_to < start && start > finish && this.moving_to > finish)) {
            this.moving_to = finish;
        }
    }

    callback('open');
  };

  doors(action, callback) {
    console.log(action+" door at "+this.on_floor+" floor");
    if (action == 'open'){
        if ( this.moving_to == this.on_floor  && this.occupied > 1){
            // eventually somone went wrong direction
            // but the trip is over
            this.occupied = 1
        }
        if (this.occupied < 2){
            this.moving_to = null;
            this.num_trips++;
            if (this.num_trips == 100) { this.maintenance = true; }
        }
    }
    // in essence callback is called when action='close'
    if (callback && typeof callback == "function") {
        callback();
    }
  };

}
module.exports = Elevator;
