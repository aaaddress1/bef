\-\-- layout: post title:
\"\[Windows\]\[PE\]\[ASM\]\[CE\]從PE架構到模組架構到暴力列舉模組找模組位置（如Kernel32.dll）\"
date: \'2015-04-30T12:37:00.002-07:00\' author: 聖豪馬 tags: - PE -
CheatEngine - Windows - ASM modified\_time:
\'2015-04-30T12:37:55.808-07:00\' thumbnail:
http://3.bp.blogspot.com/-wAhqdcgPHX4/UcVTB4oktrI/AAAAAAAABrs/f15TpDUyUA4/s72-c/Diagram4.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-4499400543433098829
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/04/windowspeasmcepekernel32dll.html
\-\-- [此篇內容接續著前一篇Blog文：
從PE架構淺談純組語撈出當前進程的映像路徑](http://helloadr.blogspot.tw/2015/04/windowspeasmcepe.html)\
最近都在看Buffer Overflow相關資料\...所以這類型廢文比較多XD\
就把一段一段覺得蠻重要的部份整理出來了\
\
參考文獻\

1.  [緩衝區溢位攻擊：第三章 -
    改變程式執行的行為](http://securityalley.blogspot.tw/2013/06/blog-post.html)
2.  [MSDN - PEB
    structure](https://msdn.microsoft.com/en-us/library/windows/desktop/aa813706%28v=vs.85%29.aspx)

\
一樣先偷偷引用一下文章中的結構：\

``` {.brush: .cpp;}
typedef struct _TEB
{
        NT_TIB                  Tib;//0x00
        PVOID                   EnvironmentPointer;//0x01c
        CLIENT_ID               Cid;//0x20
        PVOID                   ActiveRpcInfo;//0x28
        PVOID                   ThreadLocalStoragePointer;//0x2c
        PPEB                    Peb;//0x30
        ULONG                   LastErrorValue;
        ULONG                   CountOfOwnedCriticalSections;
        PVOID                   CsrClientThread;
        PVOID                   Win32ThreadInfo;
        ULONG                   Win32ClientInfo[0x1F];
        PVOID                   WOW32Reserved;
        ULONG                   CurrentLocale;
        ULONG                   FpSoftwareStatusRegister;
        PVOID                   SystemReserved1[0x36];
        PVOID                   Spare1;
        ULONG                   ExceptionCode;
        ULONG                   SpareBytes1[0x28];
        PVOID                   SystemReserved2[0xA];
        ULONG                   GdiRgn;
        ULONG                   GdiPen;
        ULONG                   GdiBrush;
        CLIENT_ID               RealClientId;
        PVOID                   GdiCachedProcessHandle;
        ULONG                   GdiClientPID;
        ULONG                   GdiClientTID;
        PVOID                   GdiThreadLocaleInfo;
        PVOID                   UserReserved[5];
        PVOID                   GlDispatchTable[0x118];
        ULONG                   GlReserved1[0x1A];
        PVOID                   GlReserved2;
        PVOID                   GlSectionInfo;
        PVOID                   GlSection;
        PVOID                   GlTable;
        PVOID                   GlCurrentRC;
        PVOID                   GlContext;
        NTSTATUS                LastStatusValue;
        UNICODE_STRING          StaticUnicodeString;
        WCHAR                   StaticUnicodeBuffer[0x105];
        PVOID                   DeallocationStack;
        PVOID                   TlsSlots[0x40];
        LIST_ENTRY              TlsLinks;
        PVOID                   Vdm;
        PVOID                   ReservedForNtRpc;
        PVOID                   DbgSsReserved[0x2];
        ULONG                   HardErrorDisabled;
        PVOID                   Instrumentation[0x10];
        PVOID                   WinSockData;
        ULONG                   GdiBatchCount;
        ULONG                   Spare2;
        ULONG                   Spare3;
        ULONG                   Spare4;
        PVOID                   ReservedForOle;
        ULONG                   WaitingOnLoaderLock;
        PVOID                   StackCommit;
        PVOID                   StackCommitMax;
        PVOID                   StackReserved;
} TEB, *PTEB; 
```

今天的重點要找出在一個進程中負責存放所有模組的名單結構在哪，好方便我們可以在寫Shellcode時候可以做獲取某個API的基礎地址（大部分情況下系統API地址是會浮動、甚至尚未被載入到該進程中的）\
\
那麼這個負責存放所有模組名單的結構在Windows的PE架構設計上，在TEB上可以看到在Offset為0x30上有個叫做ProcessEnvironmentBlock（PEB）負責存放當前進程的環境內容，\
在參考了一下MSDN上微軟官方對PEB的定義如下：\

``` {.brush .: .cpp;}
typedef struct _PEB {
  BYTE                          Reserved1[2];//0x00
  BYTE                          BeingDebugged;//0x00 + 1 *2 = 0x02
  BYTE                          Reserved2[1];//0x02 + 1 = 0x03
  PVOID                         Reserved3[2];//0x03 + 1 = 0x04
  PPEB_LDR_DATA                 Ldr;//0x04 + 4 *2 = 0x0C
  PRTL_USER_PROCESS_PARAMETERS  ProcessParameters;
  BYTE                          Reserved4[104];
  PVOID                         Reserved5[52];
  PPS_POST_PROCESS_INIT_ROUTINE PostProcessInitRoutine;
  BYTE                          Reserved6[128];
  PVOID                         Reserved7[1];
  ULONG                         SessionId;
} PEB, *PPEB;
```

在Offset為0x0C上有個叫做Ldr的成員，它指向的是\_PEB\_LDR\_DATA結構體，\
這結構體在MSDN官網上查詢結果如下：\
\

``` {.brush .: .cpp;}
typedef struct _PEB_LDR_DATA {
  BYTE       Reserved1[8];
  PVOID      Reserved2[3];
  LIST_ENTRY InMemoryOrderModuleList;
} PEB_LDR_DATA, *PPEB_LDR_DATA;
```

但是根據[緩衝區溢位攻擊：第三章 -
改變程式執行的行為](http://securityalley.blogspot.tw/2013/06/blog-post.html)原文作者使用WinDbg去下斷點獲取的結構體長的像如下：\

``` {.brush: .cpp;}
0:000> dt ntdll!_PEB_LDR_DATA
   +0x000 Length           : Uint4B
   +0x004 Initialized      : UChar
   +0x008 SsHandle         : Ptr32 Void
   +0x00c InLoadOrderModuleList : _LIST_ENTRY
   +0x014 InMemoryOrderModuleList : _LIST_ENTRY
   +0x01c InInitializationOrderModuleList : _LIST_ENTRY
   +0x024 EntryInProgress  : Ptr32 Void
```

可以看到從0x00c
InLoadOrderModuleList以後的成員，微軟官方刻意的隱匿資訊，不希望一般開發者發現這件事情喔XD（並且Offset從0x00\~0x0c都被當作保留成員，不告訴我們資訊XD，看來微軟也很不願意公布太多消息XDDD）\
\
這邊有個很關鍵的資訊是在Offset等於0x1C
InInitializationOrderModuleList這裡，這個成員結構體保留了整個系統在CreateProcess後對該Process套上模塊的順序、當前已載入模組的基礎模組位置、資料，這個成員使用的結構類型是\_LIST\_ENTRY\
\
可以去爬一下MSDN得到\_LIST\_ENTRY結構體：\

``` {.brush: .cpp;}
typedef struct _LIST_ENTRY {
   struct _LIST_ENTRY *Flink;
   struct _LIST_ENTRY *Blink;
} LIST_ENTRY, *PLIST_ENTRY, *RESTRICTED_POINTER PRLIST_ENTRY;
```

修過大二資料結構（雖然我現在大一XDDDDDDD）就知道這是一個雙向式的鏈狀結構體，在Flink（0x00）成員會指向下一個\_LIST\_ENTRY結構體；而Blink（0x08）則會指向上一個成員（也就是誰的Flink指向它，那麼它的Blink就會指回去）\
\
可以參考一下下圖，[來自參考文章 - 緩衝區溢位攻擊：第三章 -
改變程式執行的行為](http://securityalley.blogspot.tw/2013/06/blog-post.html)\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-wAhqdcgPHX4/UcVTB4oktrI/AAAAAAAABrs/f15TpDUyUA4/s1600/Diagram4.png){width="640"
height="186"}](http://3.bp.blogspot.com/-wAhqdcgPHX4/UcVTB4oktrI/AAAAAAAABrs/f15TpDUyUA4/s1600/Diagram4.png)
:::

\
但是這個結構體可以幹嘛？它是Process初始化整份系統模組陣列清單的成員，在作者提及這個結構體0x00是Flink、0x04會是Blink、0x08才是存放指向模組基底地址的地方，為什麼？不知道，是實驗出來的XD（可參考緩衝區溢位攻擊原文），而存放UnicodeString的模組名稱的存放點被實驗出來的偏移會在0x20上XD。（至於為啥是實驗出來的？微軟官方沒有公開這個結構體的完整資料以前都還是只能實驗出答案\...但是實驗出來結果就是這樣XD）\
\
根據一開始一路到現在可以知道的事情如下：\
TEB → PEB(0x30) → Ldr(0x0C)\
→ InInitializationOrderModuleList(0x1C)\
→ 第一個模組結構體\
\
而模組結構體可以得知\

1.  0x00（Flink）- 指向下一個結構體
2.  0x04（Blink）- 指向上一個結構體
3.  0x08（Base）- 指向當前模組的基礎地址
4.  0x20（Name）- 指向存放UnicodeString型態的模組名稱

所以我寫了支簡單的CE AutoASM Script如下實測：\

``` {.brush: .cpp;}
alloc(Func,128)
createthread(Func)

alloc(n,04)
registersymbol(n)

Func:
mov eax,fs:[30] //PEB
mov eax,[eax+0c]//Ldr
mov eax,[eax+1c]//InInitializationOrderModuleList
//Current EAX = Point to Current Mudoal
mov [n],eax
ret
```

在Win7 x32bit環境下實測\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-z7KWSYNyTfk/VUJ-aKAYVoI/AAAAAAAAGSs/0yPO7UuGjrY/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="262"}](http://3.bp.blogspot.com/-z7KWSYNyTfk/VUJ-aKAYVoI/AAAAAAAAGSs/0yPO7UuGjrY/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 看到 \[ \[n\] + 8 \] 保存的值為0x77600000，跳到該地址看一下\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-cp_DmMiiQ1c/VUJ-1sI_geI/AAAAAAAAGS0/oLCTQ2Kj3ug/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="324"}](http://1.bp.blogspot.com/-cp_DmMiiQ1c/VUJ-1sI_geI/AAAAAAAAGS0/oLCTQ2Kj3ug/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

就可以發現原來整份InInitializationOrderModuleList鍊狀結構體名單第一個系統載入的模組對象就叫做ntdll.dll，接著在看一下
\[ \[n\] + 20 \]指向的地址為 0x77668530\
[![](http://1.bp.blogspot.com/-uBy0BzXyojw/VUJ_b6OjyKI/AAAAAAAAGS8/gyMGPy_hSS4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="132"}](http://1.bp.blogspot.com/-uBy0BzXyojw/VUJ_b6OjyKI/AAAAAAAAGS8/gyMGPy_hSS4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)\
很好，既然我們有辦法取得模組地址、Flink、模組名稱，那麼就應該有辦法取出Kernel32.dll\
\
前面說0x00的Blink成員會指向下一個結構體的存放位置，所以我們實測一下\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-cVSK2ZH4k28/VUKAFaQ-AEI/AAAAAAAAGTE/8xU0p47xs-g/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="246"}](http://4.bp.blogspot.com/-cVSK2ZH4k28/VUKAFaQ-AEI/AAAAAAAAGTE/8xU0p47xs-g/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 我只在mov \[n\],eax前在加了一句mov
eax,\[eax+00\]，透過這句話來將當前eax移動到Flink來移動到下一個模組結構體的結構基址上，實驗後發現：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-AA-3ksLeuxg/VUKAsCqHpyI/AAAAAAAAGTM/FHIgla1LuUg/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="366"}](http://4.bp.blogspot.com/-AA-3ksLeuxg/VUKAsCqHpyI/AAAAAAAAGTM/FHIgla1LuUg/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 \[ \[n\] + 8 \] 指向
0x75640000位置，其實就是KERNELBASE.dll，這應該是VISTA開始新增的一個模組，如果在XP下實測應該會是Kernel32.dll\
\
這樣就可以發現一件事情，我們只要在比對完第一個模組的名字不是我們要的模組（如Kernel32.dll）那麼我們就做mov
eax,\[eax +
0\]來移動到下一個模組，繼續比對名字，如果不對在繼續移動\...如此就可以達成暴力列舉PE模組資訊來尋找指定的模組基址了！\
\
\
所以依據這種想法，另外原文作者也提示說Kernel32.dll（一共12個字，因為文字型態為Unicode所以占用12\*2
=
24個BYTE，所以第25個字必須為\\x00）會使文字中第25個char為\\x00，於是就可以寫出一個這樣子的CE
AutoASM腳本：\

``` {.brush: .cpp;}
//Find Kernel32 Base, By.aaaddress1.
alloc(Func,128)
createthread(Func)
label(Search)
alloc(BaseAdr,04)
registersymbol(BaseAdr)
alloc(NameAdr,04)
registersymbol(NameAdr)

Func:
mov eax,fs:[30] //PEB
mov eax,[eax+0c]//Ldr
mov eax,[eax+1c]//InInitializationOrderModuleList
//Current EAX = Point to Current Mudoal
Search:
mov ebx,[eax+08]//Point to Current Modual Base.
mov [BaseAdr],ebx
mov ebx,[eax+20]//Point to Current Name.
mov [NameAdr],ebx
mov ebx,[ebx+18]//Get the char of Name[25].
test ebx,ebx//Test if Name[25] == \x00.
mov eax,[eax+00]
jnz Search
ret
```

實測如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-YvVYcgpkjyo/VUKD3PIP2AI/AAAAAAAAGTY/jpdQimPv1dI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="336"}](http://4.bp.blogspot.com/-YvVYcgpkjyo/VUKD3PIP2AI/AAAAAAAAGTY/jpdQimPv1dI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 看一下我寫的腳本跑完後，BaseAdr變數內容指向的0x76EA0000地址：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-HBGSlOBVaUk/VUKEIDgaj8I/AAAAAAAAGTg/6hElLMxYQCI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="226"}](http://1.bp.blogspot.com/-HBGSlOBVaUk/VUKEIDgaj8I/AAAAAAAAGTg/6hElLMxYQCI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 而NameAdr指向的0x000F2C58地址：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-dvAuraxxpMI/VUKEW-emrqI/AAAAAAAAGTo/B3QefHPpsZY/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="72"}](http://3.bp.blogspot.com/-dvAuraxxpMI/VUKEW-emrqI/AAAAAAAAGTo/B3QefHPpsZY/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

相當成功啊～～打完收工！
