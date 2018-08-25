\-\-- layout: post title: Garena 釣魚蠕蟲 Dropper
樣本分析（照片.zip）與如何清除病毒 date:
\'2018-03-03T03:12:00.002-08:00\' author: 聖豪馬 tags: - Malware
modified\_time: \'2018-03-03T03:12:43.750-08:00\' thumbnail:
https://4.bp.blogspot.com/-izfajkNyA00/Wpp5KTRRv2I/AAAAAAAAIj0/87hgfDddek45DHmvWbR2Bnjw\_nLyOycGgCLcBGAs/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.29.18.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-2273497149748728936
blogger\_orig\_url:
http://helloadr.blogspot.com/2018/03/garena-dropper-zip.html \-\--

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-izfajkNyA00/Wpp5KTRRv2I/AAAAAAAAIj0/87hgfDddek45DHmvWbR2Bnjw_nLyOycGgCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.29.18.png){width="640"
height="543"}](https://4.bp.blogspot.com/-izfajkNyA00/Wpp5KTRRv2I/AAAAAAAAIj0/87hgfDddek45DHmvWbR2Bnjw_nLyOycGgCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.29.18.png)
:::

前言
----

<div>

事情是這樣的，一如反常的我打開我的 macbook、打開虛擬機、打開
Windows、打開 Garena~~、打開 LoL 想發洩一下~~
這時候發現一堆人都在密我呢，好害羞啊，可是大家都密我一樣的東西，丟了一份
照片.zip 過來，這引起了我的好奇

</div>

<div>

\

</div>

<div>

[註：這篇文章只分析 Dropper 部分，後面還有一支 \*.exe
惡意程式有加殼，如果時間比較有空了我才會分析進去他在幹嘛XD，這篇文章主要是分享分析
\*.vbe 加密後的 VBScript
的方法與解混淆的技巧。~~我不會承認是因為我懶得開虛擬機，所以這篇文章都在真實工作電腦內純靜態分析哈哈哈哈哈哈~~]{style="color: red;"}

</div>

<div>

[ ]{style="color: red;"}[TL;DR：如何清除病毒？]{style="color: red;"}
--------------------------------------------------------------------

因為這隻惡意程式把路徑跟檔名都寫死的，所以檢查一下你 Windows
的「啟動」資料夾是否有 r.vbe，跟 C:\\programdata\\opopopk.exe
這個程式是否存在。把啟動資料夾內的 r.vbe 與 C:\\programdata\\opopopk.exe
刪除就完成清除病毒惹

</div>

惡意壓縮包附件
--------------

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-_OBqC2WSlpo/Wpp8wk3N0RI/AAAAAAAAIkA/Pncr687gmnMB3H2lL6ZtVDiuB14NHwbMQCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.44.58.png){width="640"
height="230"}](https://3.bp.blogspot.com/-_OBqC2WSlpo/Wpp8wk3N0RI/AAAAAAAAIkA/Pncr687gmnMB3H2lL6ZtVDiuB14NHwbMQCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.44.58.png)
:::

<div>

首先你拿到這份壓縮包後，會看到裡面只有一個「照片.vbe」檔案，類型可見是
VBScript 編碼後的腳本文件

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-o8MkEW2pI6k/Wpp9YIf2dCI/AAAAAAAAIkI/5IQsqrhL7iI-XRiYKUGVbnGE1LpdjNkUQCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.47.40.png){width="640"
height="442"}](https://4.bp.blogspot.com/-o8MkEW2pI6k/Wpp9YIf2dCI/AAAAAAAAIkI/5IQsqrhL7iI-XRiYKUGVbnGE1LpdjNkUQCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.47.40.png)
:::

<div>

打開這份 \*.vbe
文件後，即可見內部是編碼過後的腳本，無法直接觀看到程式碼，你可以透過
[VBS decrypter and
encrypter](https://master.ayra.ch/vbs/vbs.aspx) 來完成這個解碼的部分~~，這個編碼解碼有一套固定算法沒有任何技術性，不要浪費人生在這種無意義的東西上~~

</div>

<div>

~~\
~~

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-GzJqxHLscuk/Wpp-XubVQXI/AAAAAAAAIkU/2zSerRAUXp4Gbtp6ApL2K1T4nAfNs6wbgCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.51.56.png){width="580"
height="640"}](https://4.bp.blogspot.com/-GzJqxHLscuk/Wpp-XubVQXI/AAAAAAAAIkU/2zSerRAUXp4Gbtp6ApL2K1T4nAfNs6wbgCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.51.56.png)
:::

<div>

把解碼後的程式碼稍微重新排版後，可以看到他的混淆很簡單，就只是把
VBScript 程式碼以字串方式，把每個 ASCII 碼以數字與逗號做切割保存在 Str
變數內。執行時，再將每個數字轉回文字並組合存在 restorecode 內，回傳
ASCII 組合起來的字串，再透過內建的 Execute 函數將 VBScript
執行起來。所以只要把 Execute 換為 MsgBox 函數：

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://1.bp.blogspot.com/-AB_DpxMwdsA/Wpp-7MlDxBI/AAAAAAAAIkc/aMsjWOP7GP84rHYy2fnTJCGszzx8d0PCACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258A%25E5%258D%258812.47.21.png){width="640"
height="518"}](https://1.bp.blogspot.com/-AB_DpxMwdsA/Wpp-7MlDxBI/AAAAAAAAIkc/aMsjWOP7GP84rHYy2fnTJCGszzx8d0PCACLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258A%25E5%258D%258812.47.21.png)
:::

<div>

我們就可以很輕易的把程式碼攔截下來，接著進到下一步驟做分析。

</div>

 Dropper 核心程式碼
-------------------

<div>

\

</div>

\
上面是完整攔截下來的 VBScript 的 Dropper 程式碼。\

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-uREjwUHyVoQ/Wpp_-tX7SrI/AAAAAAAAIko/M15tnL6xc-oKPzLUreiCRpXVvVsQIL23ACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.58.27.png){width="640"
height="430"}](https://3.bp.blogspot.com/-uREjwUHyVoQ/Wpp_-tX7SrI/AAAAAAAAIko/M15tnL6xc-oKPzLUreiCRpXVvVsQIL23ACLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.58.27.png)
:::

一開始執行起來這一段很好理解，基本就是把自己目前這份混淆過後的 \*.vbe
惡意腳本拷貝一份到 Windows
的「啟動目錄」來做到開機自動執行，自動下載惡意程式到本機執行（詳閱後面）\

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-8_KSHdcOTLQ/WpqA0yAyJgI/AAAAAAAAIkw/-m2N4gtzwx4xYPqNdshAF64r3IP4JuoygCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.58.49.png){width="640"
height="210"}](https://4.bp.blogspot.com/-8_KSHdcOTLQ/WpqA0yAyJgI/AAAAAAAAIkw/-m2N4gtzwx4xYPqNdshAF64r3IP4JuoygCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25886.58.49.png)
:::

這一部分就只是目標放置惡意程式的地方在 C:\\programdata
資料夾，所以展開其資料夾中每一個路徑看看資料夾是否存在，不存在的話就自動創建資料夾（避免後續放置檔案時失敗）\
\

::: {.separator style="clear: both; text-align: center;"}
[![](https://1.bp.blogspot.com/-mJcJqIBGxcg/WpqBUsydtTI/AAAAAAAAIk8/hBge0qda1mY-tifHdV3dz_o-53Dk-Jg9gCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25887.04.37.png){width="640"
height="338"}](https://1.bp.blogspot.com/-mJcJqIBGxcg/WpqBUsydtTI/AAAAAAAAIk8/hBge0qda1mY-tifHdV3dz_o-53Dk-Jg9gCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25887.04.37.png)
:::

接著是用 WMI 方式判別當前電腦的版本號是否為
XP，如果是就執行第一種行為，不是就執行第二種（不過看起來是大同小異，我直接分析
Win7+ 的行為）\

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-KuqrYwHmyds/WpqB82_MACI/AAAAAAAAIlI/aTQ4d9Aq_pAgnJ74MOWxZpqejJI3uxrbACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25887.07.19.png){width="640"
height="160"}](https://4.bp.blogspot.com/-KuqrYwHmyds/WpqB82_MACI/AAAAAAAAIlI/aTQ4d9Aq_pAgnJ74MOWxZpqejJI3uxrbACLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25887.07.19.png)
:::

::: {.separator style="clear: both; text-align: center;"}
:::

對，我知道我很偷懶，我完全不想解它的混淆，把看不懂的變數部分用 MsgBox
彈粗乃就可以發現它創建了 Wscript.Shell、MsxMl2.Http 與 ADODB.Stream
的結構實體，後續用於抓後門下來。\

::: {.separator style="clear: both; text-align: center;"}
[![](https://2.bp.blogspot.com/-a-7z9fqObzU/WpqCjH9UkOI/AAAAAAAAIlY/o4Fvifwwtb0UvriW9aM683HBKuuOAFqAQCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25887.09.43.png){width="640"
height="234"}](https://2.bp.blogspot.com/-a-7z9fqObzU/WpqCjH9UkOI/AAAAAAAAIlY/o4Fvifwwtb0UvriW9aM683HBKuuOAFqAQCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-03-03%2B%25E4%25B8%258B%25E5%258D%25887.09.43.png)
:::

最後透過 MsxMl2.Http
將「http://%77%77%77%2E%66%7A%66%7A%31%32%33%2E%75%73%61%2E%63%63/%69%6D%61%67%65%73.%67%69%66」（http://www.fzfz123.usa.cc/images.gif，實際上是一隻惡意程式）下載到
C:\\programdata\\opopopk.exe，然後透過「cmd /c set &&ping -n 10
127.0.0.1 &&start
C:\\ProgramData\\opopopk.exe」把這隻惡意程式給叫起來，完成 Dropper
的工作\
\
