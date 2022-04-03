import axios from "axios";
import LemonPlugin from "../../classes/LemonPlugin";

export default new LemonPlugin("useragent", async (bot) => {
  axios.interceptors.request.use((config) => {
    config.headers["User-Agent"] =
      "Lemon Tools v2 (github.com/cooljim/lemontools)";
    return config;
  });
});
