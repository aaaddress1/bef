\-\-- layout: post title:
\"\[C++\]\[PEB\]\[ASM\]硬幹取得指定函數的內存地址、透過PEB枚舉獲取指定內存地址之函數名稱\"
date: \'2015-02-16T08:54:00.001-08:00\' author: 聖豪馬 tags: - CBuilder
- CPlus - ASM modified\_time: \'2015-06-01T04:43:40.397-07:00\'
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-8929587396336594148
blogger\_orig\_url: http://helloadr.blogspot.com/2015/02/cpebasmpeb.html
\-\-- 這篇是個人筆記啦XD\
基本上就是因為網路上要找到寫這種奇怪的東西，實在找不到\
所以就去網路上東抓西抓然後改一改弄出來的東西了\
\
首先是\
透過指定模組取得函數名稱的地址(其實就是GetProcAddress API的功能啦)\
\

``` {.brush: .cpp;}
DWORD GetFuncAddr(HMODULE hModule,char* FuncName)
{
PIMAGE_DOS_HEADER pDosHeader;
PIMAGE_NT_HEADERS pNtHeader;
PIMAGE_EXPORT_DIRECTORY pExportDirectory;
HMODULE hModuleBase = hModule;
pDosHeader = (PIMAGE_DOS_HEADER)hModuleBase;
pNtHeader = (PIMAGE_NT_HEADERS)((PBYTE)hModuleBase + pDosHeader->e_lfanew);
pExportDirectory = PIMAGE_EXPORT_DIRECTORY(pNtHeader->OptionalHeader.DataDirectory[0].VirtualAddress + (PBYTE)hModuleBase);
PDWORD pAddressName = PDWORD((PBYTE)hModuleBase+pExportDirectory->AddressOfNames); //函数名称表指针
PWORD pAddressOfNameOrdinals = (PWORD)((PBYTE)hModuleBase+pExportDirectory->AddressOfNameOrdinals); //函数名称序号表指针
PDWORD pAddresOfFunction = (PDWORD)((PBYTE)hModuleBase+pExportDirectory->AddressOfFunctions); //函数地址表指针
 for (int index = 0; index < (pExportDirectory->NumberOfNames); index++)
 {
  PCHAR pFunc = (PCHAR)((long)hModuleBase + *pAddressName);
  pAddressName ++ ;
  if (!strcmp(pFunc, FuncName)) return (DWORD)( (PBYTE)hModuleBase + pAddresOfFunction[*pAddressOfNameOrdinals]);
  pAddressOfNameOrdinals++;//ENT和函数名序号数组两个并行数组同时滑动指针(序号数组中的序号就对应函数名对应的函数地址的数组索引)
 }
 return (NULL);
}
```

再來就是\
網路上找不太到該怎麼實做的\
＂從指定函數地址取得函數名稱＂（應該說是GetProcAddress的反函數吧？）\
實際做法其實就是把上面的暴力枚舉模組的API反過來檢測而已\

``` {.brush: .cpp;}
AnsiString GetFuncName(HMODULE hModule,DWORD FuncAddr)
{
PIMAGE_DOS_HEADER pDosHeader;
PIMAGE_NT_HEADERS pNtHeader;
PIMAGE_EXPORT_DIRECTORY pExportDirectory;
HMODULE hModuleBase = hModule;
pDosHeader = (PIMAGE_DOS_HEADER)hModuleBase;
pNtHeader = (PIMAGE_NT_HEADERS)((PBYTE)hModuleBase + pDosHeader->e_lfanew);
pExportDirectory = PIMAGE_EXPORT_DIRECTORY(pNtHeader->OptionalHeader.DataDirectory[0].VirtualAddress + (PBYTE)hModuleBase);
PDWORD pAddressName = PDWORD((PBYTE)hModuleBase+pExportDirectory->AddressOfNames); //函数名称表指针
PWORD pAddressOfNameOrdinals = (PWORD)((PBYTE)hModuleBase+pExportDirectory->AddressOfNameOrdinals); //函数名称序号表指针
PDWORD pAddresOfFunction = (PDWORD)((PBYTE)hModuleBase+pExportDirectory->AddressOfFunctions); //函数地址表指针
 for (int index = 0; index < (pExportDirectory->NumberOfNames); index++)
 {
  PCHAR pFunc = (PCHAR)((long)hModuleBase + *pAddressName);
  pAddressName ++ ;
  DWORD CurrentFuncAddr = ( (DWORD)hModuleBase + pAddresOfFunction[*pAddressOfNameOrdinals]) ;
  if ( !(CurrentFuncAddr - FuncAddr) )
  {
   return pFunc;
  }
  pAddressOfNameOrdinals++;
 }
 return ("");
}
```

最後就是\
萬一如果知道內存地址但是不知道它在哪個模組上的時候\
 要馬可以透過VirtualQueryEx取得模組基址\
但要是VirtualQueryEx沒辦法取得的時候就得透過PEB表暴力列舉所有模組然後去搜索\

``` {.brush: .cpp;}
AnsiString EnumGetFuncName(DWORD FuncAddr)
{
 MEMORY_BASIC_INFORMATION mbi;
 VirtualQueryEx((void*)-1,(void *)FuncAddr,&mbi,sizeof(MEMORY_BASIC_INFORMATION));
 if (mbi.BaseAddress && mbi.AllocationBase) return (GetFuncName((HMODULE)mbi.AllocationBase ,FuncAddr));
 void *PEB = NULL,
 *Ldr = NULL,
 *Flink = NULL,
 *p = NULL,
 *BaseAddress = NULL,
 *FullDllName = NULL;
 asm
 {
  mov eax,fs:[0x30]
  mov PEB,eax
 }
 Ldr = *( ( void ** )( ( unsigned char * )PEB+0x0c ) );
 Flink = *( ( void ** )( ( unsigned char * )Ldr+ 0x1c ) );
 p = Flink;
 do
 {
  BaseAddress = *( ( void ** )( ( unsigned char * )p+ 0x08 ) );
  FullDllName = *( ( void ** )( ( unsigned char * )p+ 0x18) );
  AnsiString CurrentFoundName = GetFuncName((HMODULE)BaseAddress,FuncAddr);
  if (CurrentFoundName != "") return CurrentFoundName ;
  p = *( ( void ** )p);
 }
 while ( Flink != p );
 return "";
}
```
