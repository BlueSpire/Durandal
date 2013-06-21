exports.config = function(weyland) {
    weyland.build('main')
        .task.jshint({
            include:"app/*.js"
        })
        .task.uglifyjs({
            include:"app/*.js"
        })
        .task.rjs({
            include:["app/*.js","app/*.html"]
        });
}