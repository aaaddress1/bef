\-\-- layout: post title: \"\[OSX\]\[ASM\]初探Mac
OSX軟件爆破（GDB遠程調試＋反匯編＋打補丁）\" date:
\'2015-02-17T15:10:00.003-08:00\' author: 聖豪馬 tags: - OSX - ASM
modified\_time: \'2015-02-17T15:10:29.914-08:00\' thumbnail:
http://4.bp.blogspot.com/-aRE8TyJDrnU/VOPAAHxyM6I/AAAAAAAAF1c/rQGnGVMCjIM/s72-c/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.25.20.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-165068065072633830
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/02/osxasmmac-osxgdb.html \-\--
為什麼會有這篇文產生呢，\
純粹因為一直很想摸OSX的App逆向\
不過又沒有入門\
對岸跟台灣基本上根本沒有文章可以參考\...變得入門很難\
去找了幾篇國外原文然後花一兩個小時摸摸～這篇算是簡略心得文（？）\
\
是說破完之後發現其實OSX幾乎呈現0保護狀態耶XD\
OSX的軟體都還蠻好破解的\...\
不像MicroSoft被一堆大牛們破解到怕了XD所以Windows超多防護機制\
（也很多廠商推出混淆、虛擬機\...等手法來反破解這樣）\
\
本身有Windows逆向工程底子的人來摸其實還蠻快就上手惹\
會覺得OSX之後會不會像多多鳥一樣很可愛、然後變成下一個Windows的命運XD?\
＿＿＿＿＿＿＿＿＿＿＿＿我是分割線＿＿＿＿＿＿＿＿＿＿＿＿\
所以這算是筆記吧（？）\
在逆向之前總得有個可憐的孩子被逆向，\
不過因為我很菜\...不會醜到爆的Obj-C、噁爛的Swift（它真的看起來超像Shift的）\
所以我這邊是用C++Builder的跨平台FireMonkey專案開發了一支小App做測試\
\
首先我在VM內寫Code\
設計超級他媽簡單\...就只有一個按鈕\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-aRE8TyJDrnU/VOPAAHxyM6I/AAAAAAAAF1c/rQGnGVMCjIM/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.25.20.png){width="640"
height="400"}](http://4.bp.blogspot.com/-aRE8TyJDrnU/VOPAAHxyM6I/AAAAAAAAF1c/rQGnGVMCjIM/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.25.20.png)
:::

按鈕內響應的事件：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-d8-MyvHtD1c/VOPAKGqUcKI/AAAAAAAAF1k/Q3p3lYa-0OI/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.26.34.png){width="640"
height="298"}](http://1.bp.blogspot.com/-d8-MyvHtD1c/VOPAKGqUcKI/AAAAAAAAF1k/Q3p3lYa-0OI/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.26.34.png)
:::

整個做的事情非常簡單。把a的值設為1，b的值設為2\
假設a跟b相等則彈出"Happy"的視窗；若不相等則彈出"Angry\"的視窗。\
不過因為a跟b本來就永遠都不可能相等所以永遠都只會彈出angryangryangryangryangryangryangryangryangryangryangryangryangryangry\
\
接著用Xcode跟VM的C++Builder遠程連機然後編譯：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-lqx8lI6dKng/VOPBA2oI1_I/AAAAAAAAF1s/l-Ia6WoOPRM/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.30.09.png){width="640"
height="518"}](http://3.bp.blogspot.com/-lqx8lI6dKng/VOPBA2oI1_I/AAAAAAAAF1s/l-Ia6WoOPRM/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.30.09.png)
:::

長出了一個野生的視窗，上面的按鈕按下去，視窗永遠看起來很生氣的樣子\
\
接著就是調適的部分了\
我這邊用的是Hopper Dissasmbler付(ㄆㄛˋ)費(ㄐㄧㄝˇ)版\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-8UAtk8xyaD0/VOPBUBhm5RI/AAAAAAAAF10/Ar6T3Mkei64/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.31.24.png){width="640"
height="400"}](http://1.bp.blogspot.com/-8UAtk8xyaD0/VOPBUBhm5RI/AAAAAAAAF10/Ar6T3Mkei64/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.31.24.png)
:::

不要跟我要，網路上找一下就有惹XD\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-M7sv5VzM5SE/VOPCKsdzEDI/AAAAAAAAF18/02adXgy597U/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.34.56.png){width="640"
height="320"}](http://1.bp.blogspot.com/-M7sv5VzM5SE/VOPCKsdzEDI/AAAAAAAAF18/02adXgy597U/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.34.56.png)
:::

接著載入今天主角\...翻了一下它的外導函數很快就可以找到Button\_Click的事件惹\
（不要問我為啥外導函數這麼醜，去問問CBuilder官方T\_\_T，CBuilder生產出來的東西外導函數都很ㄐㄅ醜）\
\
接著可以看到Button\_Click的asm Code怎麼跑的\
不過Hopper的反匯編能力還不錯，可以幫你把asm逆推回C++ Code看邏輯怎麼跑\
如果你的asm功力頗菜可以參考一下XD\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-RLoZ3596fpo/VOPDjq7oZpI/AAAAAAAAF2M/u5kQ4AFQpgQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.40.13.png){width="640"
height="424"}](http://1.bp.blogspot.com/-RLoZ3596fpo/VOPDjq7oZpI/AAAAAAAAF2M/u5kQ4AFQpgQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.40.13.png)
:::

可以從反匯編上看到雖然我們C++ Builder的Source寫得很簡單\
不過在程式被編譯完後asm是這麼跑的：\
先把var\_m12賦予值 = 1 （變數a）、var\_m16賦予值 = 2 （變數b）\
接著比對如果var\_m12跟var\_m16相等，則把暫存器EDX設為0x2bd32\
若兩者不相等則設為0x2bd38（這兩者其實就是\"Angry\"跟\"Happy\"的文字記憶體位置）\
最後再透過[\@System\@UnicodeString
API（我猜是CBuilder官方自己搞出來的函數）把var\_m20的文字從EDX位置上Copy進去，最後才透過]{style="font-family: Menlo; font-size: 14px;"}[Fmx\@Dialogs\@ShowMessage
API把文字給彈出來]{style="font-family: Menlo; font-size: 14px;"}\
\
然後在Button\_Click事件上下斷點（F9）\
這邊比較特別的是\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-_QbTyOipU08/VOPC_ZwpFZI/AAAAAAAAF2E/SuhEw-bUWIg/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.38.39.png){width="640"
height="508"}](http://2.bp.blogspot.com/-_QbTyOipU08/VOPC_ZwpFZI/AAAAAAAAF2E/SuhEw-bUWIg/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.38.39.png)
:::

例如說Cheat Engine下斷點是F5 單步F7 躍過F8 執行F9\
OD是斷點F2 單步F7 躍過F8 執行F9\
不過Hopper是斷點F9 單步F7 躍過F8 執行F5\
\
然後使用GDB遠程CreateProcess\
是說這邊蠻哭爸的事情是\...GDB一開始初始化好像不會幫你在Entry下一個暫停\
所以UI會直接彈出來，沒有讓你去跟蹤Entry怎麼跑的\
然後我們去按那個超大粒的按鈕，就會觸發Debugger訊息傳回GDB然後暫停\
（而且速度超慢der\...不知道他們怎麼通訊的，Windows底下OD、CE在調適都超快）\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-K8mtI-BwPd0/VOPF7eQcxmI/AAAAAAAAF2Y/OKgiMbualcw/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.51.01.png){width="640"
height="400"}](http://2.bp.blogspot.com/-K8mtI-BwPd0/VOPF7eQcxmI/AAAAAAAAF2Y/OKgiMbualcw/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.51.01.png)
:::

然後GDB Catch到Debugger Event之後，就可以用F7F7F7F7F7F7跟蹤啦～\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-lkPCw6c0brY/VOPGSHjGw7I/AAAAAAAAF2g/Frjgx36f9c4/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.52.23.png){width="640"
height="104"}](http://1.bp.blogspot.com/-lkPCw6c0brY/VOPGSHjGw7I/AAAAAAAAF2g/Frjgx36f9c4/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.52.23.png)
:::

接著跟蹤到底下很快就可以看到asm code這邊對兩個記憶體變數做比對\
不相等就跳到0x14b5f做\"Angry\"文字記憶體位置導到EDX內，否則就繼續跑到0x14b57做導入\"Happy\"文字記憶體位置到EDX內\
\
接著底下繼續跑就會處理ShowMessage()函數的呼叫了\
我們可以看一下GDB跑到JNE上的時候的EIP\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-ROHZ9EKXhoM/VOPHJSPNrJI/AAAAAAAAF2o/NBuJlmoj2jE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.56.18.png){width="640"
height="354"}](http://2.bp.blogspot.com/-ROHZ9EKXhoM/VOPHJSPNrJI/AAAAAAAAF2o/NBuJlmoj2jE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.56.18.png)
:::

這時候如果我們幫它把即將閱讀的0x14b55改為0x14b57\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-Ce-iUC5869k/VOPHdMhpD6I/AAAAAAAAF20/SgmS5EYhhfY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.57.34.png){width="640"
height="362"}](http://2.bp.blogspot.com/-Ce-iUC5869k/VOPHdMhpD6I/AAAAAAAAF20/SgmS5EYhhfY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.57.34.png)
:::

在GDB上把EIP改為0x14b57之後可以看到Hopper同步讀取點跳到了0x14b57\
成功繞掉了JNE那行了～按F5跑跑看\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-5ehUrbqzKgA/VOPHxqH1LQI/AAAAAAAAF28/Hz42EVEp95w/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.59.04.png){width="640"
height="502"}](http://4.bp.blogspot.com/-5ehUrbqzKgA/VOPHxqH1LQI/AAAAAAAAF28/Hz42EVEp95w/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%886.59.04.png)
:::

看見視窗很開心的說Happy惹\
所以很明顯今天要幹的事情就是把跳入0x14b5f給取消掉\
幫它補上兩個nop（原本JNE是短跳所以佔用兩個BYTE）\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-dP9Xh34m7gQ/VOPIQZ8tlVI/AAAAAAAAF3E/NO91aVo5CXQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%887.00.41.png){width="640"
height="208"}](http://2.bp.blogspot.com/-dP9Xh34m7gQ/VOPIQZ8tlVI/AAAAAAAAF3E/NO91aVo5CXQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%887.00.41.png)
:::

\
最後測試一下，ＯＫ，沒問題\
把Patch好的執行擋用Hopper生出來，然後塞回去原本的程式裡面\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-wJOQ_skARMs/VOPI0TQpnqI/AAAAAAAAF3U/y8YGIAdIGTo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%887.03.05.png){width="640"
height="422"}](http://3.bp.blogspot.com/-wJOQ_skARMs/VOPI0TQpnqI/AAAAAAAAF3U/y8YGIAdIGTo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-02-18%2B%E4%B8%8A%E5%8D%887.03.05.png)
:::
