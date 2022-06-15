const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep'); // delayInMilliseconds;
const Log = require('../../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription("Restarts the bot.")
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the restart request.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log("read", interaction.guild.id, `'${interaction.user.tag}' executed '/restart'.`, 'INFO'); // Logs
        // Set minimum role requirement
        let MINIMUM_EXECUTION_ROLE = undefined;
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "staff";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            default:
                await Log("read", interaction.guild.id, "Throwing because of bad permission configuration.", "ERROR"); // Logs
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log("read", interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); // Logs

        const reason = interaction.options.getString('reason') || "No reason provided";
        await Log("read", interaction.guild.id, `├─reason: ${reason}`, 'INFO'); // Logs

        // Checks
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            await Log("read", interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to use '/restart'.`, 'WARN'); // Logs
            return;
        }

        // Code
        const soft_restart = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription("Initiating a soft restart...");
        const destroying_client = new MessageEmbed()
            .setColor('FUCHSIA')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription("Destroying the client...");

        await interaction.reply({embeds: [soft_restart], ephemeral: false})
        await interaction.editReply({embeds: [destroying_client], ephemeral: false})
        const channel = client.channels.cache.get(interaction.channel.id);
        client.destroy();
        await Log("read", interaction.guild.id, `├─The client was destroyed.`, 'FATAL'); // Logs

        await Sleep(2500)
        await client.login(process.env.DISCORD_BOT_TOKEN_JERRY)
        await Log("read", interaction.guild.id, `└─Successfully logged in.`, 'INFO'); // Logs
        const online = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription("The bot has restarted!")
            .addField('Reason', `${reason}`, false);

        channel.send({embeds: [online], ephemeral: false});
    }
}
