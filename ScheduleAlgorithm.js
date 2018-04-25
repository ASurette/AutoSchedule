//setting up classes for events and times when the user is busy, they will be in their own arrays and will be used
//to fill out the array
class Event{
    constructor(name, time_length){
        this.name = name;

        this.time_length = time_length

    }
}

class BusyTime{
    constructor(name, time_length, start_time, day){
        this.name = name;//name of the event

        this.time_length = time_length;//in minutes

        this.start_time = start_time;//in 24hr clock as a 4 digit string so 0000 or 1315

        this.day = day;

    }
}

var busy_count = 0;//a variable used to check how many busy event have been made, used to keep track of the created html elements for user inpur

var event_count = 0;//a variable to check how many events have been created

//creates the elements needed to add and delete busy times
function busy_create() {

    var div = document.getElementById("busy_create");

    //label to ask the user for the name of event
    var label = document.createElement("label");
    label.textContent = "Name of busy event: "
    div.appendChild(label);

    //set up the input to get the name of the busy event
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.id = "busy_input" + busy_count;

    div.appendChild(input);

    if (localStorage.getItem("day_or_week") == 1)
    {
        //label to ask the user what day of the week
        var label2 = document.createElement("label");
        label2.textContent = "Day of the week event takes place on: "
        div.appendChild(label2);

        //add a select for the user to select the day of the week the busy event is on
        var select1 = document.createElement("select");
        select1.id = "day_of_week" + busy_count;
        day_of_week_array_values = [0, 1, 2, 3, 4, 5, 6];
        day_of_week_array_text = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        div.appendChild(select1);

        //add the options to the selection
        for (var i = 0; i < day_of_week_array_text.length; i++) {
            var option = document.createElement("option");
            option.value = day_of_week_array_values[i];
            option.text = day_of_week_array_text[i];
            select1.appendChild(option);
        }

    }

    //label to give the user info
    var label3 = document.createElement("label");
    label3.textContent = "When does the event start? ";
    div.appendChild(label3);

    //add an input for what time the busy event starts at
    var input2 = document.createElement("input");
    input2.id = "start_time"+busy_count;
    input2.setAttribute("placeholder", "HH:MM");

    div.appendChild(input2);

    //label to give the user info
    var label4 = document.createElement("label");
    label4.textContent = "Duration of event "
    div.appendChild(label4);

    //add an input for how long the busy event lasts
    var input3 = document.createElement("input");
    input3.id = "duration"+busy_count;
    input3.setAttribute("placeholder", "Time in minutes");

    div.appendChild(input3);

    linebreak = document.createElement("br");
    div.appendChild(linebreak);

    busy_count++;

    localStorage.setItem("busy_count", busy_count);

}

function event_create() {

    var div = document.getElementById("event_create");

    //label to ask name of event
    var label = document.createElement("label");
    label.textContent = "Name of task: "
    div.appendChild(label);

    //set up the input to get the name of the event
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.id = "event_input" + event_count;

    div.appendChild(input);

    //label to ask duration of event
    var label2 = document.createElement("label");
    label2.textContent = "How long you think the task will take: "
    div.appendChild(label2);

    //add an input for how long the event lasts
    var input2 = document.createElement("input");
    input2.id = "event_duration"+event_count;
    input2.setAttribute("placeholder", "Time in minutes");

    div.appendChild(input2);

    //create a linebreak to make it look nicer
    linebreak = document.createElement("br");
    div.appendChild(linebreak);

    event_count++;

    localStorage.setItem("event_count", event_count);

}

//this is what is going to get all the data from the user input
function busy_data_collector() {

    var temp_busy_array = []

    //loop through all the inputs for each busy event and create a BusyTime out of them
    for(i = 0; i < busy_count; i++)
    {

        localStorage.setItem( "busy_input"+i, document.getElementById("busy_input"+i).value);

        localStorage.setItem( "busy_start_time"+i, document.getElementById("start_time"+i).value);

        var time_length = document.getElementById("duration"+i).value;

        time_length = (Math.ceil(time_length/15)) * 15;

        localStorage.setItem("busy_duration"+i, time_length);

        var temp_day_of_week = -1;//use -1 to represent that it is a daily schedule so we don't care about the day

        //need to run the time length and start time through some sort of value checker to make sure it is okay
        //could do it when the user types the stuff in so by this point I know it will be the correct type

        //if we are doing a week instead of a day
        if(localStorage.getItem("day_or_week") == 1)
        {

            temp_day_of_week = document.getElementById("day_of_week"+i).value;

        }

        localStorage.setItem("busy_day_of_week"+i, temp_day_of_week)

    }

}

function event_data_collector() {

    for(j = 0; j < event_count; j++)
    {

        var event_name = document.getElementById("event_input"+j).value;

        localStorage.setItem("event_name"+j, event_name);

        var event_duration = document.getElementById("event_duration"+j).value;

        event_duration = (Math.ceil(event_duration/15)) * 15;

        localStorage.setItem("event_duration"+j, event_duration);

    }

}

//Takes the time as a string and calculates where it should be in the array
function array_position_calculation(hour) {

   hours_in_minutes = (Number(hour[0] * 10) + Number(hour[1])) * 60;

   minutes = (Number(hour[2])* 10) + Number(hour[3]);

   space = (hours_in_minutes + minutes)/15;

   return(space);

}

//fill the array with the times the user gives as busy
function fill_busy_array(busy_array, busy_time_array) {

    var start_position;//where the event starts in the busy_array

    var time_ticks;//how many slots in the array the event will take up in the busy_array

        for (i = 0; i < busy_time_array.length; i++) {

            start_position = array_position_calculation(busy_time_array[i].start_time);

            time_ticks = Number(busy_time_array[i].time_length) / 15;

            for (j = start_position - 1; j < (start_position + time_ticks); j++) {

                busy_array[j] = busy_time_array[i].name;//mark it busy

            }

        }

    return busy_array;

}

//creates the initial array for when the user is busy
function array_creator(start_of_day, end_of_day, busy_time_array){

    var busy_array = Array.apply(null, Array(96)).map(Number.prototype.valueOf,0);

    //NEED TO FIX THE CASE WHERE END OF DAY IS BEFORE START OF DAY

    array_placement_start = array_position_calculation(start_of_day);

    array_placement_end = array_position_calculation(end_of_day);

    for(i = 0; i < array_placement_start; i++)
    {

        busy_array[i] = 'Sleeping';//set all the values until they start their day as busy

    }

    for(i = array_placement_end; i < 96; i++)
    {

        busy_array[i] = 'Sleeping'//the the values of when the user goes to sleep to busy

    }

    fill_busy_array(busy_array, busy_time_array);

    return busy_array;
}

function week_array_creator(start_of_day, end_of_day, busy_time_array){

    var busy_array = Array.apply(null, Array(96)).map(Number.prototype.valueOf,0);

    //NEED TO FIX THE CASE WHERE END OF DAY IS BEFORE START OF DAY

    array_placement_start = array_position_calculation(start_of_day);

    array_placement_end = array_position_calculation(end_of_day);

    for(i = 0; i < array_placement_start; i++)
    {

        busy_array[i] = 'Sleeping';//set all the values until they start their day as busy

    }

    for(i = array_placement_end; i < 96; i++)
    {

        busy_array[i] = 'Sleeping'//the the values of when the user goes to sleep to busy

    }

    return busy_array;
}

function fill_busy_week_array(busy_array, busy_time_array, day_of_week) {

    var start_position;//where the event starts in the busy_array

    var time_ticks;//how many slots in the array the event will take up in the busy_array

        for (i = 0; i < busy_time_array.length; i++) {

            if(day_of_week == busy_time_array[i].day)
            {
                start_position = array_position_calculation(busy_time_array[i].start_time);

                time_ticks = Number(busy_time_array[i].time_length) / 15;

                for (j = start_position - 1; j < (start_position + time_ticks); j++) {

                    busy_array[j] = busy_time_array[i].name;//mark it busy

                }
            }
        }

    return busy_array;

}

//insertion sort I found online at http://khan4019.github.io/front-end-Interview-Questions/sort.html
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

function ScheduleAlgorithm(busy_time_array, events_array, start_of_day, end_of_day) {

//-----------------Start Algorithm------------------------------
// -------------------------------------------------------------

        //create the busy array
        var busy_array = array_creator(start_of_day, end_of_day, busy_time_array);

        //set up a variable that will calculate how much time the user has in the day/week
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

                if(( (schedule[j] == 0) && schedule[j-1] != 0)){

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

        }
        return(schedule);
}

function WeekScheduleAlgorithm(busy_time_array, events_array, start_of_day, end_of_day) {

//-----------------Start Algorithm------------------------------
// -------------------------------------------------------------

    //create the busy arrays
    var busy_array0 = week_array_creator(start_of_day, end_of_day, busy_time_array);
    var busy_array1 = week_array_creator(start_of_day, end_of_day, busy_time_array);
    var busy_array2 = week_array_creator(start_of_day, end_of_day, busy_time_array);
    var busy_array3 = week_array_creator(start_of_day, end_of_day, busy_time_array);
    var busy_array4 = week_array_creator(start_of_day, end_of_day, busy_time_array);
    var busy_array5 = week_array_creator(start_of_day, end_of_day, busy_time_array);
    var busy_array6 = week_array_creator(start_of_day, end_of_day, busy_time_array);

    //fill the arrays with the correct busy events
    fill_busy_week_array(busy_array0, busy_time_array, 0);
    fill_busy_week_array(busy_array1, busy_time_array, 1);
    fill_busy_week_array(busy_array2, busy_time_array, 2);
    fill_busy_week_array(busy_array3, busy_time_array, 3);
    fill_busy_week_array(busy_array4, busy_time_array, 4);
    fill_busy_week_array(busy_array5, busy_time_array, 5);
    fill_busy_week_array(busy_array6, busy_time_array, 6);

    //put all of them in one array
    busy_week_array = [busy_array0, busy_array1, busy_array2, busy_array3, busy_array4, busy_array5, busy_array6];

    //set up a variable that will calculate how much time the user has in the day/week
    var total_free_time = 0;

    //loop through the busy array to see how much time they have in total
    for (k = 0; k < 7; k++)
    {
        for (i = 0; i < 96; i++) {
            if (busy_week_array[k][i] == 0) {

                total_free_time += 15;

            }
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
        return('There is not enough time in the week for all of your events.')
    }

    var schedule = busy_week_array;//make a copy in case we need the busy array untouched for something later

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

        for(z = 0; z<7; z++)
        {
            for(j = 0; j < 96; j++)//loop through the schedule and look for an empty space
            {
                //need to fix the edge case where j=0

                //if there is an empty space and the previous space isn't empty
                //this is to spend less time looping through unnecessarily
                //and to make sure we optimize the amount of space the algo has to work with

                if (((schedule[z][j] == 0) && schedule[z][j - 1] != 0)) {

                    var is_space = true;//this value if for the next part to see if there is a continuous string of 0's

                    for (k = 0; k < (Number(events_array[i].time_length) / 15); k++)//loop through for how long the event lasts
                    {

                        if (k + j > 95) {
                            is_space = false; //if k+j is > 95 that means we can't place the event there
                        }
                        else if (schedule[z][k + j] != 0)//if at any point there is no empty space then we can't use that 0
                        {
                            is_space = false;
                        }

                    }

                    if (is_space == true)//if we find a spot where we can fit the event save it in an array
                    {
                        if (potential_array.length == 1 && potential_array[0] == 0) {
                            potential_array[0] = [z,j];
                        }
                        else {
                            potential_array.push([z,j]);
                        }

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

            x = potential_array[rng][0];

            y = potential_array[rng][1];

            for(m = 0; m < number_of_spaces; m++)
            {
                schedule[x][y+m] = events_array[i].name;
            }

        }

    }

    return(schedule);

}

function main(){

    //find whether the schedule is a day or week schedule
    day_or_week = localStorage.getItem("day_or_week");

    //get when the user's day starts
    start_of_day = localStorage.getItem("start_day");

    //get when the user's day ends
    end_of_day = localStorage.getItem("end_day");

    var busy_time_array = [];//will hold all the busy events and will be passed to the algorithm

    var event_array = [];//will hold all the events and will be passed to the algorithm

    //get the array of values from the busy events the user input

    //the busy count but I don't want it to get confused with the global variable busy count, used to check how many busytime we need to create
    var BC = localStorage.getItem("busy_count");

    for(i = 0; i < BC; i++)
    {

        var name = localStorage.getItem("busy_input"+i);

        var duration = localStorage.getItem("busy_duration"+i);

        var start_time = localStorage.getItem("busy_start_time"+i);

        var dow = localStorage.getItem("busy_day_of_week"+i);

        busy_time_array.push( new BusyTime(name, duration, start_time, dow) );

    }

    var EC = localStorage.getItem("event_count");//get the event count we saved earlier because that is how many events we need to make

    for(j = 0; j < EC; j++)
    {

        var name = localStorage.getItem("event_name"+j);

        var duration = localStorage.getItem("event_duration"+j);

        event_array.push( new Event(name, duration) );

    }

    //if we are doing only a day schedule
    if(day_or_week == 0)
    {

        output = ScheduleAlgorithm(busy_time_array, event_array, start_of_day, end_of_day);

        for(m = 95; j > -1; j--)
        {
            if(output[m] == 'Sleeping')
            {
                delete(output[m]);
            }
        }

        document.getElementById('day0').innerHTML = output;

    }
    //we are doing a week schedule
    else
    {

        output = WeekScheduleAlgorithm(busy_time_array, event_array, start_of_day, end_of_day);

        for(h = 0; h < 7; h++)
        {
            for(j = 95; j > -1; j--)
            {
                if(output[h][j] == 'Sleeping')
                {
                    delete(output[h][j]);
                }
            }
        }

        //add the day schedules to the divs

        document.getElementById("day0").innerHTML = output[0];
        document.getElementById("day1").innerHTML = output[1];
        document.getElementById("day2").innerHTML = output[2];
        document.getElementById("day3").innerHTML = output[3];
        document.getElementById("day4").innerHTML = output[4];
        document.getElementById("day5").innerHTML = output[5];
        document.getElementById("day6").innerHTML = output[6];

    }

}
/*
function test()
{
    var start_of_day = '0900';
    var end_of_day = '2300';
    var BT0_0 = new BusyTime('Lunch',   '30', '1130', 0);
    var BT0_1 = new BusyTime('Lunch',   '30', '1130', 1);
    var BT0_2 = new BusyTime('Lunch',   '30', '1130', 2);
    var BT0_3 = new BusyTime('Lunch',   '30', '1130', 3);
    var BT0_4 = new BusyTime('Lunch',   '30', '1130', 4);
    var BT0_5 = new BusyTime('Lunch',   '30', '1130', 5);
    var BT0_6 = new BusyTime('Lunch',   '30', '1130', 6);
    var BT1_1 = new BusyTime('Workout', '45', '1330', 1);
    var BT1_3 = new BusyTime('Workout', '45', '1330', 3);
    var BT2_2 = new BusyTime('Math',    '75', '1230', 2);
    var BT2_4 = new BusyTime('Math',    '75', '1230', 4);
    var busy_time_array = [BT0_0, BT0_1, BT0_2, BT0_3, BT0_4, BT0_5, BT0_6, BT1_1, BT1_3, BT2_2, BT2_4];
    var ET0 = new Event('Math Homework', '120');
    var ET1 = new Event('Coding Homework', '90');
    var ET2 = new Event('Laundry', '180');
    var ET3 = new Event('Senior Design', '60');
    var ET4 = new Event('Senior Design 2', '120');
    var ET5 = new Event('Grocery Shopping');
    var event_array = [ET0, ET1, ET2, ET3, ET4, ET5];
    schedule = WeekScheduleAlgorithm(busy_time_array, event_array, start_of_day, end_of_day);
    for(h = 0; h < 7; h++)
    {
        for(j = 95; j > -1; j--)
        {
            if(schedule[h][j] == 'Sleeping')
            {
                delete(schedule[h][j]);
            }
        }
    }
    document.getElementById("day0").innerHTML = schedule[0];
    document.getElementById("day1").innerHTML = schedule[1];
    document.getElementById("day2").innerHTML = schedule[2];
    document.getElementById("day3").innerHTML = schedule[3];
    document.getElementById("day4").innerHTML = schedule[4];
    document.getElementById("day5").innerHTML = schedule[5];
    document.getElementById("day6").innerHTML = schedule[6];
}
*/
//test();
