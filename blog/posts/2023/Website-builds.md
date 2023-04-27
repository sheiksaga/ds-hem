# Website Builds
---
Hey there! In my last post, I mentioned that I was using [Publii](https://getpublii.com/)[^1] to publish my posts, storing them on [GitHub](https://github.com/) and deploying them with [Cloudflare Pages](https://www.cloudflare.com/). I had a few reasons for doing this:

* First off, I wanted to cut down on the hosting costs for my blog[^2]. That’s why I decided to make it public on GitHub and deploy it with Cloudflare[^3].
* I also wanted to move away from WordPress and use a headless CMS where I had complete control over my posts.
* Plus, I really like writing in Markdown!
* And last but not least, I wanted full control over everything on my site - from the design to the formatting.

At first, everything was going great. But then I started having trouble with the theming. Publii uses a theming format called Handlebars[^4] and its own taxonomy for posts. And even though I had Publii and GitHub all set up, I still felt like I didn’t have as much control over my site as I wanted. Don’t get me wrong - Publii is great if you just want to write posts and publish them without worrying about how they’ll look. But I wanted more.

So I decided to start over from scratch. I got [VS Code](https://code.visualstudio.com/) (which is amazing, by the way) and started with a basic HTML5 template. I’ll write more about how I built the site in a future post.

As of 25/03/2023, here’s where things stand:

![](../../media/2023/homepage_23.png)

There are still a few things missing (like the dark mode toggle not working quite right) and some other fixes I need to make. But for the most part, everything is working great.

I’m still storing the site on GitHub Pages and deploying it with Cloudflare. But now, I have complete control over how my blog looks and feels. It takes a little longer to publish a post (since I write in Markdown and then have to convert it to HTML), but it’s worth it. All in all, I’m really happy with how everything turned out!




[^1]: Publii is a offline CMS. Think WordPress for blogging, but stored on your computer. 
[^2]: The blog was hosted on a VPS on [Contabo](https://contabo.com/en). Contabo was great, but too much for simple blogging. 
[^3]: The choice of Cloudflare was a convenience one. I use it as my DNS manager, so less sites to keep track of. But really, any CDN service with a free option would do the trick (Like [Netlify](https://www.netlify.com/), or [Vercel](https://vercel.com/)).
[^4]: Handlebars isn't a difficult theming language. I just didn’t want to add more systems to my site and make things more complicated than they needed to be