
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


function ScheduleAlgorithm(day_or_week, busy_array, events_array) {

        var total_time = 0;

        //loop through the busy array to see how much time they have in total
        for(i = 0; i < 96; i++)
        {
            if(busy_array[i] == 0)
            {

                total_time += 15;

            }
        }

        number_events = events_array.length()

        total_event_time = 0;

        for(j = 0; j < number_events; j++){

            total_event_time = total_event_time + events_array[j].time_length;

        }

        if(total_time < total_event_time){
            return('There is not enough time in the day for all of your events.')
        }


}

