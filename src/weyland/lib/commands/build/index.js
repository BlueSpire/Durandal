var log = require('npmlog'),
    util = require('util');

exports.process = function(options, builds){
    if(!Array.isArray(builds)){
        builds = [builds];
    }

    if(options.verbose){
        log.info("build", "config", util.inspect(builds, { depth: null, colors:true }));
    }

    builds.forEach(function(buildConfig){
        buildConfig.tasks.forEach(function(taskConfig){
            var task = require('../../tasks/' + taskConfig.moduleId);

            //TODO: handle include/exclude

            task.build(taskConfig);
        });
    });
};
