# Lemon Tools Source Code

<div align="center">
  <img src="https://i.imgur.com/x8CCQmk.png" />
</div>

<div align="center">
  <a href="https://top.gg/bot/896309687136436234">
    <img src="https://top.gg/api/widget/896309687136436234.svg" />
  </a>
</div>
 
<div align="center">
  <a href="https://ko-fi.com/B0B2AAOTI">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" />
  </a>
</div>


**This source code is licensed under the GNU GPL 3.0 License. See LICENSE for more information.**

> Lemon Tools is the premier multipurpose Discord bot for your server. Lemon Tools is fully open source, and trusted by many servers around the globe. Our goal is to create a useful, and simple bot to cover all your bot and automation needs in a Discord server. Invite Lemon Tools today!

# How to self-host
> Holup! If you want to add Lemon Tools to your server, rather than self hosting it, [invite it here](https://discord.com/oauth2/authorize?client_id=896309687136436234&permissions=515463564358&scope=bot%20applications.commands). Inviting the bot is the best way to use Lemon Tools

## Install Requirements

Firstly, download a copy of the source code. You need [Node.js](https://nodejs.org) and [Yarn](https://classic.yarnpkg.com)

Then, run these commands in the folder of the downloaded code

```bash
# Install dependencies
yarn
```

## Setup & Configure

After installing all the required dependencies, create a `.env` file at the base of the code (not in `src`). Copy the following into the `.env` file, filling in the required values

```env
ENVIRONMENT=production
BOT_TOKEN=Bot token
NASA=NASA Token
MONGO=MongoDB Connection URI (with password)
NYT=NYT API Key (required for news)
ORG=Influx DB org
BUCKET=Influx DB Bucket
INFLUX=Influx API Key
INFLUX_URL=Influx DB URL
```

Next, open the `config.yaml` file and edit the values. See `config.example.yaml` for more information.

## Build Step

This is the final step of self hosting. Type this command into the terminal:

```bash
yarn build && yarn start
```

This will build Lemon Tools and launch it. If all goes well, your bot should come online!
