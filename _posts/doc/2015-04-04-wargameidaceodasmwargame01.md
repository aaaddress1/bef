\-\-- layout: post title:
\"\[Wargame\]\[IDA\]\[CE\]\[OD\]\[ASM\]交大Wargame01，手拆題解（上集）\"
date: \'2015-04-04T02:30:00.000-07:00\' author: 聖豪馬 tags: - Crack -
OllyICE - CheatEngine - ASM - IDA - Wargame modified\_time:
\'2015-04-05T12:57:30.774-07:00\' thumbnail:
http://1.bp.blogspot.com/-IznHtKZr-Pk/VR-nOMX\_EKI/AAAAAAAAGIY/4mLcuYpvSzw/s72-c/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%884.55.02.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-259434442090083546
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/04/wargameidaceodasmwargame01.html
\-\--

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-IznHtKZr-Pk/VR-nOMX_EKI/AAAAAAAAGIY/4mLcuYpvSzw/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%884.55.02.png){width="640"
height="272"}](http://1.bp.blogspot.com/-IznHtKZr-Pk/VR-nOMX_EKI/AAAAAAAAGIY/4mLcuYpvSzw/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%884.55.02.png)
:::

首先這次這次的主角\
至於為啥我要拆這個呢\...因為有人不會解\...正好問我T\^T\
這種類型的wargame我一直都不怎麼會解XD 就當作練習看看了\
[\
](https://drive.google.com/file/d/0B1oHoqUSsP-bWGIwcTVaT3NRTTQ/view?usp=sharing)[下載題目（點我點我）](https://drive.google.com/file/d/0B1oHoqUSsP-bWGIwcTVaT3NRTTQ/view?usp=sharing)\
\
[![](http://3.bp.blogspot.com/-xpgd0Sj1z0I/VR-n-rItJ9I/AAAAAAAAGIg/e6evNqapgaQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%884.59.25.png){width="640"
height="300"}](http://3.bp.blogspot.com/-xpgd0Sj1z0I/VR-n-rItJ9I/AAAAAAAAGIg/e6evNqapgaQ/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%884.59.25.png)\
那麼首先題目要求是這樣的，希望輸入一組Name跟對應的序列（要求必須都是數字的序列），如果這組序列跟Name有對應關係就會跳出破解成功，反之就跳出"Try
Again！"\
如上圖所示\
\
那這個問題現在其實很明顯了，那我們該怎麼解呢\...\
首先，我的想法是先找出內存中的"Try Again！"的內存指針，找出誰引用它\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-60Qrzj3jo7c/VR-ohmb_lMI/AAAAAAAAGIo/bW5A2ssYuaE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.01.08.png){width="640"
height="134"}](http://2.bp.blogspot.com/-60Qrzj3jo7c/VR-ohmb_lMI/AAAAAAAAGIo/bW5A2ssYuaE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.01.08.png)
:::

那麼很快的開啟OllyICE的文字搜索引擎翻了一下就可以看到很敏感的三個文字在這\
逆著DEBUG追回去可以看到：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-wL9cnb2MLoU/VR-ozr7YpfI/AAAAAAAAGIw/UtlvkcLGOcA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.02.52.png){width="640"
height="348"}](http://4.bp.blogspot.com/-wL9cnb2MLoU/VR-ozr7YpfI/AAAAAAAAGIw/UtlvkcLGOcA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.02.52.png)
:::

看到這裡，找到了0x458800就是主要核心的文字判斷點了\
針對你的序列跟名字作演算後對應判斷正不正確的核心點\
所以我的直覺就是\...阿不就把Try Again的邏輯跳掉就好了嗎（？）\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-JCTzjiOGa1Q/VR-qBu0WD_I/AAAAAAAAGI8/XV6z950o-q8/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.08.09.png){width="640"
height="188"}](http://1.bp.blogspot.com/-JCTzjiOGa1Q/VR-qBu0WD_I/AAAAAAAAGI8/XV6z950o-q8/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.08.09.png)
:::

一個正常的破解者都會想到的做法XDDDDD\
淺顯易懂 直接Nop掉不就好了嗎～～關鍵點爆破 (Y)\
不過很快地把答案交給問我的人 就被打槍惹\
\
他說題目是：Name為HelloWorld時的Serial為多少？\
踏馬德聽到這個就頭痛啊\...(　ﾟдﾟ)\
吃了顆普拿疼後把程式拖進IDA\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-6gdE6fJZTws/VR-quAbf9OI/AAAAAAAAGJE/vnCNL0HKYso/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.10.57.png){width="640"
height="632"}](http://1.bp.blogspot.com/-6gdE6fJZTws/VR-quAbf9OI/AAAAAAAAGJE/vnCNL0HKYso/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.10.57.png)
:::

這邊可以看一下這個核心判斷點在幹嘛\...\
可以專注在 sub\_407774(v10, v4) ==
dword\_45B844這個，這邊是核心判斷序列到底正確不正確的位置，dword\_45B844這個應該是前面做HASH時的存放點，拿來跟sub\_407774()結果做比對，正確才會彈出破解成功\
\
可以翻一下sub\_407774在幹麻\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-ST5bLcqtuJ8/VR-sH1WdMVI/AAAAAAAAGJQ/ovo4ELRoQ-U/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.16.38.png){width="603"
height="640"}](http://2.bp.blogspot.com/-ST5bLcqtuJ8/VR-sH1WdMVI/AAAAAAAAGJQ/ovo4ELRoQ-U/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.16.38.png)
:::

再往內翻一層可以翻到sub\_4037E8內，它對v11做什麼\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-eAzHWWPORAc/VR-syqt6VAI/AAAAAAAAGJY/_YyGChHVQLY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.19.17.png){width="564"
height="640"}](http://4.bp.blogspot.com/-eAzHWWPORAc/VR-syqt6VAI/AAAAAAAAGJY/_YyGChHVQLY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.19.17.png)
:::

它對傳入的文字每個數值做單一的xor運算（對v3）然後再把最後HASH結果去跟dword\_45B844比對\
\
你會發現TMD繞這麼一大圈其實它也在對序列做數值的xor一次做檢查而已\
所以其實 sub\_407774(v10, v4) ==
dword\_45B844就不過是在比對使用者傳入的文字HASH後結果（sub\_407774）跟該名字（HelloWorld）做HASH後的正確解答（dword\_45B844）如果一樣就返回破解成功\
\
所以我們可以把名字輸入HelloWorld然後用Cheat Engine抓一下\
內存中dword\_45B844的值是多少\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-abj7GvUGIO4/VR-txfzuzeI/AAAAAAAAGJk/CEnxo7VmoGc/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.24.07.png){width="640"
height="464"}](http://2.bp.blogspot.com/-abj7GvUGIO4/VR-txfzuzeI/AAAAAAAAGJk/CEnxo7VmoGc/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.24.07.png)
:::

(　ﾟдﾟ)\...TMD原來答案是32960啊\....\
最後，結果是這樣：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-NbyyEkjm7fQ/VR-uFfvt1rI/AAAAAAAAGJs/Kva0wZ6O0ts/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.25.25.png){width="640"
height="368"}](http://4.bp.blogspot.com/-NbyyEkjm7fQ/VR-uFfvt1rI/AAAAAAAAGJs/Kva0wZ6O0ts/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-04-04%2B%E4%B8%8B%E5%8D%885.25.25.png)
:::

沒有做任何的inline hook或者patch，驗證後答案為32960\
(´Д\` )會出這種噁心題目的老師肯定心理對世界有什麼陰影啊\...\...\
\
後記：\
我前面其實根本沒想到那個位置直接就存答案了\...我想說應該沒那麼好心吧（？）這樣題目會不會太簡單，結果帶進去答案就出來了\....直覺就直接拿那個值來測了，算是直覺吧（？）\
不過這種題目有沒有更好的解法，麻煩各位大大再提供出來分享了m(\_ \_)m\
\
此篇有下集囉，想知道怎麼找出這題CrackMe的序列演算法？\
[\[Wargame\]\[IDA\]\[Python\]\[ASM\]\[CE\]交大Wargame01，用Python寫出序號機演算法（下集）](http://helloadr.blogspot.tw/2015/04/wargameidapythonasmcewargame01python.html)
