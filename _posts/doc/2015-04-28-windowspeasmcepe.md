\-\-- layout: post title:
\"\[Windows\]\[PE\]\[ASM\]\[CE\]從PE架構淺談純組語撈出當前進程的映像路徑\"
date: \'2015-04-28T12:00:00.000-07:00\' author: 聖豪馬 tags: - PE -
CheatEngine - Windows - ASM modified\_time:
\'2015-04-29T11:25:27.159-07:00\' thumbnail:
http://2.bp.blogspot.com/-DG9Jj2EEubc/VT\_VQLRjCpI/AAAAAAAAGR4/MhI7VwktR3s/s72-c/%E6%9C%AA%E5%91%BD%E5%90%8D.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-4967046379238653034
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/04/windowspeasmcepe.html \-\--
近日很少發發廢文啊XD，大學生各種忙碌期中考\
最近觀書有感，來發發拆拆手札廢文\
\
參考文獻\

1.  [緩衝區溢位攻擊：第三章 -
    改變程式執行的行為](http://securityalley.blogspot.tw/2013/06/blog-post.html)
2.  [MSDN - PEB
    structure](https://msdn.microsoft.com/en-us/library/windows/desktop/aa813706%28v=vs.85%29.aspx)
3.  [MSDN -  RTL\_USER\_PROCESS\_PARAMETERS
    structure](https://msdn.microsoft.com/en-us/library/windows/desktop/aa813741%28v=vs.85%29.aspx)
4.  [MSDN - UNICODE\_STRING
    structure](https://msdn.microsoft.com/en-us/library/windows/desktop/aa380518%28v=vs.85%29.aspx)

懶人包：\
每個Process中都會存在一個TEB結構體\
偷偷引用一下文章中的結構：\

``` {.brush: .cpp;}
typedef struct _TEB
{
        NT_TIB                  Tib;// Offset = 0x00
        PVOID                   EnvironmentPointer;
        CLIENT_ID               Cid;
        PVOID                   ActiveRpcInfo;
        PVOID                   ThreadLocalStoragePointer;
        PPEB                    Peb;
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

\
每個Process中的TEB會存放這支Process中運行的環境、Process的屬性、或者大家Coding會用的Try的偵錯機制處理\...等，不過今天我要先講的是映像路徑（ImagePath）的擷取，所以現在著重的重點放在Offset
= 0x30上的PEB（Process Environment
Block）上，裡面會存放許多關於當前進程的屬性資料；而如果是研究BufferOverflow則對Offset
= 0x00上的NT\_TIB很熟悉了（內含WIN處理錯誤機制屬性處理的資料）\
\
那麼今天我們要取的映像路徑會放在哪？查了一下資料會得知放在PEB內的ProcessParameters結構體內的ImagePathName指標（以UnicodeString做存放）\
\
參考了一下MSDN上微軟官方對PEB的定義如下：\

``` {.brush .: .cpp;}
typedef struct _PEB {
  BYTE                          Reserved1[2];//0x00
  BYTE                          BeingDebugged;//0x00 + 1 *2 = 0x02
  BYTE                          Reserved2[1];//0x02 + 1 = 0x03
  PVOID                         Reserved3[2];//0x03 + 1 = 0x04
  PPEB_LDR_DATA                 Ldr;//0x04 + 4 *2 = 0x0C
  PRTL_USER_PROCESS_PARAMETERS  ProcessParameters;//0x0C + 4 = 0x10
  BYTE                          Reserved4[104];
  PVOID                         Reserved5[52];
  PPS_POST_PROCESS_INIT_ROUTINE PostProcessInitRoutine;
  BYTE                          Reserved6[128];
  PVOID                         Reserved7[1];
  ULONG                         SessionId;
} PEB, *PPEB;
```

可以參考一下我補上的Offset，要從PEB結構體爬到ProcessParameters的指標Offset算法會是：BYTE\*2
+ BYTE + BYTE + PVOID\*2 + PPEB\_LDA\_DATA = 0x10\
\
接著可以在參考一下MSDN上的ProcessParameters（在Windows的.h頭文件內定義是\_RTL\_USER\_PROCESS\_PARAMETERS）結構體定義：\

``` {.brush: .cpp;}
typedef struct _RTL_USER_PROCESS_PARAMETERS {
  BYTE           Reserved1[16];//0x00
  PVOID          Reserved2[10];//0x00 + 1 * 16 = 0x10
  UNICODE_STRING ImagePathName;//0x10 + 4 * 10 = 0x38
  UNICODE_STRING CommandLine;
} RTL_USER_PROCESS_PARAMETERS, *PRTL_USER_PROCESS_PARAMETERS;
```

接著看到這個結構體上我補上的Offset，一路從ProcessParameters結構體爬到ImagePathName指針的Offset就會是
BYTE\*16 + PVOID\*10 = 0x38\
\
所以這邊我用了Cheat Engine的AutoASM寫了一個簡單的彙編腳本：\

``` {.brush: .cpp;}
alloc(Func,128)
alloc(GetPtr,4)
createthread(Func)
registersymbol(GetPtr)

Func:
mov eax, fs:[30]//eax = fs[30] = PEB_address.
mov eax,[eax+10]//eax = fs[30] + ProcessParameters_offset.
add eax,38      //eax = ProcessParametersAddress + ImagePath_offset.
mov [GetPtr],eax
ret
```

跑起來像這樣；\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-DG9Jj2EEubc/VT_VQLRjCpI/AAAAAAAAGR4/MhI7VwktR3s/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="304"}](http://2.bp.blogspot.com/-DG9Jj2EEubc/VT_VQLRjCpI/AAAAAAAAGR4/MhI7VwktR3s/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 這邊我在Win7
x32bit下對記事本(notepad.exe)的進程做鎖定，執行了我寫的腳本後，可以去看到GetPtr取到地址為0x00231A90，這是什麼呢？這就會是UnicodeString的結構了（存放ImagePath文字）\
\
可以查一下MSDN上的UNICODE\_STRING結構體如下：\

``` {.brush:cpp;}
typedef struct _LSA_UNICODE_STRING {
  USHORT Length;//0x00
  USHORT MaximumLength;//0x00 + 2 = 0x02
  PWSTR  Buffer;//0x02 + 2 = 0x04
} LSA_UNICODE_STRING, *PLSA_UNICODE_STRING, UNICODE_STRING, *PUNICODE_STRING;
```

這邊可以得知我們的UncodeString上有兩個Buffer（以Short為單位，意味著其實UncodeString在Windows上最大只能到16\*16
= 256單位長）才會是指向文字內容的指針\
\
所以我們就可以得知找到文字的指針加上0x04的Offset就可以成功指向文字了\
操作如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-HcXa45BMx_Y/VT_XNZuYemI/AAAAAAAAGSE/KzmVZTUQS_w/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="276"
height="320"}](http://2.bp.blogspot.com/-HcXa45BMx_Y/VT_XNZuYemI/AAAAAAAAGSE/KzmVZTUQS_w/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

在Cheat
Engine介面下新增Pointer，地址填寫GetPtr（或者填寫0x00231A90）然後Offset填寫0x04：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-DpB04DfRIcE/VT_XhkB3O8I/AAAAAAAAGSM/sejPqaiuoog/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="144"}](http://2.bp.blogspot.com/-DpB04DfRIcE/VT_XhkB3O8I/AAAAAAAAGSM/sejPqaiuoog/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 嘿嘿，成功找到ImagePath的結構體上指向的Buffer指針囉，指針地址為0x0023271A\
接著就可以看到進程的ImagePath存放的路徑囉，如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-L8fVBdoqa80/VT_YGfaf3bI/AAAAAAAAGSU/A5lmoh_U6jY/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="140"}](http://1.bp.blogspot.com/-L8fVBdoqa80/VT_YGfaf3bI/AAAAAAAAGSU/A5lmoh_U6jY/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

 Got It！
