---
title: 915resolution After Ubuntu Upgrade To Gutsy
date: 2007-10-05
description: How to remove 915resolution for upgrading to Gutsy Ubuntu
---

After getting to grips with the basics of Ubuntu, I thought I might aswell have
a try a Gutsy --- the new (currently beta) upgrade to Ubuntu.

One of the biggest gripes with Feisty was that it didn't detect my Laptop
graphics (monitor) native resolution. I solved that by using the endless amount
of help avaliable:

I have the Intel i915GM onboard graphics chipset and although the drivers are
already included in the distro, there is extra work to be done for it to run at
native resolution. Luckily I found some [documentation][] explaining the
process.

I then ran the `autoi915` script and all seems fine!

Gutsy however now implements the modeset changing in xorg, out-of-the-box (as I
understand). So `915resolution` has been made redundant. If your upgrading from
Feisty (like most people will be), you will need to reconfigure your xorg.conf
for the new settings:

1.  Make sure "xserver-xorg-video-intel" is installed (search in Synaptic)
2.  Remove 915resolution --- I chose remove completely
3.  Remove Auto915resolution (startup script --- if you used it):

```bash
cd /etc/rc2.d
sudo rm S08startupscript
cd /etc/init.d
sudo rm auto915resolutionScript
```

4.  At that point, I restarted just to check if the resolution had changed (from
    native) --- and it did
5.  Now run:

```bash
sudo dpkg-reconfigure xserver-xorg
```

6.  This will reconfigure your xorg.conf file. Run through the process as
    normal, it's worth reading the description of whats about to be changed, if
    in doubt, leave the field blank. In the video driver screen, **select
    "Intel"** instead of "i810 or i915".

Restart and your resolution should be correct!

  [documentation]: https://help.ubuntu.com/community/i915Driver
