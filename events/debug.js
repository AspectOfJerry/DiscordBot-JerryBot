const Sleep = require('../modules/sleep'); //delayInMilliseconds;
const Log = require('../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    name: "debug",
    once: false,
    async execute(info) {
        Log('debug_event', info, 'DEBUG');
    }
}