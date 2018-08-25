\-\-- layout: post title:
\"\[C++Builder\]解決Firemonkey跨平台專案無法實機發佈軟體到iPhone設備上DEBUG\"
date: \'2015-03-08T11:05:00.000-07:00\' author: 聖豪馬 tags: - CBuilder
- Firemonkey - iOS - CPlus modified\_time:
\'2015-06-01T04:43:40.394-07:00\' thumbnail:
http://1.bp.blogspot.com/-s9WZdNpkLBQ/VPyLK-fiQyI/AAAAAAAAGCw/jeZeh6MgMoY/s72-c/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%881.46.45.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-8613896383552957964
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/03/cbuilderfiremonkeyiphonedebug.html
\-\-- 原先一開始我的專案需求\
只專門測試了軟體可以跑在Android、Windows、OSX上面\
所以PAServer什麼的都已經弄好了\
\
因為ADR很窮\...只有Android手機，後來跟朋友借到一隻iPhone5（有JB），發現選到iOS
Device並且Macbook
Pro已經正確跟iPhone連線上，PAServer也正確啟動服務可以遠端聯繫了，卻出現：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-s9WZdNpkLBQ/VPyLK-fiQyI/AAAAAAAAGCw/jeZeh6MgMoY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%881.46.45.png){width="640"
height="400"}](http://1.bp.blogspot.com/-s9WZdNpkLBQ/VPyLK-fiQyI/AAAAAAAAGCw/jeZeh6MgMoY/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%881.46.45.png)
:::

這問題很雷，特雷\
因為這個問題去查Google有九成以上的台灣Blog介紹C++ Builder開發iOS
App是沒有介紹這個問題該怎麼解決的\...（應該直接了當的說台灣沒幾隻貓在寫C++
Builder開發的iOS App部落格的感覺\...）\
\
仔細看了一下編譯噴錯的原因：\
iphone developer no identity
found（blablabla以下省略超多字）大略意思是在遠端調試的時候，一個叫做iPhoneDeveloper的程式無法正確被傳遞參數並且把App傳入iOS設備導致的\
\
翻了一下PAServer目錄底下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-qfqUnaNg3Bc/VPyMTLSJ47I/AAAAAAAAGC4/pdRVYZ9Diak/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%881.51.53.png){width="400"
height="163"}](http://3.bp.blogspot.com/-qfqUnaNg3Bc/VPyMTLSJ47I/AAAAAAAAGC4/pdRVYZ9Diak/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%881.51.53.png)
:::

其實App還有簽章之類的內容PAServer早就幫你弄好了\...只是app沒辦法放進去\
這時候有兩種做法：\
\
1.有JB狀況下\
可選擇再新增一個\"payload\"的資料夾並且把.app放進去裡面，最後把payload資料夾與另外兩個檔案用壓縮的方式壓縮成一個解壓縮包，並且把副檔名改為.ipa\
\
2.修正iPhonedeveloper無法被喚起的問題\
後來爬了大概快四十幾篇文，後來在對岸論壇爬到問題應該出在權限不足沒有簽章權限問題，解決方法如下\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-LRMmtxy1eg8/VPyNk5sXroI/AAAAAAAAGDA/YpXcGeT7sZo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%881.56.42.png){width="640"
height="400"}](http://1.bp.blogspot.com/-LRMmtxy1eg8/VPyNk5sXroI/AAAAAAAAGDA/YpXcGeT7sZo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%881.56.42.png)
:::

首先開啟你的Laucher找到系統程式的"鑰匙圈存取"\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-UKwcVGroV8w/VPyOPOk5P9I/AAAAAAAAGDM/SjQL1hFOz4U/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%882.00.06.png){width="640"
height="370"}](http://2.bp.blogspot.com/-UKwcVGroV8w/VPyOPOk5P9I/AAAAAAAAGDM/SjQL1hFOz4U/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%882.00.06.png)
:::

在鑰匙圈存取》憑證輔助程式 找到"製作憑證"開啟它\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-85MJDhg80sc/VPyO2g2p44I/AAAAAAAAGDY/8XSe1Nzjwaw/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%882.02.16.png){width="640"
height="460"}](http://1.bp.blogspot.com/-85MJDhg80sc/VPyO2g2p44I/AAAAAAAAGDY/8XSe1Nzjwaw/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%882.02.16.png)
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-XH-C40e7q7Q/VPyO2jv6_OI/AAAAAAAAGDk/p2NhxAOxZ0s/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%882.02.42.png){width="640"
height="458"}](http://1.bp.blogspot.com/-XH-C40e7q7Q/VPyO2jv6_OI/AAAAAAAAGDk/p2NhxAOxZ0s/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-03-09%2B%E4%B8%8A%E5%8D%882.02.42.png)
:::

接著名稱寫：iPhone Developer，身份類型：自簽根，憑證類型：代碼簽名\
然後其他就預設值，一路按繼續繼續繼續繼續繼續繼續繼續繼續繼續繼續繼續\
\
最後看到完成，再回你的C++ Builder做一次編譯就可以解決這個問題了\
（參考：[盒子論壇](http://bbs.2ccc.com/topic.asp?topicid=426194)）
