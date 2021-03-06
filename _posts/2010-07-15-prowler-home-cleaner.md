---
title: prowler an inotify based home directory cleaner
date: 2010-07-15
description: A Linux shell script to keep your home directory clean
---

[prowler][] is a shell script that automatically deletes files and directories
from a home directory as soon as they're created. Read on to learn why this
might be useful and for more information on the design decisions.

The problem
-----------

Almost all applications use some form of configuration, cache or temporary file
to run. In the Linux world, most of these are written *somewhere* within a
user's home directory. There lies the inherent problem. Without an agreed
standard, applications are freely allowed to write *anywhere* they choose. Not
only does this produce clutter and disorganisation, it distracts users and, from
an HCI perspective, leaves the user feeling he has decreased control over the
system. That's already two usability [heuristics][] broken.

Solutions
---------

Fortunately, there are a few solutions to the problem. Firstly, developers can
follow the [XDG base directory specification][XDG] for a consistent location to
put application files. Sadly, its use is not widespread, indeed, even big
players like Mozilla aren't following it (yet), whereas the Chromium developers
[have got it right][chromium].

You could also go about modifying individual applications themselves. For
instance, in the case of [dmenu][], a cache file is usually created within
`$HOME/.dmenu_cache`. By changing the `$CACHE` variable in `dmenu_run`, you can
specify a more sane default, such as:

```bash
CACHE="${XDG_CACHE_HOME:-"$HOME/.cache"}/dmenu-cache"
```

Of course, this is time consuming since every offending application will have to
be customised.

Browsing through GitHub for other methods, I found [rmshit][]. This perl script
uses `inotify` (more on that later) to delete the unwanted files. While it works
as expected, I rarely use perl and I felt it was over complicating things.
Taking influence from `rmshit`, I decided to write my own solution.

### inotify

[inotify][] is a component of the kernel that monitors the filesystem for
certain events. Events, such as a file being modified, are then reported to
applications. This provides an elegent solution in situations when [polling][]
might overwise be used.

Here we're going to make use of inotify to delete some of those rogue files and
directories. `inotify-tools` provides a interface to `inotify` in the form of
library applications that we can use in scripts, namely `inotifywait`.

`inotifywait` does all the heavy-lifting for us. All it requires is a few
options to be set and a wrapper to define what should happen when an event
occurs... introducing `prowler`:

### prowler

```bash
#!/bin/bash
#
# prowler: delete unwanted files that otherwise pollute $HOME
#
# Author:   Tom Vincent
# Created:  2010-07-05

WATCH_FILES="${XDG_CONFIG_HOME:-"$HOME/.config"}/${0##*/}/badfiles" # Bash-ism
LOG="${XDG_CACHE_HOME:-"$HOME/.cache"}/${0##*/}.log"

inotifywait -qm --format '%f' -e create "$HOME" | while read file; do
    if $(grep -Fq "$file" "$WATCH_FILES"); then
        rm -rf "$HOME/$file"
        echo "$(date +"%F %R") :: Deleted $HOME/$file" >> $LOG
    fi
done
```

`prowler` simply receives a file/directory name when an `inotify` *create* event
is triggered, checks to see if it's one we're interested in using `grep` --- [let
me know][issues] if it can be done without it --- and if so, deletes it and logs
it.

`prowler` is a simple solution in under eight lines of code that requires
minimal setup:

#### Setting up prowler

After downloading the latest version of `prowler` from my [GitHub
repository][prowler], firstly make sure `inotifywait` is installed. If your
running Arch Linux, this means installing the `inotify-tools` package. Next,
list which files you want to track within a file designated by `WATCH_FILES`.
Mine looks like this:

```
Desktop
.adobe
.macromedia
.log
.esd_auth
.lyrics
.dmenu_cache
```

Then, make sure those files and directories are already deleted (before running
`prowler` for the fist time):

```bash
rm -rf ~/`cat ~/.config/prowler/badfiles`
```

Note, you could avoid this step by configuring `inotifywait` to listen for more
than just the *create* events. I chose this approach since I would assume
listening for more events requires more resources. Again, [let me know][issues]
if I'm wrong on that.

Now `prowler` is ready to be run. Perhaps a little overkill, I do this by
launching it as a daemon when *X* starts up. Make sure `prowler` is in `$PATH`
and then add `prowler &` to your `.xinitrc`:

```bash
#!/bin/sh
# .xinitrc
...
prowler &
exec xmonad
```

Restart *X* and there you have it; an simple automatic home directory cleaner.
You could even save yourself a few lines of code by removing the logging
feature, though sometimes it's interesting to see what's happening:

```bash
$ watch -n1 cat ~/.cache/prowler.log
2010-07-15 10:25 :: Deleted /home/tom/Desktop
2010-07-15 11:55 :: Deleted /home/tom/.adobe
2010-07-15 11:55 :: Deleted /home/tom/.macromedia
2010-07-15 11:55 :: Deleted /home/tom/.adobe
2010-07-15 11:55 :: Deleted /home/tom/.macromedia
2010-07-15 11:55 :: Deleted /home/tom/.adobe
2010-07-15 11:55 :: Deleted /home/tom/.macromedia
```

Flash tries to create six directories in under a second even though it runs fine
without them!

So until more developers make use of the [XDG][] base directory standards,
`prowler` keeps your `$HOME` directory clean and in turn offers a sense of
control.

  [inotify]: http://en.wikipedia.org/wiki/Inotify "Wikipedia entry on inotify"
  [polling]: http://en.wikipedia.org/wiki/Polling_(computer_science) "Wikipedia entry on polling"
  [issues]: http://github.com/tlvince/bin/issues "GitHub issue tracker"
  [heuristics]: http://www.useit.com/papers/heuristic/heuristic_list.html "Nielsen's 10 usability heuristics"
  [XDG]: http://standards.freedesktop.org/basedir-spec/basedir-spec-latest.html "XDG base directory specification"
  [chromium]: http://www.chromium.org/developers/linux-technical-faq "Chromium Linux Technical FAQ"
  [dmenu]: http://tools.suckless.org/dmenu/ "dmenu homepage"
  [rmshit]: http://github.com/trapd00r/rmshit "rmshit GitHub repository"
  [prowler]: https://github.com/tlvince/prowler "Prowler repository on GitHub"
