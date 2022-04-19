/**
 * @license MIT See LICenses/snow-stamp/LICENSE
 * @author vegeta897
 * @abstract Discord Snowflake Converter
 *
 * Adapted for use in Lemon Tools by Compositr
 */

import { DISCORD_EPOCH } from "../../../consts/discord/snowflake/SnowflakeConsts";

// Converts a snowflake ID string into a JS Date object using the provided epoch (in ms), or Discord's epoch if not provided
export function convertSnowflakeToDate(
  snowflake: string | number | bigint,
  epoch = DISCORD_EPOCH
) {
  // Convert snowflake to BigInt to extract timestamp bits
  // https://discord.com/developers/docs/reference#snowflakes
  const milliseconds = BigInt(snowflake) >> BigInt(22);
  return new Date(Number(milliseconds) + epoch);
}

// Validates a snowflake ID string and returns a JS Date object if valid
export function validateSnowflake(
  snowflake: string,
  epoch = DISCORD_EPOCH
): { error: true; message: string; data: null } | { error: false; data: Date } {
  if (!Number.isInteger(+snowflake)) {
    return {
      error: true,
      message:
        "That doesn't look like a snowflake. Snowflakes contain only numbers.",
      data: null,
    };
  }

  if (+snowflake < 4194304) {
    return {
      error: true,
      message:
        "That doesn't look like a snowflake. Snowflakes are much larger numbers.",
      data: null,
    };
  }

  const timestamp = convertSnowflakeToDate(snowflake, epoch);

  if (Number.isNaN(timestamp.getTime())) {
    return {
      error: true,
      message:
        "That doesn't look like a snowflake. Snowflakes have fewer digits.",
      data: null,
    };
  }

  return {
    error: false,
    data: timestamp,
  };
}
