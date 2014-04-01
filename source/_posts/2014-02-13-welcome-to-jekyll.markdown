---
layout: post
title:  "Jekyll!"
date:   2014-02-14 00:48:00
categories:
---

{% highlight javascript %}
(function($) {
    var canvas = document.getElementById('test');
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    for(var i=5; i<canvas.width; i+=5) {
        ctx.moveTo(i,0);
        ctx.lineTo(i,canvas.height);
    }
    for(var i=5; i<canvas.height; i+=5) {
        ctx.moveTo(0,i);
        ctx.lineTo(canvas.width,i);
    }
    ctx.stroke();
})(jQuery);
#=> Just keeping a record of how to highlight codes.
{% endhighlight %}

# Javascript test

<canvas id='test'></canvas>
<script src='/js/vendor/jquery.min.js'></script>
<script src='/js/jstest.js'></script>

