---
title: "As of 01 May"
date: 2023-05-01
category: web_design
---

There has been some changes to the site since I last wrote.
By this I mean that almost everything has changed.

## changelog

*   [the main site and blog have been fully integrated into designsaga.se (my main website)](#why-integrate?)
*   [occasionalposts.com redirects to designsaga.se/blog/](#redirect)
*   [the entire thing is now hosted on github and served using cloudflare](#hosting)
*   [all code is now 100% written by hand (I previously used some bootstrap templates for designsaga and used publii for occasionalposts)](#code-scripts)
*   [there is now a way to filter posts that you are looking for (all three of them)](#filter)
*   [small animations (such as for the refresh switch and darkmode toggle)](#animations)
*   optimism that things are finally complete[^1]
*   Javascript tweaks all around


### why integrate?

Mostly because keeping code fresh for two websites is work. Laziness is the mother of efficiency I have found.
Also, this way I can re-use code for both sites, keep coherency and drive traffic organically from one to the other.

### redirect

Initially I tried working with cloudflare page rules, but it seems I had forgotten HTML first principles.
You can do most things with HTML and CSS, so I used this on occasionalposts.com:
```
    <head>
    <meta http-equiv="Refresh" content="0; url='https://designsaga.se/blog/'" />
    </head>
```
Beautiful. So simple, so clean.

### hosting
Why? It seemed to be the simplest (and cheapest) option. Github can store all my files and I can easily push changes through VS code.
I use cloudflare for DNS admin as well anyway, and this meant publishing the site tomy designsaga domain was a breeze. They also provide a CDN and speed optimizations (caching and brotli compression) free of cost.


### CSS 4EVA
If you check the code to the site you will see that it is not as clean or as optimised as it could be (if you check in the future it might be cleaned up).
When I started building websites in 2021, I had just started with CSS. Back then, I was more focused on the UI, but UI based in figma or adobe sketch. I couldn't write a single `.class` or `{property:}` to save my life.

With basic CSS, you can make sites look like a million $$$, with advanced CSS, you will get away with murder (and do cool stuff [like this madness here](https://codepen.io/jh3y/pen/poVWrPK) without using JS)

It is also crazy easy to learn.

### filter
Here is the JS code.
It is a bad code because it doesn't work well. But stackoverflow can only get one so far.

```
//filter buttons
$(document).ready(function() {

// Initially show all items
$(".list-of-posts li").show();

// Add click event to filter buttons
    $(".filter-button").click(function() {

// Get all selected tags
        var selectedTags = $(".filter-button.selected").map(function() {
         return $(this).data("tag");
    }).get();

// If no tag is selected, show all items
    if (selectedTags.length === 0) {
        $(".list-of-posts li").show();
        return;
      }

// Hide all items
      $(".list-of-posts li").hide();
      // Show items that have any of the selected tags
      selectedTags.forEach(function(tag) {
        $(".list-of-posts li:has(." + tag + ")").show();
      });
    });

// Add click event to toggle button selection
    $(".filter-button").click(function() {
      $(this).toggleClass("selected");
    });
  });

```


### animations
The refresh toggle button is actually good code. because it works.
```
<img src="/assets/img/refresh-line.svg" alt="refresh icon" class="refresh-icon" onclick="location.reload()">
```
```
.refresh-icon{
        height: 1.5rem;
        width: 1.5rem;
        background: url("/assets/img/refresh.svg");
        vertical-align: -0.25rem;
        animation: rotate 5000ms 5 linear;
        cursor: pointer;
    }
```

You might wonder why I use the image url in both the CSS and HTMl. I will then point you to [this](#css-4eva).


[^1]: Things will never be complete (╯°□°）╯︵ ┻━┻
