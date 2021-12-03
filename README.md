# Lemon Tools Source Code

<p align="center">
  <img src="https://i.imgur.com/x8CCQmk.png" />
  <br />
  <a href="https://github.com/CoolJim/lemontools/actions/workflows/node.js.yml">
    <img src="https://github.com/CoolJim/lemontools/actions/workflows/node.js.yml/badge.svg" />
  </a>
    <a href="https://github.com/CoolJim/lemontools/actions/workflows/codeql-analysis.yml">
    <img src="https://github.com/CoolJim/lemontools/actions/workflows/codeql-analysis.yml/badge.svg" />
  </a>
</p>

<p align="center">
<a href="https://top.gg/bot/896309687136436234">
  <img src="https://top.gg/api/widget/896309687136436234.svg" />
  </a>
  </p>

This souce code is licensed under the GNU GPL 3.0 License. See LICENSE for more information.

> Lemon tools is an open-sourced, completely free-to-use Discord bot with a few tricks up it's sleeves! It can fetch the news, fetch Coronavirus information and even spark a conversation

# How to self-host

1. Download a copy of the source code. You should have NodeJS (v16.10.x +) installed on your machine, and a copy of npm (v7.x.x +) already installed.

2. Fill out an .env file. See `.env.example` for an example. After that, open your favourite text editor, and edit the config.json to your liking.

3. Open a terminal window in the directory where you have the code. Type these commands:

```bash
$ npm ci
$ npm run build
```

Once that is done, run

```bash
$ npm run start
```

The bot should start.
