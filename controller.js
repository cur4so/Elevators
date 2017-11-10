// the next 2 variables can be put into the interface,
// so a user can choose for her/his convenience
// for simplicity and time saving they are hardcoded
var num_elevators = 2;
var max_num_floors = 10;

var elevators = [];
for (i = 0; i < num_elevators; i++){
    elevators[i] = new Elevator(max_num_floors);
}

// ============ outside elevator call

document.getElementById("floor")
    .addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            validate(e.target.value);
        }
    });

function validate(floor){
    if (parseInt(floor) == floor) {
        floor = (floor > max_num_floors) ? max_num_floors : floor;
        get_closest(floor, function(closest){
            elevators[closest].move(elevators[closest].on_floor,
                floor, function(action){
                    elevators[closest].doors(action);
                    document.getElementById("getin").innerHTML =
                    "<p> if you are in elevator<br>\
                    enter a floor and press enter here\
                    <input type='text' name="+closest+" id='elev'>";
            });
        });
    } else {
        alert('an integer is required, got:'+floor);
    }
}

function get_closest(floor, callback){
    var which = null;
    var dist = max_num_floors;
    for (i = 0; i < num_elevators; i++){
        if (!elevators[i].maintenance) {
            // elevator is already stopped at that floor,
            // then it will always have the highest priority
            if (elevators[i].on_floor == floor) { which=i; break; }
            else {
                // elevator is moving and will pass that floor on its way
                // to save time and taking into account that in the task, it's not
                // pointed still to find closest, we break on the 1st found
                if (elevators[i].moving_to !== null){
                    if ((floor - elevators[i].on_floor > 0 &&
                        elevators[i].moving_to -floor >= 0) ||
                        (elevators[i].on_floor - floor > 0 &&
                        floor - elevators[i].moving_to >= 0)){ which=i; break; }
                // get closest
                } else if (dist > Math.abs(elevators[i].on_floor - floor)){
                    dist = Math.abs(elevators[i].on_floor - floor);
                    which = i;
                }
            }
        }
    }
    if (which != null) {
        callback(which);
    } else {
        alert('all elevators need service');
    }
}

// ============== inside elevator call

document.getElementById("getin")
    .addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            validate_inside(e.target.value, e.target.name);
        }
    });

function validate_inside(floor, closest){
    if (parseInt(floor) == floor) {
        floor = (floor > max_num_floors) ? max_num_floors : floor;
        elevators[closest].doors('close', function(){
            elevators[closest].move(elevators[closest].on_floor,
                floor, function(action){
                    elevators[closest].doors(action);
                    document.getElementById("getin").innerHTML =
                    "<p> if you are in elevator<br>\
                    enter a floor and press enter here\
                    <input type='text' name="+closest+" id='elev'>";
            });
        });
    } else {
        alert('an integer is required, got:'+floor);
    }
}
