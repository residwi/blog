---
title: "Moving from VS Code to Neovim"
tags:
  - neovim
  - vim
  - tooling
---

About two months ago, I switched my main editor from VS Code to Neovim. And I think this time it will stay.

This is not a "VS Code is bad" post. VS Code is great and it rarely got in my way. The honest reason I switched is my team. A few months ago I moved to the subscriptions and payments team, and almost everyone there pairs in Vim. We pair remotely, so when it is my turn to drive I am typing inside their Neovim, inside tmux, over a screen share, and I am the one who has to know the motions. The first sessions were slow and a little embarrassing. But after enough of them I got curious, the Vim and tmux combo especially, and being a guest on someone else's setup made me want my own.

## The rough start

Setting up my own was the harder part. Before switching, I had run the Vim extension in VS Code for a while, on purpose, to get the motions into my hands before moving to the real thing. So I did not come in cold. But configuring a whole editor from zero is a different problem from knowing the motions, and that is where the time went.

Getting comfortable still took longer than I expected. Not days, not a week. More like a couple of months before the whole setup felt natural.

## What my setup looks like

I built my config from scratch, not from a ready-made distro, because the whole point for me was to understand every line. I use lazy.nvim to manage plugins. The pieces I use every day:

- telescope for fuzzy finding and grepping the project, with ripgrep and fzf behind it
- treesitter for syntax and better text objects
- nvim-lspconfig with mason for language servers, and nvim-cmp for completion
- conform and nvim-lint for format-on-save and linting
- which-key, so when I forget a keymap, the menu reminds me
- vim-rails, vim-projectionist and fugitive, because I write a lot of Ruby and Go
- vim-tmux-navigator, so the same `Ctrl-h/j/k/l` moves between vim splits and tmux panes

The theme is Catppuccin Mocha, the same one I use almost everywhere, including this blog. The leader key is the space bar. I spent too many hours making the Tailwind language server behave inside Rails form helpers. That is exactly the kind of yak-shaving you sign up for when you go this way.

## Is it really better?

For some things, clearly yes. Moving around a codebase with telescope and treesitter motions is faster than before. Macros and the dot command save me real time on repetitive edits. And there is something nice about an editor that opens instantly and uses almost no memory.

For other things, not yet. Debugging is still smoother for me in VS Code. And every few weeks I lose one evening to configure something that just worked before. That is part of the deal.

The biggest thing is harder to measure. The setup is mine now. When something annoys me, I can fix it, because I wrote the config and I understand it. That feeling is worth a lot.

## If you are thinking about trying it

A few things I would tell myself two months ago:

- Do not configure everything on day one. Start small, and add things when you really feel the need.
- Learn the plain motions before the plugins. The plugins are nice, but the motions are the real reason to be here.
- Keep VS Code installed. A fallback for the bad days takes off the pressure.
- Give it a month or two before you decide. The first week is not a fair example.

Two months in, I am not going back. I also do not think I will ever be "done" with the config, and that is part of why I like it.
