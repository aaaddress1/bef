\-\-- layout: post title:
\"\[很雷\]\[C++\]\[OllyICE\]\[ASM\]摸摸摸、初探Buffer Overflow攻擊\"
date: \'2015-02-11T09:28:00.002-08:00\' author: 聖豪馬 tags: - Stack -
OllyICE - CPlus - ASM modified\_time: \'2015-06-01T04:43:40.391-07:00\'
thumbnail:
http://4.bp.blogspot.com/-GsaqZ66hmZY/VNuHcxnfnNI/AAAAAAAAFzc/zt8GOepoUj0/s72-c/%E6%9C%AA%E5%91%BD%E5%90%8D.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-8078551082568450136
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/02/collyiceasmbuffer-overflow.html
\-\-- 一直覺得Buffer Overflow的算法很神奇\
一定要算到很精確才能讓Shellcode溢位到準確的EIP上做return\
不過最近某某大神的這篇[緩衝區溢位攻擊：第二章 -
改變程式執行的流程](http://securityalley.blogspot.tw/2013/05/blog-post.html)\<(\_
\_)\>\
看完之後自己的心得吧（？）\
\
不過因為使用上原版的好麻煩\...（各種懶惰）\
所以改寫了一下\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-GsaqZ66hmZY/VNuHcxnfnNI/AAAAAAAAFzc/zt8GOepoUj0/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="307"}](http://4.bp.blogspot.com/-GsaqZ66hmZY/VNuHcxnfnNI/AAAAAAAAFzc/zt8GOepoUj0/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

\
在中間因為x恆等於1所以永遠都會printf出\"x is 1\"這句話\
用跟蹤了一下Dev C++編譯出來的結果\
先對strcpy下breakpoint然後跟蹤回去可以看到整支code在哪\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-ez29EsWS9s0/VNuIf72WM-I/AAAAAAAAFzk/kafsplc9QIc/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="332"}](http://2.bp.blogspot.com/-ez29EsWS9s0/VNuIf72WM-I/AAAAAAAAFzk/kafsplc9QIc/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

接著可以跟蹤一下記憶體\
在func函數跑到申請區域變數記憶體完後的stack資料\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-69SE0oaENCk/VNuJ3CYeK5I/AAAAAAAAFzw/4vCpecS1Fx8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="234"}](http://3.bp.blogspot.com/-69SE0oaENCk/VNuJ3CYeK5I/AAAAAAAAFzw/4vCpecS1Fx8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

在func函數跑到尾巴時候的stack資料\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-dLPq4M9-ozY/VNuNMt8J4II/AAAAAAAAFz8/AmzFZ_SktYo/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="250"}](http://3.bp.blogspot.com/-dLPq4M9-ozY/VNuNMt8J4II/AAAAAAAAFz8/AmzFZ_SktYo/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

可以試著把Dev C內的Code文字改成24個點去占用buffer變數的24個Byte看看\
占用後的結果：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-51jr9Hq-5kY/VNuN_WEFZ2I/AAAAAAAAF0E/ekT1n_5dYzo/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="259"}](http://2.bp.blogspot.com/-51jr9Hq-5kY/VNuN_WEFZ2I/AAAAAAAAF0E/ekT1n_5dYzo/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

會發現還有兩組LONG大小的空間，才會占用到EIP返回點\
後來跟了一下22FEC0中記錄的777B8CD5的這個位置，是strcpy的API地址\
至於22FEC4的這個就不知道是啥了\...看不太懂到底這個位置是？\
總之可以得知我們需要占用24個字節+2個LONG的長度+一個LONG(EBP記錄的變數)\
最後才能占用到22FECC的EIP返回點\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-vYgLZmNat4w/VNuPhAbKmcI/AAAAAAAAF0Q/-iMJOqMQE4c/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="90"}](http://4.bp.blogspot.com/-vYgLZmNat4w/VNuPhAbKmcI/AAAAAAAAF0Q/-iMJOqMQE4c/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

可以發現那個永遠不會被執行到的位置地址為0x0040170C\
轉成BYTE Array得寫：0C 17 40 00\
\
所以最後文字的Shellcode可以寫成：\
「**[[\...\...\...\...\...\...\...\...xxxxyyyyzzzz\\x0C\\x17\\x40\\x00]{.underline}]{style="color: #e06666;"}**」\
24個「.」負責占用buffer的內容\
四個x負責占用strcpy的地址\
四個y負責占用不知道是啥的空間\
四個z負責占用占存的EBP值\
接著就是補上四個BYTE的返回點\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-VqLOqk8CK7Q/VNuRBlUNFgI/AAAAAAAAF0c/33da4q1F96E/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="292"}](http://4.bp.blogspot.com/-VqLOqk8CK7Q/VNuRBlUNFgI/AAAAAAAAF0c/33da4q1F96E/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

最後把文字換為shellcode，就成功控制了底下的邏輯流程惹
