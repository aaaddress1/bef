\-\-- layout: post title:
\"\[C++Builder\]Firemonkey下的多線程﹢跨線程控制UI物件（委派）\" date:
\'2015-03-03T16:36:00.001-08:00\' author: 聖豪馬 tags: - CBuilder -
Thread modified\_time: \'2015-03-05T19:16:38.765-08:00\' blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-3127756969486818332
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/03/cbuilderfiremonkeyui.html \-\--
為啥會有這篇\...純粹因為最近用C++
Builder寫專案，想讓UI的Feedback可以Q彈滑順一點。不過因為是用Firemonkey的跨平台專案功能，意思是如果你想發揮Firemonkey的跨平台性去做多線程處理UI更新，勢必不可能用到系統API來處理（例如說Windows上用CreateThread來實做）\
\
不過既然沒辦法直接用系統API來處理，去Google了大概三四十頁的搜尋結果，後來參考一個日本人的Blog才寫出來算是比較簡潔的解法\...，用ECB官方自帶的類別庫還有用到了TThread類別來實做（話說小吐槽一下\...馬的C++Builder跟Delphi在處理跨線程UI控制真的很麻煩\...像在.NET內用委派甚至解除跨線程安全檢查就好了、在QT內也是委派投擲訊息就好\...CB內要實做委派＂不能投擲參數＂這點超級麻煩\...意思是如果你要委派的函數有參數，就得額外在開一個新的函數來收你的委派然後跑在UI
Thread來處理事情，參數也要額外宣告變數來做存放..我靠）\
\

``` {.brush: .cpp;}
class CoreModuFunc : public TCppInterfacedObject
{
public:
CoreModuFunc(TTabbedForm* Form) : FForm(Form) {}
virtual void __fastcall Invoke(void)
{
while (1)
{
DirectNewItem("Hi");
Sleep(5000);
}
}

void DirectNewItem(String Str)
{
TempStr = Str;
TThread::Synchronize(TThread::CurrentThread, AddNewItem);
}
void __fastcall AddNewItem(void)//注意一定得用fastcall，才能用Synchronize委派
{
if (TempStr == "") return;
FForm->ListBox1->Items->Add(TempStr );
}
private:
TForm1 * FForm; //要控制的UI Form指針
String TempStr ; //存放參數的點
};
```

<div>

然後如果你要創建這個Thread就這麼寫就可以了：\

``` {.brush: .cpp;}
TThread::CreateAnonymousThread(new CoreModuFunc(this))->Start();
```

\
\
當調用到了CreateAnonymousThread之後會給你指定的calss結構體一個Thread去跑，當class觸發完new建構式之後接著就是線程開始跑的時候就會觸發了＂Invoke＂事件\
接著我這邊做的事情是用Synchronize去做委派，把想控制UI的事情封裝到一個函數內委派給UI線程去幫我做處理

</div>