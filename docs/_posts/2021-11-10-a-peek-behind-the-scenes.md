---
title: A peek behind the scenes
categories: [Leaks]
layout: single
header:
  teaser: assets/images/2021-11-10-leaks_coin.png
---

It's always exciting to see whats going on behind the scenes, but not all of us are willing to (or know how to) read code (If you are part of the more _technically inclined_ you can read our code in the [Github repo](https://github.com/cooljim/lemontools)). So, we decided to write this article to inform the average Joe about what is really going on in Lemon Tools.

# What Lemon Tools runs on

Lemon Tools is coded on the [NodeJS](https://nodejs.org) platform, in the TypeScript coding language. We chose NodeJS as it is the most widely supported platform to code Discord Bots.

We chose Ubuntu (a distribution of the Linux Operation System) as our server software, since it consume much less resources than Windows, and is less prone to crashes, making it overall more reliable and efficent than Windows.

## How about this website?

This website you are currently viewing is hosted on [GitHub Pages](https://pages.github.com), and uses [Jekyll](https://jekyllrb.com/) to generate these pages. The styling comes from the theme [Minimal Mistakes](https://mademistakes.com/work/minimal-mistakes-jekyll-theme/).

# What's been going on recently?

At the time of writing, we're currently working on a new feature update, v1.4.0! We don't have a set timeframe yet, and no promises but we aim for about Janurary 2022. Here's a sneak peek into some of the new features which are coming!

<figure>
  <img src="{{site.baseurl}}assets/images/2021-11-10-leaks_coin.png" alt="Demo of coin flip command">
  <figcaption>A coin flip command...</figcaption>
</figure>

A coin flip command - such a ubiquitous command, yet we forgot to add it! Beginning from v1.4.0, you will be able to use `/coin` to flip a virtual coin.

We're also adding a `/pokemon` command, which allows you to search up the [PokeAPI](https://pokeapi.co) for a Pokemon.

<figure>
  <img src="{{site.baseurl}}assets/images/2021-11-10-leaks_pokemon.png" alt="Demo of /pokemon command">
  <figcaption>/pokemon</figcaption>
</figure>

That's all we're willing to leak right now - check back later for more updates and cool leaks!
