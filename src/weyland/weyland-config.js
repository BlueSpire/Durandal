exports.build = function(weyland) {
    var tasks = weyland.tasks;

    return {
        main:{
            tasks:[
                tasks.jshint.config({
                    include:"app/*.js"
                }),
                tasks.uglifyjs.config({
                    include:"app/*.js"
                }),
                tasks.rjs.config({
                    include:["app/*.js","app/*.html"]
                })
            ]
        }
    }
}