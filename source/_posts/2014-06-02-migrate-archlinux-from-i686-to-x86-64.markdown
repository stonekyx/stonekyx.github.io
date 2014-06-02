---
layout: post
title: "Migrate ArchLinux from i686 to x86_64"
date: 2014-06-02 16:46:57 +0800
comments: true
categories: 
---

用了5年之后才知道我的CPU居然支持64位，所以今天把系统转换到64位了。

ArchWiki上有一篇[指南](https://wiki.archlinux.org/index.php/Migrating_Between_Architectures_Without_Reinstalling)，不过上面说的方法有几个陷阱。首先升级，然后安装内核，重启之后会变成64位环境，不过所有的程序都是32位的。然后安装pacman，最后安装之前下好的所有64位软件包。

关键问题就出在最后这两步之间。安装好pacman之后，能够运行的程序马上就只剩下pacman、bash和busybox了，实际上这时候已经不能正常启动，bash虽说能运行，实际上作用已经很小。所以最关键的一点就是，必须在这个时候利用当前内存里的几个进程和pacman来完成剩下的安装步骤。

习惯比较好的话，可能会一直呆在普通用户模式下，然后用sudo来继续安装。但问题是sudo也用不了了！这个时候就已经被完全困住了，只能利用另外一个系统来恢复。用另一块硬盘上的32位系统启动，然后将pacman的root设置为损坏的系统，执行刚才安装pacman的那条指令：`pactree -l pacman | pacman -r /mnt/ext -b /var/lib/pacman -S -`。这样可以将刚才覆盖掉的pacman、glibc等重要的包还原成32位。再次启动原来的系统之后，吸取刚才的教训，直接用root登录到字符界面，然后再安装一次pacman。于是又有问题了。虽然之前早已经下好了所有64位对应的包，但没考虑到multilib的问题。再次执行最后那个全系统更新的时候，会发现还需要再下几个`lib32-*`的包。但是刚才没有执行dhcpcd，而且现在也执行不了了！所以又得重新来一次，恢复到32位，然后这次用root登录之后马上启动dhcpcd，登录好网络之后，再执行全系统安装。

全系统安装最后需要执行两次，因为第一次会有很多包无法正常安装。

然后系统终于能够启动了，这次是完整的64位环境。剩下的就是补上aur包，vim、mutt、cmus等自行编译的软件，以及firefox了。当然，像阿里安全控件这样的东西也是会继续浪费时间的。
