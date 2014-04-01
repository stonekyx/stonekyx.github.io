---
layout: post
title:  "Rip audio CD"
date:   2014-02-23 21:09:00
categories:
---

买了CLICK和apple symphony之后是第一次在Linux命令行下Rip，因为想采用尽可能原始和准确的方法，所以稍微绕得有点复杂。

首先，使用的主要工具是cdrdao。用cdrdao的`read-cd`命令，可以得到一对bin/toc文件。bin是原始的音频数据，toc是相当于cue的东西，可以用toc2cue转换到cue。cdrdao的命令具体是：`cdrdao read-cd data.toc`。第二个参数是toc文件的名字，虽然需要指定这个文件名，但bin文件却可以缺省，不知道为什么。

之后是缓慢的读取过程。其实随时间增加好像有变快的趋势。

读取完之后，`file data.bin`会发现返回的文件类型是`data`，不可识别。因为它没有wav的文件头。实际上，这时用`aplay -f cdr`才可以播放，所以可以推测出这个文件是big endian的。我的习惯是要把CD切成单曲，所以接下来要用bchunk。bchunk有个参数`-s`可以交换字节序，所以这个时候就要用到它了，不然切出来就会变成杂音。具体指令是`bchunk -ws data.bin data.cue data-`。

切出来之后，连文件头也已经加好了，是WAV文件。所以接下来是`flac data-*.wav`。

如果不需要音轨信息，就可以结束了。但那显然不可能。用CD获取音轨信息最好的工具是Musicbrainz的官方工具picard。遗憾的是，这是一个图形化界面的工具。先导入所有的flac文件，然后查询CD信息，获取结束之后将flac一首首拖到CD的音轨信息上去，最后保存即可。

如果CD比较高级，自带有音轨信息，那么可以用cdda2wav来读取。`cdda2wav -J -g -D /dev/sr0`。
