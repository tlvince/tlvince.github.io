---
title: Tiling Window Managers reprise
date: 2009-03-13
description: Revisiting tiling window managers to improve your workflow
---

[Previously][], I wrote about a newcomer's experience with so-called Tiling
Window Managers (TWM's). Some of the criticisms I highlighted were:

* Most TWM's are presented with an emphasis (and perhaps  synonymous use) with
  terminal (CLI) apps
* TWM's seem to work best when they are used on high-resolution, **widescreen**
  monitors
* Making regular use of tags/workspaces (and swapping between them) is the only
  way to efficiently manage your workflow

Perhaps unsuprisingly (and with a few months more road-testing), I'm back to
revoke my uneducated view of TWM's!

I'm a [KISS][] advocate, especially as this equates to optimising the most from
(old) hardware and so maybe, I lost sight of this slightly by diving into the
not so-[awesome][]. It's still in baby-stages, true, but I ditched *desktop
environments* years ago. I was on the lookout for something leaner, *KISS'er*
and more importantly easier to use. Then I <span style="text-decoration:
line-through;">makepkg -efi</span> found dwm.

[dwm][], being the grounding for many TWM's, originally seemed an outdated
choice at first, but I'm tied to it. Being a first-year programmer, the C config
file didn't seem that scary; the simple, straight-forward usage patterns and
importantly the *tiny* memory footprint (even less than OpenBox in my brief
tests) all set it apart from *awesome*.

Now to address those three looming bullet points above...

> Most TWM's are presented with an emphasis (and perhaps  synonymous use) with
> terminal (CLI) apps

This point is still valid unfortunately, but not to the extent of my first
impression. Making use of a combination of different layouts, float settings and
effective tagging doesn't mean you'll always have to be stuck with the halated
terminal. Even still, the terminal, in some cases, can be much more efficient
than GUI counterparts and it gives you a reason to learn some more of those
[cryptic command words][cli].

> TWM's seem to work best when they are used on high-resolution, **widescreen**
> monitors

Again, although it tends to be more of an enjoyable experience with lots of
screenspace, once you've tried the automatic window placement of TWM's, it's
hard to go back. It will make you adopt a more productive workflow, for example,
I'm using Opera here in [ERA][] mode to write this post, while having my
original up side-by-side without any dreaded horizontal scroll-bars. A hugely
underused feature of Opera in my opinion and one that will deservedly have a
blog post dedicated to it soon.

[![Opera and DWM][opth]][op]

A side-by-side, vertical view of two webpages using Opera and dwm

> Making regular use of tags/workspaces (and swapping between them) is the only
> way to effeciently manage your workflow

Looking back it this, it's less of a disopinion than I first thought. Think
about it, the equivalent to this in floating window managers is heavy use of
ALT+TAB. TWM's with tagging/workspaces allow you to group similar programs or
allow launching of programs to specific tags; a more efficient system once
you've learnt it.

If you haven't already, I urge you to take a look at TWM's --- if you like to keep
it clean and simple, check out [dwm][]; if your in need of more features and
don't mind installing a few dependencies, try [xmonad][]. Once you've mastered
them, a TWM can have great effects on improving your workflow!

  [KISS]: http://en.wikipedia.org/wiki/KISS_principle "Wikipedia entry on the KISS principle"
  [dwm]: http://en.wikipedia.org/wiki/Dwm "Wikipedia entry on dwm"
  [xmonad]: http://en.wikipedia.org/wiki/Xmonad "Wikipedia entry on xmonad"
  [ERA]: http://www.opera.com/press/releases/2004/11/23/ "Information on Opera's ERA mode"
  [cli]: http://abubalay.com/tutorials/linuxcli
  [awesome]: http://awesome.naquadah.org/ "Awesome tiling window manager homepage"
  [op]: /assets/img/2009-03-13-123531.png
  [opth]: /assets/img/th/2009-03-13-123531.png
  [previously]: /tiling-window-managers
