/**
 * Enables common http request scenarios.
 * @module http
 * @requires jquery
 * @requires knockout
 */
define(['jquery', 'knockout'], function ($, ko) {
    /**
     * @class HTTPModule
     * @static
     */
    return {
        /**
         * The name of the callback parameter to inject into jsonp requests by default.
         * @property {string} callbackParam
         * @default callback
         */
        callbackParam: 'callback',
        /**
         * Makes an HTTP GET request.
         * @method get
         * @param {string} url The url to send the get request to.
         * @param {object} [query] An optional key/value object to transform into query string parameters.
         * @param {object} header The data to add to the request header.
         * @return {Promise} A promise of the get response data.
         */
        get: function (url, query, header) {
            return $.ajax(url, { data: query, headers: ko.toJS(header) });
        },
        /**
         * Makes an JSONP request.
         * @method jsonp
         * @param {string} url The url to send the get request to.
         * @param {object} [query] An optional key/value object to transform into query string parameters.
         * @param {string} [callbackParam] The name of the callback parameter the api expects (overrides the default callbackParam).
         * @param {object} header The data to add to the request header.
         * @return {Promise} A promise of the response data.
         */
        jsonp: function (url, query, callbackParam, header) {
            if (url.indexOf('=?') == -1) {
                callbackParam = callbackParam || this.callbackParam;

                if (url.indexOf('?') == -1) {
                    url += '?';
                } else {
                    url += '&';
                }

                url += callbackParam + '=?';
            }

            return $.ajax({
                url: url,
                dataType: 'jsonp',
                data: query,
                headers: ko.toJS(header)
            });
        },
        /**
         * Makes an HTTP POST request.
         * @method post
         * @param {string} url The url to send the post request to.
         * @param {object} data The data to post. It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @param {object} header The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @return {Promise} A promise of the response data.
         */
        post: function (url, data, header) {
            return $.ajax({
                url: url,
                data: ko.toJSON(data),
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                headers: ko.toJS(header)
            });
        },

        /**
         * Makes an HTTP DELETE request.
         * @method del
         * @param {string} url The url to send the post request to.
         * @param {object} header The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @return {Promise} A promise of the response data.
         */
        del: function (url, header) {
            return $.ajax({
                url: url,
                type: 'DELETE',
                contentType: 'application/json',
                dataType: 'json',
                headers: ko.toJS(header)
            });
        }
    };
});
