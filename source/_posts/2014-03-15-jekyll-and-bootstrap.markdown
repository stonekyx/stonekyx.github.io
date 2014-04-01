---
layout: post
title:  Jekyll + Bootstrap
date:   2014-03-15 14:41:00
categories:
---

Jekyll原来的页面效果太少，而且也想练习一下Bootstrap，所以想办法在Jekyll里用上Bootstrap了。

折腾了这么久，最后发现这个早就被实现过了。[Jekyll-Bootstrap](http://jekyllbootstrap.com/)貌似就是一个很完整的实现。不过既然都已经折腾出来了，就这样吧。

首先，由于担心Bootstrap里的HTML class跟Jekyll用到的重名，所以将Jekyll所有的class都加上了`jekyll-`这样的前缀。这样分辨起来也容易一点。不过这里还是用没有前缀的版本来记录。

将文件都复制过来以后，首先要折腾的就是导航栏了。感觉导航栏的HTML结构实在是太复杂，而且很容易就被已有的HTML class影响，还不知道影响来自哪里。

* 这次首先遇上的问题是标题按钮跟其他导航按钮不对齐。原因是Jekyll原来用`<h1>`当标题，放到Bootstrap里之后，它跟一个`<ul>`当兄弟，由于h1有更多的margin，就出问题了。把h1换成div。

* 然后是title这个HTML类的问题。它混在导航栏里之后，会让所在的那个div有特别多的`margin-bottom`。这样就使得导航栏下面多出一块空白，非常不好看。把title这个类从标签里去掉。

* 导航栏那个大div所在的位置也很重要，它的宽度会受到父div的影响。Jekyll里的header原来就是放在一个有site类的容器里，而site是固定宽度的，这就让导航栏没法随着窗口的大小而伸缩了。其实把Bootstrap的container类加在site类后面就行了，然后把Jekyll的main.css里site的`width`属性名改成`max-width`。

* 怎么感觉Blog Posts这几个字变大了..去看一下。
