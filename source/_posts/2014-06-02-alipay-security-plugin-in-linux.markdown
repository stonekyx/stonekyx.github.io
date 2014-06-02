---
layout: post
title: "Alipay Security Plugin in Linux"
date: 2014-06-02 16:13:59 +0800
comments: true
categories: 
---

阿里的支付宝在登录或者支付的时候可能需要一个安全控件。虽然官方提供了控件的安装脚本和说明，但那个脚本里带的插件比较古老，依赖libpng12，而且脚本的流程很难让人相信，所以这个安装总是会花费我半个下午的时间。

首先想办法从安装脚本中把封装的文件解出来。用脚本中的命令就可以，通过awk获得二进制数据的起始位置，然后用tail截取，并转到tar。这个过程如果直接用删除脚本中前面若干行的方法来替代，可能会出现tar解压失败的问题。可能是文本编辑器改动了二进制数据。

第二次解压后会得到两个so文件，根据不同的架构，将对应文件放到~/.mozilla/plugins里即可。然后检查可用性，`ldd libaliedit64.so`，发现`libpng12.so.0`的依赖是not found。于是到[libpng.org](http://www.libpng.org)上去找源码包，安装到/opt，并在/usr/lib下建立一个符号链接。

这时候再次启动firefox，如果安装libpng12之前已经启动过一次，可能firefox已经将这个插件标记为不可用了，所以启动前先删除`~/.mozilla/firefox/<profile>/pluginreg.dat`，让它重建一次。最后在`about:plugins`页面里应该能看到。
