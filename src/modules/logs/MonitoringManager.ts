import { InfluxDB, Point } from "@influxdata/influxdb-client";
import Manager from "../../classes/Manager";
import Bot from "../../classes/NewBot";
import os from "os";

export default class MonitoringManager extends Manager {
  private influx = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX,
  });
  constructor(bot: Bot) {
    super("MonitoringManager", bot);
    this.start();
  }

  private async start() {
    const _start = Date.now();
    setInterval(async () => {
      const write = this.influx.getWriteApi(
        process.env.ORG,
        process.env.BUCKET
      );
      write.useDefaultTags({
        env: this.bot.isDev() ? "development" : "production",
      });
      const mem = new Point("memory");
      const cpu = new Point("cpu");
      const botinfo = new Point("botinfo");
      const latency = new Point("latency");

      /**
       * Latency
       */
      latency.floatField("ws", this.bot.ws.ping || 0);

      mem
        .floatField("heapUsed_mb", process.memoryUsage().heapUsed / 1048576) // 1048576 = 1024 ** 2
        .floatField("heapTotal_mb", process.memoryUsage().heapTotal / 1048576);

      /**
       * @IMPORTANT
       *
       * CPU measurement reporting has changed. Instead of reporting cpu total usage
       * we are now only reporting CPU used by the bot itself.
       */

      cpu.floatField("percentage", this._percentiseCpu(os.cpus()));

      botinfo.floatField("servers", (await this.bot.guilds.fetch()).size);

      /**
       * @IMPORTANT
       *
       * New field: cache_servers! These should help monitor
       * how full the cache is and if it's being cleared or not.
       *
       * Field measurement change: Instead of reducing guild member
       * size, get cache size of actual users. This will indicate the amount
       * of users in cache, not the amount of users in *server* cache
       */
      botinfo.floatField("cache_members", this.bot.users.cache.size);
      botinfo.floatField("cache_servers", this.bot.guilds.cache.size);

      write.writePoints([mem, cpu, botinfo, latency]);
      write
        .close()
        .then(() =>
          this.bot.logger.debug("MonitoringManager: InfluxDB write closed")
        );
    }, 60_000);
  }
  private _percentiseCpu(cpus: os.CpuInfo[]) {
    // The following is taken from https://stackoverflow.com/questions/63289933/get-process-cpu-usage-in-percentage

    // Get first cpu (since node only uses 1 cpu)
    const cpu = cpus[0];

    // Get total time
    const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);

    // Normalize the one returned by process.cpuUsage()
    // (microseconds VS miliseconds)
    const usage = process.cpuUsage();
    const currentCPUUsage = (usage.user + usage.system) * 1000;

    // Find out the percentage used for this specific CPU and return it
    return (currentCPUUsage / total) * 100;
  }
}
