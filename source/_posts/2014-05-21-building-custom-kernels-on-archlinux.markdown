---
layout: post
title: "Building custom kernels on ArchLinux"
date: 2014-05-21 20:07:46 +0800
comments: true
categories: 
---

虽然也可以用ArchWiki上说的那样使用ABS编译，但更加自由的方式是直接clone git.kernel.org上的代码。

当然还是直接用发行版提供的config文件，不过直接用的话编译可能会花整整一个下午。复制到代码树之后，先`make localmodconfig`，可以按照当前系统加载的模块，将不需要的模块都去掉。这样编译大概只需要十几分钟时间。当然，安装并启动之后会发现一些问题，不过应该都不太严重，比如无法挂载vfat之类。这个只要再启用fat文件系统支持，以及NLS里包括cp437、iso8859-1在内的一些IO编码即可。对于已经有可用内核的发行版来说，很容易解决。

编译之后，如果想尽快开始使用，那么不用照顾ArchLinux的系统策略也没关系，直接将bzImage复制到/boot，再`make modules_install`，然后使用mkinitcpio生成initramfs。顺便在这一步中，还可以用dkms和mkinitcpio.conf里的hooks来自动化编译第三方模块，比如nvidia。AUR上的nvidia-dkms和nvidia-hook直接拿来用就行。只是initramfs的文件名需要跟内核保持一致，比如vmlinuz-xxx和initramfs-xxx.img，这样才能被grub-mkconfig找到。

最后执行grub-mkconfig。不过这样生成之后，重启可能会发现找不到新的启动项，但其实它很可能就在ArchLinux with Advanced Options那一条里面。那里面有个子菜单。

如果之后发现需要增加新的模块，`modules_install`之后可能会丢失之前mkinitcpio时hook自动安装的模块。这时即便再mkinitcpio也没办法装上了，因为dkms判断已经安装。判断的机制还不太清楚，不过可以先用dkms命令卸除模块，再一次装上。
