\-\-- layout: post title:
\"\[Windows\]\[OllyICE\]\[ASM\]\[Unpack\]手脫MPRESS殼\" date:
\'2015-05-15T12:58:00.001-07:00\' author: 聖豪馬 tags: - OllyICE -
Scylla - Windows - ASM - 脫殼 modified\_time:
\'2015-05-15T12:58:31.424-07:00\' thumbnail:
http://2.bp.blogspot.com/-Fg9U5o4YzPs/VVZKjLndE5I/AAAAAAAAGXU/DcuJdaB7a3I/s72-c/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.35.23.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-8100175810017266388
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/05/windowsollyiceasmunpackmpress.html
\-\--

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-Fg9U5o4YzPs/VVZKjLndE5I/AAAAAAAAGXU/DcuJdaB7a3I/s320/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.35.23.png){width="320"
height="164"}](http://2.bp.blogspot.com/-Fg9U5o4YzPs/VVZKjLndE5I/AAAAAAAAGXU/DcuJdaB7a3I/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.35.23.png)
:::

::: {.separator style="clear: both; text-align: center;"}
\
:::

小小的紀錄一下MPRESS殼的手脫過程\
\
前情提要：\
因為朋友正在分析一支電腦裡野生長出來的軟體，但是看它筋骨奇特，深深覺得絕非善類，肯定是會咬人的壞東西，丟到IDA，IDA也胃口不好。用PEID照妖鏡一看原來外面有戴套，是層MPRESS的殼還蠻冷門的，於是朋友就把這奇形怪貌的東西丟給我脫殼惹
.\_\_\_.\
\
但是因為我先前根本沒有脫殼過，有的話\...我之前脫過UPX算嗎（？）\
[初探手工脫UPX殼（IAT修復Dump＋ESP定律找OEP），學學如何幫程式脫殼裸奔](http://helloadr.blogspot.tw/2015/02/upxiatdumpespoep.html)\
(不過這篇也只是練習脫UPX殼而已啦XD）\
\
後來Google了一下MPRESS有找到國外相關資料：[Unpacking mpress'ed PE+ DLLs
with the Bochs
plugin](http://www.hexblog.com/?p=403)，於是可以得知一些資訊來做脫殼惹\
\
首先，用OD載入這鬼東西，\
OD會問要不要解壓縮資料請選擇是，\
然後讓OD幫我們斷在入口點上：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-pUNXTinWbKA/VVZMWWBX9-I/AAAAAAAAGXg/DbdRpG5mPzc/s640/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.42.20.png){width="640"
height="400"}](http://4.bp.blogspot.com/-pUNXTinWbKA/VVZMWWBX9-I/AAAAAAAAGXg/DbdRpG5mPzc/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.42.20.png)
:::

再來就是一連串繁瑣無聊的把資源解壓縮出來的演算法\
一路F8越過，直到遇到底下這裡：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/--gXT8d0kQDs/VVZMo2DI4jI/AAAAAAAAGXo/sUWlgxb-8To/s640/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.44.24.png){width="640"
height="362"}](http://4.bp.blogspot.com/--gXT8d0kQDs/VVZMo2DI4jI/AAAAAAAAGXo/sUWlgxb-8To/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.44.24.png)
:::

花點時間跟蹤到這邊會發現資源就解壓縮得差不多了，都釋放到記憶體了\
繼續單步跟蹤進去：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-ffrMO3A0XKo/VVZM_sTlDgI/AAAAAAAAGXw/FXbxe5Cp5SA/s640/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.45.53.png){width="640"
height="430"}](http://3.bp.blogspot.com/-ffrMO3A0XKo/VVZM_sTlDgI/AAAAAAAAGXw/FXbxe5Cp5SA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.45.53.png)
:::

Jmp進去的第一層跑到這裡眼尖的人會發現Stack上Heap區多了關於原始程序模塊的基址\
不過其實這跟脫殼要的資訊沒太大關係啦\...順帶提一下XD\
然後繼續越過跟蹤下去：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-wjWd1agyIPQ/VVZN38iOhXI/AAAAAAAAGX8/TqoJ8kjfZiY/s640/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.49.29.png){width="640"
height="216"}](http://3.bp.blogspot.com/-wjWd1agyIPQ/VVZN38iOhXI/AAAAAAAAGX8/TqoJ8kjfZiY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.49.29.png)
:::

到這個特徵會看到一個call，如果你用越過（F8）會發現在那邊卡很久\
這邊我們用F7單步跟蹤進去：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-MMvdQjWdFhI/VVZOLd5TByI/AAAAAAAAGYE/vZCfF0WXmEU/s640/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.50.53.png){width="640"
height="294"}](http://3.bp.blogspot.com/-MMvdQjWdFhI/VVZOLd5TByI/AAAAAAAAGYE/vZCfF0WXmEU/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.50.53.png)
:::

江江江江～原來call進來的地方第一句就是call GetModuleHandleA\
聽起來超熟悉的啊，配合底下GetProcAddress雙函數迴圈處理，\
原來這邊就是開始還原IAT的處理\
應該是對應到國外那篇文章裡面的UnPack函數\
\
接著我們花點時間往下翻翻翻可以翻到：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-IDcpBCs-IoE/VVZOmJ0SQQI/AAAAAAAAGYM/t4T7QU5Tkow/s640/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.52.43.png){width="640"
height="136"}](http://3.bp.blogspot.com/-IDcpBCs-IoE/VVZOmJ0SQQI/AAAAAAAAGYM/t4T7QU5Tkow/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.52.43.png)
:::

這邊做popad恢復了stack環境，然後做了一個大跳躍回到OEP了\
單步跟蹤進去，如下圖：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-cPsOLzy4IUI/VVZPJbK-fqI/AAAAAAAAGYc/35JgEjz_8T4/s640/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.54.59.png){width="640"
height="316"}](http://3.bp.blogspot.com/-cPsOLzy4IUI/VVZPJbK-fqI/AAAAAAAAGYc/35JgEjz_8T4/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.54.59.png)
:::

::: {.separator style="clear: both; text-align: center;"}
\
:::

漂亮的OEP裸體在我們眼前了，紀錄一下OEP位置0x0041F070\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-V1awlwKsfzI/VVZPitC-BgI/AAAAAAAAGYk/bfubJqbYz_0/s640/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.56.17.png){width="640"
height="518"}](http://1.bp.blogspot.com/-V1awlwKsfzI/VVZPitC-BgI/AAAAAAAAGYk/bfubJqbYz_0/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-05-16%2B%E4%B8%8A%E5%8D%883.56.17.png)
:::

然後用內建的OllyDump設置OEP為0x0041F070，修一下IAT就脫殼完成囉！