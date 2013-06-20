module.exports = errorHandler;

function errorHandler(er){
    var os = require("os"),
        log = require('npmlog'),
        pack = require('../../package.json');

    var printStack = true;

    console.error(""); // just a line break

    log.error("System", os.type() + " " + os.release());
    log.error("command", process.argv.map(JSON.stringify).join(" "));
    log.error("cwd", process.cwd());
    log.error("node -v", process.version);
    log.error("weyland -v", pack.version);

    [ "file"
        , "path"
        , "type"
        , "syscall"
        , "fstream_path"
        , "fstream_unc_path"
        , "fstream_type"
        , "fstream_class"
        , "fstream_finish_call"
        , "fstream_linkpath"
        , "code"
        , "errno"
        , "stack"
        , "fstream_stack"
    ].forEach(function (k) {
            var v = er[k];

            if (k === "stack") {
                if (!printStack) {
                    return;
                }

                if (!v){
                    v = er.message;
                }
            }

            if (!v){
                return;
            }

            if (k === "fstream_stack") {
                v = v.join("\n");
            }

            log.error(k, v);
        });
}