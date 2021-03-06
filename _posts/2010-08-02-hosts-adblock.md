---
title: Lightweight adblock with a hosts file
date: 2010-08-02
description: An alternative method of ad blocking using a hosts file
---

Does your browser's memory usage sky rocket? Are you using an Adblock extension?
This guide introduces you to an alternative method of ad blocking using a hosts
file and (optionally) CSS element hiding.

Background reading
------------------

Chromium is a great, modern approach to a web browser. It's lightweight,
modular, open-source and portable; all the traits of good software and hence,
this article will be geared towards it (though the same approach applies to all
browsers).

After choosing a browser, one of the first steps for the more advanced user is
to install some sort of ad blocking system. There are [many ad blocking
methods][maemo], from the super convenient [AdBlock][] extension, to
privacy-orientated proxies, such as the aptly named [Privoxy][] (for the more
adventurous user).

While ad blocking extensions do their job with minimal fuss, I've noticed their
resource usage to be rather large, assumedly due to the sheer amount of regex
rules and substring comparisons (leave a comment if you have any real
quantitative data on this). On low end systems --- such as my [Dell C400][]
(recently given a new lease of life running Arch Linux) --- the lack of resources
becomes very noticeable. Running Chromium and the AdBlock extension with
anything more than five tabs open caused disk thrashing and general
unresponsiveness.

Hosts file approach
-------------------

A hosts file is used by most operating systems as a lookup table of IP addresses
to domain names. Since the OS looks in this file before making a DNS request,
domain names can be redirected to a different IP source than intended.

We can therefore exploit this behaviour by redirecting ad servers to the local
machine, essentially blocking the request altogether. This saves bandwidth by
preventing the resource from being downloaded (a feature Chromium only recently
implemented with the [beforeload][] event) with minimal overheads.

To try this, check out [MVPS][] or (the more rigorous) [hpHosts][] hosts files.

Element hiding
--------------

While we could leave it there, wouldn't it be nice to clean up all those "This
web page is not available" notices and any remaining ads, notably text-based ads
(such as those preferred by Google).

Thankfully, we can use what's known as element hiding to rid of those. Using the
CSS `display:none` property, we can hide any element on a page. Here we will be
using [Fanboy's optimised element filter list][Fanboy] and a Chromium extension
to do the job.

### userContent

userContent is a browser-based stylesheet that overrides CSS files served from
web pages. Firefox and Opera have this built-in, whereas Chromium (strangely)
requires an extension. I'm using the simple [userContent][] extension, though if
you want more features and simple installation, try [userScriptCSS][] (with the
`.*` regex rule to apply to all pages) or even [Stylish][].

#### Installing the userContent extension

Firstly, download the [userContent source][userContent] from GitHub (using `git
clone` or the [userContent zip package][userContent src]) and open the extension
tab in Chromium.

Open the "Developer mode" drop-down and click "Pack extension". After selecting
the source file directory you just downloaded and packing the extension, drag
and drop the resulting `.crx` file into Chromium or invoke

```bash
$ chromium /path/to/usercontent.crx
```

... to install the extension. Now open userContent's options page and paste
Fanboy's CSS rules.

If all being well, you should end up with a lightweight and complete ad blocking
solution.

  [AdBlock]: https://chrome.google.com/extensions/detail/gighmmpiobklfepjocnamgkkbiglidom?hl=en-gb "AdBlock on the Chrome extension gallery"
  [maemo]: http://wiki.maemo.org/Ad_blocking "Ad blocking article on maemo.org"
  [Privoxy]: http://www.privoxy.org/ "Privoxy homepage"
  [Dell C400]: http://www.zdnet.co.uk/reviews/ultraportables/2002/01/28/dell-latitude-c400-10000055/ "Dell C400 review on ZDNet"
  [Fanboy]: http://www.fanboy.co.nz/adblock/opera/ "Fanboy's Adblock lists"
  [userContent]: http://github.com/decklin/usercontent "The userContent extension on GitHub"
  [userScriptCSS]: https://chrome.google.com/extensions/detail/pdfbjinabdohnegjnbfgdgohlhegamnm?hl=en-gb "userScriptCSS on the Chrome extension gallery"
  [Stylish]: https://chrome.google.com/extensions/detail/fjnbnpbmkenffdnngjfgmeleoegfcffe?hl=en-gb "Stylish on the Chrome extension gallery"
  [userContent src]: http://github.com/decklin/usercontent/archives/master "userContent source in Zip (or Tar) archive format"
  [beforeload]: http://code.google.com/p/chromium/issues/detail?id=35897#c63 "Chromium beforeload event on Chromium issue tracker"
  [MVPS]: http://www.mvps.org/winhelp2002/hosts.htm "MVPS hosts file homepage"
  [hpHosts]: http://hosts-file.net/ "hpHosts homepage"
