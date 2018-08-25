\-\-- layout: post title: \"\[CTF\]\[Pwn\]\[BoF\] AIS3 Pre-Exam
Pwn3D\_1\" date: \'2015-07-26T11:53:00.002-07:00\' author: 聖豪馬 tags:
- BOF - CTF - Pwn modified\_time: \'2015-07-26T11:53:56.376-07:00\'
thumbnail:
http://2.bp.blogspot.com/-fNr3eY19K84/VbUmk5pzCYI/AAAAAAAAGoU/JZWibBwdqhE/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.25.57.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-7064052482371647368
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/07/ctfpwnbof-ais3-pre-exam-pwn3d1.html
\-\--
大神請路過Q\_\_\_Q，這是第一次解Pwn類型題目，想說太久沒發發廢文了，\
所以就把分析過程記錄下來惹\
\
是說之前摸BoF都沒用上場，沒想到第一次派上用場是在這種時候XD\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-fNr3eY19K84/VbUmk5pzCYI/AAAAAAAAGoU/JZWibBwdqhE/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.25.57.png){width="640"
height="62"}](http://2.bp.blogspot.com/-fNr3eY19K84/VbUmk5pzCYI/AAAAAAAAGoU/JZWibBwdqhE/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.25.57.png)
:::

\
題目給的檔案載下來之後，終端機下：file pwn1，可以得知是一個可執行的ELF
x64bit在Linux下的文件，接著拖進IDA Pro For
x64，熱鍵：Shift+F12檢視所有文字資源，如下圖：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-JrCTRJAYxqA/VbUnT1j_-aI/AAAAAAAAGoc/1mgRwm5rfIA/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.30.18.png){width="640"
height="208"}](http://4.bp.blogspot.com/-JrCTRJAYxqA/VbUnT1j_-aI/AAAAAAAAGoc/1mgRwm5rfIA/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.30.18.png)
:::

\
很快可以找到主機用nc連線上去時回應的"Input Your Name"點擊後會看見：\
[![](http://3.bp.blogspot.com/-KL53mpOMPBI/VbUoAqgo_xI/AAAAAAAAGow/1xY4AsXP0w0/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.33.40.png){width="640"
height="98"}](http://3.bp.blogspot.com/-KL53mpOMPBI/VbUoAqgo_xI/AAAAAAAAGow/1xY4AsXP0w0/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.33.40.png)\
\
可以看見字串的資源位置，點擊後方Data Xref可以找到呼叫參考來源：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-WOtcdmto9DQ/VbUoZOolLAI/AAAAAAAAGpA/SB-txVVbqcw/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.35.08.png){width="640"
height="258"}](http://4.bp.blogspot.com/-WOtcdmto9DQ/VbUoZOolLAI/AAAAAAAAGpA/SB-txVVbqcw/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.35.08.png)
:::

\
F5照妖鏡下去，IDA Pro分析如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-lCCUSF4dHv8/VbUpIvByaTI/AAAAAAAAGpI/ohfgBkYHHog/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.38.03.png){width="640"
height="342"}](http://3.bp.blogspot.com/-lCCUSF4dHv8/VbUpIvByaTI/AAAAAAAAGpI/ohfgBkYHHog/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.38.03.png)
:::

可以看到伺服器上回應的程式puts出"Input Your
Name"後，做scanf把使用者傳入的Data寫入v1內（應該是char
array？）接著就判斷v4是否為0x90909090，是就噴Flag否則就告訴你目前的v4的值為多少（如果沒控制成功，預設會是10）\
\
這邊可以得知的是唯一跟使用者傳入（可控）的是v1，接著我們想控制的是一個被宣告為DWORD的v4（4個BYTE），接著回到組合語言狀態下觀看：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-gl4FHiTeZ_s/VbUqcWpupMI/AAAAAAAAGpU/ctlqCfG3Mas/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.43.57.png){width="640"
height="158"}](http://3.bp.blogspot.com/-gl4FHiTeZ_s/VbUqcWpupMI/AAAAAAAAGpU/ctlqCfG3Mas/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.43.57.png)
:::

\
這邊可以得知v1（Buffer）地址為+0x20而v4地址則為+0x04，也就是兩個偏移量差了32
- 4 = 28個BYTE，所以我們可以這樣傳入使用者測資來控制v4：\
\[\...\.....共28個字元塞滿(隨便塞)\...\.....\]\[要控制的v4值,4BYTE\]\
\
所以本來我很開心的就nc上去然後丟Data：\
\...\...\...\...\...\...\...\...\....\\x90\\x90\\x90\\x90\
結果後來發現它不會把跳脫字元轉換為ascii
XD，於是又想說，那不如查0x90對應ascii填上去吧？結果我傳入：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-vDMznL9ssxg/VbUr_OzkrqI/AAAAAAAAGpg/OgBB4O-MasY/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.50.30.png){width="640"
height="95"}](http://1.bp.blogspot.com/-vDMznL9ssxg/VbUr_OzkrqI/AAAAAAAAGpg/OgBB4O-MasY/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.50.30.png)
:::

沒想到v4的值被改成了0x90C290C2（具體原因是什麼不清楚QQ，應該是因為文字傳送會有文字處理傳輸的問題），後來爬了一下才得知可以這樣下命令：\
 echo -e \"\...\...\...\...\...\...\...\...\....\\x90\\x90\\x90\\x90\"
\| nc ip port\
\
-e會把跳脫字元處理成BYTE然後傳輸過去就沒有這個問題惹，收工
