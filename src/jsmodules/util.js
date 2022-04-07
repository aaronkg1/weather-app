import getTime from "date-fns/getTime";
import getDay from "date-fns/getDay";
import fromUnixTime from "date-fns/fromUnixTime";
import format from "date-fns/format";
import isAfter from "date-fns/isAfter";
import { utcToZonedTime } from 'date-fns-tz/esm';
import { isBefore } from "date-fns";


function formatDate(unix, zone) {

    const dateLocal = fromUnixTime(unix);
    const date = utcToZonedTime(dateLocal, zone); // Convert data to local time at location using its timezone
    const formattedDate = format(date, 'ddMMMyyyyHH:mm');
    let day = formattedDate.slice(0, 2);
    const month = formattedDate.slice(2, 5);
    const year = formattedDate.slice(5, 9);
    const time = formattedDate.slice(9,14);
    let suffix;

    if (day )

    if (day.slice(-1) == 1) {
        suffix = 'st';
    }

    else if (day.slice(-1) == 2) {
        suffix = 'nd';
    }

    else if (day.slice(-1) == 3) {
        suffix = 'rd';
    }
    else {
        suffix = 'th';
    }

    if (day < 10) {
        day = day.slice(1, 2);
    }
   const dateToReturn = `${day}${suffix} ${month} ${year}, ${time}`;
   return dateToReturn;
}


function getDayFromDate(unix, timeZone) {
    const dateLocal = fromUnixTime(unix);
    const date = utcToZonedTime(dateLocal, timeZone)
    const day = getDay(date);
    if (day == 0) {
        return 'Sun';
    }
    else if (day == 1) {
        return 'Mon';
    }
    else if (day == 2) {
        return 'Tue';
    }
    else if (day == 3) {
        return 'Wed';
    }
    else if (day == 4) {
        return 'Thu';
    }
    else if (day == 5) {
        return 'Fri';
    }
    else if (day == 6) {
        return 'Sat';
    }
    else  {
        throw Error('Invalid date');
    }

}

function hasSunSet(location) {
    const currentTime = fromUnixTime(location.current.dt);
    const sunsetTime = fromUnixTime(location.current.sunset);
    const sunriseTime = fromUnixTime(location.current.sunrise);
    if (isAfter(currentTime, sunsetTime) || isBefore(currentTime, sunriseTime)) {
        return true
    }
    else return false
}

function oneByone(array, fn, ms) {
    let i = 0;
    function loop() {
        setTimeout(() => {
            fn(array[i]);
            i++;
            if (i < array.length) {
                loop();
            }
        }, ms);
        
    }
    loop();
}
export {formatDate, getDayFromDate, hasSunSet, oneByone}