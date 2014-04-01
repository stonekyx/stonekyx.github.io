---
layout: post
title:  Bottom-up Mergesort
date:   2014-02-28 16:32:00
categories:
---

今天开始做Leetcode。有一题要求NlogN的时间、常数空间对链表排序，在讨论里看到要用自底向上的归并排序。在链表上高速排序一直有种先入为主的观念认为不可行，但这次看来似乎是可行的。

其实也正因为是在链表上，常数空间才特别可以实现，因为链表的元素交换是常数时间的，不需要像数组一样开另一个来存结果。但是实现起来也特别复杂。

期间遇到一个问题，经过一定的归并过程之后，链表会变短。

{% highlight java linenos %}
    public void merge(ListNode a, ListNode b, int len) {
        ListNode bprev = nodeAt(a, len);
        ListNode bnext = null;
        for(; b!=null && len>0; b=bnext,len--) {
            while(a.next!=null && a.next.val<b.val) {
                a=a.next;
                if(a==bprev) return;
            }
            bprev.next = b.next;
            bnext = b.next;
            b.next = a.next;
            a.next = b;
        }
    }
{% endhighlight %}

这是归并过程，a、b两段是一前一后相连的（即a的最后一个结点后面就是b），每段长度为len。其实为了方便实现，“a”这个参数给的是a段首结点的前面一个，也就是说其实a段有`len+1`个元素，但b段只有`len`个。

链表缩短的问题就出在中间那个while循环上。

{% highlight java linenos %}
while(a.next!=null && a.next.val<b.val) {
    a=a.next;
    if(a==bprev) return;
}
{% endhighlight %}

这个while循环用来找到b结点的插入位置，插入位置就是这个循环结束后的a的后面。

第3行里bprev是一个不变的指针，指向b段的第一个元素前面的结点。利用它可以方便地将b删除。当b段全部删除时，bprev就成了合并后序列的最后一个元素。但是一旦中途a走到了bprev上，就说明a段已经结束了，b段已经不需要再移动。

之前错误的写法是将第2、3行对调，if写在前面。这样的话在这一轮循环结束后，a还可能停留在bprev上，而不再有机会return。此时再判断`a.next.val<b.val`为真（因为`a.next`此时就等于`b`），就退出while了。

while下面就会将b插入到a的后面，而b已经在a的后面。事实上，此后的第一次操作没有任何影响，链表保持不变。问题是此时b后面的值跟b一样，那么它仍然能跳过while循环（因为当b变成它时，`a.next.val==b.val`），再次执行移动操作。此时bprev已经不正确了，它仍然跟a重合，而且在b的前面两个位置。这会导致在操作中将b前面的结点（也就是bprev后面的结点）删除。再往后，如果还有连续相等的结点，这种情况还会继续发生。

-----------

这个问题花费了一个下午的时间。如果是在面试中的话，早已经无望了吧。
