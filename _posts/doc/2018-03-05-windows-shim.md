\-\-- layout: post title: \'Windows Shim (ACT) 在 Windows10 下禁止
Inject Dll 系統實作細節原因 \' date: \'2018-03-05T12:59:00.000-08:00\'
author: 聖豪馬 tags: - PE - Loader - Windows - Shim modified\_time:
\'2018-03-05T14:13:36.593-08:00\' thumbnail:
https://2.bp.blogspot.com/-ZgYstVdUKAU/Wp2ytGS\_lsI/AAAAAAAAImI/2QoxomzxCww7TKNbG-zp9Ymi68Xnxp8zgCLcBGAs/s72-c/%25E6%2593%25B7%25E5%258F%2596.PNG
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-893404230718577992
blogger\_orig\_url:
http://helloadr.blogspot.com/2018/03/windows-shim.html \-\--

前言
----

<div>

如果你對 Windows Shim (ACT)
不熟是什麼，建議你可以先參考這篇：[详解Windows
Shim的攻防利用](http://www.freebuf.com/articles/system/114287.html)，這篇很不錯的介紹了
Windows Shim
相容性工具如何被惡意濫用進行攻擊。另外還有一篇俄羅斯的文章介紹的也不錯：[shim
handlers](http://redplait.blogspot.tw/2011/04/shim-handlers.html)。

</div>

<div>

\

</div>

<div>

前陣子在做一份玩具需要做到對單一 Process 每次開機重啟都能穩定 hook
住固定 API 作檢測，第一個想到最穩定的做法當然是 TMD
幫該執行程式打一層補丁 (Shim) 指定該 Process 每次開機重啟都會加載我的
\*.dll，接著就可以做熱修復（Hot Patch）這做法很漂亮，一個簡單 \*.sdb
就能簡單起到穩定的 \*.dll 同一 Process 穩定注入，不過\...

</div>

<div>

\

</div>

<div>

對，Windows 10 不給玩這招了，你在 Windows 10 下打上 Inject Dll
的補丁是會被無視的 QQ，最近時間比較充裕
~~並沒有，只是突然很想知道為什麼不給這樣搞 ~~ 花了大概一小時的時間把
Windows 7 與 Windows 10 的 Loader
實作細節分析完畢，然後就大概摸出了問題點在哪\...囧。

</div>

<div>

\

</div>

PE Loader (at ntdll.dll) on Windows 7
-------------------------------------

<div>

如果你跟我一樣吃飽太閒（不過其實打這篇文章的時候我好餓喔\...好想吃滷肉飯）翻一下
ntdll.dll 的實作你應該可以看到一支 \*.exe
被執行起來後，要開始做程式必備初始化的修復動作，這些步驟可以看到在
ntdll!LdrpInitializeProcess 內實作：

</div>

<div>

[![](https://2.bp.blogspot.com/-ZgYstVdUKAU/Wp2ytGS_lsI/AAAAAAAAImI/2QoxomzxCww7TKNbG-zp9Ymi68Xnxp8zgCLcBGAs/s640/%25E6%2593%25B7%25E5%258F%2596.PNG){width="640"
height="576"}](https://2.bp.blogspot.com/-ZgYstVdUKAU/Wp2ytGS_lsI/AAAAAAAAImI/2QoxomzxCww7TKNbG-zp9Ymi68Xnxp8zgCLcBGAs/s1600/%25E6%2593%25B7%25E5%258F%2596.PNG)

</div>

<div>

\

</div>

<div>

如果你有開 IDA Pro 的話上下捲捲捲就可以看到這個函數內在初始化 Process
時候，會按造順序分配堆疊必備的記憶體空間、分配各區段對應在虛擬地址上、修正重定向、最後修正了引入函數表（IAT,
Import Address Table）而這幾大修正步驟過程中，根據 Shim
的需求可能會需要在載入 DLL
之前、期間、之後，各階段插入不同的行為來完成打補釘的行為。

</div>

<div>

\

</div>

<div>

每次要讓 Shim 機制介入打補釘時，就會呼叫 ntdll!LdrpLoadShimEngine
函數來載入 Shim 引擎，如果完成該階段的目標後，就會呼叫
ntdll!LdrpUnloadShimEngine 來卸載 Shim 引擎，而 LdrpLoadShimEngine
內部實作是這樣子的：

</div>

<div>

\

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://1.bp.blogspot.com/-24w6Qs6zmzY/Wp20edqlWqI/AAAAAAAAImU/ejk49bnkQ5El9oLhb3gAARPlXyG5PwOigCLcBGAs/s640/%25E6%2593%25B7%25E5%258F%2596.PNG){width="640"
height="564"}](https://1.bp.blogspot.com/-24w6Qs6zmzY/Wp20edqlWqI/AAAAAAAAImU/ejk49bnkQ5El9oLhb3gAARPlXyG5PwOigCLcBGAs/s1600/%25E6%2593%25B7%25E5%258F%2596.PNG)
:::

<div>

你可以看到大致上透過  LdrpLoadDll 呼叫
C:\\Windows\\System32\\shimeng.dll（事實上如果你的 Windows 有打過
Patch，你應該可以在 C:\\Windows\\ 下找到其他
shimeng.dll，那才是真正你現在電腦正在運行的版本，微軟爸爸的安全更新幫你做熱修復升級強制替換的新版
shimeng.dll）。接著呼叫了
LdrpGetShimEngineInterface()，然後確定當前系統是否有開啟 Shim 補釘機制。

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-B2VbDjUyFzY/Wp22Aj-JowI/AAAAAAAAImg/2lj12Wxv_LkFstNC-jHmC8zJjtqO3rZlwCLcBGAs/s640/%25E6%2593%25B7%25E5%258F%2596.PNG){width="640"
height="636"}](https://4.bp.blogspot.com/-B2VbDjUyFzY/Wp22Aj-JowI/AAAAAAAAImg/2lj12Wxv_LkFstNC-jHmC8zJjtqO3rZlwCLcBGAs/s1600/%25E6%2593%25B7%25E5%258F%2596.PNG)
:::

<div>

\

</div>

<div>

LdrpGetShimEngineInterface() 內部實作，即嘗試動態初始化各個 Shim
各階段執行需要的必備函數，並且將查 shimeng.dll
取得外導函數表幾個會用到的 API 地址，透過 EncodeSystemPointer
函數保存在全域變數中。

</div>

<div>

\

</div>

<div>

所以這邊就可以大概知道實作部分接著就是在 ntdll!LdrpInitializeProcess
內完成各階段步驟時，甚至是 Process 被通知得「被自殺」時，呼叫對應的 Shim
Engine API 來完成動態補丁實作。

</div>

ShimEng.dll on Windows 7
------------------------

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-jeTeljz3doc/Wp23h1_L5dI/AAAAAAAAIms/wRNFFt8f2CM00ujLgIg71t7cNHwrO72mQCLcBGAs/s640/%25E6%2593%25B7%25E5%258F%2596.PNG){width="640"
height="526"}](https://3.bp.blogspot.com/-jeTeljz3doc/Wp23h1_L5dI/AAAAAAAAIms/wRNFFt8f2CM00ujLgIg71t7cNHwrO72mQCLcBGAs/s1600/%25E6%2593%25B7%25E5%258F%2596.PNG)
:::

<div>

接著你可以翻一下 ShimEng.dll 的外導函數表，你會發現所有 API
根本都是他媽的 appHelp.dll 的實作，ShimEng.dll
內部根本不參與任何實作！~~幹，超級拖台錢~~

</div>

<div>

AppHelp.dll on Windows 7
------------------------

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-oSzNOiRQ2is/Wp24fiizMUI/AAAAAAAAIm0/VXS-T-bLDtA2gXp-YN7WrQfh8GXjcAuXQCLcBGAs/s640/%25E6%2593%25B7%25E5%258F%2596.PNG){width="640"
height="552"}](https://3.bp.blogspot.com/-oSzNOiRQ2is/Wp24fiizMUI/AAAAAAAAIm0/VXS-T-bLDtA2gXp-YN7WrQfh8GXjcAuXQCLcBGAs/s1600/%25E6%2593%25B7%25E5%258F%2596.PNG)
:::

<div>

\

</div>

<div>

安安，所以會發現始作俑者都是 AppHelp.dll 啦。Shim
整個機制的函數實作都放在 AppHelp.dll 內，並且你想要「自己以 C/C++
製造一個 \*.sdb 補丁文件」也是可以透過 AppHelp.dll 開放的 Sdb
系列函數來快速生產 \*.sdb 補丁文件。

</div>

<div>

\

</div>

<div>

好，所以重點是什麼？重點在 AppHelp!SE\_InstallBeforeInit 實作上：

</div>

<div>

\

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-fUv7rJD1Ux4/Wp2-rHarqzI/AAAAAAAAInM/kOCyRHj-xxIv0M0oghd-9ji5z9GsYhS1gCLcBGAs/s640/%25E6%2593%25B7%25E5%258F%2596.PNG){width="640"
height="288"}](https://4.bp.blogspot.com/-fUv7rJD1Ux4/Wp2-rHarqzI/AAAAAAAAInM/kOCyRHj-xxIv0M0oghd-9ji5z9GsYhS1gCLcBGAs/s1600/%25E6%2593%25B7%25E5%258F%2596.PNG)
:::

<div>

\

</div>

<div>

這邊在 AppHelp!SE\_InstallBeforeInit 實作內呼叫了 AppHelp!SeiInit：

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-fPhgLCWsnV4/Wp2_Ow5mqnI/AAAAAAAAInU/7WSD9Vt-4IA2R2rhyY5Hk2kBHmu_6-4ogCLcBGAs/s640/%25E6%2593%25B7%25E5%258F%2596.PNG){width="640"
height="368"}](https://3.bp.blogspot.com/-fPhgLCWsnV4/Wp2_Ow5mqnI/AAAAAAAAInU/7WSD9Vt-4IA2R2rhyY5Hk2kBHmu_6-4ogCLcBGAs/s1600/%25E6%2593%25B7%25E5%258F%2596.PNG)
:::

<div>

然後 AppHelp!SeiInit
內部實作有一個超他媽巨大迴圈負責跑完整個目前已註冊的 \*.sdb 中這支
Process 需要注入哪些 Dll。\
\

</div>

<div>

[AppHelp.dll on Windows
10]{style="-webkit-text-stroke-width: 0px; background-color: transparent; color: black; display: inline !important; float: none; font-family: Times New Roman; font-size: 24px; font-style: normal; font-variant: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: left; text-decoration: none; text-indent: 0px; text-transform: none; white-space: normal; word-spacing: 0px;"}\
[]{style="-webkit-text-stroke-width: 0px; background-color: transparent; color: black; display: inline !important; float: none; font-family: Times New Roman; font-size: 24px; font-style: normal; font-variant: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: left; text-decoration: none; text-indent: 0px; text-transform: none; white-space: normal; word-spacing: 0px;"}

</div>

<div>

[]{style="-webkit-text-stroke-width: 0px; background-color: transparent; color: black; display: inline !important; float: none; font-family: Times New Roman; font-size: 24px; font-style: normal; font-variant: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: left; text-decoration: none; text-indent: 0px; text-transform: none; white-space: normal; word-spacing: 0px;"}

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-jL7s9QzKluk/Wp3ASEgZ8WI/AAAAAAAAIng/7vYauE1ZExYNVLdOTwf4-vtUIMnVLNZCACLcBGAs/s640/%25E6%2593%25B7%25E5%258F%2596.PNG){width="640"
height="418"}](https://4.bp.blogspot.com/-jL7s9QzKluk/Wp3ASEgZ8WI/AAAAAAAAIng/7vYauE1ZExYNVLdOTwf4-vtUIMnVLNZCACLcBGAs/s1600/%25E6%2593%25B7%25E5%258F%2596.PNG)
:::

沒有錯啦！Windows 10 上面整個邏輯大改，負責加載 \*.sdb
注入函數的那個迴圈邏輯通通不見了啦！！！！就跟你的腹肌一樣不曾存在過啦！！！！！看到這邊整個氣到彈出來，可以看到
Windows 10 上面 AppHelp.dll 只實作了呼叫 LdrLoadDll 函數 + API 定位來做
Shim 裡面的函數劫持功能而已，原本負責注入的邏輯整個被拔掉了 RRRRRR

</div>
