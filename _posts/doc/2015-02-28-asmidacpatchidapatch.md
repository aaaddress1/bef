\-\-- layout: post title:
\"\[ASM\]\[IDA\]\[C++\]爆破也能很優雅！純靜態爆破文件關鍵點+純靜態打Patch（IDA反組譯﹢打Patch）\"
date: \'2015-02-28T10:00:00.000-08:00\' author: 聖豪馬 tags: - Crack -
CPlus - ASM - IDA modified\_time: \'2015-06-01T04:43:40.370-07:00\'
thumbnail:
http://1.bp.blogspot.com/-2c\_T82AAYDk/VPH5slsWitI/AAAAAAAAF\_g/FVQnB6uSaF8/s72-c/%E6%9C%AA%E5%91%BD%E5%90%8D.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-3595131243527674006
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/02/asmidacpatchidapatch.html \-\--
在打Patch方面，Windows上分析\

<div>

一直都有著優異分析能力的Ring3工具有三套

</div>

<div>

Cheat Engine、OllyICE、IDA

</div>

<div>

\

</div>

<div>

大家比較熟的可能是OllyICE可以直接分析PE Header、分析.text段

</div>

<div>

然後直接對Patch的資料保存回執行檔文件

</div>

<div>

\

</div>

<div>

或者不少人也知道Cheat Engine有提供一個噁爛等級的Lua腳本

</div>

<div>

讓你直接用ASM+Lua，不會主流程式語言也能輕鬆製作出補釘工具

</div>

<div>

有些人乾脆就自己寫一個KeyGen or Patch文件了.

</div>

<div>

\

</div>

<div>

不過今天要介紹的不是這些,

</div>

<div>

而是大多數人知道IDA可以分析程式靜態邏輯,輕鬆得知內容

</div>

<div>

而不知道其實IDA也有Patch文件的功能XD

</div>

<div>

(知道的就別看這篇文啦\~很雷很雷\~\~大牛請飄過)

</div>

<div>

\

</div>

<div>

是說本來這篇文想用純英文耍屌寫文章

</div>

<div>

後來想想\...算惹 幹嘛這樣吃力不討好呢(尻杯XD)

</div>

<div>

[]{#more}本文開始

</div>

<div>

[本次Demo的附件在這，下載點我點我](http://www.mediafire.com/download/orxyb1wk70fatkw/Demo.rar)

</div>

<div>

內有一個Normal.exe是未修改的程式

</div>

<div>

Patch.exe則是手動修改過的程式

</div>

<div>

\

</div>

<div>

破解總要有個方向\~所以用CBuilder自寫了一個小程式

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-2c_T82AAYDk/VPH5slsWitI/AAAAAAAAF_g/FVQnB6uSaF8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="184"}](http://1.bp.blogspot.com/-2c_T82AAYDk/VPH5slsWitI/AAAAAAAAF_g/FVQnB6uSaF8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

至於它的功能是啥\...

</div>

<div>

詳見Code：

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-POXjuuxN2os/VPH6OU0iZkI/AAAAAAAAF_o/RX5z-pqN7GQ/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="154"}](http://2.bp.blogspot.com/-POXjuuxN2os/VPH6OU0iZkI/AAAAAAAAF_o/RX5z-pqN7GQ/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

我只在Button1Click的事件上寫了

</div>

<div>

製造一個變數a的數字內容為0到99其中一個數字

</div>

<div>

假如a變數的數字哪天出現了100，則跳出訊息說\"Hello\"

</div>

<div>

\

</div>

<div>

不過因為變數範圍為0\~99，永遠不可能是100，所以MessageBox永遠不會跳出來 

</div>

<div>

\

</div>

<div>

(至於為啥我要寫這麼麻煩\...因為CBuilder會邊譯器優化,如果寫恆等句會自動被清除不必要的垃圾Code\...)

</div>

<div>

\

</div>

<div>

Ok，看到這邊大概能知道我們要幹嘛惹吧

</div>

<div>

首先這個事情要Patch，對使用OD的破解者來說十分難分析

</div>

<div>

問題點在於一般人可能不知道怎麼找到這個事件的位置（有些看雪大牛可能會用特徵碼之類der就不特別討論），CE的破解者也很難分析這個事件點的狀況

</div>

<div>

\

</div>

<div>

不過特別提一下，如果你真的想用CE跟OD破解，可以考慮從SendMessage
API下手，然後跟蹤整個WinNT的消息機制\...不過應該會跟到哭哭（or
採用看雪大牛們的特徵碼辦法）

</div>

<div>

\

</div>

<div>

不過今天要教的是不弄髒手又可以很優雅的IDA打Patch

</div>

<div>

所以請出我們的主角，垮奶肥婆IDA！

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://fiks-ru.net/Image/Advanced/IDA_Pro_Adansed.png)](http://fiks-ru.net/Image/Advanced/IDA_Pro_Adansed.png)
:::

<div>

不過她奶有沒有很垮我是不知道啦，但你們進來看我文章應該就要認同我的偏見吧（？）

</div>

<div>

廢話結束

</div>

<div>

\

</div>

<div>

首先用IDA Pro v6.6的版本載入這支小程式

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-oBRweAGaaUw/VPH8nZ3d5gI/AAAAAAAAF_0/QRWKNDwj9Vw/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="346"}](http://3.bp.blogspot.com/-oBRweAGaaUw/VPH8nZ3d5gI/AAAAAAAAF_0/QRWKNDwj9Vw/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

然後開啟完畢後，給垮奶奶一點點時間分析整個.text段在幹嘛

</div>

<div>

分析完畢後，找到右邊很多外導函數對吧

</div>

<div>

直接找到我們的事件Button1Click，然後展開它

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-3p-WImuMKtc/VPH9162zexI/AAAAAAAAGAA/DKmpcbG87m8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="272"}](http://3.bp.blogspot.com/-3p-WImuMKtc/VPH9162zexI/AAAAAAAAGAA/DKmpcbG87m8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

ok，這時候你會看到\...咦 這不是識曾相似的感覺嗎

</div>

<div>

不過你可以看到a變數不見了，變成一個叫result的變數

</div>

<div>

看來應該是C++Builder為了節省空間做的優化，直接把eax暫存器當做變數存放點來用了

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-RzzIwGpZ_kQ/VPH-0OEVrlI/AAAAAAAAGAI/8uxGqPI8laE/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="524"}](http://1.bp.blogspot.com/-RzzIwGpZ_kQ/VPH-0OEVrlI/AAAAAAAAGAI/8uxGqPI8laE/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

選擇到View找到Disassembly

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-ISr3XMJmKHk/VPH_Hpyy8ZI/AAAAAAAAGAQ/lEAxz5QCN6M/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="306"}](http://1.bp.blogspot.com/-ISr3XMJmKHk/VPH_Hpyy8ZI/AAAAAAAAGAQ/lEAxz5QCN6M/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

然後就可以跳到組語介面了～

</div>

<div>

然後看一下組語Code搭配剛剛IDA分析內容，可以很快的看到\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-WxDr8yjLI9I/VPH_kNjSGbI/AAAAAAAAGAY/46WPGi7ZkdI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="326"}](http://2.bp.blogspot.com/-WxDr8yjLI9I/VPH_kNjSGbI/AAAAAAAAGAY/46WPGi7ZkdI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

</div>

<div>

它直接把區域變數\[EBP+0x0A\]當做變數a來使用，然後比對如果\[EBP+0x0A\]不等於0x64（100），就跳到函數尾巴做釋放區域變數記憶體然後返回

</div>

<div>

\

</div>

<div>

找到關鍵點在.text段的0x00402E10那怎麼做Patch呢

</div>

<div>

選擇選單上的Edit內有個叫做Patch Program的功能，選擇Assemble功能

</div>

<div>

（p.s.記得先mark你要修改的那行 jnz     short loc\_402E22）

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-Cvh1XuNn1XU/VPIAj5lIxFI/AAAAAAAAGAk/pFugppcD2qI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="314"}](http://1.bp.blogspot.com/-Cvh1XuNn1XU/VPIAj5lIxFI/AAAAAAAAGAk/pFugppcD2qI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

既然它那麼愛跳，就斷它跳嘛，不讓它亂跳啊對吧

</div>

<div>

把原本那行補上兩個nop

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-F0LBgMpXwQg/VPIAzyLcI6I/AAAAAAAAGAs/U0XfYud5uGQ/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="246"}](http://2.bp.blogspot.com/-F0LBgMpXwQg/VPIAzyLcI6I/AAAAAAAAGAs/U0XfYud5uGQ/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

這樣它就會乖乖不敢亂跳了

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-NbeQO1rUZM4/VPIBHKzeXmI/AAAAAAAAGA0/FK96RV8HgvE/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="626"
height="640"}](http://3.bp.blogspot.com/-NbeQO1rUZM4/VPIBHKzeXmI/AAAAAAAAGA0/FK96RV8HgvE/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

最後選擇到Apply patches to input file功能

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-N3olv34ogpQ/VPIBYGcQvTI/AAAAAAAAGA8/5v4nUwgtxkI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="256"}](http://4.bp.blogspot.com/-N3olv34ogpQ/VPIBYGcQvTI/AAAAAAAAGA8/5v4nUwgtxkI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

就會看到Patch完之後的程式每次按按鈕都會乖乖跳出Hello囉

</div>