'use strict';

exports.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};
