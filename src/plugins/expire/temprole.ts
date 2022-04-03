import LemonPlugin from "../../classes/LemonPlugin";
import TempRole from "../../schema/TempRole";

export default new LemonPlugin("TempRoleExpiry", async (bot) => {
  setTimeout(() => {
    TempRole.find({ expiry: { $lt: new Date() } }).then((roles) => {
      roles.forEach(async (role) => {
        const member = await (
          await bot.guilds.fetch(role.serverId)
        )?.members.fetch(role.userId);
        member?.roles.remove(role.roleId);
        TempRole.findOneAndRemove({ _id: role._id });
      });
    });
  }, 120_000); // Check every two minutes
});
