---
title: Changelog
permalink: /changelog
layout: single
---

This is the changelog page for Lemon Tools. _Most,_ but not all changes will be recorded in this document.


# 2.2.1

## What's new
- Migrate to Yarn 2 (using PNP)


# 2.2.0

## What's new

- Punycode encoder & decoder
- Added string tools
  - String length
  - String lowercase
  - String UPPERCASE
  - String esreveR
- Hashing tools
- Radix conversion tool
- Added delete button to `/subreddit`
- `/serverinfo` command
- `/unixtime` command

## Changes

- Fix Subreddit command crashing on `403`
- Deprecated old plugin system, made better new one
- Allowed `/colour` command to be used without a `#` sign


# 2.1.1

## What's new

## Changes

- Bumped follow-redirects to non-vunlerable version (Change by Dependabot [bot]) This fixes a security flaw in the package
- Allowed NSFW subreddits & posts if you execute the command in a NSFW channel 

# 2.1.0

## What's new

- Dictionary command to search up stuff in the dictionary
- Added helpful statuses

## Changes

- Edited `config.yaml` to match my (Compositr) new username
- Temporarily disabling welcome system to push forwards two updates.

# 2.0.2

## What's new

- Re-added the `/pokemon` command from `v1`
- Added caching - this means some commands should work faster now!
- Added welcome DMs to welcome new users to your server. Use `/welcome` to edit, disable and manage welcome DMs
- Plugin system: contribute your own extensions/plugins to Lemon Tools!

## Fixes

- Fixed `epherr` template tagging
- Various bug fixes and patches
- Performance improvements

For changes 2.0.0 please see the blog post

# v1.4.1

## What's new

- Added some very basic moderation commands: `/kick` and `/ban`

## Changes

Nothing yet...

## Fixes

- Removed the vulnerable and deprecated [`request`](https://www.npmjs.com/package/request) library. This fixes the Prototype Pollution bug

# v1.4.0

## What's new

- Added `/pokemon` command. Search up Pokémon and get moves, stats and more
- Added `/coin` to flip coins
- Added `/timediff` to calculate the difference between two dates/times.
- Added `/snipe` to snipe your friends (see recently deleted messages). **Please do not use this as a tools for harassment!**
- Added `/invite` to get an invite for the bot
- Added `/embed` to create your own embeds
- Added permissions system!

## Changes

- Changed internal `/eval` command
- Did some internal refactoring
- Changed the category of some commands

## Fixes

- Attempted to fix internal security issue
- Fixed broken commands (`/dadjoke`)

# v1.3.0

## What's new

- Added giveaways (Try out `/giveaway`!)
- Added some Minecraft-related commands
- Added `User Information` Context Menu (right click a username and click `Apps` to check it out)
- Added giveaway related Context Menus (right click on a giveaway and click `Apps` to check it out)
- Added `/quiz` which grabs some trivia questions!

## Bug fixes

- Fixed bot sometimes crashing when a command failed
