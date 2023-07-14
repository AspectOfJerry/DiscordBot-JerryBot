import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";

import {getSubCommandFiles, logger, sleep} from "../../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Commands related to pseudorandom number generators.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("number")
                .setDescription("Generates a random number")
                .addIntegerOption((options) =>
                    options
                        .setName("min")
                        .setDescription("The minimum number. Defaults to 0")
                        .setRequired(false))
                .addIntegerOption((options) =>
                    options
                        .setName("max")
                        .setDescription("The maximum number. Defaults to 100")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("coinflip")
                .setDescription("Coinflip!")
        ),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        const __filename = new URL(import.meta.url).pathname;
        const __dirname = path.dirname(__filename);
        const subcommand_files = await getSubCommandFiles(path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                logger.append("debug", "STDOUT", "Handing controls to subcommand file...");
                (await import(file)).default(client, interaction);
                break;
            }
        }
    }
};
