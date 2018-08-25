\-\-- layout: post title:
\"\[OSX\]\[ASM\]OSX上對已購買軟體逆向，破解Apple Store購買驗證手法\"
date: \'2015-05-31T22:18:00.001-07:00\' author: 聖豪馬 tags: - OSX - ASM
modified\_time: \'2015-06-01T03:54:34.069-07:00\' thumbnail:
https://i.ytimg.com/vi/hhpgls1QiNc/0.jpg blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-8789883758590353042
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/05/osxasmosxapple-store.html \-\--
本文靈感來自專拆OSX的大神發布的影片\

::: {.separator style="clear: both; text-align: center;"}
:::

不過我沒有用OTX那個工具也不想記Hex & Opcode的轉換XD\
這邊我選擇使用Hopper Disassembler v3版本作為整個破解手法的核心工具\
\
另外，影片中有用簽章工具去重簽，但我沒有XD，如果你很執著想讓破解完後的軟體可以跑在別人的OSX環境上（沒有開啟允許非Apple
Store的選項狀況下）還是得做重新簽章的動作唷\
\

已購買拔除驗證的程式
--------------------

有跟那個大神要來了同樣的一支程式拔掉了Recept檔案（內紀錄了Mac碼、購買人資訊\...等）。跟大神要回來的檔案開啟後會像這樣：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-ZNusWhOtKL0/VWvg29a8hfI/AAAAAAAAGcU/llW1pOUCal8/s400/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.33.24.png){width="400"
height="241"}](http://4.bp.blogspot.com/-ZNusWhOtKL0/VWvg29a8hfI/AAAAAAAAGcU/llW1pOUCal8/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.33.24.png)
:::

在影片中提及173（0xAD）就是當開發者使用Apple
Store提供的Framework時發現驗證檔案有問題時會用173這個編號當作訊息回覆給系統然後call
exit來結束程式，程式結束後OSX系統就會顯示如上圖的訊息來告知使用者這個程式不可使用。\
\

分析過程
--------

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-8LygYLdfjjU/VWvh2C0WRMI/AAAAAAAAGcc/gwj3hX6mVxo/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.38.26.png){width="640"
height="336"}](http://1.bp.blogspot.com/-8LygYLdfjjU/VWvh2C0WRMI/AAAAAAAAGcc/gwj3hX6mVxo/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.38.26.png)
:::

<div>

這邊我選用Hopper Disassembler v3來開啟這個軟體中的exec（核心執行文件）

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-cXQb1-M1HN8/VWviKC2_FHI/AAAAAAAAGck/XUqFT2M0woQ/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.39.58.png){width="640"
height="400"}](http://1.bp.blogspot.com/-cXQb1-M1HN8/VWviKC2_FHI/AAAAAAAAGck/XUqFT2M0woQ/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.39.58.png)
:::

<div>

接著Hopper就會幫你停在EP這邊囉。

</div>

<div>

那麼接下來怎麼找到程式在做檢測是否有問題來發送173並且退出的點？

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-GDSEK6eQ8BQ/VWvjupMLdJI/AAAAAAAAGcw/tZucBvgA0CE/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.46.29.png){width="640"
height="290"}](http://4.bp.blogspot.com/-GDSEK6eQ8BQ/VWvjupMLdJI/AAAAAAAAGcw/tZucBvgA0CE/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.46.29.png)
:::

<div>

\

</div>

<div>

這邊我使用了Hopper內的搜尋（command+F）然後搜尋0xAD。

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-kHwtB5UDUYc/VWvlcNvPb-I/AAAAAAAAGdE/-unVK83hq54/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.53.41.png){width="640"
height="322"}](http://3.bp.blogspot.com/-kHwtB5UDUYc/VWvlcNvPb-I/AAAAAAAAGdE/-unVK83hq54/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.53.41.png)
:::

<div>

可以看到第一個找到的點在這裡0x100029db0，接著後面call了got\_\_objc\_msgSend

</div>

<div>

這就是第一個檢測點，而且應該是程式內開發者自己設計的檢測點

</div>

<div>

這邊使用Hopper內的反組譯功能可以看到這段回推obj-c程式碼如下：

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-Z-GJnlx8-ik/VWvlwfYqeEI/AAAAAAAAGdM/pZBPn7cfTHc/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.55.07.png){width="640"
height="394"}](http://1.bp.blogspot.com/-Z-GJnlx8-ik/VWvlwfYqeEI/AAAAAAAAGdM/pZBPn7cfTHc/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.55.07.png)
:::

<div>

反白處為我們找到的第一個173訊號設定點，這邊開發者使用了FileExistsAtPath的API做呼叫，如果返回值是0（購買權限檔案不存在）便會回傳173訊息給系統。

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-oOQuvZdfq4g/VWvm3tSDzJI/AAAAAAAAGdY/1OpzOu3kmu4/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.59.55.png){width="640"
height="98"}](http://4.bp.blogspot.com/-oOQuvZdfq4g/VWvm3tSDzJI/AAAAAAAAGdY/1OpzOu3kmu4/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.59.55.png)
:::

<div>

所以為了阻止這種惡劣的打小報告行為（？）我在0x100029da5上的test
al,al這邊做的一個BYTE的檢測之後有個jne
 0x100029dbe下一個強跳，就可以避免開發者設計的173回傳回去給系統了，使用Hopper內建的Assembler
Instruction功能修改為jmp就可以了。

</div>

<div>

\

</div>

<div>

接著我們繼續搜索0xAD可以看到第二個點：

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-SSTGoMA3sZw/VWvnHZtbl9I/AAAAAAAAGdg/nu0wBX73Inw/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.51.40.png){width="640"
height="58"}](http://3.bp.blogspot.com/-SSTGoMA3sZw/VWvnHZtbl9I/AAAAAAAAGdg/nu0wBX73Inw/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%258812.51.40.png)
:::

<div>

在0x1000f4aa6這個函數很直接的就exit(0xAD)

</div>

<div>

我們可以往上捲一點，可以看到：

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-lVOOgsHESmI/VWvojvcKeYI/AAAAAAAAGds/9EzBMX9LRmI/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%25881.07.10.png){width="640"
height="294"}](http://4.bp.blogspot.com/-lVOOgsHESmI/VWvojvcKeYI/AAAAAAAAGds/9EzBMX9LRmI/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%25881.07.10.png)
:::

<div>

可以看到箭頭指向到會呼叫到exit(0xAD)有兩個點，第一個點是在0x10004fa8d上的jne，把它nop掉即可。

</div>

<div>

接著往上找（沿著左邊那個箭頭）誰呼叫了0x10004faa6，

</div>

<div>

可以往上翻到這個位置（那條粗藍色的就是連到剛剛的exit(0xAD) ）：

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-8OioiBRzS74/VWvqLcniZoI/AAAAAAAAGd8/CAZ1YgEtMfg/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%25881.13.57.png){width="640"
height="340"}](http://2.bp.blogspot.com/-8OioiBRzS74/VWvqLcniZoI/AAAAAAAAGd8/CAZ1YgEtMfg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%25881.13.57.png)
:::

::: {.separator style="clear: both; text-align: center;"}
\
:::

<div>

為了避免被呼叫到exit(0xAD)，網上找到0x10004f96d底下那個je讓它下一個強跳即可。

</div>

<div>

（可以根據箭頭看到那裡做強跳會直接跳到exit(0xAD)之後）

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-IEB6hxE93nA/VWvqtXxHJZI/AAAAAAAAGeM/oJqUqef5lfU/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%25881.15.24.png){width="640"
height="376"}](http://4.bp.blogspot.com/-IEB6hxE93nA/VWvqtXxHJZI/AAAAAAAAGeM/oJqUqef5lfU/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%25881.15.24.png)
:::

<div>

\

</div>

<div>

最後使用Hopper來生產出新的exec並且覆蓋回去原始的exec

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-QxGcZhoW0kw/VWvq3zg0vrI/AAAAAAAAGeU/8ERlelWgwJs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%25881.17.06.png){width="640"
height="400"}](http://4.bp.blogspot.com/-QxGcZhoW0kw/VWvq3zg0vrI/AAAAAAAAGeU/8ERlelWgwJs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-06-01%2B%25E4%25B8%258B%25E5%258D%25881.17.06.png)
:::

<div>

登愣～ε-(´∀｀; )

</div>

<div>

原本害羞內向不給開的程式就破解掉Apple Store購買驗證囉

</div>