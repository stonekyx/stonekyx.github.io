---
layout: post
title: "Conflicts(?) between ALSA and PulseAudio"
date: 2014-04-07 17:49:47 +0800
comments: true
categories: 
---

在用cmus的代码写播放器的时候，发现在运行PulseAudio的系统上使用ALSA输出会有杂音。这个问题应该是可以通过安装PulseAudio的组件解决的，但是为了临时解决，更快的办法是执行`pulseaudio -k`来停止PulseAudio的服务。当然，为了正常播放还得确保ALSA安装正常才行。
