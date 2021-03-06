import Command from "../../types/Command/Command";
import { CommandMessage } from "../../extensions/Message";
import Discord from "discord.js";

export default class Close extends Command {
  constructor() {
    super({
      options: {
        ownerOnly: true,
        hidden: true,
      },
    });
  }

  public async run(message: CommandMessage, args: string[]) {
    await message.replyEmbed(new Discord.MessageEmbed().setColor("DARK_BLUE").setDescription("Good night!"));

    message.client.destroy();
    process.exit(0);
  }
}
