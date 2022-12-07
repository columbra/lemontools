
# Lemon Tools V3 is coming soon!
We are developing V3 behind the scenes. The new version will be written in Python with the Pycord library. It will include all the same features as V2 + more such as anti raid, anti nuke, captcha verification and way more! Once the new version fully releases we will create a new branch on this repo.

# Lemon Tools Source Code

<p align="center">
  <img src="https://i.imgur.com/x8CCQmk.png" />
  <br />
    <a href="https://github.com/CoolJim/lemontools/actions/workflows/codeql-analysis.yml">
    <img src="https://github.com/CoolJim/lemontools/actions/workflows/codeql-analysis.yml/badge.svg" />
  </a>
</p>

<p align="center">
  <a href="https://top.gg/bot/896309687136436234">
    <img src="https://top.gg/api/widget/896309687136436234.svg" />
  </a>
</p>
 
<p align="center">
  <a href="https://ko-fi.com/B0B2AAOTI">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" />
  </a>
</p>
<!-- [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B2AAOTI) -->
  

This source code is licensed under the GNU GPL 3.0 License. See LICENSE for more information.

> Lemon tools is an open-sourced, completely free-to-use Discord bot with a few tricks up it's sleeves! It can fetch the news, fetch Coronavirus information and even spark a conversation

# How to self-host

Firstly, Download a copy of the source code. You should have NodeJS (v16.10.x +) installed on your machine, and yarn already installed.

After that, run these commands

```bash
$ touch .env
$ nano .env # Edit the env file with your secrets. Take a look at the example file to see what fields are needed
$ touch config.yaml
$ nano config.yaml # Edit config.yaml with your wanted values. Take a look at config.example.yaml for an example
```

Open a terminal window in the directory where you have the code. Type these commands:

```bash
$ yarn
$ yarn build
```

Once that is done, run

```bash
$ node ./build
```

The bot should start. If it does not, open an [Issue](https://github.com/cooljim/lemontools/issues/new) describing your problem.

