import Command from "../../types/command/Command";
import HostCommand from "../../types/command/impl/HostCommand";

export default class SubCommandManager {
  private subCmdMap: { [name: string]: Command } = {};

  constructor(SubCommands: Command[]) {
    for (const Command of SubCommands) {
      const name = Command.constructor.name.toLowerCase();

      this.subCmdMap[name] = Command;

      if (Command.flags.aliases) for (let alias of Command.flags.aliases) this.subCmdMap[alias.toLowerCase()] = Command;
    }
  }

  public getCommand(name: string): Command | null {
    const cmd = this.subCmdMap[name];
    if (!cmd) return null;
    return cmd;
  }

  public findCommand(args: string[]): { command: Command; args: string[]; path: string[] } | null {
    let path = [];
    let curRet: Command | null = null;
    for (const arg of args) {
      if (!curRet) {
        curRet = this.getCommand(arg);
        if (!curRet) break;

        path.push(arg);
        continue;
      }

      if (curRet instanceof HostCommand) {
        if (!curRet.manager) throw "Path contains a HostCommand with a malfunctioning manager!";

        curRet = curRet.manager.getCommand(arg);
        path.push(arg);
      }
    }

    if (curRet == null) return null;
    else return { command: curRet, args: args.slice(path.length), path };
  }

  public getCommandNames() {
    return Object.keys(this.subCmdMap).filter(x => this.subCmdMap[x].flags.aliases?.includes(x) ?? true);
  }
}
