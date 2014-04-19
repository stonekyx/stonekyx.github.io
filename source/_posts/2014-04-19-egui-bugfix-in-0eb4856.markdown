---
layout: post
title: "EGUI Bugfix in 0eb4856"
date: 2014-04-19 18:51:56 +0800
comments: true
categories: 
---

在commit 0eb4856里解决了一个很明显的服务器崩溃bug。这个bug的发生过程如下：启动服务器，然后启动客户端程序`multi_windows`，待窗口出现以后，在窗口外面的黑色空白处单击鼠标左键，此时服务器会崩溃。

在现在的master分支里直接revert 0eb4856是不能再现这个问题的，因为该commit修改了一些其他的代码，而那些代码的API已经发生变化。要再现这个bug，可以在[这里](/attach/0eb4856-revert.patch)下载反转patch，在commit 5debfbce的EGUI根目录应用之后即可。初学者想练习gdb的话，建议先不看下面的内容和patch文件的内容，自己找出这个bug。

------------------

万一以上patch无效，或者不想使用patch，则需要在`window_manager/window_manager_input_handler.c`里找到`mask_active_by_mouse_down`函数，并将以下代码注释掉：

{% highlight cpp linenos tabsize=4 %}
if(!all_app_traversal_decrement(&iter, _do_find_clicked_window, &msg->mouse.cursor_position)) {
    /* Clear useless pointers in tainted iter */
    window_info_iterator_clear(&iter);
}
{% endhighlight %}

并加上一行：

{% highlight cpp linenos tabsize=4 %}
all_app_traversal_decrement(&iter, _do_find_clicked_window, &msg->mouse.cursor_position);
{% endhighlight %}

再编译后即可。

------------------

简单来说，这个bug的原因就是在函数调用失败之后，没有检查错误的返回值，也没有重置失败调用所产生的无效迭代器。其实这也可以说是一个设计缺陷，因为只要后面检查无效迭代器的代码直接依赖这个未clear的值就好了，可惜它依赖的是另外一个值。

这个未重置的值会导致将来在对vector结构操作的时候给出-1的下标，于是就把某个别的指针给覆盖掉了。此后在使用那个指针的时候，会出现无效地址。

那个被覆盖掉的指针是`global_wm.application_info_vector.head->data`，不过调试的时候在崩溃地点发现的指针应该不是这个名字，因为那是在一个复杂的迭代函数里。
