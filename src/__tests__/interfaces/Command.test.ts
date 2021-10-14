import { SlashCommandBuilder } from "@discordjs/builders";
import { Bot } from "../../client/Client";
import { Command } from "../../interfaces/Command";

test("command class", () => {
  class Test extends Command {
    name = "test";
    disabled = false;
    description = "test";
    usage = "";
    aliases = ["tester", "testing"];
    args = false;
    example = "";
    cooldown = 1_000;
    category = "INTERNAL_TEST";
    guildOnly = false;
    data = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
    sudo = false;

    execute = async (interaction: any) => {
      {
        const val = this.rnd(1, 1000);
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(1000);
      }
      {
        const val = this.capitalise("testing")
        expect(val).toBe("Testing")
      }
      {
        const val = this.percentFromDecimal(0.1)
        expect(val).toBe("10%")
      }
    };
  }
  const cmd = new Test(new Bot());
  cmd.execute("TEST");
});
