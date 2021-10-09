import * as File from "../config.json"
import { Bot } from "./client/Client"
import { Config } from "./interfaces/Config"

new Bot().start(File as Config)