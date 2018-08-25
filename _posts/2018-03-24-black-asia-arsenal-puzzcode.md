\-\-- layout: post title: \"\[Black Asia Arsenal\] puzzCode:
專注開發後門的編譯器, 自帶反逆向、對抗病毒特徵碼定位技術\" date:
\'2018-03-24T09:32:00.000-07:00\' author: 聖豪馬 tags: - Compiler - C++
- Arsenal - BlackHat - ASM modified\_time:
\'2018-04-03T00:45:24.319-07:00\' thumbnail:
https://3.bp.blogspot.com/-dcsFEGI5Hug/WrZ3DKMQX7I/AAAAAAAAIpU/Q3kQo1MRZO4qbDs0jyy-p1EyYphLZ2UgACLcBGAs/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-25%2B%25E4%25B8%258A%25E5%258D%258812.04.07.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-2045761407484611997
blogger\_orig\_url:
http://helloadr.blogspot.com/2018/03/black-asia-arsenal-puzzcode.html
\-\--

前言
----

<div>

安安，這篇沒有講任何工具本身細節XD 純粹是個人一些 murmur 的廢文

</div>

簡報
----

\

專案
----

[github.com/aaaddress1/puzzCode](https://github.com/aaaddress1/puzzCode)\
吃我 Source 看細節啦（？）\

\#murmur
--------

::: {style="font-size: medium; font-weight: 400;"}
::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-dcsFEGI5Hug/WrZ3DKMQX7I/AAAAAAAAIpU/Q3kQo1MRZO4qbDs0jyy-p1EyYphLZ2UgACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-25%2B%25E4%25B8%258A%25E5%258D%258812.04.07.png){width="640"
height="459"}](https://3.bp.blogspot.com/-dcsFEGI5Hug/WrZ3DKMQX7I/AAAAAAAAIpU/Q3kQo1MRZO4qbDs0jyy-p1EyYphLZ2UgACLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-25%2B%25E4%25B8%258A%25E5%258D%258812.04.07.png)
:::

\
其實事情是這樣
der，去年底忙完一堆工作的事情後發現好像有點閒，然後就收到了這樣的一封信躺在我的
gmail 裡面。~~畢竟個人覺得自己沒那個屁股能投稿上 BlackHat 或者 DEFCON
這種一線等級的大 Conf。~~\
~~\
~~\

::: {.separator style="clear: both; text-align: center;"}
[![](https://1.bp.blogspot.com/-1pB8fucuHjk/WrZ8RYmd8NI/AAAAAAAAIpk/-Lg8m7DqYs0ByhyD4gBU11T-Rh5P44gFACLcBGAs/s640/28828648_1791357554249865_877671159104154008_o.jpg){width="480"
height="640"}](https://1.bp.blogspot.com/-1pB8fucuHjk/WrZ8RYmd8NI/AAAAAAAAIpk/-Lg8m7DqYs0ByhyD4gBU11T-Rh5P44gFACLcBGAs/s1600/28828648_1791357554249865_877671159104154008_o.jpg)
:::

\
這封信指出可以投稿你自己的駭客工具到 Black Hat
Asia，若被接受，你可以獲得一個攤位和大約 2hr 時間可以讓你 present
你工具特別之處，最棒的是你可以獲得價值六萬塊新台票的入場券！（就是門票啦，那張
Badge）除此之外會贈送大會背包這樣，對一個沒去過 Black Hat
的屁孩如我來說超吸引的啊XD\
\
之前的研究一直都差不多打轉在防毒軟體怎麼設計安全防護上，然後花了一點時間接了
MinGW 編譯器（GCC 在 Windows 分支版本的編譯器）用 C\# 寫了一個簡單的
UI，來做到自動化將 C/C++ 原始碼透過編譯器產生 Assembly
Script（其實理想狀況用編譯器的 IR Code 會比較恰當，畢竟如果要跨 CPU
架構，你的混淆 Patten 很容易吃大便）然後自幹了簡單的 Assembly
指令混淆邏輯單元、最後再透過組譯器產生出 Object File 與連結器封裝為
\*.exe 的 Windows 程式這樣XD\
\
這樣的工具當初構想是：很多基於 YARA
或者其他自定義的惡意程式特徵碼設計概念都是連續組合語言片段檢測 + Hash
Check
來確認一隻文件是否具有惡意（正確來說應該是：是否已經被建檔為惡意文件）所以如果能設計一個編譯器自動化做到同份原始碼、每次編譯出的執行程式都會被混淆邏輯單元打散程式碼順序與穿插混淆程式碼，那其實可以做到很強程度的對抗現在一線的防毒軟體（看看那隻有點紅的小傘）\
\
運氣不錯的是：以往 Black Hat
收錄的工具沒有這類型的工具，原本只有備取、最後成功被收錄到 Black Hat
Asia 的軍火庫（Arsenal）啦，可參見至：[PUZZCODE, MAKE BACKDOORS GREAT
AGAIN!](https://www.blackhat.com/asia-18/arsenal/schedule/index.html#puzzcode-make-backdoors-great-again-9680)\
\

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-HiZg7B2lF3g/WrZ-NaOSWTI/AAAAAAAAIpw/kCKFpz6ws2sM6IVhCHOhfLOwWIN32qk4ACLcBGAs/s640/photo_2018-03-25_00-28-28%2B%25282%2529.jpg){width="640"
height="360"}](https://3.bp.blogspot.com/-HiZg7B2lF3g/WrZ-NaOSWTI/AAAAAAAAIpw/kCKFpz6ws2sM6IVhCHOhfLOwWIN32qk4ACLcBGAs/s1600/photo_2018-03-25_00-28-28%2B%25282%2529.jpg)
:::

::: {.separator style="clear: both; text-align: center;"}
[![](https://2.bp.blogspot.com/-SFnz0F-qWGE/WrZ-NTBDEVI/AAAAAAAAIp0/hMjGg1Wt6motbMduqdbHL_a8zVeW71tjgCEwYBhgL/s640/photo_2018-03-25_00-28-32.jpg){width="640"
height="480"}](https://2.bp.blogspot.com/-SFnz0F-qWGE/WrZ-NTBDEVI/AAAAAAAAIp0/hMjGg1Wt6motbMduqdbHL_a8zVeW71tjgCEwYBhgL/s1600/photo_2018-03-25_00-28-32.jpg)
:::

\
實際擺攤的時候，對你工具有興趣想聽的會在你攤位開始的時間前面卡位等著，然後看起來會\...蠻有點壓力的（？）~~我不會承認是因為怕英文說得很差QQ ~~然後就是你分享你的工具的時刻惹。不過看了一下左右其他
Arsenal 攤位擺的都是蠻知名的工具，比如說：FLARE VM
這種知名到爆的工具XD，都很怕自己攤位會被噓爆 QQ\
\
總之，如果你很有一些特別想法想實作一些蠻有用的小工具 + 想跑來 Black Hat
逛大莊園（大拜拜啦）這個 Project 蠻適合投稿的XD（感覺很帶壞小朋友）
:::

雜圖
----

<div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-lib-BmFY-8o/WrZ_Q4ULqgI/AAAAAAAAIp8/Ox_S2BPo5QkXnwtYPkeLmCdB9TmbuvmHQCLcBGAs/s640/28947798_1791357574249863_8653669882302061456_o.jpg){width="640"
height="480"}](https://3.bp.blogspot.com/-lib-BmFY-8o/WrZ_Q4ULqgI/AAAAAAAAIp8/Ox_S2BPo5QkXnwtYPkeLmCdB9TmbuvmHQCLcBGAs/s1600/28947798_1791357574249863_8653669882302061456_o.jpg)
:::

::: {.separator style="clear: both; text-align: center;"}
第一天剛註冊報到完成超興奮R
:::

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-fqsLlFlhiR4/WrZ_WcCv3TI/AAAAAAAAIqI/Qj24RnICzU4Gpun74kh43yRcQN4VDq4PwCEwYBhgL/s640/28828895_1791006507618303_1320000527110670904_o.jpg){width="480"
height="640"}](https://4.bp.blogspot.com/-fqsLlFlhiR4/WrZ_WcCv3TI/AAAAAAAAIqI/Qj24RnICzU4Gpun74kh43yRcQN4VDq4PwCEwYBhgL/s1600/28828895_1791006507618303_1320000527110670904_o.jpg)
:::

::: {.separator style="clear: both; text-align: center;"}
擺攤結束，準備開溜前拍一張XD
:::

::: {.separator style="clear: both; text-align: center;"}
[![](https://1.bp.blogspot.com/-hc1F48n8dJY/WrZ_YjXHLkI/AAAAAAAAIqY/Z4txOfWZc-YGqxOmlYUeXa7BoeKAlu0SwCEwYBhgL/s640/29511464_10155489053586134_5763112127668317673_n.jpg){width="640"
height="480"}](https://1.bp.blogspot.com/-hc1F48n8dJY/WrZ_YjXHLkI/AAAAAAAAIqY/Z4txOfWZc-YGqxOmlYUeXa7BoeKAlu0SwCEwYBhgL/s1600/29511464_10155489053586134_5763112127668317673_n.jpg)
:::

::: {.separator style="clear: both; text-align: center;"}
切換場次時候第一波人會很多XD，應該是最緊張的時候
:::

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-GEFAeHTxznM/WrZ_XP7qeMI/AAAAAAAAIqM/GhK8Oj13GLQg4ntun82Fzbt0Jr1SmFyuwCEwYBhgL/s640/29497638_10155489054376134_5828223084802790468_n.jpg){width="480"
height="640"}](https://3.bp.blogspot.com/-GEFAeHTxznM/WrZ_XP7qeMI/AAAAAAAAIqM/GhK8Oj13GLQg4ntun82Fzbt0Jr1SmFyuwCEwYBhgL/s1600/29497638_10155489054376134_5828223084802790468_n.jpg)
:::

\

::: {.separator style="clear: both; text-align: center;"}
[![](https://1.bp.blogspot.com/-AaaBN59_GIA/WrZ_XRpxQhI/AAAAAAAAIqU/kL-gwLFr4tcvq2Bns2ImChiaiHXJeEOBwCEwYBhgL/s640/29497894_10155489053576134_107793926402099413_n.jpg){width="640"
height="480"}](https://1.bp.blogspot.com/-AaaBN59_GIA/WrZ_XRpxQhI/AAAAAAAAIqU/kL-gwLFr4tcvq2Bns2ImChiaiHXJeEOBwCEwYBhgL/s1600/29497894_10155489053576134_107793926402099413_n.jpg)
:::

\

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-MQQ4oJTJgHM/WrZ_Y15gF_I/AAAAAAAAIqc/ru3a3lMmih8qdAjPorqMROhyWva9HSlawCEwYBhgL/s640/29594589_10155489055346134_1874324855265736820_n.jpg){width="640"
height="480"}](https://3.bp.blogspot.com/-MQQ4oJTJgHM/WrZ_Y15gF_I/AAAAAAAAIqc/ru3a3lMmih8qdAjPorqMROhyWva9HSlawCEwYBhgL/s1600/29594589_10155489055346134_1874324855265736820_n.jpg)
:::

\

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-ynIb66azfHI/WrZ_WMQVXuI/AAAAAAAAIqk/lGtrf0o6pQsaY_utU9fAGtl9AGcf4fPCgCEwYBhgL/s640/28953717_1791357340916553_3493352067623305881_o.jpg){width="480"
height="640"}](https://3.bp.blogspot.com/-ynIb66azfHI/WrZ_WMQVXuI/AAAAAAAAIqk/lGtrf0o6pQsaY_utU9fAGtl9AGcf4fPCgCEwYBhgL/s1600/28953717_1791357340916553_3493352067623305881_o.jpg)
:::

\

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-OEcHUYeL8ns/WrZ_XIqo_0I/AAAAAAAAIqQ/hfLC8vjxvtQn_CW_0cj3dy_hFqXj776cACEwYBhgL/s640/28953874_1791006494284971_4079340284096371882_o.jpg){width="480"
height="640"}](https://3.bp.blogspot.com/-OEcHUYeL8ns/WrZ_XIqo_0I/AAAAAAAAIqQ/hfLC8vjxvtQn_CW_0cj3dy_hFqXj776cACEwYBhgL/s1600/28953874_1791006494284971_4079340284096371882_o.jpg)
:::

\

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-0wqudVgH1ps/WrZ_WU2OGRI/AAAAAAAAIqo/yPp-YF7HFBINlCHDBUT8T5B0ZF80X8O8gCEwYBhgL/s640/28827582_1791357230916564_3615213658460614202_o.jpg){width="480"
height="640"}](https://4.bp.blogspot.com/-0wqudVgH1ps/WrZ_WU2OGRI/AAAAAAAAIqo/yPp-YF7HFBINlCHDBUT8T5B0ZF80X8O8gCEwYBhgL/s1600/28827582_1791357230916564_3615213658460614202_o.jpg)
:::

::: {.separator style="clear: both; text-align: center;"}
\
:::

</div>
