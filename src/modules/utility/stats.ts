import Command from "../../types/Command";
import { CommandMessage } from "../../extensions/Message";

import Discord, { MessageEmbed } from "discord.js";

import time from "../../utils/timeHelper";

export default class Stats extends Command {
  private startTime = Date.now();

  public async run(message: CommandMessage, args: string[]) {
    const serverCount = message.client.guilds.cache.size;
    const userCount = message.client.users.cache.size;

    await message.replyEmbed(
      new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.client.user!.username, message.client.user!.avatarURL()!)
        .addField("Uptime", this.epochToTimeDifferenceString(Date.now() - this.startTime), true)
        .addField("Servers | Users", `${serverCount} | ${userCount}`, true)
        .addField("Memory usage", Math.round(process.memoryUsage().heapUsed / 1049000) + " MiB", true)
        .addField("Commands ran", message.reiClient.commandsRun, true)
        .addField("Messages received", message.reiClient.messagesReceived, true)
    );
  }

  private epochToTimeDifferenceString(epoch: number) {
    const diff = time.calcTimeDifference(epoch);

    const years = diff.years > 0 ? diff.years + "y" : "";
    const months = diff.months > 0 ? diff.years + "m" : "";
    const days = diff.days > 0 ? diff.years + "d" : "";
    const hours = diff.hours > 0 ? diff.years + "h" : "";
    const mins = diff.minutes > 0 ? diff.years + "min" : "";
    const seconds = diff.seconds > 0 ? diff.years + "s" : "";

    return `${years} ${months} ${days} ${hours} ${mins} ${seconds}`;
  }
}
