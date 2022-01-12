---
title: An open-sourced, multipurpose Discord bot
permalink: /
layout: splash
header:
  overlay_color: "#F9E231"
  overlay_filter: "0.2"
excerpt: Lemon Tools is an open-sourced, completely free-to-use Discord Bot with a few tricks up it’s sleeves! It can fetch the news, get Coronavirus information and host giveaways.
feature_row:
  - image_path: https://i.imgur.com/2x6Et4V.png
    alt: Lemon Tools Logo
    title: A multipurpose Discord Bot
    excerpt: From QRCode generation to conversation starters and even giveaways, Lemon Tools is the Swiss Pocket Knife of Discord Bots.
    btn_label: Add to Discord
    btn_class: btn--primary
    url: https://discord.com/api/oauth2/authorize?client_id=896309687136436234&scope=bot+applications.commands&permissions=448928796608
feature_row2:
  - image_path: assets/images/2021-10-28-interactive-giveaways.png
    title: Interactive Giveaways!
    alt: Giveaways demo
    excerpt: Lemon Tools allows you to create interactive giveaways quickly and easily, and makes is a breeze to manage existing giveaways!
    btn_label: Start your giveaway
    btn_class: btn--success
    url: https://discord.com/api/oauth2/authorize?client_id=896309687136436234&scope=bot+applications.commands&permissions=448928796608
feature_row3:
  - image_path: assets/images/github_full.png
    title: Fully Open Source
    alt: GitHub Logo
    excerpt: Lemon Tools is fully open sourced, and intends to stay that way. Contribute by creating a Pull Request, or download your copy of the code
    btn_label: View GitHub Repo
    btn_class: btn--info
    url: https://github.com/cooljim/lemontools
feature_row4:
  - title: So, what are you waiting for?
    excerpt: Invite Lemon Tools to your Discord server today!
    btn_label: Click To Invite
    btn_class: btn--success btn--x-large
    url: https://discord.com/api/oauth2/authorize?client_id=896309687136436234&scope=bot+applications.commands&permissions=448928796608
---

{% include feature_row id="feature_row" type="left" %}

{% include feature_row id="feature_row2" type="right" %}
{% include feature_row id="feature_row3" type="left" %}
{% include feature_row id="feature_row4" type="center" %}

<h3 class="archive__subtitle">{{ site.data.ui-text[site.locale].recent_posts | default: "Recent Posts" }}</h3>

{% if paginator %}
{% assign posts = paginator.posts %}
{% else %}
{% assign posts = site.posts %}
{% endif %}

{% assign entries_layout = page.entries_layout | default: 'list' %}

<div class="entries-{{ entries_layout }}">
  {% for post in posts %}
    {% include archive-single.html type=entries_layout %}
  {% endfor %}
</div>

{% include paginator.html %}

![License](https://img.shields.io/github/license/cooljim/lemontools)
<a href="https://github.com/CoolJim/lemontools/actions/workflows/codeql-analysis.yml">
<img src="https://github.com/CoolJim/lemontools/actions/workflows/codeql-analysis.yml/badge.svg" />
</a>
