\-\-- layout: post title: \"\[Windows\]\[PE\]\[ASM\]純組語手幹Dll
Header解析外導函數表撈出函數地址（如LoadLibraryA動態地址）\" date:
\'2015-05-04T10:42:00.001-07:00\' author: 聖豪馬 tags: - PE - Windows -
ASM modified\_time: \'2015-05-06T11:07:49.876-07:00\' thumbnail:
http://2.bp.blogspot.com/-h443epemzvo/UcVVMRIJYnI/AAAAAAAABsM/Qk5l3p87vAc/s72-c/Diagram5.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-5963375336989871971
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/05/windowspeasmdll-headerapiloadlibrarya.html
\-\-- 此篇內容接續著前幾篇Blog文：\

-   [從PE架構淺談純組語撈出當前進程的映像路徑 ](http://helloadr.blogspot.tw/2015/04/windowspeasmcepe.html)
-   [從PE架構到模組架構到暴力列舉模組找模組位置（如Kernel32.dll）](http://helloadr.blogspot.tw/2015/04/windowspeasmcepekernel32dll.html)

參考文獻\

1.  [緩衝區溢位攻擊：第三章 -
    改變程式執行的行為](http://securityalley.blogspot.tw/2013/06/blog-post.html)

今天如果已經能找出進程中模組內容、列舉模組，但是模組並不是我們需要的直接呼叫的目標（應該說我們想找出模組資料、細節，就是為了內部的函數來做呼叫），所以今天我們的目標是用組語透過模組的資料結構來分析一個動態記憶體中的DLL
Library的模組陣列結構、進一步來做篩選出我們要的函數地址在哪裡（如LoadLibraryA在進程中的哪個位置上）\
\
首先可以去翻翻DLL在Windows從DLL頭開始會有DOS Header、NT
Header、各區段節..等\
可以參考[緩衝區溢位攻擊：第三章 -
改變程式執行的行為](http://securityalley.blogspot.tw/2013/06/blog-post.html)中的圖：\
\
![](http://2.bp.blogspot.com/-h443epemzvo/UcVVMRIJYnI/AAAAAAAABsM/Qk5l3p87vAc/s1600/Diagram5.png)\
而我們要找一個DLL中有哪些函數可以給我們引用，例如說：Kernel32中的OpenProcess、GetCurrentThreadId、LoadLibraryA\...等。這些函數都被稱之為導出函數（Export
Function），也就是該DLL願意分享出去給其他使用者去調用其中的函數。\
\
在這張圖上我們清楚看到整個DLL中第一個區段（也就是在Offset =
0的時候）為DOS
Header，也就是說，整個DLL架構中我唯一能確定的資料結構就是DOS
Header，所以可以先看一下DOS Header的結構如下：\

``` {.brush:cpp;}
typedef struct _IMAGE_DOS_HEADER {      // DOS .EXE header
    WORD   e_magic;                     // Magic number
    WORD   e_cblp;                      // Bytes on last page of file
    WORD   e_cp;                        // Pages in file
    WORD   e_crlc;                      // Relocations
    WORD   e_cparhdr;                   // Size of header in paragraphs
    WORD   e_minalloc;                  // Minimum extra paragraphs needed
    WORD   e_maxalloc;                  // Maximum extra paragraphs needed
    WORD   e_ss;                        // Initial (relative) SS value
    WORD   e_sp;                        // Initial SP value
    WORD   e_csum;                      // Checksum
    WORD   e_ip;                        // Initial IP value
    WORD   e_cs;                        // Initial (relative) CS value
    WORD   e_lfarlc;                    // File address of relocation table
    WORD   e_ovno;                      // Overlay number
    WORD   e_res[4];                    // Reserved words
    WORD   e_oemid;                     // OEM identifier (for e_oeminfo)
    WORD   e_oeminfo;                   // OEM information; e_oemid specific
    WORD   e_res2[10];                  // Reserved words
    LONG   e_lfanew;                    // File address of new exe header
  } IMAGE_DOS_HEADER, *PIMAGE_DOS_HEADER;
```

這個DOS
Header應該是為了兼容舊版MS-DOS時代軟體所留下來的結構，而今天重點只放在最後一個e\_lfanew（Offset
= 0x3C）的變數上，裡面存放了NT
Header所在的偏移值為多少，藉由此偏移值加上當前DLL所在的地址就可以精確的計算出NT
Header結構體所在的位置在哪裡。\
\
找到NT Header後，可以看一下NT Header結構體如下：\
\

``` {.brush:cpp;}
typedef struct _IMAGE_NT_HEADERS {
    DWORD Signature;
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER32 OptionalHeader;// + 0x18
} IMAGE_NT_HEADERS32, *PIMAGE_NT_HEADERS32;
```

\
NT
Header中三個區段，我們說外導函數表會存放在OptionalHeader（0x18）區段中；而Optional
Header節段的最後一項Data
Directories區段內有16個DWORD變數的陣列（也就是這個區段占用的大小有16\*4
= 64 BYTE這麼大）區段依序紀錄指向的資料結構如下：\
\

``` {.brush: .cpp;}
#define IMAGE_DIRECTORY_ENTRY_EXPORT          0   // Export Directory
#define IMAGE_DIRECTORY_ENTRY_IMPORT          1   // Import Directory
#define IMAGE_DIRECTORY_ENTRY_RESOURCE        2   // Resource Directory
#define IMAGE_DIRECTORY_ENTRY_EXCEPTION       3   // Exception Directory
#define IMAGE_DIRECTORY_ENTRY_SECURITY        4   // Security Directory
#define IMAGE_DIRECTORY_ENTRY_BASERELOC       5   // Base Relocation Table
#define IMAGE_DIRECTORY_ENTRY_DEBUG           6   // Debug Directory
#define IMAGE_DIRECTORY_ENTRY_COPYRIGHT       7   // (x86 usage)
#define IMAGE_DIRECTORY_ENTRY_ARCHITECTURE    7   // Architecture Specific Data
#define IMAGE_DIRECTORY_ENTRY_GLOBALPTR       8   // RVA of GP
#define IMAGE_DIRECTORY_ENTRY_TLS             9   // TLS Directory
#define IMAGE_DIRECTORY_ENTRY_LOAD_CONFIG    10   // Load Configuration Directory
#define IMAGE_DIRECTORY_ENTRY_BOUND_IMPORT   11   // Bound Import Directory in headers
#define IMAGE_DIRECTORY_ENTRY_IAT            12   // Import Address Table
#define IMAGE_DIRECTORY_ENTRY_DELAY_IMPORT   13   // Delay Load Import Descriptors
#define IMAGE_DIRECTORY_ENTRY_COM_DESCRIPTOR 14   // COM Runtime descriptor
```

而今天我們的目標就是撈出導出函數表、比對一個DLL內所有導出的函數哪個是我們想用的函數，找到後再取出該函數的記憶體中的絕對位置，如此便能讓我們調用；很快的就可以看到再Offset
=
0的IMAGE\_DIRECTORY\_ENTRY\_EXPORT結構體指向的就是我們要找的導出函數資料結構體，那麼在看一下IMAGE\_DIRECTORY\_ENTRY\_EXPORT的定義：\

``` {.brush:cpp;}
typedef struct _IMAGE_EXPORT_DIRECTORY {
    DWORD   Characteristics;
    DWORD   TimeDateStamp;
    WORD    MajorVersion;
    WORD    MinorVersion;
    DWORD   Name;
    DWORD   Base;
    DWORD   NumberOfFunctions;      // + 0x14
    DWORD   NumberOfNames;          // + 0x18
    DWORD   AddressOfFunctions;     // + 0x1C
    DWORD   AddressOfNames;         // + 0x20
    DWORD   AddressOfNameOrdinals;  // + 0x24
} IMAGE_EXPORT_DIRECTORY, *PIMAGE_EXPORT_DIRECTORY;
```

今天重點我們放在末五個變數，分別為NumberOfFunctions（0x14）、NumberOfNames（0x18）、AddressOfFunctions（0x1C）、AddressOfNames（0x20）、AddressOfNameOrdinals（0x24）\
\
它們功用如下：\

-   NumberOfFunctions - 紀錄當前DLL有多少個外導函數
-   NumberOfNames - 紀錄當前DLL有多少個外導函數名稱
-   AddressOfFunctions - 紀錄所有函數的偏移
-   AddressOfNames - 紀錄著所有函數名的偏移
-   AddressOfNameOrdinals -
    紀錄著AddressOfFunctions要的函數地址是多少索引值 

所以今天可以推導出一個策略該如何找到一個DLL中的指定函數所在的地址呢？以Kernel32.dll中的LoadLibraryA函數而言，首先我們得從Kernel32.dll中的DOS
Header內e\_lfanew（0x3C）取得NT Header，接著從NT
header找到OptionalHeader（0x18）區段，在找到OptionalHeader區段中的IMAGE\_DIRECTORY\_ENTRY\_EXPOR結構體\
\
找到了IMAGE\_DIRECTORY\_ENTRY\_EXPOR結構體後，
我們就可以從AddressOfNames（0x20）函數名陣列去列舉所有DLL中的導出函數有哪些，找到了＂LoadLibraryA＂的函數名後，看它是在AddressOfNames中的第幾個，拿此索引值去AddressOfNameOrdinals（0x24）找出相對應索引值上的Ordinals欄位內寫的索引值為多少，拿此索引值去查詢AddressOfFunctions（0x1C）陣列，就可以取出該函數的偏移在哪，加上DLL的地址後就會是記憶體中該函數的絕對地址了\
\
聽起來有點囉嗦\...我寫了一個CE的AutoASM腳本效果如下：\

``` {.brush:cpp;}
//NT Header Find LoadLibraryA Address Of Kernel32.dll.
//By aaaddress1.
alloc(Func,128)
createthread(Func)
alloc(Get,04)
registersymbol(Get)
label(NextFind)
label(MyLeave)

Func:
mov eax, kernel32.dll//DLL Base Address.
mov ebx, [eax+3C]//e_iframe Offset(DOS Header)
add ebx, eax//EBX Point To NTHeader Address.
add ebx, 18//NT Header -> OptionalHeader.
add ebx, 60//IMAGE_OPTIONAL_HEADER -> DataDirectory.
add ebx, 00//IMAGE_DIRECTORY_ENTRY_EXPORT Offset.
mov ebx, [ebx]//EBX = IMAGE_DIRECTORY_ENTRY_EXPORT Offset
add ebx, eax//EBX Point To IMAGE_DIRECTORY_ENTRY_EXPORT

mov ecx, [ebx+18]//ECX = Number Of Names

NextFind:
mov edx, [ebx+20]//EDX = Offset Of Name Address Array.
add edx, eax//EDX Point to Name Address Array.
mov edx, [edx+ecx*4]//ECX(index) * sizeof(DWORD) + Name Array Address. 
add edx, eax//Offset + eax(Kernel32.dll address) = Current String Address.
dec ecx
jl MyLeave//Find Fail.

cmp [edx+00],64616F4C//Name[0~4] = {'L','o','a','d'}
jne NextFind
cmp [edx+08],41797261//Name[8~11] = {'a','r','y','A'}
jne NextFind

//Find Correct "LoadLibraryA" String Address.
inc ecx//前面會多扣一次,這邊我們補回來.
mov edx, [ebx+24]//EDX = AddressOfNameOrdinals  Array Offset.
add edx, eax//EDX Point to AddressOfNameOrdinals  Address.
mov cx, [edx+ecx*2]//ECX = AddressOfNameOrdinals  + Index As WORD(2 BYTE)
mov edx,[ebx+1C]//EDX = AddressOfFunction Array Offset.
add edx, eax//EDX Point to AddressOfFunction Array Address.
mov edx, [edx+ecx*4]//Set EDX = Value Of AddressOfFunction[Index] = Offset.
add edx, eax//EDX Point to Function Address.
mov [Get],edx//Got It!

MyLeave:
ret
```

實測結果如下：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-wbQrlMPi77k/VUe9Inq9cqI/AAAAAAAAGUQ/V29xs4EMHxQ/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="304"}](http://4.bp.blogspot.com/-wbQrlMPi77k/VUe9Inq9cqI/AAAAAAAAGUQ/V29xs4EMHxQ/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

可以取出Get變數內的地址為0x7615DD15，實際看一下0x7615DD15的函數：\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/--F_lCeS4-iw/VUe9bF5bd_I/AAAAAAAAGUY/kpPyxK1im58/s640/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="640"
height="200"}](http://2.bp.blogspot.com/--F_lCeS4-iw/VUe9bF5bd_I/AAAAAAAAGUY/kpPyxK1im58/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

成功惹！\
\
最後，\
可以結合前一篇Blog文[從PE架構到模組架構到暴力列舉模組找模組位置（如Kernel32.dll）](http://helloadr.blogspot.tw/2015/04/windowspeasmcepekernel32dll.html)寫好的數據，寫出以下AutoASM腳本，就可以達成純組語不用API卻可以撈出正確的LoadLibraryA的記憶體地址囉！\
\

``` {.brush:cpp;}
//NT Header Find LoadLibraryA Address Of Kernel32.dll.
//By aaaddress1.
alloc(Func,100)
createthread(Func)
alloc(Get,04)
registersymbol(Get)
label(Search)
label(NextFind)
label(MyLeave)
Func:
/*Find DLL Base Of Kernel32.dll*/
mov ebx,fs:[30] //PEB
mov ebx,[ebx+0c]//Ldr
mov ebx,[ebx+1c]//InInitializationOrderModuleList
Search:
mov eax,[ebx+08]//Point to Current Modual Base.
mov ecx,[ebx+20]//Point to Current Name.
mov ecx,[ecx+18]//Get the char of Name[25].
test ecx,ecx//Test if Name[25] == \x00.
mov ebx,[ebx+00]
jnz Search
/*EAX = Kernel32.dll Address.
Start To Find LoadLibraryA Address.*/
mov ebx, [eax+3C]//e_iframe Offset(DOS Header)
add ebx, eax//EBX Point To NTHeader Address.
mov ebx, [ebx+78]//EBX = IMAGE_DIRECTORY_ENTRY_EXPORT Offset
add ebx, eax//EBX Point To IMAGE_DIRECTORY_ENTRY_EXPORT
mov ecx, [ebx+18]//ECX = Number Of Names
NextFind:
mov edx, [ebx+20]//EDX = Offset Of Name Address Array.
add edx, eax//EDX Point to Name Address Array.
mov edx, [edx+ecx*4]//ECX(index) * sizeof(DWORD) + Name Array Address.
add edx, eax//Offset + eax(Kernel32.dll address) = Current String Address.
dec ecx
jl MyLeave//Find Fail.
cmp [edx+08],41797261//Name[8~11] = {'a','r','y','A'}
jne NextFind
inc ecx//前面會多扣一次,這邊我們補回來.
mov edx, [ebx+24]//EDX = AddressOfNameOrdinals  Array Offset.
add edx, eax//EDX Point to AddressOfNameOrdinals  Address.
mov cx, [edx+ecx*2]//ECX = AddressOfNameOrdinals  + Index As WORD(2 BYTE)
mov edx,[ebx+1C]//EDX = AddressOfFunction Array Offset.
add edx, eax//EDX Point to AddressOfFunction Array Address.
mov edx, [edx+ecx*4]//Set EDX = Value Of AddressOfFunction[Index] = Offset.
add edx, eax//EDX Point to Function Address.
mov [Get],edx//Got It!
MyLeave:
ret
```

最後，我花了點時間，參照原文的方式加入了Hash來比對文字（而非上面用ASCII做字節判斷）
額外還加了一些模組化的設計，成果像這樣：

``` {.brush:cpp;}
//NT Header Find LoadLibraryA Address Of Kernel32.dll.
//By aaaddress1.
alloc(Func,256)
createthread(Func)
alloc(Get,04)
registersymbol(Get)
registersymbol(Func)

//===============HASH FUNCTION=================
alloc(HashFunc,128)
label(compute_hash_again)
label(compute_hash_finished)
HashFunc:
xor edi, edi
xor eax, eax
cld
compute_hash_again:
lodsb
test eax, eax
jz compute_hash_finished
ror edi, 0D
add edi, eax
jmp compute_hash_again
compute_hash_finished:
mov eax,edi
ret

//================FIND FUNCTION ADDRESS.=======
alloc(FindFuncAddr,256)
label(NextFind)
label(MyLeave)

FindFuncAddr:
mov ebp, [esp+04]//GET DLL Base
mov ebx, [ebp+3C]//e_iframe Offset(DOS Header)
add ebx, ebp//EBX Point To NTHeader Address.
mov ebx, [ebx+78]//EBX = IMAGE_DIRECTORY_ENTRY_EXPORT Offset
add ebx, ebp//EBX Point To IMAGE_DIRECTORY_ENTRY_EXPORT
mov ecx, [ebx+18]//ECX = Number Of Names
NextFind:
mov edx, [ebx+20]//EDX = Offset Of Name Address Array.
add edx, ebp//EDX Point to Name Address Array.
mov edx, [edx+ecx*4]//ECX(index) * sizeof(DWORD) + Name Array Address.
add edx, ebp//Offset + eax(Kernel32.dll address) = Current String Address.
dec ecx
jl MyLeave//Find Fail.

mov esi, edx
call HashFunc
cmp eax, [esp+08]
jne NextFind
inc ecx//前面會多扣一次,這邊我們補回來.
mov eax, [ebx+24]//EDX = AddressOfNameOrdinals  Array Offset.
add eax, ebp//EDX Point to AddressOfNameOrdinals  Address.
mov cx, [eax+ecx*2]//ECX = AddressOfNameOrdinals  + Index As WORD(2 BYTE)
mov eax,[ebx+1C]//EDX = AddressOfFunction Array Offset.
add eax, ebp//EDX Point to AddressOfFunction Array Address.
mov eax, [eax+ecx*4]//Set EDX = Value Of AddressOfFunction[Index] = Offset.
add eax, ebp//EDX Point to Function Address.
MyLeave:
ret 08

//===============FIND KERNEL32 DLL BASE==========
alloc(GetKernel32Base,64)
label(Search)
GetKernel32Base:
mov ebx,fs:[30] //PEB
mov ebx,[ebx+0c]//Ldr
mov ebx,[ebx+1c]//InInitializationOrderModuleList
Search:
mov eax,[ebx+08]//Point to Current Modual Base.
mov ecx,[ebx+20]//Point to Current Name.
cmp [ecx+18],00//Test if Name[25] == \x00.
mov ebx,[ebx+00]
jne Search
ret


//=================Main=======================
Func:
/*Find DLL Base Of Kernel32.dll*/
call GetKernel32Base

/*Start To Find LoadLibraryA Address.*/
push EC0E4E8E
push eax
call FindFuncAddr
mov [Get],eax//Got It!
ret
```
