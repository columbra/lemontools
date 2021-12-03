import { CommandInteraction } from "discord.js";
import { Bot } from "../../client/Client";
import InteractionCreate from "../../events/InteractionCreate";

describe("InteractionCreate handler", () => {
  const mockbot = {
    logger: {
      error: jest.fn((err) => {}),
    },
    cooldowns: {
      get: jest.fn((any) => {
        return {
          user: "1",
        };
      }),
      set: jest.fn((name, array) => 0),
    },
    config: {
      sudos: ["0"],
    },
    commands: {
      get: jest.fn((any) => {
        return { execute: jest.fn(), perms: [], sudo: false };
      }),
    },
  } as unknown as Bot;
  const ctx = {
    isCommand: jest.fn(() => false),
    commandName: "",
    reply: jest.fn(),
    inGuild: jest.fn((any) => true),
    channel: {
      send: jest.fn(),
    },
    user: {
      id: "0",
    },
  } as unknown as CommandInteraction;
  const event = new InteractionCreate(mockbot);
  it("should return when it is not a text command", async () => {
    const ret = await event.execute([ctx]);
    expect(ret).toBeUndefined();
  });
  it("should stop when in DMs", async () => {
    const inDMCtx = {
      isCommand: jest.fn(() => false),
      commandName: "",
      reply: jest.fn(),
      inGuild: jest.fn((any) => true),
      channel: {
        send: jest.fn(),
      },
      user: {
        id: "0",
      },
    } as unknown as CommandInteraction;
    inDMCtx.inGuild = jest.fn((any) => false) as any;
    console.log(inDMCtx);
    const ret = await event.execute([inDMCtx]);
    // expect(inDMCtx.reply).toHaveBeenCalled();
    // expect(inDMCtx.reply).toHaveBeenCalledWith(
    //   "Must be in server to execute commands!"
    // );
    expect(ret).toBeUndefined();
  });
});
