// get date string in this format: '2023-07-12';
// return as a result this format: '12/07/2023'


// diff dates string in this format 'yyyy-mm--dd', return the days diff between them
function calculateDateDifference(start_date, end_date) {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
  
  
    // Calculate the difference in milliseconds between the two dates
    const timeDifference = endDate.getTime() - startDate.getTime();
  
    // Check for negative difference
    if (timeDifference < 0) {
      throw new Error("תאריך ההתחלה גבוה מתאריך הסיום!");
    }
    if (timeDifference == 0) {
      throw new Error("עליך לבחור תאריכים שונים!");
    }
  
    // Convert milliseconds to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);
  
    // Round the result to get an integer number of days
    return Math.round(daysDifference);
}

function israeli_format_Date_string(dateString) {
    const dateParts = dateString.split('-'); // Split the date string into year, month, and day parts
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
  
    // Create a Date object using the year, month, and day
    const date = new Date(year, month - 1, day);
  
    // Extract the day, month, and year from the Date object and format them
    const formattedDay = ('0' + date.getDate()).slice(-2);
    const formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    const formattedYear = date.getFullYear();
  
    // Return the formatted date string in 'dd/mm/yyyy' format
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
}


// return ISO date with UTC Z 
const get_date_now = ()=>{
    const date = new Date().toISOString()
    return date
}

// return the format and local date of the user 
const display_date_from_iso = (iso_date) => {
    const local_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const user_lang = navigator.languages && navigator.languages.length
    ? navigator.languages[navigator.languages.length-1]
    : navigator.language
    return new Date(iso_date).toLocaleDateString(user_lang, {timeZone:local_zone})
}

// return the format and local date and time of the user 
const display_date_and_time_from_iso = (iso_date) => {
    const local_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const user_lang = navigator.languages && navigator.languages.length
    ? navigator.languages[navigator.languages.length-1]
    : navigator.language

    return new Date(iso_date).toLocaleString(user_lang, {timeZone:local_zone})
}

// return the format and local time of the user 
const display_only_time_from_iso = (iso_date) => {
    const local_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const user_lang = navigator.languages && navigator.languages.length
    ? navigator.languages[navigator.languages.length-1]
    : navigator.language

    return new Date(iso_date).toLocaleTimeString(user_lang, {timeZone:local_zone})
}

// return date object with no time - Good for comparing
const get_object_date_with_no_time = (dateString)=>{
    const d=new Date(dateString)
    d.setHours(0,0,0,0)
    return d
}
// return date object with no time - Good for comparing
const get_object_date_with_time = (dateString)=>{
    const d=new Date(dateString)
    return d
}

// return date object with time when the data is timstamp from server 
const timestamp_to_date_with_time=(date)=>{
    let d
    if(date._second) d = new Date(date._seconds * 1000)
    if(date.second) d = new Date(date.seconds * 1000)
    return d
}

// return date object with no time when the data is timstamp from server 
const timestamp_to_date_no_time=(date)=>{
    let d
    if(date._seconds) d = new Date(date._seconds * 1000)
    if(date.seconds) d = new Date(date.seconds * 1000)
    d.setHours(0,0,0,0)
    return d
}

// Time difference between 2 Dates:
const time_diff_calc = (dateFuture, dateNow) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let difference = '';
    if (days > 0) {
      difference += (days === 1) ? `${days} day, ` : `${days} days, `;
    }

    difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

    difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`; 

    return [days, hours, minutes];
}

export{
    israeli_format_Date_string,
    get_date_now,
    display_date_from_iso,
    display_date_and_time_from_iso,
    display_only_time_from_iso,
    get_object_date_with_no_time,
    get_object_date_with_time,
    timestamp_to_date_with_time,
    timestamp_to_date_no_time,
    time_diff_calc,
    calculateDateDifference
}