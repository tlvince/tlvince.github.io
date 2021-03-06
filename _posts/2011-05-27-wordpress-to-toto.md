---
title: Wordpress to Toto
date: 2011-05-27
description: A customary site redesign write up
---

## Rationale

Though infrequent, my existing blog was a maintenance nightmare. A playground of
mine since 2007, I had accumulated a combination of a Wordpress SQL database,
corresponding [XML backups][wpexport]; some entries polluted with WYSIWYG
clutter, some written with [Markdown for Wordpress][md4wp].

Things became more organised when I switched to [git-wordpress][] as the
canonical source for writing and publishing. This came with it's own problems
however: each post would be littered with Wordpress identifiers and still
required posts to be published through the web interface.

## Choosing toto

I wanted more *control*. I wanted something *simpler*. I wanted something to
*hack* on.

There are *many* [static website generators][staticgen] that fulfil those
requirements, the central idea being to kill the database, instead creating a
website from plain-text files.

A popular choice is [Jekyll][], but I chose [toto][] because of it's simplicity.
`toto` is also designed to run on [Heroku][]; a Ruby web app host. For a
low-traffic site like mine, there is absolutely no reason to pay for hosting
these days. Heroku provides an excellent free service, but also check out
[GitHub Pages][ghp] and [Drydrop][].

## Importing old posts

I had a mass of unfinished draft posts in Wordpress. The first job was to begin
a fresh repository that retained the content and history of the drafts in my
[git-wordpress][] repository.

`git filter-branch` is [the tool][gfb1] for [this job][gfb2]:

1. Clone the existing repository:

    ```bash
    git clone --no-hardlinks /path/to/existing/repo new-repo
    ```

2. Delete what you don't want (from all branches):

    ```bash
    git filter-branch --index-filter \
      "git rm -rf --cached --ignore-unmatch articles" --prune-empty -- --all
    ```

3. Clean up:

    ```bash
    cd new-repo
    rm -rf .git/refs/origin
    git remote rm origin
    git gc --aggressive
    git prune
    ```

## Customising toto

Reminiscent of a popular [git branching strategy][gitbr], I broke each
customisation into distinct components:

### Design

Minimalism. Nothing else. Growing tired of the plague of bloated websites, I've
started a collection of [minimal stylesheets][styles] for the most worthy.
Design is hard.

I wanted my website to be as readable as possible, with focus purely on
*content*. Rather than reinventing the wheel, I used the [html5boilerplate][]
and built up. Using Vladimir Carrer's [Better Web Readability
Project][readability] as a guideline, I've aimed for something with as little
visual noise as possible.

### Syntax Highlighting

I write [a lot][gh] of code, so it *had* to look good. This was a simple one.
Following the [syntax highlighting][totohi] guide of `toto`'s wiki, I chose a
server-side approach (to minimise any impact on page weight or additional HTTP
requests with Javascript) using [Rack::CodeHighlighter][] and [CodeRay][].
Simply adding it to the `Gemfile` and integrating [a theme][coderay-theme]
sufficed.

### Search Engine Optimisation

Using a similar approach as [Dmity Fadeyev][fadeyev], I write a one-line
abstract for each post that's used in the meta description tags. I also used
[his logic][seo] to generate friendly page titles.

The second, and unfortunately laborious task was to make sure the new site
structure was index correctly by Google. Following the excellent [moving your
site][gmvsite] guide, the majority of the work involved writing 301 redirect
rules.

Since the URL style changed from...

    /[category]/[post]/

to:

    /[YYYY]/[MM]/[DD]/[post]/

... a regex solution *seemed* impossible.

Although beyond the scope of this post, I rolled up my Python sleeves and wrote
a script to do it for me. [gen301][] takes a list of URLs and using fuzzy search
techniques, checks file names for possible matches. I set it on my [journal][]
and using [rack-rewrite][] solved the problem. Please let me know how I could
have done it easier.

## Credit

I scoured a lot of resources to create this site (as you can see from the amount
of links in this post). However, the following inspired me most:

* [Steve Losh][sjl]
* [Jason Blevins][jblevins]
* Ethan Schoonover's [Solarized][]

Of course, the site itself is [open source][src]. Hope you learn something from
it!

  [toto]: http://cloudhead.io/toto
  [dorothy]: https://github.com/cloudhead/dorothy
  [sjl]: http://stevelosh.com/
  [jblevins]: http://jblevins.org/log/
  [Solarized]: http://ethanschoonover.com/solarized
  [readability]: https://code.google.com/p/better-web-readability-project/
  [wpexport]: https://github.com/tlvince/scripts/blob/bash/wordpress-export.sh
  [md4wp]: https://wordpress.org/extend/plugins/markdown-for-wordpress-and-bbpress/
  [git-wordpress]: https://github.com/brool/git-wordpress
  [gfb1]: http://airbladesoftware.com/notes/moving-a-subdirectory-into-a-separate-git-repository
  [gfb2]: http://stackoverflow.com/questions/3223053/how-to-remove-old-commits-after-filter-branch
  [totohi]: https://github.com/cloudhead/toto/wiki/Syntax-Highlighting
  [Rack::CodeHighlighter]: https://github.com/wbzyl/rack-codehighlighter
  [CodeRay]: http://coderay.rubychan.de/
  [Ultraviolet]: http://ultraviolet.rubyforge.org/
  [coderay_bash]: https://github.com/pejuko/coderay_bash
  [coderay-theme]: http://localhost:3000/css/coderay.css
  [totowiki]: https://github.com/cloudhead/toto/wiki
  [totofork]: https://github.com/tlvince/toto
  [staticgen]: http://iwantmyname.com/blog/2011/02/list-static-website-generators.html
  [jekyll]: http://jekyllrb.com/
  [heroku]: http://www.heroku.com/
  [ghp]: http://pages.github.com/
  [drydrop]: http://www.nata2.org/2011/01/26/how-to-use-app-engine-to-host-static-sites-for-free/
  [gitbr]: http://nvie.com/posts/a-successful-git-branching-model/
  [styles]: https://github.com/tlvince/userstyles
  [html5boilerplate]: http://html5boilerplate.com/
  [gh]: https://github.com/tlvince/
  [fadeyev]: http://fadeyev.net/2010/05/10/getting-started-with-toto/
  [seo]: https://github.com/tlvince/tlvince.com/commit/3b4b4a01aaa99392d2a2cb0940c3c9e9c83a850d
  [gmvsite]: http://www.google.com/support/webmasters/bin/answer.py?hl=en&answer=83105
  [gen301]: https://github.com/tlvince/gen301
  [journal]: https://github.com/tlvince/journal
  [rack-rewrite]: https://github.com/jtrupiano/rack-rewrite
  [src]: https://github.com/tlvince/tlvince.com
