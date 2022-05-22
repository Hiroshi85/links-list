const {format} = require('timeago.js');

const helpers = {
    timeago: function(timestamp){
        return format(timestamp)
    }
}

module.exports = helpers