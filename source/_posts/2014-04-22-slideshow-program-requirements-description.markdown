---
layout: post
title: "Slideshow program requirements description"
date: 2014-04-22 10:06:25 +0800
comments: true
categories: 
---

这是设计模式大作业的需求分析说明。

--------------

Slideshow是一个简单的幻灯片放映程序，利用SDL实现。从用户编写的幻灯片脚本文件中读取指令，并在窗口中显示简单的图形。暂时不考虑动画的支持。

用户的脚本文件示例如下：

```
rect 50 50 100 100
img 300 300 a.jpg
text 0 0 Hello world!
newpage
font Times New Roman
fontsize 72
color 25 25 25
text 20 20 Thanks!
end
```

上面的示例中共有两张幻灯片，由中间的`newpage`指令分隔开。第一张上有一个从`(50,50)`开始的、长宽均为100像素的矩形；一张从`(300,300)`开始的图片，图片内容是a.jpg；以及`(0,0)`开始的文字`Hello world!`。
第二张只有从`(20,20)`开始的文字`Thanks!`，字体为`Times New Roman`，字体大小为72，颜色为`#191919`。
幻灯片之间的切换由用户操作，程序会在`newpage`指令处等待用户输入。

由于SDL已经提供了基本的图形操作和文字支持，具体的实现应该十分简单。根据后期上课讲授的设计模式，会考虑再加入新的特性。

理想中的用户脚本示例如下：

```
rect 50 50 100 100 fill //This is comment.
img 300 300 a.jpg normal //`normal` can also be `scale` or `tile`.
text 0 0 Hello world!
newpage 10s //Switch to next page in 10 seconds.
polygon 50 50 60 60 60 50 fill //Fills a triangle.
newpage //Don't switch until next user input.
font Times New Roman
fontsize 72
bold
italic
color 25 25 25
text 20 20 Thanks!
line 20 220 420 220 1 //A gray line.
end 1m //Closes the window in 1 minute.
```

同时，用户应该可以在幻灯片播放时用鼠标绘图。这一点借助SDL应该也很容易实现。还可以考虑更复杂的动画、声音，以及用户脚本中的可编程性等。
