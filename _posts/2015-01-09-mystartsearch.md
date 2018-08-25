\-\-- layout: post title: 解除mystartsearch首頁綁架 date:
\'2015-01-09T09:44:00.001-08:00\' author: 聖豪馬 tags: - Chrome -
WebBrowser modified\_time: \'2015-01-09T09:44:48.525-08:00\' thumbnail:
http://1.bp.blogspot.com/-dsy5le3jINI/VLAPtAXddzI/AAAAAAAAFdY/jCzo6lIYGq0/s72-c/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.24.17.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-9138101097016340973
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/01/mystartsearch.html \-\--

::: {.separator style="clear: both; text-align: center;"}
寫這篇文章純粹因為我MacBook中的Windows沙箱首頁被綁架了T\_\_T
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-dsy5le3jINI/VLAPtAXddzI/AAAAAAAAFdY/jCzo6lIYGq0/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.24.17.png){width="320"
height="199"}](http://1.bp.blogspot.com/-dsy5le3jINI/VLAPtAXddzI/AAAAAAAAFdY/jCzo6lIYGq0/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.24.17.png)
:::

然後到設定內可以看到它把預設開啟網頁設為流氓網站的網址.\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-Jn9iIAy2bj8/VLARuLJXv3I/AAAAAAAAFdk/YvU9i-WeuMU/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.33.49.png){width="320"
height="100"}](http://3.bp.blogspot.com/-Jn9iIAy2bj8/VLARuLJXv3I/AAAAAAAAFdk/YvU9i-WeuMU/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.33.49.png)
:::

把它更改回來之後,不過會發現無效\....會自己被設定回來流氓網站的網址.\
於是看了一下,有個流氓擴充套件在每次Chrome開啟都會修改我的首頁\...\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-qk6UlhtKIAU/VLASE4jgEwI/AAAAAAAAFds/7gMJpj8Gl5s/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.37.45.png){width="320"
height="89"}](http://2.bp.blogspot.com/-qk6UlhtKIAU/VLASE4jgEwI/AAAAAAAAFds/7gMJpj8Gl5s/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.37.45.png)
:::

所以把它移除掉就可以了\
不過移除掉之後每次開Chrome這個擴充套件又會被裝回來,\
於是從桌面上的Chrome的捷徑查看一下\....\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-7uk3abb-K8E/VLASkBKQAKI/AAAAAAAAFd0/xM4uX7-PGZo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.40.16.png){width="288"
height="320"}](http://2.bp.blogspot.com/-7uk3abb-K8E/VLASkBKQAKI/AAAAAAAAFd0/xM4uX7-PGZo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.40.16.png)
:::

原來是目標被下了參數,詳細參數為:\"C:\\Program
Files\\Google\\Chrome\\Application\\chrome.exe\"
http://www.mystartsearch.com/?type=sc&ts=1414216660&from=smt&uid=WindowsX7-0XSSD\_47TN9V1WXRFMQ2QRRRH2X（意味著一啟動Chrome就跟著shell了www.mystartsearch.com的網頁）\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-FB7_duNRTnE/VLAS-1X2QhI/AAAAAAAAFd8/2ZXwi7_CySo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.42.06.png){width="261"
height="320"}](http://2.bp.blogspot.com/-FB7_duNRTnE/VLAS-1X2QhI/AAAAAAAAFd8/2ZXwi7_CySo/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.42.06.png)
:::

把目標格子的值改為\"C:\\Program
Files\\Google\\Chrome\\Application\\chrome.exe\"\
按確定，收工～\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-svc-DRRxtVU/VLATQAkqRuI/AAAAAAAAFeE/6qlYHE8w6SE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.43.12.png){width="320"
height="200"}](http://2.bp.blogspot.com/-svc-DRRxtVU/VLATQAkqRuI/AAAAAAAAFeE/6qlYHE8w6SE/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%2B2015-01-10%2B%E4%B8%8A%E5%8D%881.43.12.png)
:::

\
下一次開啟就是乾淨的Chrome囉～\

::: {.separator style="clear: both; text-align: center;"}
\
:::
