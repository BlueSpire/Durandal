exports.config = function(weyland) {
    weyland.build('main')
        .task.jshint({
            input:'app/*.js'
        })
        .task.uglifyjs({
            input:'app/*.js'
        })
        .task.rjs({
            input:['app/*.js','app/*.html']
        });
}