const {format} = require('timeago.js');

const helpers = {
    timeago: function(timestamp){
        return format(timestamp - 5 * 1000 * 3600)
    }
}

module.exports = helpers