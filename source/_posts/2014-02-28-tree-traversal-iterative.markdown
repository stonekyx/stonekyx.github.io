---
layout: post
title:  Non-recursive binary-tree traversal
date:   2014-02-28 21:09:00
categories:
---

非递归地后序遍历二叉树。

{% highlight java linenos %}
    TreeNode it = root;
    do {
        while(it.left!=null) {
            stack.push(it);
            it=it.left;
        }
        if(it.right!=null) {
            stack.push(it);
            it=it.right;
            continue;
        }
        while(stack.size()>0) {
            ans.add(it.val);
            TreeNode par = stack.pop();
            if(par.left == it && par.right != null) {
                stack.push(par);
                it=par.right;
                break;
            } else {
                it=par;
                continue;
            }
        }
    } while(it!=root);
    ans.add(it.val);
    return ans;
{% endhighlight %}

一次大循环以回溯为结束。简单来说，就是尽量向左走，如果回溯过程中发现能向右走，那么马上停止回溯，向右走一步，继续遍历右子树。所以，整个遍历过程中是**不断遍历右子树**，而这些右子树**以左结点的链为轴排布**。
