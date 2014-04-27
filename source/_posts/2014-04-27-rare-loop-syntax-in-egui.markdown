---
layout: post
title: "Rare loop syntax in EGUI"
date: 2014-04-27 20:42:36 +0800
comments: true
categories: 
---

EGUI代码里有一些比较奇怪的循环语法，比如

{% highlight cpp linenos tabsize=4 %}
struct list_node *pos;
list_for_each_macro(&t->header->units, pos) {
    if(((struct tab_header_unit*)pos->data)->page == new_focus) {
        tab_header_set_focus(t->header, pos->data);
        return 0;
    }
}
{% endhighlight %}

这样写的目的是避免为了一小段代码写一个多余的函数。原来为了使用`list_for_each`函数枚举列表中的元素，必须写一个新的函数，并将它传入`list_for_each`。

至于`list_for_each_macro`这种奇怪语法的实现方式，只是利用了一下`#define`而已。

{% highlight cpp linenos tabsize=4 %}
#define list_for_each_macro(list, pos) \
    for((pos)=(list)->node.next; (pos)!=&(list)->node; (pos)=(pos)->next)
{% endhighlight %}

它是利用宏替换隐藏了一个循环。不过由于C语言不能在for后面临时定义循环变量，所以必须由使用者先准备好一个循环变量，也就是那个`struct list_node *pos`。

---------------

类似地，还有一个地方利用了这种语法。

{% highlight cpp linenos tabsize=4 %}
struct point *pos;
struct bresenham_iterator *it;
bresenham_for_each(pos, it, x1, y1, x2, y2) {
    screen_set_pixel(s, r, c, pos->x, pos->y);
}
{% endhighlight %}

bresenham是一个绘制直线的算法，为了方便它在不同地方重复使用，将它从graph模块中提取出来了。在上面的`for_each`循环里，每一次循环都会得到直线上下一个点的坐标。所以，我们只需要将这个点画出来就行了。

很方便的一点是，枚举器it不需要使用者分配空间，正常使用完后也不需要释放，`bresenham_next`函数在直线走完之后会自动释放空间。当然，如果使用者从中途break出去了，就需要自己释放了。

至于为什么会同时需要pos和it两个循环变量，是由于bresenham算法的原因。我们把算法的每一步都拆成了独立的函数，所以需要有个地方来存放这些步骤之间的状态。it就是存放这些状态的位置。

--------------

其实改变C语言的语法并不是很好的做法，只有在不得已的时候才用一下。另外，`list_for_each`好像在Linux内核里也有类似的用法。
