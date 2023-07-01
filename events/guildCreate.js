const {log, sleep} = require("../modules/jerryUtils.js");
const {updateGuild} = require("../database/mongodb.js");

module.exports = {
    name: "guildCreate",
    once: false, // Whether or not this event should only be triggered once
    async execute(guild) {
        await log("append", "", `[0x475543] The bot joined the "${guild.name}" guild:
            createdAt: ${guild.createdAt} [${guild.createdTimestamp}],
            id: ${guild.id},
            large: ${guild.large},
            memberCount: ${guild.memberCount},
            ownerId: ${guild.ownerId},
            preferredLocale: '${guild.preferredLocale}'.`, "INFO");

        updateGuild(guild.id, guild.name, "", "", "");
    }
};
