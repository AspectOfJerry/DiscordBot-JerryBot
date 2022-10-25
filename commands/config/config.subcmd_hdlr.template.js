const fs = require('fs');
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    data: new SlashCommandBuilder()
        .setName('CMD_NAME')
        .setDescription("CMD_DESCRIPTION")
        .addSubcommand(subcommand =>
            subcommand
                .setName('SUBCMD_NAME')
                .setDescription("SUBCMD_DESCRIPTION")
                .addStringOption((options) =>
                    options
                        .setName('SUBCMD_OPTION_NAME')
                        .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
                        .setRequired(true / false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('SUBCMD_NAME')
                .setDescription("SUBCMD_DESCRIPTION")
                .addStringOption((options) =>
                    options
                        .setName('SUBCMD_OPTION_NAME')
                        .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
                        .setRequired(true / false))),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/CMD_NAME [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Main
        switch(subcommand) {
            case 'SUBCMD_NAME': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/CMD_NAME SUBCMD_NAME'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'WARN'); // Logs
                require('./DIRECTORY_subcommands')(client, interaction);
            }
                break;
            case 'SUBCMD_NAME': {
                await Log('append', "subcmd_hdlr", `└─'${interaction.user.tag}' executed '/CMD_NAME SUBCMD_NAME'.`, 'INFO'); // Logs

                // Declaring variables

                // Calling the subcommand file
                await Log('append', "subcmd_hdlr", `└─Handing controls to subcommand file...`, 'WARN'); // Logs
                require('./DIRECTORY_subcommands')(client, interaction);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};
