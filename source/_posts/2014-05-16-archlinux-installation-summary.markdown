---
layout: post
title: "ArchLinux Installation Summary"
date: 2014-05-16 19:11:29 +0800
comments: true
categories: 
---

用了一下午时间给一个学弟安装ArchLinux。系统环境是64位CPU，AMD显卡的笔记本电脑，安装在16G、USB 3.0的U盘里。要求安装GNOME，并配置中文输入法和字体。

首先残念的是，U盘虽然是USB 3.0，也插在了USB 3.0的接口上，但速度显然还是很慢。可能是买得太便宜了。

遇到的第一个问题是grub安装报错。其实这里有两种错误，首先是在chroot环境里特有的`/run/lvm/lvmetad.socket`不存在的问题，ArchWiki上说可以忽略。另外，最后还提示说无法嵌入grub的数据。这是GPT缺少BIOS引导分区的问题，需要在34-2047扇区建立空的引导分区，类型编号为`ef02`。

引导成功以后，进入登录界面时屏幕卡死，并渐渐变暗。推测是AMD显卡驱动的问题。粗看了一下ArchWiki，把`radeon`加入到mkinitcpio.conf的MODULES部分，重建并引导以后屏幕直接被关闭，系统卡死。为了节约时间，直接在ISO环境里安装了xorg和GNOME，并在客户系统里用systemctl启用`gdm`。考虑到xorg带有xf86-video的显示驱动，至少应该能正常引导到图形界面。果然，重启后黑屏，然后恢复，并进入了图形界面。

然后是GNOME里打不开`gnome-terminal`的问题。在控制台下配置好`DISPLAY`环境变量运行，提示DBus相关的错误（好像是`org.??`加载失败）。后来配置了`/etc/locale-gen.conf`并生成locale之后正常打开。

GNOME安装过程中几次卡死，重启后重新安装，又多次出错，几次反复后成功。中间有一次`ldconfig`提示说某些`.so`文件为空，估计是文件系统recover journal的时候将它们重置了。

最后是ibus。安装完ibus和ibus-sunpinyin之后，直接运行是无法输入中文的，因为还需要在`.xprofile`里设置环境变量：
```
export XMODIFIERS="@im=ibus"
export GTK_IM_MODULE="ibus"
export QT_IM_MODULE="ibus"
```
