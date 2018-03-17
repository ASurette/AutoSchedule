
//setting up classes for events and times when the user is busy, they will be in their own arrays and will be used
//to fill out the array
class Event{
    constructor(name, time_length){
        this.name = name;

        this.time_length = time_length

    }
}

class BusyTime{
    constructor(name, time_length, start_time){
        this.name = name;//name of the event

        this.time_length = time_length;//in minutes

        this.start_time = start_time;//in 24hr clock as a 4 digit string so 0000 or 1315

    }
}

//Takes the time as a string and calculates where it should be in the array
function array_position_calculation(hour)
{

   hours_in_minutes = (Number(hour[0] * 10) + Number(hour[1])) * 60;

   minutes = (Number(hour[2])* 10) + Number(hour[3])

   space = (hours_in_minutes + minutes)/15;

   return(space);

}

//fill the array with the times the user gives as busy
function fill_busy_array(busy_array, busy_time_array){

    var start_position;//where the event starts in the busy_array

    var time_ticks;//how many slots in the array the event will take up in the busy_array

    for(i=0; i < busy_time_array.length; i++)
    {

        start_position = array_position_calculation(busy_time_array[i].start_time);

        time_ticks = Number(busy_time_array[i].time_length) / 15;

        for(j = start_position-1; j < (start_position+time_ticks); j++){

            busy_array[j] = 'B';//mark it busy

        }

    }

    return busy_array

}

//creates the initial array for when the user is busy
function array_creator(start_of_day, end_of_day, busy_time_array){

    var busy_array = Array.apply(null, Array(96)).map(Number.prototype.valueOf,0);


    //NEED TO FIX THE CASE WHERE END OF DAY IS BEFORE START OF DAY


    array_placement_start = array_position_calculation(start_of_day);

    array_placement_end = array_position_calculation(end_of_day);

    for(i = 0; i < array_placement_start; i++)
    {

        busy_array[i] = 'B';//set all the values until they start their day as busy

    }

    for(i = array_placement_end; i < 96; i++)
    {

        busy_array[i] = 'B'//the the values of when the user goes to sleep to busy

    }

    fill_busy_array(busy_array, busy_time_array)

    return busy_array;
}

//insertion sort I found onlien at http://khan4019.github.io/front-end-Interview-Questions/sort.html
function bubbleSort(arr){
    var len = arr.length;
    for (var i = len-1; i>=0; i--){
        for(var j = 1; j<=i; j++){
            if( Number(arr[j-1].time_length) < Number(arr[j].time_length) ){
                var temp = arr[j-1];
                arr[j-1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

function ScheduleAlgorithm(day_or_week, busy_time_array, events_array, start_of_day, end_of_day) {

        var busy_array = array_creator(start_of_day, end_of_day, busy_time_array);

        var total_free_time = 0;

        //loop through the busy array to see how much time they have in total
        for(i = 0; i < 96; i++)
        {
            if(busy_array[i] == 0)
            {

                total_free_time += 15;

            }
        }

        number_events = events_array.length;

        total_event_time = 0;

        //turn the time_length string to an int
        for(i = 0; i < events_array.length; i++){
             Number(events_array[i].time_length)
            }

        for(j = 0; j < number_events; j++){

            total_event_time = total_event_time + Number(events_array[j].time_length);

        }

        if(total_free_time < total_event_time){
            return('There is not enough time in the day for all of your events.')
        }

        var schedule = busy_array;//make a copy in case we need the busy array untouched for something later

        bubbleSort(events_array);//this bubblesort sorts high to low, this is because I want to find space for the large time commitments since they will fit in less spaces as events are placed

        //loop through the schedule and look for a 0, then see if there are enough 0 behind that 0 to place the current event in there
        //once you find a spot replace enough 0 with that event name

        //for loop to loop through events
        //find all the potential spaces the event can go in
        //event should be touching at least 1 non-0, this way you don't waste potential time by putting a large event
        // in the middle of a time block then can't fit a smaller event around it

        number_of_events = events_array.length;

        for(i = 0; i < number_of_events; i++)//for all of the events
        {
            var potential_array = [0];//array where we will be putting potential places for events

            for(j = 0; j < 96; j++)//loop through the schedule and look for an empty space
            {
                //need to fix the edge case where j=0

                //if there is an empty space and the previous space isn't empty
                //this is to spend less time looping through unnecessarily
                //and to make sure we optimize the amount of space the algo has to work with

                if((schedule[j] == 0) && schedule[j-1] != 0){

                    var is_space = true;//this value if for the next part to see if there is a continuous string of 0's

                    for(k = 0; k < (Number(events_array[i].time_length) / 15); k++)//loop through for how long the event lasts
                    {
                        if(k+j > 95){
                            is_space = false; //if k+j is > 95 that means we can't place the event there
                        }
                        else if(schedule[k+j] != 0)//if at any point there is no empty space then we can't use that 0
                        {
                            is_space = false;
                        }

                    }

                    if(is_space == true)//if we find a spot where we can fit the event save it in an array
                    {
                        if(potential_array.length == 1 && potential_array[0] == 0)
                        {
                            potential_array[0] = j;
                        }
                        else
                        {
                            potential_array.push(j);
                        }

                    }

                }

            }

            if(potential_array[0] == 0)//if no valid spaces were found
            {

                return('There is no space for this event:');

            }
            else
            {
                var rng = Math.floor(Math.random() * potential_array.length);//way to chose a random space in the schedule

                number_of_spaces = Number(events_array[i].time_length)/15;//how many spaces the event fills in the schedule

                for(m = 0; m < number_of_spaces; m++)
                {
                    schedule[potential_array[rng]+m] = events_array[i].name;
                }

            }
            console.log(schedule)
        }
        return(schedule);
}

var day_or_week = 0;
var start_of_day = '0900';
var end_of_day = '2200';

var busy1 = new BusyTime('A', '75', '1230');

var busy2 = new BusyTime('B', '105', '1630');

var busy3 = new BusyTime('C', '180', '1830');

var BTA = [busy1, busy2, busy3];

var event1 = new Event('90', '90');

var event2 = new Event('30', '30');

var event3 = new Event('15A', '15');

var event4 = new Event('15B', '15');

var event5 = new Event('45', '45');

var events_array = [event1, event2, event3, event4, event5];

ScheduleAlgorithm(day_or_week, BTA, events_array, start_of_day, end_of_day);

//console.log(ScheduleAlgorithm(day_or_week, BTA, events_array, start_of_day, end_of_day));
