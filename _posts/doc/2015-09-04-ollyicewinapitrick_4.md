\-\-- layout: post title: OllyICE模糊秒爆WINAPI呼叫點小Trick date:
\'2015-09-04T17:26:00.001-07:00\' author: 聖豪馬 tags: - OllyICE -
Windows - ASM modified\_time: \'2015-09-06T23:22:27.295-07:00\'
thumbnail:
http://2.bp.blogspot.com/-S04jpZahe98/Ve0sckPVZcI/AAAAAAAAHNM/ignNEQHICmU/s72-c/%25E7%25B4%25A2%25E5%25BC%2595.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-8637031580722834699
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/09/ollyicewinapitrick\_4.html \-\--
[**哪來的梗**]{style="font-size: x-large;"}\
\
\
這次要介紹的這個梗超級有趣der，這是我在AIS3聽課的時候覺得超有趣的梗興奮得不得不讓人發文紀錄一下XD。這個梗是AIS3的Day5
大可大神（膜拜一下）Demo怎麼速爆WIndows
Office彈出過期訊息的視窗的手法。\
\
\
\
那這是什麼梗呢，Office在檢測到沒有註冊的話，狀況會是這樣子的：\
\

``` {.brush: .cpp;}
if (Not Reggistered) 
{
Show NagDialog();
// if you press CTRL + F9, after window close will return to here.
}
```

\
\
可以知道Office會彈出一個類似NagDialog的物件顯示尚未註冊的訊息，但我們並不知道具體實作過程Call了哪些API、判斷條件、位置\...等，就可以用這個Trick。\
\
\
\
大可Demo用OllyICE開啟了Office並且等它彈出提示尚未授權的視窗，接著回到OllyICE按下暫停，此時可以明顯見到位置跳轉到一個很奇怪的system
call停住，接著狂按 (Ctrl + F9) \*
N次（執行返回）最後按下F9（執行）後就會看到OllyICE直接幫你斷點斷在API呼叫點上了。\
\
\
\
蛤？為什麼我用純文字形容？因為AIS3現場課程是不准攝影拍照der\...Q\_\_\_\_Q\
\
不過為了重現生動的追蹤手法，於是我用C++Builder實驗了一下這個Trick怎麼利用的XD\
\
\
\
**[實際手法利用]{style="font-size: x-large;"}**\
\
\
既然是要彈跳出一個視窗體，那麼我就用惡名昭彰的MessageBoxA()來做測試了XD\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-S04jpZahe98/Ve0sckPVZcI/AAAAAAAAHNM/ignNEQHICmU/s640/%25E7%25B4%25A2%25E5%25BC%2595.png){width="640"
height="308"}](http://2.bp.blogspot.com/-S04jpZahe98/Ve0sckPVZcI/AAAAAAAAHNM/ignNEQHICmU/s1600/%25E7%25B4%25A2%25E5%25BC%2595.png)
:::

\
不過這個Trick部分情況其實是有問題的（稍後會提到）那這邊我在窗體上寫了兩個按鈕，上方會呼叫原生WINAPI的MessageBoxA彈出訊息，而下方按鈕則是呼叫C++Builder的runtime自己實作的消息視窗（底層不走MessageBoxA）\
\
\
[**實驗**]{style="font-size: x-large;"}\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-4Hyy00-ym3E/Ve0sbiCP-xI/AAAAAAAAHNU/P7diAtT6LZk/s640/1%25E7%25B4%25A2%25E5%25BC%2595.png){width="640"
height="378"}](http://2.bp.blogspot.com/-4Hyy00-ym3E/Ve0sbiCP-xI/AAAAAAAAHNU/P7diAtT6LZk/s1600/1%25E7%25B4%25A2%25E5%25BC%2595.png)
:::

首先用OllyICE將軟體掛載起來，接著按下MessageBoxA的按鈕此時軟體透過MessageBoxA彈出窗體顯示文字，這時候我們回OllyICE上按下暫停鍵。\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-auRS6YTIzEc/Ve0sblvW9VI/AAAAAAAAHNE/aaadilxNHNo/s640/%25E7%25B4%25A22%25E5%25BC%2595.png){width="640"
height="246"}](http://1.bp.blogspot.com/-auRS6YTIzEc/Ve0sblvW9VI/AAAAAAAAHNE/aaadilxNHNo/s1600/%25E7%25B4%25A22%25E5%25BC%2595.png)
:::

這時候OllyICE幫你把線程暫停然後把該線程斷點在一個很奇怪的位置（這位置用Cheat
Engine查了一下是KiUserCallbackDispatcher的return上）接著Ctrl+F9按個5\~6次（不過我實際測試有時候用Alt+F9一次，返回到.text段就可以了），接著按下F9繼續執行。\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-Wj8AemS_eZc/Ve0sbvfmAxI/AAAAAAAAHNQ/oyUQPaNMqOw/s640/3%25E7%25B4%25A2%25E5%25BC%2595.png){width="640"
height="350"}](http://3.bp.blogspot.com/-Wj8AemS_eZc/Ve0sbvfmAxI/AAAAAAAAHNQ/oyUQPaNMqOw/s1600/3%25E7%25B4%25A2%25E5%25BC%2595.png)
:::

接著就可以看到OllyICE直接幫你把斷點斷在API返回點上了XD，這招好用在哪？不一定每支程式都會用MessageBoxA這種明顯知道的API可能用其他很奇怪偏僻冷門API變得你很難猜它用哪個API，這招可以很容易追回判斷點、分析程式。\
\
\
\
[**例外**]{style="font-size: x-large;"}\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-1jKQY7JESGc/Ve0schCYnhI/AAAAAAAAHNY/ccY1xMSs3ns/s640/%25E7%25B4%25A24%25E5%25BC%2595.png){width="640"
height="330"}](http://4.bp.blogspot.com/-1jKQY7JESGc/Ve0schCYnhI/AAAAAAAAHNY/ccY1xMSs3ns/s1600/%25E7%25B4%25A24%25E5%25BC%2595.png)
:::

如果是使用第三方runtime包好的API呢？這邊測試了呼叫C++Builder的runtime內的ShowMessage()，發現如果你做暫停然後再Alt+F9或者Ctrl+F9它都無法自動回追XD。\
\
\
後來實際肉工跟蹤了一下會發現C++Builder官方的ShowMessage函數內用了一個int
0x2B結果OllyICE跟蹤到那個點上\...\
\
就跟丟了、[就跟丟了、]{style="font-size: large;"}[就跟丟了]{style="font-size: x-large;"}\
\
\
總之覺得這還蠻有趣的XD 整理一下心得分享XD\
\
\
\
\