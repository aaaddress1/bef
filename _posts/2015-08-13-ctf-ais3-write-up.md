\-\-- layout: post title: \"\[CTF\] AIS3 Write-Up\" date:
\'2015-08-13T10:07:00.001-07:00\' author: 聖豪馬 tags: - BOF - pyt -
OllyICE - CTF - Pwn - ASM - IDA - 脫殼 modified\_time:
\'2015-08-13T10:10:28.115-07:00\' thumbnail:
https://lh5.googleusercontent.com/BanhWE1MbLfFPG7LK7Ok0bNYKqDoG\_6vRgNk2BCV8gbBmFhWil4qJ3a91L7bZGYmjJdPokk\_xtRQxKjrpDSrfDifTCCsDbElyILWKVbt5HMvBa-W9opJ0zV09I0\_iBT\_iDyI17k=s72-c
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-7615305311511048150
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/08/ctf-ais3-write-up.html \-\--

### [[這份write-up寫好放著好久了，一直忘記發佈出來XD]{style="background-color: transparent; color: write; font-family: "Trebuchet MS"; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}]{style="font-size: small;"} {#docs-internal-guid-d1eb05bf-2806-54b4-9bc6-c0cec0955ebb dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}

### [[最近在整理文章熊熊才想到\...]{style="background-color: transparent; color: write; font-family: "Trebuchet MS"; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}]{style="font-size: small;"} {#docs-internal-guid-d1eb05bf-2806-54b4-9bc6-c0cec0955ebb dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}

### [[大神們請飄過Q\_\_Q ]{style="font-size: small;"}]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"} {#docs-internal-guid-d1eb05bf-2806-54b4-9bc6-c0cec0955ebb dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}

::: {#docs-internal-guid-d1eb05bf-2806-54b4-9bc6-c0cec0955ebb dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
\
:::

::: {#docs-internal-guid-d1eb05bf-2806-54b4-9bc6-c0cec0955ebb dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[MISC1]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

##### [嘗試送出你的第一把 KEY The key is AIS3{hello\_world}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 13.333333333333332px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"} {#嘗試送出你的第一把-key-the-key-is-ais3hello_world dir="ltr" style="line-height: 1.38; margin-bottom: 2pt; margin-top: 11pt;"}

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[直接送出KEY]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[MISC2]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[雖然facebook.zip有加密，但是可觀看到內含資料夾/p960x960/下有一個圖片檔案的檔名為851556\_443281069111871\_602278786\_n.png，透過Google搜索後，]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[可以在Github頁面：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[[https://github.com/nicksahler/FacebookStickers/blob/master/test.html]{style="background-color: transparent; color: #1155cc; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: underline; vertical-align: baseline;"}](https://github.com/nicksahler/FacebookStickers/blob/master/test.html)[中找到相關於此檔名的圖片網址為：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[[https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/p960x960/851556\_443281069111871\_602278786\_n.png]{style="background-color: transparent; color: #1155cc; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: underline; vertical-align: baseline;"}](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/p960x960/851556_443281069111871_602278786_n.png)
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![851556\_443281069111871\_602278786\_n.png](https://lh5.googleusercontent.com/BanhWE1MbLfFPG7LK7Ok0bNYKqDoG_6vRgNk2BCV8gbBmFhWil4qJ3a91L7bZGYmjJdPokk_xtRQxKjrpDSrfDifTCCsDbElyILWKVbt5HMvBa-W9opJ0zV09I0_iBT_iDyI17k){width="240px;"
height="240px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\
\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[接著將此圖片下載後，自行包成ZIP壓縮包（這裡命名為my\_zip.zip）利用知名工具PKCrack，Linux中下命令pkcrack
-d o.zip -P my\_zip.zip -c
\"p960x960/851556\_443281069111871\_602278786\_n.png\" -C facebook.zip
 -p
851556\_443281069111871\_602278786\_n.png]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[最後產出o.zip解壓縮後就可以觀看到內含的文字檔案內的key了]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[MISC3]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午12.47.51.png](https://lh4.googleusercontent.com/H1yWFadQwXOOdHj5zt0l4ZHgrgpqvGVDKB8W8aHaDeX9wW7qhR9n_3IXwGceun2-wNCRqkF5Lz8KRhDzBJZYxR036noOZ6XO9D7k7sgO7sqTzEau3dPVK4OXVxrGDrB6STAMKbo){width="602px;"
height="81px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[把檔案c4載下來後，用file查看得知為gzip檔案然後下gzip後會變成c4.gzip在解壓縮開（重複兩次後）c4會變成bitmap的檔案，點閱開來後就可以看到KEY：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午12.50.24.png](https://lh3.googleusercontent.com/VTkaDgaaqnSPy4ytGCDK4y7a_9ftjm62IJUE_Qu0Zky_N1pMFRonmc-C7le7nOLPrxzPMUmb_WIKEPB_2cIgFnGmVOBDWcF58qYPcdS5ZQl7iLjVV8195QgB1UH_QBOtiBNSm-U){width="602px;"
height="48px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[如上圖所示就會出現Key]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[WEB1]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[題目給的網站
]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[[http://52.69.163.194/web1/]{style="background-color: transparent; color: #1155cc; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: underline; vertical-align: baseline;"}](http://52.69.163.194/web1/)[
內有兩個連結about跟test，]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[點擊test會連到
]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[[http://52.69.163.194/web1/?page=test]{style="background-color: transparent; color: #1155cc; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: underline; vertical-align: baseline;"}](http://52.69.163.194/web1/?page=test)
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[點擊about會連到
]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[[http://52.69.163.194/web1/?page=about]{style="background-color: transparent; color: #1155cc; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: underline; vertical-align: baseline;"}](http://52.69.163.194/web1/?page=about)
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[查詢Stack Overflow可以得知漏洞：
]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[[http://stackoverflow.com/questions/20726247/php-security-exploit-list-content-of-remote-php-file]{style="background-color: transparent; color: #1155cc; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: underline; vertical-align: baseline;"}](http://stackoverflow.com/questions/20726247/php-security-exploit-list-content-of-remote-php-file)
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[可以透過參數塞php://filter/convert.base64-encode/resource=index把Source
Code轉Base64後印出，瀏覽網址：http://52.69.163.194/web1/?page=php://filter/convert.base64-encode/resource=index，印出Base64文字做Decode找到網頁Source內就可以看到註解含有Key]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\
\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[WEB2]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[翻到整頁亂中有序的符號中可以看見符號結尾為()，是個Java
Script加密]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午1.26.42.png](https://lh6.googleusercontent.com/FJ2t4lZSTnx_qDurMq9Iu8vPIv_wcwgZ72ziIXRDWafbxaxnsma2LsxtQIAGHY8NOk3BY875HwEJX2vECdb1uusmxR-FFQH_Yky5IMbEE-fSCt0frmrCEhc2_faURL7ZebwTK8g){width="602px;"
height="188px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午12.54.28.png](https://lh3.googleusercontent.com/rkj2uB7fEBqkSLeuNic07-40gb5xtbGoRrI0QzyyjR86OmlUl6LfjZncjuhjyHzOB6R6SLEiYbw-mLAdnfkF5M_99FRu3upGKHU738djtVmX7a-y1A57nQDpF7H31IJKzTSSlb0){width="602px;"
height="481px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[將題目內丟入主控台執行，並且重新整理]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午12.54.14.png](https://lh4.googleusercontent.com/pYkgK3VwUXiFZqO5bCtTWpxowDYc2VxlCIow_EoXlbvMwcppe7gNhcvyKAV3kCsuduN4kJoN8VEmOsfTXz_TZ13nwWsWqTP5QbjvkLBo5bBxThhmVsx1mLQ3eXTThpL-43k8ZJk){width="602px;"
height="99px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[WEB3]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[在WEB3網站內的Login登入頁面上帳號與密碼雖過濾單引號]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[但是含有SQLi漏洞可插入\\'' or 1 = 1
\#]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[BINARY1]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[用PEID可以查殼確定是UPX
Shell，但是用UPX自帶的去殼工具脫不掉]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[用OD載入軟體Bin1.exe]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午1.07.05.png](https://lh6.googleusercontent.com/FXSwIJP61ZunHZaxcKe3w-AI6ocsnMWDr9t0Dc3jutXWNsAHONcqifAVgIhXcMdZC04LOR34686_JV67_SOjH6fwQNAeyMRIGVuGG_hp8wsBWdlOX-Hf2dfUghK0sv2YmEDP1gI){width="602px;"
height="587px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[往下翻一下很快可以找到popad，接著底下cmp
esp,eax確定完恢復stack後然後jmp做大跳轉回到原始OEP，F8單步到原始OEP入口後：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午1.09.49.png](https://lh6.googleusercontent.com/P4ktFwvtY78dVcfG6ryOIrYhZgyGfVons0kPcyxaYSl6hr9x-bhxtBEfECbr5iXiZbC95c8ucS1JLEJDSxy7iUJ2ABE0ow1s94020FET9CFBwjtWyRQD6o1JZbPIxVSzSipunXA){width="602px;"
height="596px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[在原始OEP處右鍵OllyDump]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午1.11.20.png](https://lh3.googleusercontent.com/sWwY9UWybIf_GrFYFpa67ElUS7YbSLXpldULk3PsSyty3JpOik1NnoNFPw6YSR62XR-VwuueY9Gzp5Zo1wLeliiZQxXTD6Rc4-GTf1nimrCa-HhwIZOvfeyWg9zO9lSVcq_NTHE){width="602px;"
height="465px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[然後勾選選項修正物理大小與修正OEP
Offset並修正IAT，輸出出去為exe檔案]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午1.13.46.png](https://lh6.googleusercontent.com/v7MEdWD_14wPgT0npiYgM0MkcuqfGh9pZV6AGSTFefom52C7cZ3dpqUmvQPPMw1lFljL6F9kl_Ca4ebaWjj7EIxwja1r_hwU4du1LtRZ-Upk_g5mkoNdc8YVHP_itG2APELa6FU){width="602px;"
height="347px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[IDA打開後找到入口點很快就可以找到猜數字遊戲噴的KEY了]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[BINARY2]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[題目中的一串文字為一段Shellcode，可以撰寫c程式碼將Shellcode執行起來觀看結果]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[在Linux
x64下以gcc編譯並執行：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[char
code\[\]=\"\\x48\\xb8\\xb5\\xa3\\xb9\\xb1\\xc6\\x41\\x41\\x41\\x50\\x48\\xb8\\xbc\\xa0\\xa9\\x93\\xaa\\xa3\\xbe\\x93\\x50\\x48\\xb8\\xa9\\x93\\xa5\\xbf\\x93\\xbf\\xa5\\xa1\\x50\\x48\\xb8\\xbf\\xa4\\xa9\\xa0\\xa0\\xaf\\xa3\\xa8\\x50\\x48\\xb8\\x8d\\x85\\x9f\\xff\\xb7\\xa3\\xa7\\x93\\x50\\x48\\x89\\xe6\\x48\\x31\\xd2\\x80\\x34\\x16\\xcc\\xfe\\xc2\\x80\\xfa\\x25\\x75\\xf5\\x48\\x31\\xc0\\x48\\xff\\xc0\\x48\\x89\\xc7\\x0f\\x05\\x6a\\x3c\\x58\\x48\\x31\\xff\\x0f\\x05\";]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[int
main()]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[\
]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[{]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-left: 36pt; margin-top: 0pt;"}
[int (\*ret)() =
(int(\*)())code;]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-left: 36pt; margin-top: 0pt;"}
[ret();]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[BINARY3]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
下午2.35.53.png](https://lh6.googleusercontent.com/MxsBeeCPHMSsKR-E1nOJPaSQNNp2Tt5NXpGGZxJoVTryr1h8hWQzVsfiUjQlH2LkZlpxV_DftsOICMDcVgl9j1TOJCGEFmPNi0m-X8qzMae312snDXS3fD4f3yFImX3Qz-CllvQ){width="602px;"
height="153px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[從文字資源區很快可以翻到Key正確時的回應句"Yeah, It's the flag!!!
WOW"]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[往回翻到對使用者輸入的操作起始點]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午4.42.25.png](https://lh5.googleusercontent.com/ttPnc_IjKmA0_RrfCGeXJyZ3dJo_PlvH66gBZRGvYkF1BzzrKPGR_SjxIiWC7auWIuHV-gmNIkhTemkj982E2Eq3R5aQW4Kh_X7B-yCJePLK2I3B5ozEdQT4MQAjpvTPOJQFBB0){width="602px;"
height="272px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[可以看到call
to\_reg後rdx被設為input、mode被設為1，返回後把rcx放入程式內部的key（0xDDDDAAAADADADDAA）接著rdx
= rdx \^
rcx再塞回key內。]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午4.43.30.png](https://lh6.googleusercontent.com/jk_bQ6J0EAK7kwGpkyPh_dG3Z04mbaL14b1PughiFsPgGVrocJWte45KpDtjtoF2oXV4cUbtR0XTc_mbNqX9vaQx5PYW4L37o-RvYtJTT2H6fdIPH146n53iUPmSGolwR-RE51A){width="602px;"
height="128px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[接著進入到check2，先把eax清零然後call進gg內，確認gg返回值的一個short單位若為0則代表Key正確。]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午4.44.10.png](https://lh6.googleusercontent.com/kjMdvn-TwipjiGX2xO0rL6KjbmINd9LiVxJyBjVzRnfVHS413fgCVj84Guh9kSQASBVTiV8Iu2omAScjgMFJAJWQouw_cBEJBi5xVIRPsJzqWQjG94-FaoDgWCGljEH6cZIYxdI){width="602px;"
height="171px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[最後看到gg內部，會先把先前操作過的key前4bytes對0xBFB7B8CE做比對，一樣為1反之為0再將後4byte對0xBCB4DEC4做比對，一樣為1反之為0。操作完畢後若ax結果為101（也就是key與0xBCB4DEC4BFB7B8CE一樣）就回傳0反之回傳不為0。]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[因此可以得出整支程式判斷Key正不正確的過程：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[(input \^ 0xDDDDAAAADADADDAA == 0xBCB4DEC4BFB7B8CE)
則代表Key正確]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[上述公式移向後得知：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[0xBCB4DEC4BFB7B8CE \^ 0xDDDDAAAADADADDAA ==
input（原本使用者應輸入）]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
下午2.50.44.png](https://lh3.googleusercontent.com/ATOhdN_5kLILHadji41MRzTwC6y4BAgd7283tG-0FNU_1Z3xLtH8ryZZG1jgZtRFtj9xf3UOjtUY3HJS67OyPJ0z2tiLWxhxTHfB-qEotol27FnZITGpu6B4df-AxVpTsiZF3k0){width="333px;"
height="230px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[最後因0xBCB4DEC4BFB7B8CE（Integer
x64）需little-endian，故答案需反轉，]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[答案為：dementia]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[PWN1]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[這個write
up事先發成BLOG文章了]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[[http://helloadr.blogspot.tw/2015/07/ctfpwnbof-ais3-pre-exam-pwn3d1.html]{style="background-color: transparent; color: #1155cc; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: underline; vertical-align: baseline;"}](http://helloadr.blogspot.tw/2015/07/ctfpwnbof-ais3-pre-exam-pwn3d1.html)
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.25.57.png](https://lh3.googleusercontent.com/QpTtOO0XB155LMG6NibAXBorWZtfoNsr4HKpQOOZRwm1pkl1NvUOfHuK0JGF9jymbFj3ad4EkNG2m0oT3EorhIpoMq83f0wrL-x4hGBcjOspzQyLZ6-s_R1ePMayAJBbVZsEVDw){width="602px;"
height="59px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[首先下file  pwn1，可以得知為elf x64
linux檔案]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.30.18.png](https://lh5.googleusercontent.com/naUNBqvp6BMzfrVEDJCyFGIqgwfb0XlTD_TWyuiAcDMy0BVIP5qiCaNRPMO_Uvvxp_Pq2aeUIrj7vAMpiWD_Befy5EKbPruJA4JG_rSpjlYh5GdnDEUQMOeEq-vQ_9mR8-lCCQY){width="602px;"
height="196px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[拖進IDA Pro按下Shift+F12可以看見主機回應字串：Input Your
Name]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.33.40.png](https://lh5.googleusercontent.com/OgibYCgWbL2mdgJKOccay0_gOxsXv2hpayuA_Xc5qGTRtINIeADcaseR-eXr8sxJx58ZllDv6h6-9zr-xn1ycN5Pr8KvSZQJrBuNYBtw4Xjx_wIAppj2sZ_jTSmx5M25lNz8bWU){width="602px;"
height="92px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[接著翻到文字資源點點擊xref觀看參考點]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![http://4.bp.blogspot.com/-WOtcdmto9DQ/VbUoZOolLAI/AAAAAAAAGpA/SB-txVVbqcw/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-07-27%2B%25E4%25B8%258A%25E5%258D%25882.35.08.png](https://lh5.googleusercontent.com/ZMpaDjRB2vwHgSPdaZaDKhRtPMsMInE-8mrmcyNu7lAFS1RPbDHglQZmehb8oKnxsXImVAVsluxOMrRU3GWiMm1kf7eioK6pbdpWIYZ1Wc6yW4SSBk7B7iWhxaVylpcGf65Fkto){width="602px;"
height="243px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[接著可以使用IDA Pro
F5得到：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![](https://lh4.googleusercontent.com/-x2R9X1bRVRgjVYrdFoMBAn2w5LcNh1WreZB3TwHyV1WCtVG9jqVKCih-IVR_iZ6kTyaHARrhGJ7CVWZrECaYvvj2EgwJo06zEMIq8QS3fyqNEdxyVJs6_0J9v6XfGoAsTXWYgI){width="602px;"
height="323px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[可以看到伺服器上回應的程式puts出"Input Your
Name"後，做scanf把使用者傳入的Data寫入v1內（應該是char
array？）接著就判斷v4是否為0x90909090，是就噴Flag否則就告訴你目前的v4的值為多少（如果沒控制成功，預設會是10）]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[這邊可以得知的是唯一跟使用者傳入（可控）的是v1，接著我們想控制的是一個被宣告為DWORD的v4（4個BYTE），接著回到組合語言狀態下觀看：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![](https://lh3.googleusercontent.com/PS8e5d_gEiNdm05kwrz088LRjWXRuPtEroy4xuLZG2jYxNyq0z4BzhJ9OlKkAnA49CVSkHOG1gpeQKA8wxRtsjlfGnFXVYeon5_yPLGQ6rWLeZP2DNA-YcTbgtm1euZIEQjOckA){width="602px;"
height="148px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[這邊可以得知v1（Buffer）地址為+0x20而v4地址則為+0x04，也就是兩個偏移量差了32
- 4 =
28個BYTE，所以我們可以這樣傳入使用者測資來控制v4：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[\[\...\.....共28個字元塞滿(隨便塞)\...\.....\]\[要控制的v4值,4BYTE\]]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[最後下： echo -e
\"\...\...\...\...\...\...\...\...\....\\x90\\x90\\x90\\x90\" \| nc ip
port]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[
就可以得到KEY了]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[Crypto1]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[題目內給了一個秘文，檔名為vigenere.txt推測為此題關鍵，]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[Google搜尋了一下：維吉尼爾加密法]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vigen%C3%A8re\_square\_shading.svg/2000px-Vigen%C3%A8re\_square\_shading.svg.png](https://lh5.googleusercontent.com/-G59ITI2U4rZ-4UZjBpoDt-Kv47MnG3kjsdvNXsBp1LRWyz2Jvj5IiqaOrZp6vdd5rZa9Nyhn2ZNjIdLcC6x2ifH92tP7nToYqNAUbC_AwxY5VrAOk_qbUkItak5aLnxLq6SA5w){width="485px;"
height="485px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[找到這張對換表，可以看到是英文字母對換表不處理符號]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午2.28.00.png](https://lh4.googleusercontent.com/4fJA41UhS9DS6kOOWfa5_tj_BDWyzuQ0XGqI-BHTA9UYkbp7NZOOBC-cNWi3HBLkFGsrGEOZYTVh_YjmoTb21ZbAyc9BK9rQiaQn3pF2ZXONSLEuAOdBnY1Eb7vxIzVupSwoV0k){width="602px;"
height="128px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[在題目給的秘文中找到很明顯的字串為：]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[vayy://dgu.sjg3.vwp/gvawt/hojtfldxwwnjwfetzbvhmj.uki]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[開頭相似於http://的形式，推測為網址，根據維吉尼爾加密法，根據Key加密方式會有一個固定的Offset相對應於該位置上；不過可以利用線上工具：http://smurfoncrack.com/pygenere/index.php]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[![螢幕快照 2015-07-28
上午2.44.04.png](https://lh5.googleusercontent.com/fiCN-Ij_4Bi9OKfOaqtqWZGmgJSvXqOMkW0QAMt7qYEk82q5SFSZYB1zMAI4afb89r3CRXtO-wIus_v_ILVc8yyzF47f9RUSdxG_vfJP6mnDhu8POwBy82CwCT_hF5DMo4ojWek){width="602px;"
height="567px;"}]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[將密文整段放入後按下分析可以幫我們暴力Try
Key出來還有解密的文本XD]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[連線至該連結就可以得到Key了]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

\

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[Crypto2]{style="background-color: transparent; color: write; font-family: 'Trebuchet MS'; font-size: 28px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::

::: {dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"}
[上
]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}[[http://www.factordb.com]{style="background-color: transparent; color: #1155cc; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: underline; vertical-align: baseline;"}](http://www.factordb.com/)[
網站上可以查詢到p與q即可解密RSA，就可以得到Key]{style="background-color: transparent; color: write; font-family: Arial; font-size: 14.666666666666666px; font-style: normal; font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: baseline;"}
:::
