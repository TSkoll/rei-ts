import { Structures, MessageEmbed } from "discord.js";
import Command from "../types/Command";
import ReiClient from "../types/ReiClient";

const CMessage = Structures.extend("Message", C => {
  class CommandMessage extends C {
    isCommand: boolean = false;
    prefix?: string;
    command?: Command;
    args?: string[];
    reiClient: ReiClient = this.client as ReiClient;

    public async intialize(prefix: string) {
      this.isCommand = true;
      this.prefix = prefix;

      const parsed = this.parse(this.content, this.prefix);

      try {
        this.command = this.reiClient.commandHandler.getCommand(parsed.command);
        this.args = parsed.args;

        await this.run();
      } catch (ex) {
        const exPayload = {
          messageContent: this.content,
          prefix,
          parsed,
        };
        this.reiClient.logger.error(ex, exPayload);

        await this.replyBasicError(ex);
      }
    }

    public async run() {
      if (this.command && this.args) {
        try {
          this.command.checkPermissions(this);
          await this.command.run(this, this.args);

          this.reiClient.commandsRun++;
        } catch (err) {
          await this.replyBasicError(err);
        }
      } else throw "A commandMessage was not initialized properly!";
    }

    public async replyBasicSuccess(content: string) {
      return await this.channel.send(new MessageEmbed().setColor("GREEN").setDescription(content));
    }

    public async replyBasicError(content: string) {
      return await this.channel.send(new MessageEmbed().setColor("RED").setDescription(content));
    }

    public async replyBasicInfo(content: string) {
      return await this.channel.send(new MessageEmbed().setColor("BLUE").setDescription(content));
    }

    public async replyEmbed(content: MessageEmbed) {
      return await this.channel.send(content);
    }

    private parse(content: string, prefix: string) {
      const withoutPrefix = content.substring(prefix.length);
      const commandName = withoutPrefix.split(" ", 1)[0];
      const argString = withoutPrefix.substring(commandName.length + 1);

      const argsMatches = argString.match(new RegExp('"[^"]+"|[\\S]+', "g"));
      const args = argsMatches ? argsMatches.map(el => el.replace(new RegExp('"', "g"), "")) : [];

      return {
        command: commandName,
        args,
      };
    }
  }

  return CommandMessage;
});
export default CMessage;

export class CommandMessage extends CMessage {}
