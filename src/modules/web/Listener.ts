import Manager from "../../classes/Manager";
import Bot from "../../classes/Bot";
import express from "express";
import bodyParser from "body-parser";
import type { Request, Response } from "express";
import { Guild, User } from "discord.js";

/**
 * This is the Manager which listens for web requests.
 *
 * This manager is responsible for handling all incoming requests such as those from the dashboard & webhooks
 */

export default class ListenerManager extends Manager {
  constructor(bot: Bot, disabled?: boolean) {
    super("ListenerManager", bot);
    if (!disabled) this.start();
    else this.bot.logger.warn(`ListenerManager: Disabled module`);
  }

  private async start() {
    const { LISTENER_PORT, LISTENER_SECRET } = process.env;

    const _start = Date.now();
    const server = express();

    server.use(bodyParser.json());

    server.all("/api/:path", (req, res) => {
      this.bot.logger.verbose(`ListenerManager: Received request on API route`);

      if (!req.headers.authorization) {
        this.bot.logger.verbose(
          `ListenerManager: No authorization header from API request originating from ${req.ip}`
        );
        return res.status(401).json({
          message: "Missing Authorization Header",
          data: null,
        });
      }
      if (req.headers.authorization !== LISTENER_SECRET) {
        this.bot.logger.verbose(
          `ListenerManager: Invalid authorization header from API request originating from ${req.ip}`
        );
        return res.status(401).json({
          message: "Invalid Authorization Header",
          data: null,
        });
      }
      this.bot.logger.verbose(
        `ListenerManager: valid API request originating from ${req.ip}. Sending to handler for prcoessing`
      );
      return this.handler(req, res, req.params.path);
    });

    server.get("/ping", (req, res) => {
      this.bot.logger.verbose(
        `ListenerManager: Received request on ping route`
      );

      res.status(200).json({
        message: "OK",
        data: {
          easterEgg: `${this.bot.config.bot.name} | Based on Lemon Tools`,
          bot: {
            uptime: this.bot.uptime,
            ping: this.bot.ws.ping,
          },
          machine: {},
        },
      });
    });

    server.listen(LISTENER_PORT, () => null);

    this.bot.logger.info(
      `ListenerManager: Started listening on port ${LISTENER_PORT}. Took ${
        Date.now() - _start
      }ms`
    );
  }

  private async handler(req: Request, res: Response, path: string) {
    const _start = Date.now();
    this.bot.logger.verbose(
      `ListenerManager: Received request on /api/${path} route from ${req.ip}`
    );
    const handler = this.handlers[path];
    if (!handler)
      return res.status(404).json({ message: "Not found", data: null });
    const ret = handler(req, res);
    this.bot.logger.verbose(
      `ListenerManager: /api/${path} took ${Date.now() - _start}ms`
    );
    return ret;
  }

  private handlers = {
    amInGuild: async (req, res) => {
      const {
        query: { guildId },
      } = req;
      if (!guildId || typeof guildId !== "string")
        return res
          .status(400)
          .json({ message: "Missing or malformed guildId", data: null });
      const guild: Guild | null = await this.bot.guilds
        .fetch(guildId)
        .catch(() => null);
      if (!guild)
        return res
          .status(404)
          .json({ message: "Guild not found", data: false });
      return res.status(200).json({ message: "OK, guild found", data: true });
    },
    amInGuilds: async (req, res) => {
      const { body } = req;
      if (!body || !body.guildIds || !Array.isArray(body.guildIds))
        return res
          .status(400)
          .json({ message: "Missing or malformed guildIds array", data: null });
      const data = await Promise.all(
        (body.guildIds as string[]).map(async (id) => ({
          id,
          amIn: !!(await this.bot.guilds.fetch(id).catch(() => null)),
        }))
      );
      return res.status(200).json({ message: "OK", data });
    },
    getGuildData: async (req, res) => {
      const {
        query: { guildId },
      } = req;
      if (!guildId || typeof guildId !== "string")
        return res.status(400).json({
          message: "Missing or malformed guildId",
          data: null,
        });
      const guild: Guild | null = await this.bot.guilds
        .fetch(guildId)
        .catch(() => null);
      if (!guild?.available)
        return res.status(404).json({
          message: "Guild not found",
          data: null,
        });
      return res.status(200).json({
        message: "OK",
        data: guild,
      });
    },
    setNickInServer: async (req, res) => {
      const {
        query: { guildId },
      } = req;
      const { nick } = req?.body;
      if (!guildId || typeof guildId !== "string")
        return res.status(400).json({
          message: "Missing or malformed guildId",
          data: null,
        });
      if (!nick || typeof nick !== "string")
        return res.status(400).json({
          message: "Missing nick or nick is not string",
          data: null,
        });
      if (nick.length === 0 || nick.length >= 32)
        return res.status(400).json({
          message:
            "Invalid nick length. Nicknames must be between 1 and 32 chars",
          data: null,
        });
      const guild: Guild | null = await this.bot.guilds
        .fetch(guildId)
        .catch(() => null);
      if (!guild)
        return res.status(404).json({
          message: "Guild not found",
          data: null,
        });
      return guild.me
        .setNickname(nick)
        .then((me) => {
          res.status(204).end();
        })
        .catch((r) => {
          res.status(500).json({
            message: "Error setting nick",
            data: r,
          });
        });
    },
  } as {
    [key: string]: (
      req: Request,
      res: Response<{
        message: string;
        data: any;
      }>
    ) => any;
  };
}
