const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;

const {log, sleep} = require("../modules/jerryUtils.js");

let disabled = false;

async function execute(client) {
    /**
     * Triggers at 06h00 every day
     */
    const online = new CronJob("00 6 * * *", async () => {
        client.user.setStatus("online");

        log("append", "cycle", "[CycleDay] Successfully the bot's status to online.", "DEBUG");
    });

    /**
     * Triggers at 21h45 every day
     */
    const idle = new CronJob("45 21 * * *", async () => {
        client.user.setStatus("idle");

        log("append", "cycle", "[CycleNight] Successfully the bot's status to idle.", "DEBUG");
    });

    online.start();
    idle.start();

    console.log("Day/night cycle started!");
}


module.exports = {
    execute
};
