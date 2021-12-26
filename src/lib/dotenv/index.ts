/**
 * @author Scott Motte
 * @thanks To Scott Motte for the dotenv package, adapted here for use in a Discord Bot
 */
import fs from "fs";
import path from "path";
import os from "os";

function log(message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`);
}

const NEWLINE = "\n";
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\r\n|\n|\r/;

// Parses src into an Object
function parse(
  src /*: string | Buffer */,
  options /*: ?DotenvParseOptions */
) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug);
  const obj = {};

  // convert Buffers before splitting into lines and processing
  src
    .toString()
    .split(NEWLINES_MATCH)
    .forEach(function (line, idx) {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      const keyValueArr = line.match(RE_INI_KEY_VAL);
      // matched?
      if (keyValueArr != null) {
        const key = keyValueArr[1];
        // default undefined or missing values to empty string
        let val = keyValueArr[2] || "";
        const end = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[end] === '"';
        const isSingleQuoted = val[0] === "'" && val[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE);
          }
        } else {
          // remove surrounding whitespace
          val = val.trim();
        }

        obj[key] = val;
      } else if (debug) {
        log(
          `did not match key and value when parsing line ${idx + 1}: ${line}`
        );
      }
    });

  return obj;
}

function resolveHome(envPath) {
  return envPath[0] === "~"
    ? path.join(os.homedir(), envPath.slice(1))
    : envPath;
}

// Populates process.env from .env file
function config(
  options /*: ?DotenvConfigOptions */
):
  | { parsed: {}; error?: undefined }
  | { error: any; parsed?: undefined } /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), ".env");
  let encoding /*: string */ = "utf8";
  let debug = false;

  if (options) {
    if (options.path != null) {
      dotenvPath = resolveHome(options.path);
    }
    if (options.encoding != null) {
      encoding = options.encoding;
    }
    if (options.debug != null) {
      debug = true;
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    //@ts-ignore
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug });

    Object.keys(parsed).forEach(function (key) {
      process.env[key] = parsed[key];
    });

    return { parsed };
  } catch (e) {
    return { error: e };
  }
}
export { config, parse };
