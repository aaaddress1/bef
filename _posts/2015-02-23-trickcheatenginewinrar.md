\-\-- layout: post title:
\"\[無用\]\[Trick\]CheatEngine秒爆軟體收費請求核心檢測點.(以某知名壓縮軟體為例)\"
date: \'2015-02-23T06:35:00.001-08:00\' author: 聖豪馬 tags: - Crack -
OllyICE - CheatEngine - ASM - API modified\_time:
\'2015-03-09T03:09:36.165-07:00\' thumbnail:
http://1.bp.blogspot.com/-oeuhB0HaDrs/VOsY44kxmzI/AAAAAAAAF4Y/utsOcmjcPT8/s72-c/%E6%9C%AA%E5%91%BD%E5%90%8D.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-7795070993880772856
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/02/trickcheatenginewinrar.html \-\--

<div>

為什麼會有這篇文呢\...

</div>

<div>

純粹因為要去某某學校講場Talk可是怕沒東西Demo撐時間

</div>

<div>

所以就拿在網路上被拆到爛掉的WinRAR介紹一下惹XD

</div>

<div>

PS：有興趣的人可以用OllyICE手動暴力跟跟看，會發現跟不進去XD

</div>

<div>

**[※這篇文一點都不黑、不技術、純學術唷，學術型駭客正夯呢！]{style="color: red;"}**

</div>

<div>

[]{#more}

</div>

首先，本文主角是某壓縮軟體試用版\

<div>

[請支持正版，到官網下載](http://www.rar.com.tw/download.html)

</div>

::: {.separator style="clear: both; text-align: center;"}
:::

<div>

點選試用版的WINRAR x32bit

</div>

<div>

裝完試用版後有免費試用40天的期限

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-oeuhB0HaDrs/VOsY44kxmzI/AAAAAAAAF4Y/utsOcmjcPT8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="580"}](http://1.bp.blogspot.com/-oeuhB0HaDrs/VOsY44kxmzI/AAAAAAAAF4Y/utsOcmjcPT8/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

不過因為要等四十天才能繼續寫文章\....

</div>

<div>

請把右下角的Windows時間調整到四十天以後XD

</div>

<div>

在開啟一次WinRAR.exe就會像這樣：

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-cI0FmLbIcGM/VOsZtG7XlpI/AAAAAAAAF4g/Oxa_aiDJG4A/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="452"}](http://4.bp.blogspot.com/-cI0FmLbIcGM/VOsZtG7XlpI/AAAAAAAAF4g/Oxa_aiDJG4A/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

會噴出這個很煩人的窗窗\...

</div>

<div>

OK，接著我們開啟工具Cheat Enigne

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-MzTeKN3n4V0/VOsaut8LZSI/AAAAAAAAF4o/vEtJfx6U_6k/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="478"}](http://1.bp.blogspot.com/-MzTeKN3n4V0/VOsaut8LZSI/AAAAAAAAF4o/vEtJfx6U_6k/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

然後用CreateProcess的方式選擇到WinRAR.exe，按下開啟舊擋

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-AioKG2B0JU8/VOsbDADysZI/AAAAAAAAF4w/Yvv6gkemqJw/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="512"}](http://3.bp.blogspot.com/-AioKG2B0JU8/VOsbDADysZI/AAAAAAAAF4w/Yvv6gkemqJw/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

就會看到CE幫你把Main Thread做了暫停並且視窗停在入口點囉

</div>

<div>

\

</div>

<div>

接下來

</div>

<div>

要介紹怎麼秒爆WinRAR的商業收費時間檢測點

</div>

<div>

首先我們知道，如果日期一超過四十天，雖然不知道它怎麼計算的

</div>

<div>

但是確切知道的是：它會彈出一個視窗告訴你該繳摳摳囉

</div>

::: {.separator style="clear: both; text-align: center;"}
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-ynQL0GrTzg0/VOsy1SswUDI/AAAAAAAAF58/90z5eIXTC0o/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="226"}](http://2.bp.blogspot.com/-ynQL0GrTzg0/VOsy1SswUDI/AAAAAAAAF58/90z5eIXTC0o/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

\

</div>

<div>

所以我們就來在下一個BreakPoint下在SetWindowPos+14的返回點上

</div>

<div>

咦？你說不知道為啥要Hook這個很奇怪的點？看起來很難記嗎？XD

</div>

<div>

其實你可以翻到上一層

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-07dxJCof4uw/VOszXB7OzBI/AAAAAAAAF6E/Pc526e-QeNg/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="233"}](http://3.bp.blogspot.com/-07dxJCof4uw/VOszXB7OzBI/AAAAAAAAF6E/Pc526e-QeNg/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

其實它是SetForegroundWindow這個API準備進入Ring0層的接口

</div>

<div>

可是它不像一般其他API都有NT函數，

</div>

<div>

而是獨立一個很奇怪的位置在SetWindowPos+14這個位置，沒有給正式的函數名

</div>

<div>

\

</div>

<div>

至於我怎麼撈出來的\...

</div>

<div>

不要問\...這算是經驗吧（？）暴力跟出來的XD

</div>

<div>

基本上涉及到窗體焦點\...etc很多類型都會調用到這個

</div>

<div>

\

</div>

<div>

下好斷點後，準備開始瘋狂F9的旅程

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-bIGNqjcsftk/VOs1AHic7zI/AAAAAAAAF6Q/E66nf-NPUBM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="310"}](http://2.bp.blogspot.com/-bIGNqjcsftk/VOs1AHic7zI/AAAAAAAAF6Q/E66nf-NPUBM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

\

</div>

<div>

一直F9、F9、F9、F9\...會終於等到那個試用的訊息窗終於跳出來了

</div>

<div>

此時把返回點的BreakPoint拿掉（這很重要XD，不然你會進入很基巴的死迴圈）

</div>

<div>

接著可以做第一層的往上層跟蹤（Shift+F8）

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-a4hDr7-5nZ4/VOs1kw_wzmI/AAAAAAAAF6Y/5_hq5yFQMGM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="328"}](http://1.bp.blogspot.com/-a4hDr7-5nZ4/VOs1kw_wzmI/AAAAAAAAF6Y/5_hq5yFQMGM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

會發現來到User32內的Call中Call

</div>

<div>

但是實在不是確實的比對點\...繼續往上爬（Shift+F8）

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-PjyCVDibPc4/VOs1-bqNglI/AAAAAAAAF6g/PKUrGkVyT9s/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="328"}](http://4.bp.blogspot.com/-PjyCVDibPc4/VOs1-bqNglI/AAAAAAAAF6g/PKUrGkVyT9s/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-pvAxJ2nlTh4/VOs2OVXm-vI/AAAAAAAAF6o/5jPRp0VDKI4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="328"}](http://1.bp.blogspot.com/-pvAxJ2nlTh4/VOs2OVXm-vI/AAAAAAAAF6o/5jPRp0VDKI4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

爬到這裡就可以發現原來它的試用訊息是用DialogBoxIndirectParamAorW噴出來der

</div>

<div>

接著把試用訊息的提示視窗關閉後，就會把控制權交回CE惹

</div>

<div>

在往上跟一層

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-brVIVOJRT1M/VOs2yB9-ZyI/AAAAAAAAF6w/pX6w-f9IWCM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="436"}](http://4.bp.blogspot.com/-brVIVOJRT1M/VOs2yB9-ZyI/AAAAAAAAF6w/pX6w-f9IWCM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

往上跟蹤到DialogBoxParamW是用這個做Create的～～

</div>

<div>

繼續往上跟

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-gH0ucnOHvjE/VOs3IlIQF_I/AAAAAAAAF64/MDBdW0WHHjM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="348"}](http://4.bp.blogspot.com/-gH0ucnOHvjE/VOs3IlIQF_I/AAAAAAAAF64/MDBdW0WHHjM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

<div>

\

</div>

<div>

將將將將～～超級無敵容易就爬到檢測點了

</div>

<div>

在上面做了一個test al,al如果al為空就表示不需要跳出試用訊息

</div>

<div>

\

</div>

<div>

找到惹核心檢測點在Winrar.exe+9A2CB這邊的Test Al,Al要讓它下一個強跳

</div>

<div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-usgI85xu1gI/VOs5mVOdcFI/AAAAAAAAF7E/ppcBnZp9hD4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="298"}](http://3.bp.blogspot.com/-usgI85xu1gI/VOs5mVOdcFI/AAAAAAAAF7E/ppcBnZp9hD4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

開啟OD，載入WinRAR找到這個位置\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-b2wCCb3H-vU/VOs51i_TChI/AAAAAAAAF7M/HyzNaUrnWZk/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="334"}](http://1.bp.blogspot.com/-b2wCCb3H-vU/VOs51i_TChI/AAAAAAAAF7M/HyzNaUrnWZk/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

送它一記強跳OWO\
然後存起來\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-_97UgwIXEbk/VOs6D5xX-8I/AAAAAAAAF7U/D8UFkhCgMrM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="360"}](http://3.bp.blogspot.com/-_97UgwIXEbk/VOs6D5xX-8I/AAAAAAAAF7U/D8UFkhCgMrM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

手動打開這個Cracked版看看\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-RiqDX2bMjQ0/VOs6TWEEA2I/AAAAAAAAF7c/Tfrs67VGUI4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="506"}](http://2.bp.blogspot.com/-RiqDX2bMjQ0/VOs6TWEEA2I/AAAAAAAAF7c/Tfrs67VGUI4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

成功啦\~\~從此以後都不會在彈那個試用訊息惹\
\
PS：那個關鍵點往上爬一層就可以看到付費版檢測的方式不過感覺付費版應該沒跟試用版差多少功能，所以有興趣的可以再從al暫存器繼續做跟蹤，應該可以成功Patch成付費版

</div>