\-\-- layout: post title: \"\[VB.NET\]DLL跨進程遠程注入(LoadLibraryA)\"
date: \'2015-02-22T02:58:00.001-08:00\' author: 聖豪馬 tags: - CBuilder
- Injector - VB.NET - CPlus modified\_time:
\'2015-06-01T04:43:40.388-07:00\' blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-806995129068585186
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/02/vbnetdll-remote-inject-loadlibrarya.html
\-\-- 這份Code在我高二的時候好像就丟在某論壇惹吧\
不過既然現在有Blog就一併更新發上來了\
\
[\[C++\]DLL遠程注入(LoadLibraryA)](http://helloadr.blogspot.tw/2015/02/cvbnetdllloadlibrarya.html)\
\
Source Code在GitHub：\
https://github.com/aaaddress1/DLL-Injector-In-VB.NET\
\
核心Code：\

``` {.brush: .vbnet}
Dim DllPath As String = Application.StartupPath + "/MyDll.dll"
'先宣告變數來存放你要注入的DLL
Dim TargetHandle As IntPtr = Process.GetProcessesByName("ProcessName")(0).Handle
'然後透過Process類別去取得Handle
'特別注意一下這個Handle取到了就同等於用OpenProcess得到控制句柄了喔

If (TargetHandle.Equals(IntPtr.Zero)) Then
    MsgBox("對進程 " + ComboBox1.Text + " 進行打開進程行為失敗.")
    Exit Sub
End If

'獲取LoadLibraryA的地址(PS:不同進程但同API,地址相同).
Dim GetAdrOfLLBA As IntPtr = GetProcAddress(GetModuleHandle("Kernel32"), "LoadLibraryA")
If (GetAdrOfLLBA.Equals(IntPtr.Zero)) Then
    MsgBox("取得LoadLibraryA API函數基址失敗.")
    Exit Sub
End If
'將DLL路徑轉為Char()陣列.
Dim OperaChar As Byte() = System.Text.Encoding.Default.GetBytes(DllPath)
'在目標進程申請一塊空間存放路徑字串.
Dim DllMemPathAdr = VirtualAllocEx(TargetHandle, 0&, &H64, MEM_COMMIT, PAGE_EXECUTE_READWRITE)
If (DllMemPathAdr.Equals(IntPtr.Zero)) Then
    MsgBox("對進程 " + ComboBox1.Text + "申請空間時發生錯誤.")
    Exit Sub
End If
'將申請來的記憶體空間寫入路徑Char()陣列.
If (WriteProcessMemory(TargetHandle, DllMemPathAdr, OperaChar, OperaChar.Length, 0) = False) Then
    MsgBox("對進程 " + ComboBox1.Text + "寫入記憶體時發生錯誤!")
    Exit Sub
End If
'令目標進程呼叫LoadLibraryA加載Char()陣列中存放的路徑.
CreateRemoteThread(TargetHandle, 0, 0, GetAdrOfLLBA, DllMemPathAdr, 0, 0)
MsgBox("對進程 " + ComboBox1.Text + "注入完成")
```
