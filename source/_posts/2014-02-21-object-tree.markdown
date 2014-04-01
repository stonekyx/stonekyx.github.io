---
layout: post
title:  "Object tree"
date:   2014-02-21 21:02:00
categories:
---

#EGUI的对象树
对象树就是在object结构中组建出树。组建树的代码在object.c中并没有提供，而是在其他地方隐式体现的。

#对象树的隐式规则
对象本身并没有强制組成一棵树，也就是说并不是一个object结构体就能组成一棵单结点的树。

一棵对象树必须要有至少两个结点，这两个结点都是树根。它们可以理解成一种循环的上下关系。令真正的树根为root，那么它上面必须还有一个伪根fakeroot，并且`root->parent==fakeroot && fakeroot->parent==root`，也就是两个结点互相为对方的父结点。

在添加更多子结点的时候，`object_attach_child()`的参数应该是root及其下面的结点。

由于并没有规定谁是真正的树根，在编写API的时候，可以选择返回任意一个树根，但是在用object.c提供的接口进行遍历的时候，应该认定**fakeroot**为树根。

object.c提供的遍历接口依赖于root和fakeroot的这种循环上下关系，而且`attach_child`也会及时地修正fakeroot里保存的内部数据，所以在使用这些接口时需要考虑清楚fakeroot的安全性（它是不是还被用做保存了其他数据，因为那些数据在`attach_child`的时候会被覆盖）和正确性（循环上下关系是否成立）。

#代码示例
以下代码摘自`application/manipulate_window.c`。

{% highlight cpp linenos tabsize=4 %}
node = OBJECT_POINTER(w);
tree = node->parent;
tree_real_parent = tree->parent;
tree->parent = node;
node = object_tree_l_most_node(tree);
while(node != NULL)
{
	union message msg;
	msg.base.type = MESSAGE_TYPE_WIDGET_REPAINT;
	msg.widget_repaint.area = WIDGET_POINTER(node)->area;
	if(WIDGET_POINTER(node)->callback != NULL)
		WIDGET_POINTER(node)->callback(node, &msg);

	node = object_tree_iterator_increment(tree, node);
}
tree->parent = tree_real_parent;
{% endhighlight %}

这段代码是为了遍历以w（也就是node）为根的子树。由于在原树中w并不是树根，所以需要临时把它的父结点改成fakeroot来让w成为树根，遍历完再改回去。代码上体现在第3行和第16行。

在第14行增长迭代器的时候，提供给接口的参数是作为fakeroot存在的tree指针，而不是真正的根。实际上，由于真正的根在初始化部分之后基本上就没用了，所以在这段代码后半部分直接就把node当迭代器来用了。（**这是很不好的习惯！**）
