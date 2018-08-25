\-\-- layout: post title: 以Debugger原理拆解LINE的Anti-Debug Attach
date: \'2015-01-07T11:18:00.002-08:00\' author: 聖豪馬 tags: - Crack -
CheatEngine - LINE - Debugger modified\_time:
\'2015-01-09T09:16:01.053-08:00\' thumbnail:
http://2.bp.blogspot.com/-ijV-fTfOU84/VK2Azr1DVCI/AAAAAAAAFa8/L2R6FpsC9LU/s72-c/%E6%9C%AA%E5%91%BD%E5%90%8D.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-1383088197503401747
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/01/debuggerlineanti-attach.html \-\--
在Windows版上的LINE開啟後,如果使用Cheat
Engine做進程掛接上去,會看到LINE直接崩潰掉.\
\
先單看Windows提供的一組WinAPI怎麼建立Debugger機制:\

#### [Win32 Debug API 原理](http://www.xuebuyuan.com/1655208.html)

#### **[使用VS调试时，被调试进程如何被断下来的。](http://www.cnblogs.com/aoaoblogs/archive/2011/07/24/2115180.html)**

#### [【原创】反OD调试的一些想法与实践](http://bbs.pediy.com/archive/index.php?t-71065.html)

<div>

\

</div>

<div>

看完之後會知道Debugger的核心機制是:

</div>

<div>

\

</div>

<div>

1.創建進程(CreateProcess)使用[DEBUG\_PROCESS這個Flag,此時該進程內的PEB中的]{style="font-family: Verdana; orphans: 2; widows: 2;"}[BeingDebugged
Flag會被設為True]{style="font-family: Verdana; orphans: 2; widows: 2;"}[,呼叫完後,進成被創建完就會先是被凍結主線程(UI
Thread)的進程了.]{style="font-family: Verdana; orphans: 2; widows: 2;"}

</div>

<div>

[\
]{style="font-family: Verdana; orphans: 2; widows: 2;"}

</div>

::: {style="orphans: 2; widows: 2;"}
[2.接著激活主線程後,WinNT消息機制發現了]{style="font-family: Verdana;"}BeingDebugged為True,就會主動調用
:::

DbgBreakPoint API,在組語上遇到了int
3(0xCC)線程又會被凍結,然後會反彈一個[Create\_PROCESS\_DEBUG\_EVENT訊息回去給父進程,給Debugger做事情.]{style="font-family: Verdana;"}\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-ijV-fTfOU84/VK2Azr1DVCI/AAAAAAAAFa8/L2R6FpsC9LU/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="158"}](http://2.bp.blogspot.com/-ijV-fTfOU84/VK2Azr1DVCI/AAAAAAAAFa8/L2R6FpsC9LU/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {style="orphans: 2; widows: 2;"}
[\
]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[3.如果Debugger想下新的Ring3層斷點,會先用CreateThread在指定進程中創線程,使此線程Call DbgUiRemoteBreakin,那麼指定進程內所有線程就會被Debugger掛起.那麼Debugger便可以對需要的指定記憶體段下int
3異常點.]{style="font-family: Verdana;"}[DbgUiRemoteBreakin內可以看到所有線程主動去Call ]{style="font-family: Verdana;"}[DbgBreakPoint來把當前線程控制權交給Debugger.]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[\
]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[4.如果是進程已經被運行,Debugger才去Attach,則用到DebugActiveProcess去Attach指定進程,接著]{style="font-family: Verdana;"}BeingDebugged又會被設為True,然後做異常機制的掛起線程.
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-FC1DRv7i0ys/VK2ABGNl4HI/AAAAAAAAFa0/VewHHNm0Aa8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="107"}](http://2.bp.blogspot.com/-FC1DRv7i0ys/VK2ABGNl4HI/AAAAAAAAFa0/VewHHNm0Aa8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {style="orphans: 2; widows: 2;"}
\
:::

::: {style="orphans: 2; widows: 2;"}
最後我比較好奇的是
:::

[DbgUserBreakPoint函數內寫法跟DbgBreakPoint其實一模一樣,我不太懂微軟幹嘛把同個功能寫成兩個不同的API?]{style="font-family: Verdana;"}\

::: {style="orphans: 2; widows: 2;"}
[\
]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[接著總結一下]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[所以一般Ring3層需要防Debugger可能會防止]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[1.自身]{style="font-family: Verdana;"}DbgBreakPoint被呼叫.(只要此函數呼叫了便把控制權交出去了)
:::

::: {style="orphans: 2; widows: 2;"}
2.[自身]{style="font-family: Verdana;"}[DbgUserBreakPoint]{style="font-family: Verdana;"}被呼叫.
:::

::: {style="orphans: 2; widows: 2;"}
[3.自身]{style="font-family: Verdana;"}[DbgUiRemoteBreakin被呼叫.(此函數會導致所有線程去呼叫上述其一API)]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[\
]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[先看一下LINE的資料夾:]{style="font-family: Verdana;"}
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-rjE0fFkJGZM/VK2BZeyToTI/AAAAAAAAFbE/kxEPbUoiT2A/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="278"}](http://1.bp.blogspot.com/-rjE0fFkJGZM/VK2BZeyToTI/AAAAAAAAFbE/kxEPbUoiT2A/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {style="orphans: 2; widows: 2;"}
[可以看得出來資料夾內沒有任何驅動文件,確定了LINE本身走純Ring3的Anti-Debugger.]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
\
:::

::: {style="orphans: 2; widows: 2;"}
我們可以用CE檢查一下LINE對上述三個API做了什麼事情
:::

::: {style="orphans: 2; widows: 2;"}
先是前兩條API:
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-o9FFH0W8Ct0/VK2DDdtArII/AAAAAAAAFbQ/jeJu1rFxBlU/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="178"}](http://1.bp.blogspot.com/-o9FFH0W8Ct0/VK2DDdtArII/AAAAAAAAFbQ/jeJu1rFxBlU/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {style="orphans: 2; widows: 2;"}
可以看到的是,LINE的工程師蠻瞧不起DbgUserBreakPoint的,根本不去處理它.
:::

::: {style="orphans: 2; widows: 2;"}
\
:::

::: {style="orphans: 2; widows: 2;"}
不過DbgBreakPoint這條API原本是int 3的OP
Code卻被改成了ret,意味著就算DbgBreakPoint被呼叫了,該進程就會直接無視這函數原本要做的int
3然後繼續做接下來的事情.
:::

::: {style="orphans: 2; widows: 2;"}
所以我們要做的事情就是幫int 3恢復回來
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-unZXgCGZd9k/VK2E7W65ZhI/AAAAAAAAFbc/asihiPuPkMM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="27"}](http://2.bp.blogspot.com/-unZXgCGZd9k/VK2E7W65ZhI/AAAAAAAAFbc/asihiPuPkMM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {style="orphans: 2; widows: 2;"}
\
:::

::: {style="orphans: 2; widows: 2;"}
接著看到[DbgUiRemoteBreakin
API的記憶體內容:]{style="font-family: Verdana;"}
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-MOKzsXBJ95k/VK2FL6switI/AAAAAAAAFbk/HA667CdWkNM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="177"}](http://3.bp.blogspot.com/-MOKzsXBJ95k/VK2FL6switI/AAAAAAAAFbk/HA667CdWkNM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {style="orphans: 2; widows: 2;"}
[它在API入口就下了jmp
NtDll.LdrShutdownProcess,如果這個]{style="font-family: Verdana;"}[DbgUiRemoteBreakin被呼叫就直接跳轉到]{style="font-family: Verdana;"}[LdrShutdownProcess這個API做自我進程關閉的動作.]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
[而且蠻有趣的地方是,它jmp完底下還有2個Byte沒有做清除乾淨的動作XD,看來LINE工程師也想說能用就好惹,不講求看起來記憶體乾淨整潔啊\~\~]{style="font-family: Verdana;"}
:::

::: {style="orphans: 2; widows: 2;"}
一樣,幫它把API入口做恢復:
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-NACQPH3GsCo/VK2F9kyRDSI/AAAAAAAAFbs/zIPDmUiKmWI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="48"}](http://3.bp.blogspot.com/-NACQPH3GsCo/VK2F9kyRDSI/AAAAAAAAFbs/zIPDmUiKmWI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {style="orphans: 2; widows: 2;"}
OK,三個API都做完修正了. 把CE Attach上去LINE身上看看:
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-dfPcodMDpZs/VK2GTs6dL-I/AAAAAAAAFb0/9IoIqnjz_U0/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="209"}](http://2.bp.blogspot.com/-dfPcodMDpZs/VK2GTs6dL-I/AAAAAAAAFb0/9IoIqnjz_U0/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {style="orphans: 2; widows: 2;"}
大功告成,成功Attach上去了,LINE不會崩潰了.
:::

::: {style="orphans: 2; widows: 2;"}
\
:::

::: {style="orphans: 2; widows: 2;"}
\
:::

::: {style="orphans: 2; widows: 2;"}
\...是說,Hook這三個API的做法\...好像跟Garena競時通做法**[完全一模一樣]{style="color: red;"}**呢,不知道是誰抄誰XD
:::