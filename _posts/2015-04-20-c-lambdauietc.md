\-\-- layout: post title: \"\[C\#\]
Lambda花式應用噁爛寫法（跨UI委派秒幹、多線程處理\...etc）\" date:
\'2015-04-20T12:45:00.002-07:00\' author: 聖豪馬 tags: - Lambda - CSharp
modified\_time: \'2015-04-20T12:45:33.532-07:00\' blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-4486867833185796857
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/04/c-lambdauietc.html \-\--
為啥會有這篇呢\...因為最近寫太多C\#
突然發現Lambda對程式碼減化太有幫助了=\...=\
為了怕哪天老人癡呆忘了這些噁心的花式寫法，就開一篇Blog文紀錄了\
\
以前在寫多線程,可能得這麼寫：\

``` {.brush: .cpp;}
void Func() {/*多線程要做的事情*/}

//接著呼叫：
Thread nThread = new Thread(Func);
nThread.Start();
```

\
但今天用Lambda可以改寫：\

``` {.brush: .cpp;}
Thread nThread = new Thread(() => {/*多線程要做的事情*/});
nThread.Start();
```

\
甚至在噁心點寫的寫法：\

``` {.brush: .cpp;}
new Thread(() => {/*多線程要做的事情*/}).Start();
```

簡單來說Lambda的形式可拆解成：
()是指你的函數參數列、然後可用=\>代表你要接的Lambda陳述句/塊，最後用{}把事情包起來。
在來就是比較討厭的C\#內要做跨UI線程操控UI上物件，會有跨UI安全性線程問題，
所以一般會額外寫個委派函數，然後請求UI
Thread去處理這個委派函數請求，才能控制
這樣往往可能只用一兩次的委派函數，卻要占用一個篇幅去寫委派函數\
先看看正常的跨UI委派寫法：\

``` {.brush: .cpp;}
   private delegate void nCallback(string ContentText); 
    public void n(string ContentText)
    {
        if (this.InvokeRequired)
        {
            nCallback obj = new nCallback(n);
            this.Invoke(obj, new object[] { ContentText });
            return;
        }
        this.Text = ContentText;
    }
    //調用時呼叫n("str")
```

\
\
就可以改寫成：\

``` {.brush: .cpp;}
this.Invoke(new Action(() => { this.Text = "Str"; })); 
```

\
\
又因為=\>後面可接陳述塊或者陳述句，所以可以寫這樣：\

``` {.brush: .cpp;}
this.Invoke(new Action(() => this.Text = "Str" )); 
```
