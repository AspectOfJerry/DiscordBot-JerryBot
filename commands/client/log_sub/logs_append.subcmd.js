const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = async function (client, interaction, string, object) {
    await interaction.deferReply();

    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    const writing_to_logs = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle('Writing to logs...')
        .addFields(
            {name: 'Body string', value: `${string}`, inline: false},
            {name: 'Target directory', value: "../logs/", inline: false})
    const write_to_logs = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setTitle('Write to logs')
        .addFields(
            {name: 'Body string', value: `${(await object).parsedString}`, inline: false},
            {name: 'Target directory', value: `../logs/${(await object).fileName}`, inline: false})

    await interaction.reply({embeds: [writing_to_logs]});
    await Log("append", interaction.guild.id, string, "INFO");
    await interaction.editReply({embeds: [write_to_logs]});
};
