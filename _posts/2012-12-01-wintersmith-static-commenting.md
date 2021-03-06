---
title: Wintersmith Static Commenting
date: 2012-12-01 08:24:04 +0000
description: An implementation of static commenting in Wintersmith
---

Following my previous entry on [static commenting][], this article serves as a
step-by-step guide to implementing the "[emailed comments][]" approach in
Wintersmith and subsequently, Jade templating.

*Note*: I've generalised and packaged a variant of this project as
[wintersmith-static-comments][] on GitHub.

## Configure a mailbox

Comments will be sent via email, so first decide on an address to use. A likely
candidate is `comment@your-domain.com`, but any address will do fine.

Next, add it as a variable that can be later accessed in a view/template. Here
we'll be using Wintersmith's `config.json` but it could quite happily be set as
an environment variable (a la [The Twelve-Factor App][twelve-factor]).

Add a new key --- `comment_email` --- within the locals section:

```json
{
  "locals": {
    ...
    "comment_email": "comment@example.com"
  }
}
```

## Create a comments repository

An overarching goal of static commenting is freedom. Here, we'll be storing
comments as plain-text (Markdown formatted) files in a `git` repository.

Create a new repository within Wintersmith's *contents* directory. Files placed
here will later be accessible within the global `ContentTree` object.

```bash
cd public/contents
git init comments
```

The directory structure here should take the form:

```
.
|-- [post-url]
|   `-- 00.mkd
`-- [post2-url]
    |-- 00.mkd
    |-- 01.mkd
    |-- 02.mkd
    `-- 03.mkd
```

... where `00.mkd`, `01.mkd`, etc. are comments in chronological order
containing Markdown and some leading metadata (a la Wintersmith's [page
plugin][]):

```
name: Paul Graham
date: 2011-04-07T19:18:06
url: http://paulgraham.com

An insightful comment.
```

The only mandatory metadata keys are `name` and `date`; arbitrary keys can
later be accessed in the view.

### An aside for Disqus users

If you're migrating away from Disqus (or just want a backup), try my
[disqus2yaml][] script. Give it an [API key][disqus-api] and your website's
short url (Disqus ID) and it'll spit out a directory tree like the one
explained above.

## Jade includes

With the data source set up, we'll now create a template to present the
comments.

### comments.jade

```jade
- var url = page.url.substring(page.url.indexOf('/') + 1).replace(/\//g, '-');
- var email = locals.comment_email.split('@');
- var mailto = email[0] + '+' + url + '@' + email[1];

section#comments
  h2 Comments

  if _.has(contents.comments, url)
    - var index = 1;
    for comment in _.keys(contents.comments[url]).sort()
      - comment = contents.comments[url][comment]
      include comment
      - index++;

  p
    | Have something to add? Leave a&nbsp;
    a(href='mailto:'+mailto+'?subject='+page.title, target='_blank') comment
    | .
```

In short, this simply loops through comment directories that match a normalised
version of the current url and passes their contents to `comment.jade`.

The `mailto` link is constructed in the following form:

```
[mailbox]+[normalised-post-url]@[domain]?subject=[post title]
```

### comment.jade

```jade
- var permalink = 'comment' + index;

blockquote(id=permalink,
  class="#{comment._metadata.reply ? 'comment reply' : 'comment'}")
  - var content = marked(comment._content)
  | !{content}
  p
    small
      if comment._metadata.url
        a(href=comment._metadata.url)=comment._metadata.name
      else)
        =comment._metadata.name
      | ,&nbsp;
      a(href='\##{permalink}')=comment._metadata.date
```

Each comment is then wrapped in a `blockquote`, given a class for styling and
anchored with a permalink. Simple.

As an embellishment to the [generalised version][wintersmith-static-comments],
comment are also parsed as Markdown by exposing `marked` in Wintersmith's [page
plugin][expose-marked]. You'll need to use the *exposed-marked* branch of [my
fork][wintersmith-fork] of Wintersmith if you want to try this.

## Integration

Lastly, integrate comments into your main template using an `include`
statement:

```
article
  header
    h1=page.title
  section#contents
    | !{page.html}
  include comments
```

You should now see a new comment section like the one below. See my [Vim
XDG][vim-xdg] post for an example of how comments themselves are rendered.

When you receive a comment, it's a simple case of saving it in the comments
repository and rebuilding the site. If the repository is hosted publicly (as is
the case with [mine][gh-comments]), commenters could even add their comment via
a pull-request or use GitHub's [create file feature][gh-create] directly.

  [static commenting]: /static-commenting
  [emailed comments]: /static-commenting#emailed-comments
  [twelve-factor]: http://www.12factor.net/
  [page plugin]: https://github.com/jnordberg/wintersmith/#the-page-plugin
  [disqus2yaml]: https://github.com/tlvince/scripts-python/blob/master/disqus2yaml.py
  [disqus-api]: http://help.disqus.com/customer/portal/articles/472122-where-do-i-find-my-api-keys-
  [underscore]: http://underscorejs.org/#objects
  [wintersmith-static-comments]: https://github.com/tlvince/wintersmith-static-comments
  [expose-marked]: https://github.com/tlvince/wintersmith/commit/8c8e0faed8b76629825ab270cb79034e48f165c6
  [wintersmith-fork]: https://github.com/tlvince/wintersmith/branches
  [vim-xdg]: /vim-respect-xdg#comments
  [gh-comments]: https://github.com/tlvince/tlvince-comments
  [gh-create]: https://github.com/blog/1327-creating-files-on-github
