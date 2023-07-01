const {log, sleep} = require("../modules/jerryUtils.js");


module.exports = {
    name: "guildBanRemove",
    once: false, // Whether or not this event should only be triggered once
    async execute(ban) {
        await log("append", "", `[0x474252] '@${ban.user.tag}' was unbanned from "${ban.guild.name}".`, "WARN");
    }
};
