import { PermissionResolvable } from "discord.js";

export default abstract class CommandOptions {
  public ownerOnly?: boolean = false;
  public singleArg?: boolean = false;
  public ignoreMin?: number = 0;
  public botPerms?: PermissionResolvable[] = undefined;
  public userPerms?: PermissionResolvable[] = undefined;
  public disallowDM?: boolean = false;
  public nsfw?: boolean = false;
  public aliases?: string[] = undefined;
  public ratelimit?: number = 0;
  public hidden?: boolean = false;

  constructor(options?: CommandOptions) {
    if (options) {
      this.ownerOnly = options.ownerOnly;
      this.singleArg = options.singleArg;
      this.ignoreMin = options.ignoreMin;
      this.botPerms = options.botPerms;
      this.userPerms = options.userPerms;
      this.disallowDM = options.disallowDM;
      this.nsfw = options.nsfw;
      this.aliases = options.aliases;
      this.ratelimit = options.ratelimit;
      this.hidden = options.hidden;
    }
  }
}
