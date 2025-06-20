---
title: "Migrating this blog from Tailwind v3 to v4"
tags:
  - tailwindcss
  - css
---

I moved this blog from Tailwind v3 to v4. The big change is that the configuration left `tailwind.config.js` and went into the CSS itself, with `@theme`.

The three directives I was used to:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

are now just one line:

```css
@import "tailwindcss";
```

I put the Catppuccin Mocha colors into `@theme` variables, right in the stylesheet:

```css
@theme {
  --color-base: #1e1e2e;
  --color-text: #cdd6f4;
  --color-mauve: #cba6f7;
}
```

It took me some time to forget the old JS config habit. My fingers kept opening `tailwind.config.js` to add a color, but it was not there anymore. After I got used to it, having the theme next to the CSS felt cleaner.
