import axios from "axios";
import Plugin from "../../classes/Plugin";

export default new Plugin(async (bot) => {
  bot.logger.info(`Started Axios UserAgent Plugin`);
  axios.interceptors.request.use(
    (config) => {
      config.headers["User-Agent"] =
        "Lemon Tools v2 (github.com/cooljim/lemontools)";
      return config;
    }
  );
}, {});
