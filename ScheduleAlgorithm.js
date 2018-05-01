
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

var busy_count = 0;//a variable used to check how many busy event have been made, used to keep track of the created html elements for user input

var event_count = 0;//a variable to check how many events have been created

var final_schedule;//the final schedule, used for adding events to Google Calendar

//creates the elements needed to add and delete busy times
function busy_create() {

    var div = document.getElementById("busy_create");

    //label to ask the user for the name of event
    var label = document.createElement("label");
    label.textContent = "What are you doing? "
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
        label2.textContent = "What day of the week does it occur? "
        div.appendChild(label2);

        //add a select for the user to select the day of the week the busy event is on
        var select_days_of_week = document.createElement("select");
        select_days_of_week.id = "day_of_week" + busy_count;
        select_days_of_week.setAttribute("multiple", "Multiple")
        day_of_week_array_values = [0, 1, 2, 3, 4, 5, 6];
        day_of_week_array_text = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        div.appendChild(select_days_of_week);

        //add the options to the selection
        for (var i = 0; i < day_of_week_array_text.length; i++) {
            var option = document.createElement("option");
            option.value = day_of_week_array_values[i];
            option.text = day_of_week_array_text[i];
            select_days_of_week.appendChild(option);
        }

    }

    //label to give the user info
    var label3 = document.createElement("label");
    label3.textContent = "When does the event start? ";
    div.appendChild(label3);

    /*
    //add an input for what time the busy event starts at
    var input2 = document.createElement("input");
    input2.id = "start_time"+busy_count;
    input2.setAttribute("placeholder", "HH:MM");

    div.appendChild(input2);
    */

    var hour_select = document.createElement("select");
    hour_select.id = "hour_select" + busy_count;
    hour_select_values = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
    hour_select_text = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

    for (var i = 0; i < hour_select_values.length; i++) {
        var option = document.createElement("option");
        option.value = hour_select_values[i];
        option.text = hour_select_text[i];
        hour_select.appendChild(option);
    }

    div.appendChild(hour_select);

    var minute_select = document.createElement("select");
    minute_select.id = "minute_select" + busy_count;
    minute_select_values = ['00','15','30','45'];
    minute_select_text = ['00','15','30','45'];

    for (var i = 0; i < minute_select_values.length; i++) {
        var option = document.createElement("option");
        option.value = minute_select_values[i];
        option.text = minute_select_text[i];
        minute_select.appendChild(option);
    }

    div.appendChild(minute_select);

    //label to give the user info
    var label4 = document.createElement("label");
    label4.textContent = "How long will it take? "
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
//creates the elements needed to add and delete event times
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
    label2.textContent = "How long you think the task will take? "
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

//this is what is going to get all the data from the user input for busy events
function busy_data_collector(){

    var total_hidden_events = 0;//this is for all the extra events because of the multiple selector for week schedules

    //loop through all the inputs for each busy event and create a BusyTime out of them
    for(i = 0; i < busy_count; i++)
    {

        localStorage.setItem( "busy_input"+i, document.getElementById("busy_input"+i).value);

        var H = document.getElementById("hour_select"+i).value;

        var M = document.getElementById("minute_select"+i).value;

        localStorage.setItem( "busy_start_time"+i, H+M);

        var time_length = document.getElementById("duration"+i).value;

        time_length = (Math.ceil(time_length/15)) * 15;

        localStorage.setItem("busy_duration"+i, time_length);

        var temp_day_of_week = -1;//use -1 to represent that it is a daily schedule so we don't care about the day

        //need to run the time length and start time through some sort of value checker to make sure it is okay
        //could do it when the user types the stuff in so by this point I know it will be the correct type

        //if we are doing a week instead of a day
        if(localStorage.getItem("day_or_week") == 1)
        {

            var S = '#day_of_week' + i + " option:checked";//the selector for querySelectorAll

            const selected = document.querySelectorAll(S);
            const values = Array.from(selected).map((el) => el.value);//get the multiple values

            var L = values.length;//get the length of the array which is how many extra events there are needed.-

            if(L > 1)//if multiple selections
            {
                for(k = 1; k < L ; k++)
                {

                    total_hidden_events++;//increment this for each extra day of the week beyond the first

                    var num = total_hidden_events + busy_count -1;

                    localStorage.setItem("busy_day_of_week"+num, values[k]);

                    localStorage.setItem("busy_start_time"+num, H+M);

                    localStorage.setItem("busy_duration"+num, time_length);

                    localStorage.setItem( "busy_input"+num, document.getElementById("busy_input"+i).value);

                }
            }

            temp_day_of_week = document.getElementById("day_of_week"+i).value;

        }

        localStorage.setItem("busy_day_of_week"+i, temp_day_of_week);

    }

    busy_count += total_hidden_events;//add the extra events to busy count because that is how many

    localStorage.setItem("busy_count", busy_count);

    console.log("Busy count is: ", busy_count);

}

//this is what is going to get all the data from the user input for events
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
function array_position_calculation(hour) {//hour is a string in the format HHMM

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

        start_position = array_position_calculation(busy_time_array[i].start_time) + 1;

        time_ticks = Number(busy_time_array[i].time_length) / 15;

        for (j = start_position - 1; j < (start_position + time_ticks - 1); j++) {

            busy_array[j] = busy_time_array[i].name;//mark it busy

        }

    }
    return busy_array;
}

//fills the array of arrays for a week schedule
function fill_busy_week_array(busy_array, busy_time_array, day_of_week) {

    var start_position;//where the event starts in the busy_array

    var time_ticks;//how many slots in the array the event will take up in the busy_array

    for (i = 0; i < busy_time_array.length; i++) {

        if(day_of_week == busy_time_array[i].day)
        {

            start_position = array_position_calculation(busy_time_array[i].start_time) + 1;

            time_ticks = Number(busy_time_array[i].time_length) / 15;

            for (j = start_position - 1; j < (start_position + time_ticks -1); j++) {

                busy_array[j] = busy_time_array[i].name;//mark it busy

            }
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

//creates the array of arrays for when the user is busy for a week schedule
function week_array_creator(start_of_day, end_of_day){

    var busy_array = Array.apply(null, Array(96)).map(Number.prototype.valueOf,0);

    //NEED TO FIX THE CASE WHERE END OF DAY IS BEFORE START OF DAY

    console.log(start_of_day);

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

//converts minutes to hours and minutes
function convert_min_to_hr(time){

    var hours = Math.floor(time/60);//the number of hours in the time

    var min = time % 60;//the remainder which in this case is the minutes

    return [hours,min];

}

//adds two times together
function add_times(time1, time2){

    var hour = time1[0]+time2[0];

    var min = time1[1]+time2[1];

    if(min >= 60){

        hour += Math.floor(min/60);//converts minutes to hours and adds to hours

        min = min % 60;//the remainder is the minutes

    }

    return [hour, min];
}

//the algorithm that calculates where the events should go
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
//the algorithm that calculates where the events should go for a week schedule
//its pretty much the same as the ScheduleAlgorithm but it works for the array of arrays needed for a week schedule
function WeekScheduleAlgorithm(busy_time_array, events_array, start_of_day, end_of_day) {

//-----------------Start Algorithm------------------------------
// -------------------------------------------------------------

    //create the busy arrays
    var busy_array0 = week_array_creator(start_of_day, end_of_day);
    var busy_array1 = week_array_creator(start_of_day, end_of_day);
    var busy_array2 = week_array_creator(start_of_day, end_of_day);
    var busy_array3 = week_array_creator(start_of_day, end_of_day);
    var busy_array4 = week_array_creator(start_of_day, end_of_day);
    var busy_array5 = week_array_creator(start_of_day, end_of_day);
    var busy_array6 = week_array_creator(start_of_day, end_of_day);

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

//this function calulcates which days of the week are which date depending on the user's initial date
//it takes into consideration if the month or year will change
function calculate_week(year, month, day, day_of_week)
{
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    var days_in_month = 0;// a variable that will store the total number of days in the month depending on what month it is

    //if the month is Jan Mar, May, Jul, Aug, Oct, Dec
    if(month == 1 | month == 3 | month == 5 | month == 7 | month == 8 | month == 10 | month == 12){days_in_month = 31;}
    //if the month is Apr, Jun, Sep, Nov
    else if(month == 4 | month == 6 | month == 9 | month == 11){days_in_month = 30;}
    //if the month is Feb, we need to check if it is a leap year
    else if(month ==2)
    {
        //checking if it is a leap year
        //its a leap year if the year%4 is 0, year%100 is not 0, unless year%400 is 0
        if(year%4 == 0)//if the year is divisible by 4 evenly
        {
            if(year%100 == 0)//if year is divisible by 100 evenly
            {
                //if year is divisible by 400 evenly
                if(year%400 == 0) {days_in_month = 29;}
                else {days_in_month = 28;}//if not a leap year
            }
            else
            {
                days_in_month = 29;
            }
        }
        else{days_in_month = 28;}//if not a leap year
    }
    else{return 'Error: not a valid month';}

    var date_array = [];//an array that hold the dates inthe format YYYY-MM-DD, which is what the google calendar api needs

    //check if we need to go into the next month
    if( ((day+7)>days_in_month) )
    {
        var difference = days_in_month - day;//the differences in the number of days

        //calculates the offsets
        for(i = 0; i < 7; i++)
        {

            var offset = 7 - (day_of_week - i);//the offset for the date, if Tues is the 17th, the sunday needs to be +5 or the 22nd
            if (offset >= 7) {offset = offset - 7;}//this is part of the offset equation

            var date;
            if ((day + offset) > days_in_month)//if the offset pushes you into another month
            {

                var temp_m = parseInt(month) + 1;

                var temp_y = year;

                if(temp_m == 13)
                {
                    temp_m = 1;

                    temp_y = year + 1;

                }

                if( String(temp_m).length == 1){temp_m = '0' + String(temp_m);}

                var off_diff = offset - difference;//this value is the day of the next month so if the offset is 3 and the difference is 2 3-2=1 so the date is the first
                if( String(off_diff).length == 1){off_diff = '0' + String(off_diff);}

                date = temp_y + '-' + temp_m + '-' + off_diff;//setting it to the format Google Calendar Needs

            }
            else//not in the next month ever
            {
                if( String(month).length == 1){month = '0' + String(month);}

                date = year + '-' + month + '-' + (day + offset);//setting it to the format Google Calendar Needs
            }

            date_array.push(date);

        }
    }
    else//we do not go into next month
    {
        //calculates the offsets
        for(i = 0; i < 7; i++)
        {
            var offset = 7-(day_of_week-i);//the offset for the date, if Tues is the 17th, the sunday needs to be +5 or the 22nd

            if(offset >= 7){offset = offset - 7;}//this is part of the offset equation

            var date = year+'-'+month+'-'+(day+offset);//setting it to the format Google Calendar Needs

            date_array.push(date);

        }
    }

    return date_array;

}

//this function gets the current schedule and adds it to the user's google calender
function addToGoogleCalendar() {

    year = localStorage.getItem("year");
    month = localStorage.getItem("month");
    day = localStorage.getItem("day");

    var d = new Date(year, month-1, day);//date treats Jan as  month 0 so it needs to be -1 to get the correct month

    day_of_week = d.getDay();//what day of the week the starting date is, this is used for calculating what exact week the user's schedule is

    start_date = year+'-'+month+'-'+day;

    day_or_week = localStorage.getItem("day_or_week");//if it is a day or week schedule


    if(day_or_week == 0)//if we are doing a day schedule
    {
        start_end_array = [];//an array that hold the start and end times of an event as well as the name of that event

        //loop through the array and look for non-0 non-Sleeping values aka events and busy events
        for(i = 0; i < 96; i++)
        {

            if(final_schedule[i] != 0 && final_schedule[i] != 'Sleeping')
            {
                count = 0;

                do { count++ }
                while (final_schedule[i] == final_schedule[i+count]);

                var ST = convert_min_to_hr((i)*15);//start time

                var duration = convert_min_to_hr((count) * 15);//duration of the event

                var ET = add_times(ST, duration);//adds the duration to the start time to find the end time

                start_end_array.push(final_schedule[i], ST, ET);

                i += count-1;//skip past all the spaces we checked with the while loop so we do not get duplicate events at the same time

            }

        }

        //now we have the date and when each event starts and ends as well as its name
        //we can make Google Calendar Events and push them to the calendar
        for(k = 0; k < start_end_array.length; k=k+3)
        {

            var start_hour = String(start_end_array[k+1][0]);
            var start_min  = String(start_end_array[k+1][1]);

            var end_hour   = String(start_end_array[k+2][0]);
            var end_min    = String(start_end_array[k+2][1]);

            //these if statements turn the int values of hour and minutes into strings and add 0 if it a single value
            //if the hour is 7 then it needs to be '07'
            if(start_hour.length == 1)
            {
                start_hour = '0'+start_hour;
            }
            if(start_min.length == 1)
            {
                start_min = '0'+start_min;
            }
            if(end_hour.length == 1)
            {
                end_hour = '0'+end_hour
            }
            if(end_min.length == 1)
            {
                end_min = '0'+end_min;
            }

            var event = {'summary': start_end_array[k],
                                'start': {'dateTime': start_date+'T'+start_hour+":"+start_min+":00", "timeZone": "America/New_York"},
                                'end':   {'dateTime': start_date+'T'+end_hour+":"+end_min+":00", "timeZone": "America/New_York"}
            }

            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });

            request.execute(function(event) {
                appendPre('Event created: ' + event.htmlLink);
            });

         }

    }
    else//if it is a week schedule
    {

        date_array = calculate_week(year, month, day, day_of_week);//creates the date array that is needed for adding the events on the correct days

        console.log(date_array);

        for(p = 0; p < 7; p++) {

            start_end_array = [];//an array that hold the start and end times of an event as well as the name of that event

            //loop through the array and look for non-0 non-Sleeping values aka events and busy events
            for (i = 0; i < 96; i++) {

                if (final_schedule[p][i] != 0 && final_schedule[p][i] != 'Sleeping') {

                    var ST = convert_min_to_hr((i) * 15);//start time, returns an array[hours, minutes ]

                    count = 0;

                    do {
                        count++
                    }
                    while (final_schedule[p][i] == final_schedule[p][i + count]);
                    var duration = convert_min_to_hr((count) * 15);//duration of the event, returns an array [hours, minutes]

                    var ET = add_times(ST, duration);//adds the duration to the start time to find the end time

                    start_end_array.push(final_schedule[p][i], ST, ET);//adds the name of the event, when it starts and when it ends to the array

                    i += count - 1;//skip past all the spaces we checked with the while loop so we do not get duplicate events at the same time

                }

            }

            //now we have the date and when each event starts and ends as well as its name
            //we can make Google Calendar Events and push them to the calendar
            for (k = 0; k < start_end_array.length; k = k + 3) {

                var start_hour = String(start_end_array[k + 1][0]);
                var start_min = String(start_end_array[k + 1][1]);

                var end_hour = String(start_end_array[k + 2][0]);
                var end_min = String(start_end_array[k + 2][1]);

                //these if statements turn the int values of hour and minutes into strings and add 0 if it a single value
                //if the hour is 7 then it needs to be '07'
                if (start_hour.length == 1) {
                    start_hour = '0' + start_hour;
                }
                if (start_min.length == 1) {
                    start_min = '0' + start_min;
                }
                if (end_hour.length == 1) {
                    end_hour = '0' + end_hour
                }
                if (end_min.length == 1) {
                    end_min = '0' + end_min;
                }

                var event = {
                    'summary': start_end_array[k],
                    'start': {
                        'dateTime': date_array[p] + 'T' + start_hour + ":" + start_min + ":00",
                        "timeZone": "America/New_York"
                    },
                    'end': {
                        'dateTime': date_array[p] + 'T' + end_hour + ":" + end_min + ":00",
                        "timeZone": "America/New_York"
                    }
                }

                console.log(event);

                var request = gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event
                });

                request.execute(function (event) {
                    appendPre('Event created: ' + event.htmlLink);
                });

            }

        }


    }

}

function append_label(name, start_hour, start_min, end_hour, end_min)
{

    var div = document.getElementById("schedule_display");

    var label = document.createElement("label");

    label.textContent = name + ": " + start_hour + ":" + start_min + "-" + end_hour + ":" + end_min;
    div.appendChild(label);

    var br = document.createElement("br");
    div.appendChild(br);
}

//the main function
function main(){

    document.getElementById('schedule_display').innerHTML = "";//when you generate another schedule this is needed so the old one doesn't stay there

    //find whether the schedule is a day or week schedule
    day_or_week = localStorage.getItem("day_or_week");

    //get when the user's day starts
    start_of_day = localStorage.getItem("start_day");

    //get when the user's day ends
    end_of_day = localStorage.getItem("end_day");

    var busy_time_array = [];//will hold all the busy events and will be passed to the algorithm
    var event_array = [];//will hold all the events and will be passed to the algorithm

    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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

        final_schedule = ScheduleAlgorithm(busy_time_array, event_array, start_of_day, end_of_day);

        start_end_array = [];//an array that hold the start and end times of an event as well as the name of that event

        //loop through the array and look for non-0 non-Sleeping values aka events and busy events
        for(i = 0; i < 96; i++)
        {

            if(final_schedule[i] != 0 && final_schedule[i] != 'Sleeping')
            {
                count = 0;

                do { count++ }
                while (final_schedule[i] == final_schedule[i+count]);

                var ST = convert_min_to_hr((i)*15);//start time

                var duration = convert_min_to_hr((count) * 15);//duration of the event

                var ET = add_times(ST, duration);//adds the duration to the start time to find the end time

                start_end_array.push(final_schedule[i], ST, ET);

                i += count-1;//skip past all the spaces we checked with the while loop so we do not get duplicate events at the same time

                //now we have the date and when each event starts and ends as well as its name
                //we can make Google Calendar Events and push them to the calendar

            }

        }
        for(k = 0; k < start_end_array.length; k=k+3)
        {

            var start_hour = String(start_end_array[k+1][0]);
            var start_min  = String(start_end_array[k+1][1]);

            var end_hour   = String(start_end_array[k+2][0]);
            var end_min    = String(start_end_array[k+2][1]);

            //these if statements turn the int values of hour and minutes into strings and add 0 if it a single value
            //if the hour is 7 then it needs to be '07'
            if(start_hour.length == 1)
            {
                start_hour = '0'+start_hour;
            }
            if(start_min.length == 1)
            {
                start_min = '0'+start_min;
            }
            if(end_hour.length == 1)
            {
                end_hour = '0'+end_hour
            }
            if(end_min.length == 1)
            {
                end_min = '0'+end_min;
            }

            console.log("k is ",k , "name is ", start_end_array[k]);

            append_label(start_end_array[k], start_hour, start_min, end_hour, end_min)

        }

    }
    //we are doing a week schedule
    else
    {
        year = localStorage.getItem("year");
        month = localStorage.getItem("month");
        day = localStorage.getItem("day");

        var d = new Date(year, month-1, day);//date treats Jan as  month 0 so it needs to be -1 to get the correct month

        day_of_week = d.getDay();//what day of the week the starting date is, this is used for calculating what exact week the user's schedule is

        final_schedule = WeekScheduleAlgorithm(busy_time_array, event_array, start_of_day, end_of_day);
        date_array = calculate_week(year, month, day, day_of_week);//creates the date array that is needed for adding the events on the correct days

        console.log(date_array);

        for(p = 0; p < 7; p++) {

            var div = document.getElementById("schedule_display");

            var para = document.createElement('paragraph');

            var D = weekdays[p];

            para.setAttribute('id', D);
            para.textContent = D;
            div.appendChild(para);

            var br = document.createElement("br");
            div.appendChild(br);

            start_end_array = [];//an array that hold the start and end times of an event as well as the name of that event

            //loop through the array and look for non-0 non-Sleeping values aka events and busy events
            for (i = 0; i < 96; i++) {

                if (final_schedule[p][i] != 0 && final_schedule[p][i] != 'Sleeping') {

                    var ST = convert_min_to_hr((i) * 15);//start time, returns an array[hours, minutes ]

                    count = 0;

                    do {
                        count++
                    }
                    while (final_schedule[p][i] == final_schedule[p][i + count]);
                    var duration = convert_min_to_hr((count) * 15);//duration of the event, returns an array [hours, minutes]

                    var ET = add_times(ST, duration);//adds the duration to the start time to find the end time

                    start_end_array.push(final_schedule[p][i], ST, ET);//adds the name of the event, when it starts and when it ends to the array

                    i += count - 1;//skip past all the spaces we checked with the while loop so we do not get duplicate events at the same time

                }

            }

            //now we have the date and when each event starts and ends as well as its name
            //we can make Google Calendar Events and push them to the calendar
            for (k = 0; k < start_end_array.length; k = k + 3) {

                var start_hour = String(start_end_array[k + 1][0]);
                var start_min = String(start_end_array[k + 1][1]);

                var end_hour = String(start_end_array[k + 2][0]);
                var end_min = String(start_end_array[k + 2][1]);

                //these if statements turn the int values of hour and minutes into strings and add 0 if it a single value
                //if the hour is 7 then it needs to be '07'
                if (start_hour.length == 1) {
                    start_hour = '0' + start_hour;
                }
                if (start_min.length == 1) {
                    start_min = '0' + start_min;
                }
                if (end_hour.length == 1) {
                    end_hour = '0' + end_hour
                }
                if (end_min.length == 1) {
                    end_min = '0' + end_min;
                }

                append_label(start_end_array[k], start_hour, start_min, end_hour, end_min);

            }
        }
    }

}

//clears the local storage, called when index is loaded and when the schedule page is unloaded, that way if the user don't input anything
//it doesn't take their events and busy events from previous entries and add them
function localStorageClear() {
    localStorage.clear();
}
