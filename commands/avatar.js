module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "avatar";
        const REQUIRED_ROLE = "everyone";
        const EXCPECTED_ARGUMENTS = 0;
        const OPTIONAL_ARGUMENTS = 1;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#4040ff')
                .setAuthor({name: "dir: ./commands/avatar.js; Lines: [INT]; File size: ~[INT] KB"})
                .setTitle(`%${COMMAND_NAME} command help (${REQUIRED_ROLE})`)
                .setDescription("**[DEPRECATED]** This command shows your user avatar or the targeted user's avatar if included.")
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <user>" + "`", false)
                .addField(`New command`, "`profile`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS} case-in/sensitive`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS} case-in/sensitive`, true)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables

        //Declaring functions

        //Checks

        //Code
        const deprecation_warning = new Discord.MessageEmbed()
            .setColor('#ff2020')
            .setAuthor({name: "DeprecationWarning"})
            .setDescription('This command is deprecated, and it is replaced by `%profile`.')
            .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp();

        message.channel.send({embeds: [deprecation_warning]})

        if(!args[0]) {
            const own_avatar = new Discord.MessageEmbed()
        }
        else if(args[0]) {
            const target = message.mentions.users.first();
            if(!target) {
                const reference_error_target = new Discord.MessageEmbed()
                    .setColor('ff2020')
                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription('**ReferenceError:** Invalid user (not found).' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
                    .setFooter({text: "Please provide a valid member to show their avatar."})
                    .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                    .setTimestamp();

                message.channel.send({embeds: [reference_error_target]})
                return;
            }

            const memberTarget = message.guild.members.cache.get(target.id);
        }
    }
}
