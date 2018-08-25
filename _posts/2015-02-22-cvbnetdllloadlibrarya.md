\-\-- layout: post title: \"\[C++\]DLL遠程注入(LoadLibraryA)\" date:
\'2015-02-22T03:21:00.002-08:00\' author: 聖豪馬 tags: - CBuilder -
Injector - CPlus modified\_time: \'2015-06-01T04:43:40.382-07:00\'
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-789087002632828971
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/02/cvbnetdllloadlibrarya.html \-\--
國中寫的東西現在翻一翻\
然後整理一下XD\
丟上來Blog當廢文發XD\

<div>

\

</div>

[\[VB.NET\]DLL跨進程遠程注入(LoadLibraryA)](http://helloadr.blogspot.tw/2015/02/vbnetdll-remote-inject-loadlibrarya.html)\

<div>

<div>

<div>

\

</div>

<div>

C++ Source Code在GitHub：

</div>

<div>

https://github.com/aaaddress1/Dll-Injector-In-CB\
\

</div>

<div>

\

</div>

<div>

``` {.brush: .cpp; name="code"}
bool EnablePrivilege()
{
//提權模組
//這個其實你用不用都沒差(在Win7以上)
//不過這個模組如果不用,在XP之下會沒辦法正常寫入記憶體/跨進程存取

HANDLE hToken=NULL;
//用OpenProcessToken確認自己的進程等級(非NULL則有權限)
if (OpenProcessToken(GetCurrentProcess(),TOKEN_ADJUST_PRIVILEGES,&hToken)) return true;
LPCTSTR szPrivName = SE_DEBUG_NAME;//調整到DEBUG
BOOL fEnable = true;
TOKEN_PRIVILEGES   tp;
tp.PrivilegeCount = 1;
LookupPrivilegeValue(NULL,szPrivName,&tp.Privileges[0].Luid);
tp.Privileges[0].Attributes   =   fEnable   ?   SE_PRIVILEGE_ENABLED:0;
AdjustTokenPrivileges(hToken,FALSE,&tp,sizeof(tp),NULL,NULL);
return((GetLastError()   ==   ERROR_SUCCESS));
}

bool RemoteInject(String DLLPath,DWORD process_id)
{
EnablePrivilege();//提權
//接著用OpenProcess取得遠端進程控制句柄
void* ProcessHandle = OpenProcess(PROCESS_ALL_ACCESS,false,process_id);
if(!ProcessHandle) return false;
//接著把String轉Char Array
char *lpszDll=AnsiString(DLLPath).c_str() ;

DWORD dwSize, dwWritten;
dwSize = lstrlenA( lpszDll ) + 1;
//在遠端進程開闢一個免費(?)空間
LPVOID lpBuf = VirtualAllocEx( ProcessHandle, NULL, dwSize, MEM_COMMIT, PAGE_READWRITE );
if (!lpBuf) return false;
//把Char Arry放進去剛剛開闢的空間
WriteProcessMemory( ProcessHandle, lpBuf, (LPVOID)lpszDll, dwSize, &dwWritten );
//取得對應的LoadLibraryA的位置
PTHREAD_START_ROUTINE pfnStartAddr = (PTHREAD_START_ROUTINE)GetProcAddress(GetModuleHandle(TEXT("Kernel32")), "LoadLibraryA");
//在對方Process開一個線程去跑LoadlibraryA去載入指定DLL
HANDLE hThread=CreateRemoteThread( ProcessHandle, NULL, 0, pfnStartAddr, lpBuf, 0, NULL);
if(!hThread) return false;
//等待該線程跑完
WaitForSingleObject( hThread, INFINITE );
//釋放掉我們剛剛占用的額外空間
VirtualFreeEx( ProcessHandle, lpBuf, dwSize, MEM_DECOMMIT );
CloseHandle( hThread );
return true;
}
```

</div>

<div>

</div>

</div>

<div>

\

</div>

</div>
