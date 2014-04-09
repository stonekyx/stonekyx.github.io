---
layout: post
title: "Real-time audio streaming with SDL Audio"
date: 2014-04-09 19:09:51 +0800
comments: true
categories: 
---

SDL虽然不是专门的音频输出系统，但也能帮助进行跨平台的音频输出支持。至少可以期望在Windows上不用为每个版本写一个输出模块了。

SDL2开始支持32位的采样格式，所以在最近的项目里尝试用SDL2来实时输出解码后的音频流。

SDL为音频输出提供的接口很简单，只要设定好采样格式等参数，执行`SDL_OpenAudio()`，成功以后就可以用`SDL_PauseAudio(0)`开始播放。播放是在另外一个线程中进行的，所以需要准备一个callback函数，用来被那个线程调用，并填充buffer。通过这种方式，就能比较自由地控制播放了，因为我们虽然刚初始化完就开始播放了，但只要在没有准备好的时候，由callback函数往buffer里填充0即可输出静音。

接下来就是写入真正的音频流了。由于项目里采用了producer-consumer模型，由生产者解码后，音频流必须实时由消费者输出到输出系统里去，也就是说consumer每调用一次`player->write(buf, cnt)`，就必须输出一段音乐。当然，是否应该block等待是无所谓的，只要能够在适当的时候卡住consumer，并等待buffer消耗就行。

如果是ALSA，这一点是自动完成的，而且就连API调用部分都直接用cmus的代码了，所以完全不用担心。但是SDL的API调用全部自己写，所以需要处理buffer的问题。SDL并没有提供一个方便的buffer管理接口，而且还有多线程同步的问题，所以我就暂时借用了producer-consumer模型用到的Monitor。这个Monitor实现的是一个泛型的循环队列。每当consumer要写入一段音频流的时候，我们就把它存放到Monitor里，当然也还是一样地用Chunk类型来存。在前面提到的callback函数里，不断从Monitor里提取出一个Chunk，并用它填充SDL给的缓冲区，直到缓冲区填满为止。所以这里其实又是一个小小的producer-consumer模型。而且Monitor本身是支持多线程操作的。

------------------------

但有个问题，SDL跟ALSA配合在一起的时候，会经常发生underrun。这貌似是个已知的问题，几年前网上有人问，但是好像没有有效的解决办法。其实在我本地是有办法解决的，只要去掉ALSA的best-rate resampling就行了。但是这个是我想要使用的，因为它能大大提高音频质量。（当然也可能是心理作用，不过毕竟CPU平均升到30%左右，效果应该是很不错的才对。即便是心理作用，听着也确实舒服。）

暂时还没用OSS、AO或者PulseAudio试过，接下来打算在Windows里试一下。
