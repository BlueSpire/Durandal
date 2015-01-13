/**
Jasmine Reporter that outputs test results to the browser console. 
Useful for running in a headless environment such as PhantomJs, ZombieJs etc.

Usage:
// From your html file that loads jasmine:  
jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
jasmine.getEnv().execute();
*/

(function (global) {
    var exportObject;
    if (typeof module !== "undefined" && module.exports) {
        exportObject = exports;
    } else {
        exportObject = global.jasmineReporters = global.jasmineReporters || {};
    }

    var ANSI = {}
    ANSI.color_map = {
        "green": 32,
        "red": 31
    }

    ANSI.colorize_text = function (text, color) {
        var color_code = this.color_map[color];
        return "\033[" + color_code + "m" + text + "\033[0m";
    }

    var ConsoleReporter = function () {
        if (!console || !console.log) { throw "console isn't present!"; }
        this.status = this.statuses.stopped;
    };

    var proto = ConsoleReporter.prototype;
    proto.statuses = {
        stopped: "stopped",
        running: "running",
        fail: "fail",
        success: "success"
    };

    function isFailed(obj) { return obj.status === "failed"; }
    function isPassed(obj) { return obj.status === "passed"; }
    function isSkipped(obj) { return obj.status === "pending"; }
    function isDisabled(obj) { return obj.status === "disabled"; }

    proto.jasmineStarted = function (runner) {
        this.status = this.statuses.running;
        this.start_time = (new Date()).getTime();
        this.executed_specs = 0;
        this.passed_specs = 0;
        this.log("Starting...");
        this.currentSuites = [];
    };

    proto.jasmineDone = function (runner) {
        var failed = this.executed_specs - this.passed_specs;
        var spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, ");
        var fail_str = failed + (failed === 1 ? " failure in " : " failures in ");
        var color = (failed > 0) ? "red" : "green";
        var dur = (new Date()).getTime() - this.start_time;

        this.log("");
        this.log("Finished");
        this.log("-----------------");
        this.log(spec_str + fail_str + (dur / 1000) + "s.", color);

        this.status = (failed > 0) ? this.statuses.fail : this.statuses.success;

        /* Print something that signals that testing is over so that headless browsers
        like PhantomJs know when to terminate. */
        this.log("");
        this.log("ConsoleReporter finished");
    };


    proto.specStarted = function (spec) {
        this.currentSuites[0].specCount++;
    };

    proto.specDone = function (spec) {
        var suite = this.currentSuites[0];
        if (isPassed(spec)) {
            this.passed_specs ++;
            suite.passedSpecCount++;
            return;
        }

        if (isSkipped(spec) || isDisabled(spec)) {
            suite.skippedSpecCount++;
            return;
        }

        this.log(spec.fullName, "red");
        var items = spec.failedExpectations;
        for (var i = 0; i < items.length; i++) {
            var trace = items[i].stack || items[i].message;
            this.log(trace, "red");
        }
    };

    proto.suiteStarted = function(suite) {
        suite.specCount = 0;
        suite.passedSpecCount = 0;
        suite.skippedSpecCount = 0;
        this.currentSuites.unshift(suite);
    };

    proto.suiteDone = function (suite) {
        var executedSpecs = suite.specCount - suite.skippedSpecCount;
        this.executed_specs += executedSpecs;
        this.currentSuites.shift();
        if (executedSpecs == 0) { return; }
        var failed = executedSpecs - suite.passedSpecCount;
        var color = (failed > 0) ? "red" : "green";
        this.log(suite.fullName + ": " + suite.passedSpecCount + " of " + executedSpecs + " passed.", color);
    };

    proto.log = function (str, color) {
        var text = (color != undefined) ? ANSI.colorize_text(str, color) : str;
        console.log(text)
    };

    exportObject.ConsoleReporter = ConsoleReporter;
})(this);