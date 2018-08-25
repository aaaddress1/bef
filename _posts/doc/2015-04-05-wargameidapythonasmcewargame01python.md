\-\-- layout: post title:
\"\[Wargame\]\[IDA\]\[Python\]\[ASM\]\[CE\]交大Wargame01，用Python寫出序號機演算法（下集）\"
date: \'2015-04-05T12:47:00.003-07:00\' author: 聖豪馬 tags: - Crack -
CheatEngine - Python - ASM - IDA - Wargame modified\_time:
\'2015-04-06T01:10:55.155-07:00\' thumbnail:
http://4.bp.blogspot.com/-6KGC1ozhzwk/VSGIbRjj3SI/AAAAAAAAGKQ/7pNjubNBwjs/s72-c/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.09.08.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-1505636407811918395
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/04/wargameidapythonasmcewargame01python.html
\-\--
[這篇接續著上一集：\[Wargame\]\[IDA\]\[CE\]\[OD\]\[ASM\]交大Wargame01，手拆題解](http://helloadr.blogspot.tw/2015/04/wargameidaceodasmwargame01.html)\
\
呃，本來想說其實解出來答案就好了\
不過後來看木棍有發[JavaScript的這支CrackMe的Keygen序號演算法（點此）](http://jsbin.com/fibonagiwi/1/edit?js,console,output)\
所以就乾脆順便筆記一下該怎麼拆出這支程式的序列演算法好了XD\
\
首先，上一集中（？）我們有教過IDA+CE+OD的combo怎麼用的\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-6KGC1ozhzwk/VSGIbRjj3SI/AAAAAAAAGKQ/7pNjubNBwjs/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.09.08.png){width="640"
height="252"}](http://4.bp.blogspot.com/-6KGC1ozhzwk/VSGIbRjj3SI/AAAAAAAAGKQ/7pNjubNBwjs/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.09.08.png)
:::

這邊直接用到IDA內建其實也有靜態文字搜索功能，很快就能找到CRACKED字串\
在這條地址上單擊進入該文字變數地址、很快就能透過引用鍵結找回上集我們用OD翻出來的判斷核心點\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-BZUxEpQP3Ug/VSGI4kdNXeI/AAAAAAAAGKY/7eDz4pdB2c8/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.11.07.png){width="640"
height="190"}](http://4.bp.blogspot.com/-BZUxEpQP3Ug/VSGI4kdNXeI/AAAAAAAAGKY/7eDz4pdB2c8/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.11.07.png)
:::

\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-DXRpCp7WOMQ/VSGJLhO1XAI/AAAAAAAAGKg/sAuR4mqhcj0/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.12.30.png){width="640"
height="580"}](http://2.bp.blogspot.com/-DXRpCp7WOMQ/VSGJLhO1XAI/AAAAAAAAGKg/sAuR4mqhcj0/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.12.30.png)
:::

那麼上集中我們提到，dword\_45B844內存中這個位置會保存著序列答案\
那我們這次焦點就放在用IDA去分析它的演算法是怎麼計算出這個dword變數的值\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-hBh2NiiAk0o/VSGJw_MGxZI/AAAAAAAAGKs/gizTOmRZOpo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.14.24.png){width="640"
height="34"}](http://1.bp.blogspot.com/-hBh2NiiAk0o/VSGJw_MGxZI/AAAAAAAAGKs/gizTOmRZOpo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.14.24.png)
:::

滑鼠對著dword\_45B844單擊，可以看這條內存的引用鍵結\
可以很快地看到這個答案的引用鍵結只有兩條道路\
上面那條路0x458760是序號機演算法時寫入的，下面那條路0x458800就是核心判斷點判斷的了，單擊sub\_458760做跟蹤\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-sAv7vmFXWXU/VSGKOlel7HI/AAAAAAAAGK0/MUNEUkB4z4g/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.16.59.png){width="640"
height="554"}](http://3.bp.blogspot.com/-sAv7vmFXWXU/VSGKOlel7HI/AAAAAAAAGK0/MUNEUkB4z4g/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.16.59.png)
:::

很快的可以用IDA跟蹤到這個頁面上看到這個CrackMe的核心演算法在這裡了\
那接下來就是分析它的序號機演算法是怎麼算序號的：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-GnMGX8KEuy0/VSGKqJVSCvI/AAAAAAAAGK8/EboU-GxcCW4/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.18.30.png){width="640"
height="238"}](http://1.bp.blogspot.com/-GnMGX8KEuy0/VSGKqJVSCvI/AAAAAAAAGK8/EboU-GxcCW4/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.18.30.png)
:::

首先我注意到了dword\_45B844答案保存點所有被寫入的過程就這些而已，那我們目光放在這段，從20行到33行就是所有的序號機演算過程\
\
在第二十行上0x45B844答案變數被清空，接著v3被賦予sub\_403A64(dword\_45B840)\
咦？看不懂v3的值是什麼嗎？好的那麼我們開Cheat
Engine下斷點在呼叫sub\_403A64的這個點上看看它在幹嘛吧 :)\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-RQ4GKwVqY78/VSGNxjOaFFI/AAAAAAAAGLI/z9YwRl4ALFw/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.32.04.png){width="640"
height="158"}](http://3.bp.blogspot.com/-RQ4GKwVqY78/VSGNxjOaFFI/AAAAAAAAGLI/z9YwRl4ALFw/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.32.04.png)
:::

下斷點在Offset =
0x587A8上，當call被呼叫時，可以看到傳入edi就是0x45B840，不過它上面用了mov
eax,\[edi\]（以值傳遞）\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-xKq8ycSMn6s/VSGONEf-KCI/AAAAAAAAGLQ/89ZftdeE8gQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.33.55.png){width="640"
height="124"}](http://3.bp.blogspot.com/-xKq8ycSMn6s/VSGONEf-KCI/AAAAAAAAGLQ/89ZftdeE8gQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.33.55.png)
:::

那會看到函數呼叫結果返回值（eax）為1。（這是當我設置Name = a的時候）\
這時候我們可以嘗試把Name設置為題目的："HelloWorld"看看\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-Gp_Diu3NMDk/VSGOl-KOy5I/AAAAAAAAGLY/2xEqkyilqsA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.35.33.png){width="640"
height="340"}](http://3.bp.blogspot.com/-Gp_Diu3NMDk/VSGOl-KOy5I/AAAAAAAAGLY/2xEqkyilqsA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.35.33.png)
:::

當Name設置為HelloWorld時回傳值為0x0A（10），這時我們可以知道原來sub\_403A64函數用於計算該文字的長度有幾個字（也就是strlen啦）\
\
不過你可能會問說你用IDA看sub\_403A64的結果會是：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-Q50MngDlE98/VSGPHLXWmCI/AAAAAAAAGLg/CBOntFbcR2E/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.37.51.png){width="640"
height="148"}](http://1.bp.blogspot.com/-Q50MngDlE98/VSGPHLXWmCI/AAAAAAAAGLg/CBOntFbcR2E/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.37.51.png)
:::

可以看到這個計算文字長度的函數長這樣，它是怎麼計算的呢？這跟string結構體有點關係，不過如果你想用CE手動找出文字長短可以這樣做：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-kO86HWacBkQ/VSGP27llYyI/AAAAAAAAGLs/iU7-wlxeEto/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.40.54.png){width="640"
height="130"}](http://3.bp.blogspot.com/-kO86HWacBkQ/VSGP27llYyI/AAAAAAAAGLs/iU7-wlxeEto/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.40.54.png)
:::

原理就是文字基址的0x0045B840取value這邊會指向一個指標，\
它的前一個變數（Offset = -4）會保存文字的長度\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-vdcQFVWuiaI/VSGQq5jtl0I/AAAAAAAAGL0/aRP8YTNZBxA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.44.27.png){width="640"
height="242"}](http://1.bp.blogspot.com/-vdcQFVWuiaI/VSGQq5jtl0I/AAAAAAAAGL0/aRP8YTNZBxA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.44.27.png)
:::

接下來我們就可以理解成這樣囉\
到這邊我們很快就能發現其實22行～32行其實就在做一個for迴圈，逐字把每個字的ascii讀入並且乘上8，到34行這，是最後才把strlen也乘上8加上去dword\_45B844的變數值\
\
到35行，對整個答案再去做乘4的動作。\
所以最後我們可以把整個逆向後的演算法用Python寫出來：\
\

``` {.brush: .cpp;}
input_str = "HelloWorld"
record_count = 0

for current in range(0, len(input_str)) :
    record_count += (ord(input_str[current]))* 8

record_count += len(input_str)* 8
record_count = record_count * 4
print(record_count)
```

測試一下Python我們自幹的Keygen解出來的序列正不正確：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-oeAyHSFR5eA/VSGSeEga0FI/AAAAAAAAGMA/5sXc7yeFFL0/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.51.22.png){width="640"
height="156"}](http://4.bp.blogspot.com/-oeAyHSFR5eA/VSGSeEga0FI/AAAAAAAAGMA/5sXc7yeFFL0/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8A%E5%8D%883.51.22.png)
:::

或者你不想照IDA逆出來的寫法，也可以改寫如下：\
\

``` {.brush: .cpp;}
s = "HelloWorld"
print((len(s) + sum(ord(s[i]) for i in range(len(s))))* 32)
```

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-UkZ_5O9-Jv0/VSI_fXG5f2I/AAAAAAAAGMo/C-jxyVP9FzQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8B%E5%8D%884.06.24.png){width="640"
height="212"}](http://2.bp.blogspot.com/-UkZ_5O9-Jv0/VSI_fXG5f2I/AAAAAAAAGMo/C-jxyVP9FzQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-06%2B%E4%B8%8B%E5%8D%884.06.24.png)
:::
