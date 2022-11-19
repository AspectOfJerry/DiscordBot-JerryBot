const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const fetch = require('node-fetch');

const Sleep = require('../../../modules/sleep.js'); // delayInMilliseconds
const Log = require('../../../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

const jerry_nasa_api_key = process.env.NASA_API_KEY_JERRY;

module.exports = async function (client, interaction) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/nasa apod'.`, 'INFO'); // Logs
    await interaction.deferReply();

    // Set minimum execution role
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_311_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        default:
            await Log('append', interaction.guild.id, "  └─Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables
    const nasa_logo_red_hex = '#0b3d91';
    let apod_date;
    let apod_explanation;
    let apod_url;
    let apod_image_url;
    let apod_title;

    // Checks
    // -----BEGIN ROLE CHECK-----
    if(MINIMUM_EXECUTION_ROLE !== null) {
        if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.editReply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/nasa apod'. [error_permissions]`, 'WARN'); // Logs
            return;
        }
    }
    // -----END ROLE CHECK-----

    // Main
    // API request
    await fetch(`https://api.nasa.gov/planetary/apod?api_key=${jerry_nasa_api_key}`)
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                const request_error = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("Error")
                    .setDescription("An error occured while trying to fetch the APOD from NASA. Please try again later.")
                    .addField(`Error code:`, `${res.error.code}`, false)
                    .addField(`Description`, `${res.error.message}`, false);

                interaction.editReply({embeds: [request_error]});
                return;
            }

            if(res.hdurl) {
                apod_image_url = res.hdurl;
            } else if(res.thumbnail_url) {
                apod_image_url = res.thumbnail_url;
            }

            if(res.media_type == "image") {
                apod_image_url = res.hdurl;
            } else if(res.media_type == "video") {
                apod_image_url = res.thumbnail_url;
            }

            apod_date = res.date;
            apod_explanation = res.explanation;
            apod_url = res.url;
            apod_title = res.title;
        });

    const nasa_apod = new MessageEmbed()
        .setColor(nasa_logo_red_hex)
        .setTitle(`NASA Astronomy Picture of the Day (APOD)`)
        .setURL(`https://apod.nasa.gov/apod/astropix.html`)
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setDescription(`${apod_explanation}`)
        .addField(`Title`, `${apod_title}`, true)
        .addField(`Date`, `${apod_date}`, true)
        .setFooter({text: "NASA Open APIs", iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/110px-NASA_logo.svg.png"})
        .setImage(`${apod_image_url}`);

    interaction.editReply({embeds: [nasa_apod]});
};
