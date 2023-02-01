const moment = require("moment");

function formatMessage(username,text,origin){
    return{
        username,
        text,
        origin,
        time: moment().format("h:mm a")
    }
}

module.exports = formatMessage;