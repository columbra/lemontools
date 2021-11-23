/**
 * @file Bot user permissions bitfield enum. Permissions for users of this bot are stored in a 16-bit bitfield, similar to Discord's 53-bit permissions bitfield.
 *
 * To get a certain permission (e.g. Beta + User), use the `|` operator
 * @example
 * const betaUser = BotPermissions.USER | BotPermissions.BETA;
 * console.log(betaUser); // 0b110
 *
 * // To check for whether the user is banned
 * if(PERMISSIONS & BotPermissions.BANNED) return "banned"
 */
export enum BotPermissions {
  BANNED = 0b1,
  USER = 0b10,
  BETA = 0b100,
  DEVELOPER = 0b1000,
  BANNED_FROM_SNIPE = 0b10000,
  SUDO = 0b100000,
  OWNER = 0b1000000000000000,
}
