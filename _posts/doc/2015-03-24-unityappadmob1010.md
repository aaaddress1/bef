\-\-- layout: post title:
手拆Unity引擎開發的遊戲APP，拔除AdMob廣告模組（以1010!為例） date:
\'2015-03-24T10:07:00.003-07:00\' author: 聖豪馬 tags: - APK - Unity -
Crack - Android modified\_time: \'2015-03-24T10:10:30.746-07:00\'
thumbnail:
http://3.bp.blogspot.com/-A7mHi8qWNqA/VRGOj8LuhBI/AAAAAAAAGEg/UFB2IzL30uk/s72-c/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.18.56.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-6134668917586638759
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/03/unityappadmob1010.html \-\--
雖然我現在也是寫了一支APP，想看能不能靠AdMob賺點微薄的收入啦（？）\
感覺寫這篇部落格文有點沒品（？）\
[我寫的APP上架囉～義守學生管家！](https://play.google.com/store/apps/details?id=com.embarcadero.IsuHack)\
\
\
[]{#more}這邊以一支上架的小遊戲\
最近我在Google Store上找到的，還蠻喜歡的小遊戲XD\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-A7mHi8qWNqA/VRGOj8LuhBI/AAAAAAAAGEg/UFB2IzL30uk/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.18.56.png){width="361"
height="640"}](http://3.bp.blogspot.com/-A7mHi8qWNqA/VRGOj8LuhBI/AAAAAAAAGEg/UFB2IzL30uk/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.18.56.png)
:::

安裝完後，開啟遊戲畫面如下\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-lC4LhMr3s8M/VRGOxPH_-8I/AAAAAAAAGEo/jCL0-5see28/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.16.27.png){width="396"
height="640"}](http://2.bp.blogspot.com/-lC4LhMr3s8M/VRGOxPH_-8I/AAAAAAAAGEo/jCL0-5see28/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.16.27.png)
:::

就是遊戲畫面上方會有個Google的AdMob的廣告看起來討厭了一點\...\
那麼我們該怎麼逆向分析這種APP呢？\
\
首先把APK從模擬器撈出來\...然後看了一下結構：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-TyOsxVYeMQs/VRGPJ2t_QMI/AAAAAAAAGEw/BkX6ep2N45g/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.21.41.png){width="640"
height="406"}](http://4.bp.blogspot.com/-TyOsxVYeMQs/VRGPJ2t_QMI/AAAAAAAAGEw/BkX6ep2N45g/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.21.41.png)
:::

看起來是個蠻標準的APK架構嘛\...不過等等\...\
翻到assets資料底下一路翻到最內層會看到：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-TzudXErsQz4/VRGPbargXbI/AAAAAAAAGE4/B2MlsF1-U2w/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.22.51.png){width="640"
height="454"}](http://3.bp.blogspot.com/-TzudXErsQz4/VRGPbargXbI/AAAAAAAAGE4/B2MlsF1-U2w/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.22.51.png)
:::

看到了UnityEngine又看到了Mono還有mscorelib（微軟.NET
JIT解析核心）好開心啊～～\
原來這是用C\#搭Unity引擎寫出來的APP，所有編譯的Code都會轉成MSIL存放在Assembly-CSharp.dll跟Assembly-CSharp-firstpass.dll內。\
\
看到這裡，看來我們可以知道很明顯的一件事情是：\
重要的核心Code都放在這兩個.NET Dll內，其他所有物件跟資源都是框架\
\
好，那麼先把Assembly-CSharp.dll跟Assembly-CSharp-firstpass.dll兩個Dll單獨解壓縮出來囉\
接著搬出Windows上的.NET Reflector神器出來囉\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-t2Y4UHQpdew/VRGQez1qWhI/AAAAAAAAGFA/nXM01Rrkpz4/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.26.50.png){width="640"
height="490"}](http://1.bp.blogspot.com/-t2Y4UHQpdew/VRGQez1qWhI/AAAAAAAAGFA/nXM01Rrkpz4/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.26.50.png)
:::

很快翻一下，可以在Assembly-CSharp-firstpass.dll內翻到關於AdMob的模組\
接下來就對幾個AdMob的關鍵模組打Patch囉\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-nf0tg67c_pQ/VRGRWZYdz2I/AAAAAAAAGFI/CAo5lPFLA_o/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.31.07.png){width="640"
height="324"}](http://3.bp.blogspot.com/-nf0tg67c_pQ/VRGRWZYdz2I/AAAAAAAAGFI/CAo5lPFLA_o/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.31.07.png)
:::

首先翻到CreateBanner模組，開啟Reflexil插件直接把這個函數的MSIL開頭處直接下一個ret（也就是Offset
= 0那裡）讓這個函數變成空函數\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-15ionGiLDQo/VRGRw1o4IrI/AAAAAAAAGFQ/QBQNLRZm7nY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.32.41.png){width="640"
height="396"}](http://4.bp.blogspot.com/-15ionGiLDQo/VRGRw1o4IrI/AAAAAAAAGFQ/QBQNLRZm7nY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.32.41.png)
:::

接著，如法炮製對另個CreateBanner同名不同參數的函數一樣下ret讓它變空函數\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-a_adzeEmbBI/VRGSDUyL9sI/AAAAAAAAGFY/8wN0sc6FGZA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.34.07.png){width="640"
height="352"}](http://1.bp.blogspot.com/-a_adzeEmbBI/VRGSDUyL9sI/AAAAAAAAGFY/8wN0sc6FGZA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.34.07.png)
:::

RefreshAd函數也是\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-QhzVrDGdjS4/VRGSRXgLRdI/AAAAAAAAGFg/CqWwIW5sTyE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.34.59.png){width="640"
height="302"}](http://2.bp.blogspot.com/-QhzVrDGdjS4/VRGSRXgLRdI/AAAAAAAAGFg/CqWwIW5sTyE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.34.59.png)
:::

ReceiveAd函數也是\
\
最後還有一個最重要的\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-qavpfeE8NoE/VRGSlr3US-I/AAAAAAAAGFo/YiSGTcmp_0g/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.36.02.png){width="640"
height="276"}](http://4.bp.blogspot.com/-qavpfeE8NoE/VRGSlr3US-I/AAAAAAAAGFo/YiSGTcmp_0g/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.36.02.png)
:::

AdMobUIManager類別下的OnGUI()也將之清空為空函數\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-qKLzQi9OV7I/VRGS2yLwS5I/AAAAAAAAGFw/PSXMSlpxfEs/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.37.29.png){width="566"
height="640"}](http://2.bp.blogspot.com/-qKLzQi9OV7I/VRGS2yLwS5I/AAAAAAAAGFw/PSXMSlpxfEs/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.37.29.png)
:::

最後把剛剛辛苦處理完的打Patch回去DLL身上\
最後把DLL塞回去APK原本那個DLL（覆蓋過去）再重新替APK簽一個新的簽章上去\
\
成果：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-DaqiLSpl-YM/VRGTQKwwYLI/AAAAAAAAGF4/8h-x3T9yfaE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.10.10.png){width="384"
height="640"}](http://3.bp.blogspot.com/-DaqiLSpl-YM/VRGTQKwwYLI/AAAAAAAAGF4/8h-x3T9yfaE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-25%2B%E4%B8%8A%E5%8D%8812.10.10.png)
:::

\
[ＰＳ：如果想直接使用去廣告版本的1010！請點此做下載（Android）](https://drive.google.com/file/d/0B1oHoqUSsP-bcWlCbmFrRzhKYWM/view?usp=sharing)