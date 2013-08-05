# Date-Utils: Polyfills for the Date object

[![Build Status](https://secure.travis-ci.org/JerrySievert/node-date-utils.png)](http://travis-ci.org/JerrySievert/node-date-utils)

## In a nutshell

- Micro-Framework adding missing functionality to the Date object
- Useable as a polyfill in the browser
- Useable as a polyfill in Node.js
- Works in CouchDB

## Using within a Browser
    <script type="text/javascript" src="date-utils.min.js"></script>

## Using with Node.js
    $ npm install date-utils
    
    require('date-utils');

Note: This did not work in the `REPL` before `Node.js 0.6` due to how `Node.js` handles context in the `REPL`.

## Static Methods
    Date.today(); // today, 00:00:00
    Date.yesterday(); // yesterday, 00:00:00    
    Date.tomorrow(); // tomorrow, 00:00:00

    Date.validateDay(day, year, month); // true/false whether a date is valid
    Date.validateYear(year); // true/false whether a year is valid
    Date.validateMonth(month); // true/false whether a month is valid
    Date.validateHour(hour); // true/false whether an hour is valid
    Date.validateMinute(minute); // true/false whether a minute is valid
    Date.validateSecond(second); // true/false whether a second is valid
    Date.validateMillisecond(millisecond); // true/false whether a millisecond is valid
    
    Date.compare(date1, date2); // -1 if date1 is smaller than date2, 0 if equal, 1 if date2 is smaller than date1
    Date.equals(date1, date2); // true/false if date1 is equal to date2

    Date.getDayNumberFromName(name); // su/sun/sunday - 0, mo/mon/monday - 1, etc
    Date.getMonthNumberFromName(name); // jan/january - 0, feb/february - 1, etc
    Date.isLeapYear(year); // true/false whether the year is a leap year
    Date.getDaysInMonth(monthNumber); // number of days in the month

## Instance Methods
    d.clone(); // returns a new copy of date object set to the same time
    d.getMonthAbbr(); // abreviated month name, Jan, Feb, etc
    d.getMonthName(); // fill month name, January, February, etc
    d.getUTCOffset(); // returns the UTC offset
    d.getOrdinalNumber(); // day number of the year, 1-366 (leap year)
    d.clearTime(); // sets time to 00:00:00
    d.setTimeToNow(); // sets time to current time
    d.toFormat(format); // returns date formatted with:
      // YYYY - Four digit year
      // MMMM - Full month name. ie January
      // MMM  - Short month name. ie Jan
      // MM   - Zero padded month ie 01
      // M    - Month ie 1
      // DDDD - Full day or week name ie Tuesday 
      // DDD  - Abbreviated day of the week ie Tue
      // DD   - Zero padded day ie 08
      // D    - Day ie 8
      // HH24 - Hours in 24 notation ie 18
      // HH   - Padded Hours ie 06
      // H    - Hours ie 6
      // MI   - Padded Minutes
      // SS   - Padded Seconds
      // PP   - AM or PM
      // P    - am or pm
    d.toYMD(separator); // returns YYYY-MM-DD by default, separator changes delimiter
    
    d.between(date1, date2); // true/false if the date/time is between date1 and date2
    d.compareTo(date); // -1 if date is smaller than this, 0 if equal, 1 if date is larger than this
    d.equals(date); // true/false, true if dates are equal
    d.isBefore(date); // true/false, true if this is before date passed
    d.isAfter(date); // true/false, true if this is after date passed
    d.getDaysBetween(date); // returns number of full days between this and passed
    d.getHoursBetween(date); // returns number of hours days between this and passed
    d.getMinutesBetween(date); // returns number of full minutes between this and passed
    d.getSecondsBetween(date); // returns number of full seconds between this and passed
    
    d.add({ milliseconds: 30,
            minutes: 1,
            hours: 4,
            seconds: 30,
            days: 2,
            weeks: 1,
            months: 3,
            years: 2}); // adds time to existing time
    
    d.addMilliseconds(number); // add milliseconds to existing time
    d.addSeconds(number); // add seconds to existing time
    d.addMinutes(number); // add minutes to existing time
    d.addHours(number); // add hours to existing time
    d.addDays(number); // add days to existing time
    d.addWeeks(number); // add weeks to existing time
    d.addMonths(number); // add months to existing time
    d.addYears(number); // add years to existing time

    
