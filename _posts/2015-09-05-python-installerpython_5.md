\-\-- layout: post title: 從Python Installer打包程式拖出Python程式碼
date: \'2015-09-05T00:34:00.002-07:00\' author: 聖豪馬 tags: - Crack -
Python modified\_time: \'2015-09-05T00:35:02.392-07:00\' thumbnail:
http://4.bp.blogspot.com/-dXoBPrbmS0s/VeqPFDX2z3I/AAAAAAAAHLE/BTK40JIft1c/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25882.43.38.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-146225842751299640
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/09/python-installerpython\_5.html
\-\-- **[卡關T\_\_T]{style="font-size: x-large;"}**\
\
登愣，之前卡關很久的FireEye的Python題目\

::: {.separator style="clear: both; text-align: center;"}
[](https://www.blogger.com/blogger.g?blogID=1335849442109808564)[![](http://4.bp.blogspot.com/-dXoBPrbmS0s/VeqPFDX2z3I/AAAAAAAAHLE/BTK40JIft1c/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25882.43.38.png){width="640"
height="412"}](http://4.bp.blogspot.com/-dXoBPrbmS0s/VeqPFDX2z3I/AAAAAAAAHLE/BTK40JIft1c/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25882.43.38.png)
:::

根據Icon可以大概推知這支Python程式透過Python
Installer來打包（畢竟Python能打包成.exe的工具不多XD）後來得知有個開源工具可以替我們撈出Source
Code： PyInstaller Extractor（後來查了一下這套工具在國外好像蠻有名的
可以看此篇 [Unpacking Pyinstaller Packed Python
Malware](http://sysforensics.org/2015/04/unpacking-pyinstaller-packed-python-malware/)）\
那麼工具載點在這裡：[PyInstaller Extractor
Source](http://sourceforge.net/projects/pyinstallerextractor/)，載回來後可以得到一個PyInstxtractor.py\
底下紀錄如何操作這套.py工具\
\
\
**[手術台]{style="font-size: x-large;"}**\
\
今天你獲得了一個Python Installer包裝好的程式（這邊拿的是Fire
Eye的flare-on題目第三題
elfie.exe）那要怎麼透過PyInstxtractor.py替我們撈出Source呢？\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-XVlpTEX89XE/VeqaRJAlCUI/AAAAAAAAHLo/ESEcz1jGDk0/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.01.21.png){width="640"
height="448"}](http://4.bp.blogspot.com/-XVlpTEX89XE/VeqaRJAlCUI/AAAAAAAAHLo/ESEcz1jGDk0/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.01.21.png)
:::

\
只要看到以上字串就表示解析成功了，接著回到你的執行目錄之下可以看到：\
[![](http://2.bp.blogspot.com/-Rv71nvYkTVw/VeqTbMUJv9I/AAAAAAAAHLQ/iEj0IVO1980/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.03.09.png){width="640"
height="465"}](http://2.bp.blogspot.com/-Rv71nvYkTVw/VeqTbMUJv9I/AAAAAAAAHLQ/iEj0IVO1980/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.03.09.png)\
會看到在目錄之下會產生很多從這個elfie.exe解析出來的區段文件，其他基本上都是包入的runtime，比較重要的是跟程式同名的文件（如在此篇解析出來就會是elfie）打開來看看\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-8pLTNZ05q_k/VeqaYnOiFhI/AAAAAAAAHLw/-J9-h1wVdhE/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.06.28.png){width="640"
height="412"}](http://2.bp.blogspot.com/-8pLTNZ05q_k/VeqaYnOiFhI/AAAAAAAAHLw/-J9-h1wVdhE/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.06.28.png)
:::

\
打開此文件後可以看到它其實是個Python腳本，不過你會看到相當大量的莫名其妙的Base64的Code，最後底下Import
base64在做exec(base64.b64decode(\...一堆base64\...))，尾巴會有個NUL。\
\
這裏我們可以得知這隻打包好的程式被跑起來時，Script會把透過exec()來執行Python的程式碼執行起來，在此我們可以看到被執行的程式碼其實也就是base64.b64decode(\...一堆base64\...)這段了，所以我們只要設法把這段程式碼Print出來就可以了。\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-AjVX90CJSvo/VeqahsjyZZI/AAAAAAAAHL4/DpQnwE0CJDY/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.30.28.png){width="640"
height="417"}](http://3.bp.blogspot.com/-AjVX90CJSvo/VeqahsjyZZI/AAAAAAAAHL4/DpQnwE0CJDY/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.30.28.png)
:::

\
\
所以我們可以手動修改一下這段程式碼，把底下NUL的部分刪掉，然後把exec()改成Print()\
然後我們再回到終端機下把這個elfie文件當作Python Script跑起來看看：\

::: {.separator style="clear: both; text-align: center;"}
[](https://www.blogger.com/blogger.g?blogID=1335849442109808564)[](https://www.blogger.com/blogger.g?blogID=1335849442109808564)[![](http://1.bp.blogspot.com/-iVs3T7w41gk/Veqa46H0sdI/AAAAAAAAHMA/yUC5JsJG0f0/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.35.37.png){width="640"
height="448"}](http://1.bp.blogspot.com/-iVs3T7w41gk/Veqa46H0sdI/AAAAAAAAHMA/yUC5JsJG0f0/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.35.37.png)
:::

\
\
接著到執行目錄下看看Code.txt：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-YQs5dYpcQ6w/VeqbA4yZ63I/AAAAAAAAHMI/u7DR3QUDYqk/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.19.06.png){width="640"
height="418"}](http://2.bp.blogspot.com/-YQs5dYpcQ6w/VeqbA4yZ63I/AAAAAAAAHMI/u7DR3QUDYqk/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-09-05%2B%25E4%25B8%258B%25E5%258D%25883.19.06.png)
:::

\
 就可以看到程式碼囉（不過上面那段Base64又是需要再做一次反轉，這層開始就是Python
Code了）\
\
