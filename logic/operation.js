const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const Surveys = require("../models/Surveys.js")
const logger = require("../utils/logger.util")
require("dotenv").config()

module.exports = {

    async execute(surveyId) {

        let record = await Surveys.findOne({ customId: surveyId })

        let [embed, rows] = null

        switch (targetId.substring(0, 1)) {
            case "S":
                logger.info("Ready to send a Survey")
                [embed, rows] = this.prepareEmbedForSurveyOrQuiz(record, "S")
                break
            case "Q":
                logger.info("Ready to send a Quiz")
                [embed, rows] = this.prepareEmbedForSurveyOrQuiz(record, "Q")
                break
            case "N":
                logger.info("Ready to send a Novel")
                [embed, rows] = this.prepareEmbedForNovel(record)
                break
        }


        return { "embeds": embeds, "rows": rows }
    },

    // UTIL

    async prepareEmbedForSurveyOrQuiz(record, mode) {
        // MODE S : survey
        // MODE Q : quiz

        let type = mode == "S" ? "Survey" : "Quiz"

        const embed = new EmbedBuilder()
            .setColor("#ffffff")
            // .setTitle("ODA Clan Survey")
            .setTitle(`${type} | ${record.name}`)
            .setDescription(record.question)

        let qOptions = record.options
        let qOptionsLen = qOptions.length
        let howManyRows = Math.floor(qOptionsLen / 3)
        let rowReminder = qOptionsLen % 3
        console.log(" -- Will use " + howManyRows + " rows for the buttons")

        let rows = []
        let responseIdPrefix = "survey_choose_" + record.customId

        // FOR EVERY ROW
        for (let i = 0; i < howManyRows; i++) {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 3 + 0].value)
                            .setLabel(qOptions[i * 3 + 0].value).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 3 + 1].value)
                            .setLabel(qOptions[i * 3 + 1].value).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 3 + 2].value)
                            .setLabel(qOptions[i * 3 + 2].value).setStyle(ButtonStyle.Primary),
                    )
            )
        }

        // REMINDERS
        if (rowReminder > 1) {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        rowReminder > 0 ? new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[howManyRows * 3 + 0].value)
                            .setLabel(qOptions[howManyRows * 3 + 0].value).setStyle(ButtonStyle.Primary) : null,
                        rowReminder > 1 ? new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[howManyRows * 3 + 1].value)
                            .setLabel(qOptions[howManyRows * 3 + 1].value).setStyle(ButtonStyle.Primary) : null
                    )
            )
        } else if (rowReminder > 0) {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        rowReminder > 0 ? new ButtonBuilder().setCustomId(record.customId + "_" + qOptions[howManyRows * 3 + 0].value)
                            .setLabel(qOptions[howManyRows * 3 + 0].value).setStyle(ButtonStyle.Primary) : null
                    )
            )
        }

        // ADD OPEN BOX IF NEEDED
        if (mode == "S") {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_OPEN")
                            .setLabel("OPEN ANSW").setStyle(ButtonStyle.Secondary)
                    )
            )
        }

        await Surveys.updateOne({ customId: targetId }, { $set: { wasPublished: true } })
        return { "embed": embed, "rows": rows }
    },

    async prepareEmbedForNovel(record) {

        const embed = new EmbedBuilder()
            .setColor("#ffffff")
            // .setTitle("ODA Clan Survey")
            .setTitle("Novel | " + record.name)
            .setDescription(record.question)

        let qOptions = record.options
        let qOptionsLen = qOptions.length

        let rows = []

        return { "embed": embed, "rows": rows }
    },

}