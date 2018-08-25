\-\-- layout: post title: \"\[TDOHConf\] Challenge \#11: fuzz macOS
算號器\" date: \'2017-10-15T13:37:00.003-07:00\' author: 聖豪馬 tags:
modified\_time: \'2017-10-15T13:41:17.996-07:00\' thumbnail:
https://3.bp.blogspot.com/-6Ooce2v9iVs/WePB51e6U4I/AAAAAAAAIaI/dJtga\_U7K1sJXEEAukKYqM9zNguj-l9kQCLcBGAs/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.15.14.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-386689067371174483
blogger\_orig\_url:
http://helloadr.blogspot.com/2017/10/tdohconf-challenge-11-fuzz-macos.html
\-\--

::: {.separator style="clear: both; text-align: left;"}
[![](https://3.bp.blogspot.com/-6Ooce2v9iVs/WePB51e6U4I/AAAAAAAAIaI/dJtga_U7K1sJXEEAukKYqM9zNguj-l9kQCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.15.14.png){width="640"
height="92"}](https://3.bp.blogspot.com/-6Ooce2v9iVs/WePB51e6U4I/AAAAAAAAIaI/dJtga_U7K1sJXEEAukKYqM9zNguj-l9kQCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.15.14.png)
:::

\
這一題好像沒人解出來, ~~想說大家快破台了這樣不行,
所以結算成績前一個小時臨時加了這一題。~~首先這個題目點進來看到是一張圖片連結，不過點開基本上是個損毀的圖片：\

::: {.separator style="clear: both; text-align: left;"}
[![](https://2.bp.blogspot.com/-Su8nk2oAjk0/WePChR9aRSI/AAAAAAAAIaM/MsV2OrN7BEUFQ1lzTUM0XisDEPt2MGa9ACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.17.54.png){width="640"
height="232"}](https://2.bp.blogspot.com/-Su8nk2oAjk0/WePChR9aRSI/AAAAAAAAIaM/MsV2OrN7BEUFQ1lzTUM0XisDEPt2MGa9ACLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.17.54.png)
:::

\
接著可以把這個圖片載下來，然後用 file 指令看看這是什麼鬼：\

::: {.separator style="clear: both; text-align: left;"}
[![](https://1.bp.blogspot.com/-Vu0m2582jvc/WePCrjbRG4I/AAAAAAAAIaQ/uEzJ4VvNb3cOWa3yScj4qG4AF-9gJznZQCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.14.41.png){width="640"
height="72"}](https://1.bp.blogspot.com/-Vu0m2582jvc/WePCrjbRG4I/AAAAAAAAIaQ/uEzJ4VvNb3cOWa3yScj4qG4AF-9gJznZQCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.14.41.png)
:::

\
會發現其實是 mach-O 格式的 macOS
執行程式，接著你可以用反組譯器去看這隻執行程式，我這邊用的是 IDA
Pro，不過如果你手上沒有 IDA Pro 其實拿免費版的 IDA
也可以看程式邏輯流程圖啦\...XD\
\
記憶體變數排列圖：\

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-93APsI-TYOc/WePGQQmv05I/AAAAAAAAIak/PwZ1gDna0DME7pRGMlzYrlpHEldrpEtfQCLcBGAs/s320/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.32.28.png){width="320"
height="135"}](https://3.bp.blogspot.com/-93APsI-TYOc/WePGQQmv05I/AAAAAAAAIak/PwZ1gDna0DME7pRGMlzYrlpHEldrpEtfQCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.32.28.png)
:::

\
\

::: {.separator style="clear: both; text-align: left;"}
[![](https://1.bp.blogspot.com/-fVe9TDxG7SQ/WePEipaoPjI/AAAAAAAAIaY/nO9yFpJUVGYVExx_LQHixPzKrDCCaydywCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.24.54.png){width="466"
height="640"}](https://1.bp.blogspot.com/-fVe9TDxG7SQ/WePEipaoPjI/AAAAAAAAIaY/nO9yFpJUVGYVExx_LQHixPzKrDCCaydywCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.24.54.png)
:::

::: {.separator style="clear: both; text-align: left;"}
第一個流程圖部分你可以看到它用 scanf 把文字儲存在區域變數 ebp+0x20
處，接著取出第一個 char 值去做右移一次、左移一次去判斷是否等於自己當前值
- 1，其實這很明顯就是在判斷奇數啦XD（比方說 31：(31 /2) \* 2 = 30
正好就會是 31-1，因為有 1 在除法乘法時候被捨去了）
:::

::: {.separator style="clear: both; text-align: left;"}
\
:::

::: {.separator style="clear: both; text-align: left;"}
第二個流程圖去比對 var\_11 是否等於 var12+3，也就是第二個 char
的值必須為第一個值 +3。
:::

::: {.separator style="clear: both; text-align: left;"}
\
:::

::: {.separator style="clear: both; text-align: left;"}
第三個流程圖則是：var\_10 必須為 var\_11 + 0x0e，第三個 char
必須為第二個 + 0x0e（14）
:::

::: {.separator style="clear: both; text-align: left;"}
\
:::

::: {.separator style="clear: both; text-align: left;"}
第四個流程圖： var\_f 則是判斷第四個 char 是否為
null（字串結尾）所以可以確定 input 必須為三個字的長度。
:::

::: {.separator style="clear: both; text-align: left;"}
\
:::

::: {.separator style="clear: both; text-align: left;"}
所以算號器算法都出來了，接著就是寫腳本去爆啦～
:::

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-r0EWasyUFhI/WePGl3KH_yI/AAAAAAAAIao/els62K0bNGMN4XBx9NExVYf68IZRCUK-wCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.35.16.png){width="640"
height="480"}](https://4.bp.blogspot.com/-r0EWasyUFhI/WePGl3KH_yI/AAAAAAAAIao/els62K0bNGMN4XBx9NExVYf68IZRCUK-wCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.35.16.png)
:::

::: {.separator style="clear: both; text-align: left;"}
寫個三層 for 迴圈，然後去暴力跑 ASCII
整張表可顯示字元部分，然後找出匹配上述三個規則的字串：
:::

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-MlfiUiB1xqA/WePG0yQbPRI/AAAAAAAAIas/9T1l2KXWPO8SSnimOBFrPfuwNJ0ZfhevACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.36.16.png){width="640"
height="622"}](https://3.bp.blogspot.com/-MlfiUiB1xqA/WePG0yQbPRI/AAAAAAAAIas/9T1l2KXWPO8SSnimOBFrPfuwNJ0ZfhevACLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.36.16.png)
:::

::: {.separator style="clear: both; text-align: left;"}
你會發現有很多符合規則的三個字元結果，這些結果都是剛剛那支算號器認證通過的字串XD
:::

::: {.separator style="clear: both; text-align: left;"}
所以得一個個去帶，最後 flag 會是 TDOHCONF{ADR}
:::

::: {.separator style="clear: both; text-align: left;"}
\
:::

::: {.separator style="clear: both; text-align: left;"}
我知道還有另一組大家很感興趣的是在：
:::

::: {.separator style="clear: both; text-align: center;"}
[![](https://3.bp.blogspot.com/-6gj7L3WX42c/WePHvHN-UbI/AAAAAAAAIa0/_13ne8S1r8U0R7Ael93O_RG10cvQp32AgCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.39.45.png){width="640"
height="264"}](https://3.bp.blogspot.com/-6gj7L3WX42c/WePHvHN-UbI/AAAAAAAAIa0/_13ne8S1r8U0R7Ael93O_RG10cvQp32AgCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-10-16%2B%25E4%25B8%258A%25E5%258D%25884.39.45.png)
:::

::: {.separator style="clear: both; text-align: left;"}
抱歉，這一組字串從頭到尾都沒被用到XD
純粹騙你用的（誰說擺了這個字串就一定要用呢？:P）
:::

\
