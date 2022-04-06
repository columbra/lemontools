import Manager from "../../classes/Manager";
import Bot from "../../classes/NewBot";
import express from "express";
import bodyParser from "body-parser";
import type { Request, Response } from "express";

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

    server.post("/api", (req, res) => {
      if (!req.headers.authorization)
        return res.status(401).json({
          message: "Missing Authorization Header",
          data: null,
        });
      if (req.headers.authorization !== LISTENER_SECRET)
        return res.status(401).json({
          message: "Invalid Authorization Header",
          data: null,
        });
      this.handler(req, res);
    });

    server.get("/ping", (req, res) => {
      res.status(200).json({
        message: "OK",
        data: null,
      });
    });

    server.listen(LISTENER_PORT, () => null);

    this.bot.logger.info(
      `ListenerManager: Started listening on port ${LISTENER_PORT}. Took ${
        Date.now() - _start
      }ms`
    );
  }

  private async handler(req: Request, res: Response) {}
}
