
//Takes the time as a string and calculates where it should be in the array
function array_position_calculation(hour)
{

   hours_in_minutes = (Number(hour[0] * 10) + Number(hour[1])) * 60;

   minutes = (Number(hour[2])* 10) + Number(hour[3])

   space = (hours_in_minutes + minutes)/15;

   return(space);

}

function array_creator(start_of_day, end_of_day){

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

    return busy_array;
}

function ScheduleAlgorithm(day_or_week, busy_array) {
        if(day_or_week == 0){//0 means the user asked for a day schedule


        }
}
