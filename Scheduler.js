
function array_position_calculation(hour)
{
   console.log(hour);

   hours_in_minutes = (Number(hour[0] * 10) + Number(hour[1])) * 60;

   console.log('hours_in_minutes is', hours_in_minutes);

   minutes = (Number(hour[2])* 10) + Number(hour[3])

   space = (hours_in_minutes + minutes)/15;

   return(space);

}

function array_creator(start_of_day, end_of_day){

    var busy_array;

    for(i=0; i<96; i++){
        busy_array[i] = 0;
    }

}

function ScheduleAlgorithm(day_or_week, busy_array) {
        if(day_or_week == 0){//0 means the user asked for a day schedule



        }
}

console.log(array_position_calculation('0000'));

console.log(array_position_calculation('0015'));

console.log(array_position_calculation('0600'));

console.log(array_position_calculation('1000'));

console.log(array_position_calculation('0215'));

console.log(array_position_calculation('1245'));

console.log(array_position_calculation('2400'));

