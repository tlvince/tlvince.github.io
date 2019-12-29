---
title: AngularJS chained modules
date: 2014-03-11 18:47:52 +0000
description: Avoid polluting the global space
---

Using `var mod = angular.module('MyModule', [])` to declare a module? _Don't_.

As this [plunkr][] demonstrates, `mod` will be accessible on the global scope
(i.e. `window.mod`).

Same goes for `var ctrl = mod.controller('MyCtrl')`.

As you've [no-doubt heard][global-domination], this is a bad idea as anything
on `window` can be unwittingly overwritten. As a case in point, try
uncommenting lines 6, then 35 in the aforementioned plunkr and opening up your
browser's console. `window.angular` no-more.

Unfortunately, Angular's own documentation give examples in this way, for
example the [module docs][] (correct as of [78165c224d][]).

Using a "chained" module definition alleviates this problem, such as:

```js
angular.module('MyModule', []).controller('MyCtrl', function() {})
```

If your modules are starting to get large, use the "[module
retrieval][retrieval]" syntax (omit the dependency array argument) to get
a reference to a previously declared module and continue the module definition
in another file, e.g.:

```js
angular.module('MyModule', [])

angular.module('MyModule').controller('MyCtrl', function() {})
```

_Note_: be careful not to pass the dependency array a second time as it will
overwrite the previous module declaration!

[plunkr]: http://plnkr.co/edit/H6WR7iz0tILuOzyejCwL?p=preview
[global-domination]: http://yuiblog.com/blog/2006/06/01/global-domination/
[module docs]: http://docs.angularjs.org/guide/module
[78165c224d]: https://github.com/angular/angular.js/blob/78165c224d75418bd7721badb8082827e00c4539/docs/content/guide/module.ngdoc#L36-L47
[retrieval]: https://github.com/angular/angular.js/blob/78165c224d75418bd7721badb8082827e00c4539/docs/content/guide/module.ngdoc#L201-L218
