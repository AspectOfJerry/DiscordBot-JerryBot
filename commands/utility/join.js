const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');
const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription("Joins a voice channel.")
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[OPTIONAL] The voice channel to join. Default to your current voice channel.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO');

        const voice_channel = interaction.options.getChannel('channel') || interaction.member.voice.channel;

        //Checks
        if(!interaction.member.voice.channel && !voice_channel) {
            const error_not_in_vc = new MessageEmbed()
                .setColor('RED')
                .setTitle('Error')
                .setDescription("You must specify a voice channel for the bot to join if you are not currently in a voice channel.")

            await interaction.reply({embeds: [error_not_in_vc], ephemeral: is_ephemeral})
            return;
        }

        //Code
        const connection = joinVoiceChannel({
            channelId: voice_channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        //const connection = getVoiceConnection(interaction.guild.id);
        connection.on(VoiceConnectionStatus.Signalling, async () => {
            const connection_signalling = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('VoiceConnection')
                .setDescription("__Signalling__. The bot is requesting to join the voice channel...")

            await interaction.channel.send({embeds: [connection_signalling], ephemeral: is_ephemeral})
        });
        connection.on(VoiceConnectionStatus.Connecting, async () => {
            const connection_connecting = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('VoiceConnection')
                .setDescription("__Connecting__. The bot is establishing a connection to the voice channel...");

            await interaction.channel.send({embeds: [connection_connecting], ephemeral: is_ephemeral});
        });
        connection.on(VoiceConnectionStatus.Ready, async () => {
            const connection_ready = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('VoiceConnection')
                .setDescription("__Ready__. The connection to the voice channel has been established.")

            await interaction.channel.send({embeds: [connection_ready], ephemeral: is_ephemeral})
        });

        const success_join = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully joined <#${voice_channel.id}>`);

        await interaction.channel.send({embeds: [success_join], ephemeral: is_ephemeral});
    }
}
