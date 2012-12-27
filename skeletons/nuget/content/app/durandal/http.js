define(function() {
    return {
        get:function(url) {
            return $.ajax(url);
        },
        post:function(url, data) {
            return $.ajax({
                url:url,
                data:JSON.stringify(data),
                type:'POST',
                contentType:'application/json',
                dataType:'json'
            });
        }
    };
});