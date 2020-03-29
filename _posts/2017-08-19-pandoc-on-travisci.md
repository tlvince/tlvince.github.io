---
title: Pandoc on TravisCI
date: 2017-08-19
description: Methods of running Pandoc in TravisCI
---

A few approaches of running [Pandoc](https://pandoc.org/) in [TravisCI](https://travis-ci.com/).

## 1. sudo & apt-get

Using Travis' [standard infrastructure](https://docs.travis-ci.com/user/installing-dependencies#Installing-Packages-on-Standard-Infrastructure), you can simply use `apt-get`:

```yaml
sudo: true
before_install:
  - sudo apt-get -qq update
  - sudo apt-get install -y pandoc
```

Depending on what Travis' current Linux environment is (Ubuntu Trusty at the time of writing), this may be all you need. However, you may be limited to an old version of Pandoc (Trusty currently has [v1.12.2](https://packages.ubuntu.com/trusty/pandoc)).

## 2. Without sudo & APT addon

Using Travis' [container infrastructure](https://docs.travis-ci.com/user/installing-dependencies#Installing-Packages-on-Container-Based-Infrastructure) (Docker), as pandoc is in the [APT addon whitelist](https://github.com/travis-ci/apt-package-whitelist/search?utf8=%E2%9C%93&q=pandoc&type=), you can do:

```yaml
addons:
  apt:
    packages:
      - pandoc
```

However, as before, this limits you to the version of pandoc currently in the Ubuntu repos.

## 3. With sudo, without an APT repo

As pandoc helpfully ships `.deb` packages in its [GitHub releases](https://github.com/jgm/pandoc/releases), you can download the `.deb` and install it manually.

```yaml
sudo: true
before_install:
  - curl -L https://github.com/jgm/pandoc/releases/download/1.19.2.1/pandoc-1.19.2.1-1-amd64.deb > pandoc.deb
  - sudo dpkg -i pandoc.deb
```

The benefit here being you can choose any version of Pandoc, so long as they continue to ship a `.deb` for the right architecture.

## 4. Without sudo, without an APT repo

Taking the above further, we manually extract the `.deb` without `sudo` and thereby have faster job startup times (`sudo`/non-container based infrastructure jobs take ~20 secs to spin up).

```yaml
before_install:
  - curl -L https://github.com/jgm/pandoc/releases/download/1.19.2.1/pandoc-1.19.2.1-1-amd64.deb > pandoc.deb
  - dpkg -x pandoc.deb .
  - export PATH="$PWD/usr/bin:$PATH"
```

Note, this only works as Pandoc is built statically and is liable to break. However, coupled with caching, this method produces the fastest builds with arbitary Pandoc versions.

See [tlvince/talks/.travis.yml](https://github.com/tlvince/talks/blob/c8f6d3ecd25f3fdd7c0db61fb498857a9fc4809a/.travis.yml) for a version with caching.
