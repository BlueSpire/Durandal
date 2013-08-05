var vows   = require('vows');
var assert = require('assert');

require('../lib/date-utils.js');

vows.describe('Date Validate').addBatch({
    'can deal with hours': {
        topic: function () { return Date; },
        'false for less than 0': function (topic) {
            assert.equal(topic.validateHour(-1), false);
        },
        'false for greater than 23': function (topic) {
            assert.equal(topic.validateHour(24), false);
        },
        'true for in range': function (topic) {
            assert.equal(topic.validateHour(12), true);
        }
    },

    'can deal with minutes': {
        topic: function () { return Date; },
        'false for less than 0': function (topic) {
            assert.equal(topic.validateMinute(-1), false);
        },
        'false for greater than 59': function (topic) {
            assert.equal(topic.validateMinute(60), false);
        },
        'true for in range': function (topic) {
            assert.equal(topic.validateMinute(30), true);
        }
    },

    'can deal with seconds': {
        topic: function () { return Date; },
        'false for less than 0': function (topic) {
            assert.equal(topic.validateSecond(-1), false);
        },
        'false for greater than 59': function (topic) {
            assert.equal(topic.validateSecond(60), false);
        },
        'true for in range': function (topic) {
            assert.equal(topic.validateSecond(30), true);
        }
    },

    'can deal with milliseconds': {
        topic: function () { return Date; },
        'false for less than 0': function (topic) {
            assert.equal(topic.validateMillisecond(-1), false);
        },
        'false for greater than 999': function (topic) {
            assert.equal(topic.validateMillisecond(1000), false);
        },
        'true for in range': function (topic) {
            assert.equal(topic.validateMillisecond(500), true);
        }
    },

    'can deal with years': {
        topic: function () { return Date; },
        'false for less than 0': function (topic) {
            assert.equal(topic.validateYear(-1), false);
        },
        'false for greater than 9999': function (topic) {
            assert.equal(topic.validateYear(10000), false);
        },
        'true for in range': function (topic) {
            assert.equal(topic.validateYear(5000), true);
        }
    },

    'can deal with days': {
        topic: function () { return Date; },
        'false for less than 0': function (topic) {
            assert.equal(topic.validateDay(-1, 2011, 12), false);
        },
        'false for greater than 31': function (topic) {
            assert.equal(topic.validateDay(32, 2011, 12), false);
        },
        'true for in range': function (topic) {
            assert.equal(topic.validateDay(10, 2011, 11), true);
        }
    },

    'static compare works': {
        topic: function () { return Date.today(); },
        '-1 for yesterday': function (topic) {
            assert.equal(Date.compare(Date.yesterday(), topic), -1);
        },
        '1 for tomorrow': function (topic) {
            assert.equal(Date.compare(Date.tomorrow(), topic), 1);
        },
        '0 for today': function (topic) {
            assert.equal(Date.compare(Date.today(), topic), 0);
        }
    },

    'static equals works': {
        topic: function () { return Date.today(); },
        'equal for today': function (topic) {
            assert.equal(Date.equals(topic, Date.today()), true);
        },
        'false for tomorrow': function (topic) {
            assert.equal(Date.equals(topic, Date.tomorrow()), false);
        },
        'false for yesterday': function (topic) {
            assert.equal(Date.equals(topic, Date.yesterday()), false);
        }
    },

    'getDayNumberFromName works': {
        topic: function () { return Date; },
        'sunday works': function (topic) {
            assert.equal(topic.getDayNumberFromName('sunday'), 0);
        },
        'sun works': function (topic) {
            assert.equal(topic.getDayNumberFromName('sun'), 0);
        },
        'su works': function (topic) {
            assert.equal(topic.getDayNumberFromName('su'), 0);
        },
        'monday works': function (topic) {
            assert.equal(topic.getDayNumberFromName('monday'), 1);
        },
        'mon works': function (topic) {
            assert.equal(topic.getDayNumberFromName('mon'), 1);
        },
        'mo works': function (topic) {
            assert.equal(topic.getDayNumberFromName('mo'), 1);
        },
        'tuesday works': function (topic) {
            assert.equal(topic.getDayNumberFromName('tuesday'), 2);
        },
        'tue works': function (topic) {
            assert.equal(topic.getDayNumberFromName('tue'), 2);
        },
        'tu works': function (topic) {
            assert.equal(topic.getDayNumberFromName('tu'), 2);
        },
        'wednesday works': function (topic) {
            assert.equal(topic.getDayNumberFromName('wednesday'), 3);
        },
        'wed works': function (topic) {
            assert.equal(topic.getDayNumberFromName('wed'), 3);
        },
        'we works': function (topic) {
            assert.equal(topic.getDayNumberFromName('we'), 3);
        },
        'thursday works': function (topic) {
            assert.equal(topic.getDayNumberFromName('thursday'), 4);
        },
        'thu works': function (topic) {
            assert.equal(topic.getDayNumberFromName('thu'), 4);
        },
        'th works': function (topic) {
            assert.equal(topic.getDayNumberFromName('th'), 4);
        },
        'friday works': function (topic) {
            assert.equal(topic.getDayNumberFromName('friday'), 5);
        },
        'fri works': function (topic) {
            assert.equal(topic.getDayNumberFromName('fri'), 5);
        },
        'fr works': function (topic) {
            assert.equal(topic.getDayNumberFromName('fr'), 5);
        },
        'saturday works': function (topic) {
            assert.equal(topic.getDayNumberFromName('saturday'), 6);
        },
        'sat works': function (topic) {
            assert.equal(topic.getDayNumberFromName('sat'), 6);
        },
        'sa works': function (topic) {
            assert.equal(topic.getDayNumberFromName('sa'), 6);
        },
        'everything else does not': function (topic) {
            assert.equal(topic.getDayNumberFromName('junk'), undefined);
        }
    },

    'getMonthNumberFromName works': {
        topic: function () { return Date; },
        'january works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('january'), 0);
        },
        'jan works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('jan'), 0);
        },
        'february works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('february'), 1);
        },
        'feb works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('feb'), 1);
        },
        'march works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('march'), 2);
        },
        'mar works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('mar'), 2);
        },
        'april works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('april'), 3);
        },
        'apr works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('apr'), 3);
        },
        'may works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('may'), 4);
        },
        'june works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('june'), 5);
        },
        'jun works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('jun'), 5);
        },
        'july works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('july'), 6);
        },
        'jul works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('jul'), 6);
        },
        'august works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('august'), 7);
        },
        'aug works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('aug'), 7);
        },
        'september works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('september'), 8);
        },
        'sep works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('sep'), 8);
        },
        'october works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('october'), 9);
        },
        'oct works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('oct'), 9);
        },
        'november works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('november'), 10);
        },
        'nov works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('nov'), 10);
        },
        'december works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('december'), 11);
        },
        'dec works': function (topic) {
            assert.equal(topic.getMonthNumberFromName('dec'), 11);
        }
    },

    'can add milliseconds': {
        'adding positive milliseconds works': function () {
            var topic = Date.today();
            topic.addMilliseconds(500);
            assert.equal(topic.getMilliseconds(), 500);
        },
        'adding negative milliseconds works': function () {
            var topic = Date.today();
            topic.addMilliseconds(500);
            assert.equal(topic.getMilliseconds(), 500);
            topic.addMilliseconds(-250);
            assert.equal(topic.getMilliseconds(), 250);
        }
    },

    'can add seconds': {
        'adding positive seconds works': function () {
            var topic = Date.today();
            topic.addSeconds(50);
            assert.equal(topic.getSeconds(), 50);
        },
        'adding negative seconds works': function () {
            var topic = Date.today();
            topic.addSeconds(50);
            assert.equal(topic.getSeconds(), 50);
            topic.addSeconds(-25);
            assert.equal(topic.getSeconds(), 25);
        }
    },

    'can add minutes': {
        'adding positive minutes works': function () {
            var topic = Date.today();
            topic.addMinutes(50);
            assert.equal(topic.getMinutes(), 50);
        },
        'adding negative minutes works': function () {
            var topic = Date.today();
            topic.addMinutes(50);
            assert.equal(topic.getMinutes(), 50);
            topic.addMinutes(-25);
            assert.equal(topic.getMinutes(), 25);
        }
    },

    'can add hours': {
        'adding positive hours works': function () {
            var topic = Date.today();
            topic.addHours(5);
            assert.equal(topic.getHours(), 5);
        },
        'adding negative hours works': function () {
            var topic = Date.today();
            topic.addHours(5);
            assert.equal(topic.getHours(), 5);
            topic.addHours(-2);
            assert.equal(topic.getHours(), 3);
        }
    },

    'can add days': {
        'adding positive days works': function () {
            var topic = new Date(2011, 0, 10);
            topic.addDays(1);
            assert.equal(topic.getDate(), 11);
        },
        'adding negative days works': function () {
            var topic = new Date(2011, 0, 10);
            topic.addDays(1);
            assert.equal(topic.getDate(), 11);
            topic.addDays(-2);
            assert.equal(topic.getDate(), 9);
        }
    },

    'can add weeks': {
        'adding positive weeks works': function () {
            var topic = new Date(2011, 0, 10);
            topic.addWeeks(1);
            assert.equal(topic.getDate(), 17);
        },
        'adding negative weeks works': function () {
            var topic = new Date(2011, 0, 10);
            topic.addWeeks(1);
            assert.equal(topic.getDate(), 17);
            topic.addWeeks(-2);
            assert.equal(topic.getDate(), 3);
        }
    },

    'can add months': {
        'adding positive months works': function () {
            var topic = new Date(2011, 1, 10);
            topic.addMonths(1);
            assert.equal(topic.getMonth(), 2);
        },
        'adding negative months works': function () {
            var topic = new Date(2011, 1, 10);
            topic.addMonths(1);
            assert.equal(topic.getMonth(), 2);
            topic.addMonths(-2);
            assert.equal(topic.getMonth(), 0);
        }
    },

    'can set time to now': {
        'setting time to now works': function () {
            var topic = Date.today();
            topic.setTimeToNow();
            var now = new Date();

            // hokey, but should be sufficient
            assert.equal((now.valueOf() - topic.valueOf() < 100), true);
        }
    },

    'can clone time': {
        topic: function () { return new Date(); },
        'clone works': function (topic) {
            var clone = topic.clone();
            assert.equal(clone.valueOf(), topic.valueOf());
        }
    },

    'between works': {
        'between returns true for valid start and end': function () {
            var today = Date.today();
            var yesterday = Date.yesterday();
            var tomorrow = Date.tomorrow();
            assert.equal(today.between(yesterday, tomorrow), true);
        },
        'between returns false for invalid start and end': function () {
            var today = Date.today();
            var yesterday = Date.yesterday();
            var tomorrow = Date.tomorrow();
            assert.equal(today.between(tomorrow, yesterday), false);
        }
    },

    'compareTo works': {
        topic: function () { return Date.today(); },
        '-1 for tomorrow': function (topic) {
            assert.equal(topic.compareTo(Date.tomorrow()), -1);
        },
        '1 for yesterday': function (topic) {
            assert.equal(topic.compareTo(Date.yesterday()), 1);
        },
        '0 for today': function (topic) {
            assert.equal(topic.compareTo(Date.today()), 0);
        }
    },


    'equals instance works': {
        topic: function () { return Date.today(); },
        'true for equal': function (topic) {
            assert.equal(topic.equals(Date.today()), true);
        },
        'false for not equal': function (topic) {
            assert.equal(topic.equals(Date.tomorrow()), false);
        }
    },

    'isBefore works': {
        topic: function () { return Date.today(); },
        'true for before': function (topic) {
            assert.equal(topic.isBefore(Date.tomorrow()), true);
        },
        'false for after': function (topic) {
            assert.equal(topic.isBefore(Date.yesterday()), false);
        }
    },

    'isAfter works': {
        topic: function () { return Date.today(); },
        'false for before': function (topic) {
            assert.equal(topic.isAfter(Date.tomorrow()), false);
        },
        'true for after': function (topic) {
            assert.equal(topic.isAfter(Date.yesterday()), true);
        }
    },

    'getDaysBetween works': {
        topic: function () { return Date.today(); },
        '1 for tomorrow': function (topic) {
            assert.equal(topic.getDaysBetween(Date.tomorrow()), 1);
        },
        '-1 for yesterday': function (topic) {
            assert.equal(topic.getDaysBetween(Date.yesterday()), -1);
        },
        '0 for today': function (topic) {
            assert.equal(topic.getDaysBetween(Date.today()), 0);
        }
    },

    'getDaysBetween works for beginning of year': {
        topic: function () {  return new Date('Jan 1, 2011 01:01:01 GMT'); },
        'should return 0 for the same day': function (topic) {
            var date = new Date('Jan 1, 2011 01:01:01 GMT');
            assert.equal(topic.getDaysBetween(date), 0);
        },
        'should return 1 for tomorrow': function (topic) {
            var date = new Date('Jan 2, 2011 01:01:01 GMT');
            assert.equal(topic.getDaysBetween(date), 1);
        }
    },

    'getMinutesBetween works': {
        topic: function () { return new Date('Jan 1, 2011 23:31:01 GMT'); },
        '10 for 10 minutes': function (topic) {
            assert.equal(topic.getMinutesBetween(new Date('Jan 1, 2011 23:41:01 GMT')), 10);
        },
        '-10 for 10 minutes ago': function (topic) {
            assert.equal(topic.getMinutesBetween(new Date('Jan 1, 2011 23:21:01 GMT')), -10);
        },
        '0 for same minute': function (topic) {
            assert.equal(topic.getMinutesBetween(new Date('Jan 1, 2011 23:31:01 GMT')), 0);
        },
        'for time difference that spans days': function (topic) {
            assert.equal(topic.getMinutesBetween(new Date('Jan 2, 2011 00:01:01 GMT')), 30);
        }
    },

    'getSecondsBetween works': {
        topic: function () { return new Date('Jan 1, 2011 23:31:01 GMT'); },
        '10 for 10 seconds': function (topic) {
            assert.equal(topic.getSecondsBetween(new Date('Jan 1, 2011 23:31:11 GMT')), 10);
        },
        '-10 for 10 seconds ago': function (topic) {
            assert.equal(topic.getSecondsBetween(new Date('Jan 1, 2011 23:30:51 GMT')), -10);
        },
        '0 for same second': function (topic) {
            assert.equal(topic.getSecondsBetween(new Date('Jan 1, 2011 23:31:01 GMT')), 0);
        }
    },

    'getMillisecondsBetween works': {
        topic: function () { return new Date(); },
        '10 for 10 milliseconds': function (topic) {
            assert.equal(topic.getMillisecondsBetween(new Date(+topic + 10)), 10);
        },
        '-10 for 10 milliseconds ago': function (topic) {
            assert.equal(topic.getMillisecondsBetween(new Date(+topic - 10)), -10);
        },
        '0 for same millisecond': function (topic) {
            assert.equal(topic.getMillisecondsBetween(new Date(+topic)), 0);
        }
    },

    'getHoursBetween works': {
        topic: function () { return new Date('Jan 1, 2011 23:31:01 GMT'); },
        '1 for 1 hour': function (topic) {
            assert.equal(topic.getHoursBetween(new Date('Jan 2, 2011 00:31:01 GMT')), 1);
        },
        '-1 for 1 hour ago': function (topic) {
            assert.equal(topic.getHoursBetween(new Date('Jan 1, 2011 22:31:01 GMT')), -1);
        },
        '0 for same hour': function (topic) {
            assert.equal(topic.getHoursBetween(new Date('Jan 1, 2011 23:31:01 GMT')), 0);
        }
    },

    'getOrdinalNumber works': {
        'returns correct day': function () {
            var date = new Date('02-01-2011');
            assert.equal(date.getOrdinalNumber(), 32);
        }
    },

    'getOrdinalNumber works for january 1st': {
        'returns correct day': function () {
            var date = new Date('01-01-2011');
            assert.equal(date.getOrdinalNumber(), 1);
        }
    },

    'getDaysInMonth works': {
        'january': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 0), 31);
        },
        'february': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 1), 28);
        },
        'february leap year': function (topic) {
            assert.equal(Date.getDaysInMonth(2008, 1), 29);
        },
        'march': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 2), 31);
        },
        'april': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 3), 30);
        },
        'may': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 4), 31);
        },
        'june': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 5), 30);
        },
        'july': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 6), 31);
        },
        'august': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 7), 31);
        },
        'september': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 8), 30);
        },
        'october': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 9), 31);
        },
        'november': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 10), 30);
        },
        'december': function (topic) {
            assert.equal(Date.getDaysInMonth(2011, 11), 31);
        }
    }

}).export(module);
