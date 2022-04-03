require('dotenv').config();
const fetch = require('window-fetch');

module.exports = {
    callback: async (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "hypixel_api";
        const REQUIRED_ROLE = "everyone";
        const EXCPECTED_ARGUMENTS = 0;
        const OPTIONAL_ARGUMENTS = 0;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#4040ff')
                .setAuthor({name: "./commands/api/hypixel/hypixel_api.js; Lines: 107; File size: ~5.7 KB"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription('This command makes an API call to `https://api.hypixel.net/key`.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + "`", false)
                .addField(`Aliases`, "`hypixelapi`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField(`Notes`, "<@611633988515266562> (AspectOfJerry) is the owner of the API key.", false)
                .addField('Related commands', "`nasa_api`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let response_success;
        let response_record_owner;
        let response_record_limit;
        let response_record_queriesInPastMin;
        let response_record_totalQueries;

        //Declaring functions

        //Checks

        //API calls
        await fetch(`https://api.hypixel.net/key?key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then(response => response.json())
            .then(response => {
                response_success = String(response.success);

                if(response_success == "true") {
                    response_record_owner = String(response.record.owner);
                    response_record_limit = String(response.record.limit);
                    response_record_queriesInPastMin = String(response.record.queriesInPastMin);
                    response_record_totalQueries = String(response.record.totalQueries);
                } else if(response_success == "false") {
                    let error_response_cause = String(response.cause);

                    if(error_response_cause == "Invalid API key") {
                        const error_response_invalid_api_key = new Discord.MessageEmbed()
                            .setColor('ff2020')
                            .setAuthor({name: "Error"})
                            .setTitle("Response")
                            .setDescription("The API key in the `.env` file is invalid.")
                            .addField("Success", `${response_success}`, true)
                            .addField("Cause:", `${error_response_cause} (Error 403)`, true)
                            .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setTimestamp();

                        message.channel.send({embeds: [error_response_invalid_api_key]})
                        return;
                    } else if(error_response_cause == "Key throttle") {
                        const error_response_key_throttle = new Discord.MessageEmbed()
                            .setColor('ff2020')
                            .setAuthor({name: "Error"})
                            .setTitle("Response")
                            .setDescription("The API key is throttled. Please try again in a minute.")
                            .addField("Success", `${response_success}`, true)
                            .addField("Cause", `${error_response_cause} (Error 429)`, true)
                            .setFooter({text: `${message.author.tag} • Use '%${COMMAND_NAME} ?' for help`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setTimestamp();

                        message.channel.send({embeds: [error_response_key_throttle]})
                        return;
                    }
                }

                //Code
                let remainingQueries = response_record_limit - response_record_queriesInPastMin;
                const success_response = new Discord.MessageEmbed()
                    .setColor('20ff20')
                    .setAuthor({name: "Success"})
                    .setTitle("Response")
                    .setDescription("A successful response was returned.\n" +
                        "<@611633988515266562> (AspectOfJerry) is the owner of the API key.")
                    .addField("Success", `${response_success}`, true)
                    .addField("Limit per minute", `${response_record_limit}`, true)
                    .addField("Queries in the last minute", `${response_record_queriesInPastMin}`, true)
                    .addField("Remaining queries this minute", `${remainingQueries}`, false)
                    .addField("Total queries", `${response_record_totalQueries}`, false)
                    .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                    .setTimestamp();

                message.channel.send({embeds: [success_response]})
            })
            .catch(console.error)
    }
}
