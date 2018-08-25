\-\-- layout: post title:
\"\[C++\]\[ASM\]免API撈模組基址(asm從PEB硬幹)\" date:
\'2015-02-15T03:37:00.001-08:00\' author: 聖豪馬 tags: - CPlus - ASM
modified\_time: \'2015-06-01T04:43:40.373-07:00\' blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-4251276204121700849
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/02/casmapiasmeb.html \-\--
這是從對岸忘記從哪裡撈來的\...\
不過看了一下手法很漂亮就記錄下來惹XD\
原理是用asm從PEB去指向模組的List去找這樣\
底下稍微改過原本寫法然後補上註解\

> DWORD GetSelfModule()//等同GetModuleHanle(NULL)\
> {\
> DWORD dRetn = 0;\
> asm\
> {\
>    push eax //保護堆疊\
>    MOV eax,dword ptr fs:\[0x30\] // pointer to PEB\
>    MOV eax,dword ptr \[eax+0x8\] //eax = Current Module Base\
>    MOV \[dRetn\],eax\
>    pop eax //恢復堆疊\
> }\
> return dRetn;\
> }

另個是如果想搜索\

> DWORD GetKernelModule()//獲取Kernel32 DLL Base\
> {\
> [ ]{.Apple-tab-span style="white-space: pre;"}DWORD dRetn = 0;\
> [ ]{.Apple-tab-span style="white-space: pre;"}asm\
> [ ]{.Apple-tab-span style="white-space: pre;"}{\
> [ ]{.Apple-tab-span style="white-space: pre;"}   push eax\
> [ ]{.Apple-tab-span style="white-space: pre;"}   mov eax,dword ptr
> fs:\[0x30\]   //pointer to PEB\
> [ ]{.Apple-tab-span style="white-space: pre;"}   mov eax,dword ptr
> \[eax+0x0c\]   //pointer to loader data\
> [ ]{.Apple-tab-span style="white-space: pre;"}   mov eax,dword ptr
> \[eax+0x1c\]   //first entry in initialization order list (ntdll.dll)\
> [ ]{.Apple-tab-span style="white-space: pre;"}   mov eax,dword ptr
> \[eax\]    //second entry int initialization order list
> (kernel32.dll)\
> [ ]{.Apple-tab-span style="white-space: pre;"}   mov eax,dword ptr
> \[eax+0x08\]   //base addr of kernel32.dll\
> [ ]{.Apple-tab-span style="white-space: pre;"}   mov \[dRetn\],eax\
> [ ]{.Apple-tab-span style="white-space: pre;"}   pop eax\
> [ ]{.Apple-tab-span style="white-space: pre;"}}\
> return dRetn;\
> }

至於可以用在哪\.....\
比如說\...要做黑黑的事情但是不想被防毒檢測到之類的XD(?)\
或者遊戲保護不給搜索(?)不過一般遊戲不會防這個啦\
\
忘了補一個\
看雪的某個大大丟的寫法這個也不錯XD\

> > //\*參考 看雪 【原创】搜索输出表取得GetProcAddress地址C++版
>
> > PIMAGE\_DOS\_HEADER pDosHeader;
>
> > PIMAGE\_NT\_HEADERS pNtHeader;
>
> > PIMAGE\_EXPORT\_DIRECTORY pExportDirectory;
>
> > HMODULE hModuleBase = hModule;
>
> > pDosHeader = (PIMAGE\_DOS\_HEADER)hModuleBase;
>
> > pNtHeader = (PIMAGE\_NT\_HEADERS)((PBYTE)hModuleBase +
> > pDosHeader-\>e\_lfanew);
>
> > pExportDirectory =
> > PIMAGE\_EXPORT\_DIRECTORY(pNtHeader-\>OptionalHeader.DataDirectory\[0\].VirtualAddress
> > + (PBYTE)hModuleBase);
>
> > PDWORD pAddressName =
> > PDWORD((PBYTE)hModuleBase+pExportDirectory-\>AddressOfNames);
> > //函数名称表指针
>
> > PWORD pAddressOfNameOrdinals =
> > (PWORD)((PBYTE)hModuleBase+pExportDirectory-\>AddressOfNameOrdinals);
> > //函数名称序号表指针
>
> > //PDWORD pAddresOfFunction =
> > (PDWORD)((PBYTE)hModuleBase+pExportDirectory-\>AddressOfFunctions);
> > //函数地址表指针
>
> > [ ]{.Apple-tab-span style="white-space: pre;"}for (int index = 0;
> > index \< (pExportDirectory-\>NumberOfNames); index++)
>
> > [ ]{.Apple-tab-span style="white-space: pre;"}{
>
> > [ ]{.Apple-tab-span style="white-space: pre;"}PCHAR pFunc =
> > (PCHAR)((long)hModuleBase + \*pAddressName);
>
> > [ ]{.Apple-tab-span style="white-space: pre;"}pAddressName ++ ;
>
> > [ ]{.Apple-tab-span style="white-space: pre;"}if (!strcmp(pFunc,
> > \"GetProcAddress\")) break;
>
> > [ ]{.Apple-tab-span
> > style="white-space: pre;"}pAddressOfNameOrdinals++;//ENT和函数名序号数组两个并行数组同时滑动指针(序号数组中的序号就对应函数名对应的函数地址的数组索引)
>
> > [ ]{.Apple-tab-span style="white-space: pre;"}}
