\-\-- layout: post title:
\"\[C++Builder\]\[Delphi\]讓IdHTTP可以正常Post出Big5漢字的參數\" date:
\'2015-01-08T03:06:00.000-08:00\' author: 聖豪馬 tags: - CBuilder -
IdHTTP - Post - Delphi modified\_time: \'2015-03-05T18:57:39.618-08:00\'
thumbnail:
http://4.bp.blogspot.com/-7mODFAk\_E7o/VK5g\_rnqFCI/AAAAAAAAFcE/jLrp5jCGvBk/s72-c/%E6%9C%AA%E5%91%BD%E5%90%8D\_%E5%89%AF%E6%9C%AC.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-3195715776322170353
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/01/cbuilderdelphiidhttppostbig5.html
\-\-- 因為寫比賽作品需要,要對學校系統做POST封包,\
設定指定email文字內容,像底下這樣\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-7mODFAk_E7o/VK5g_rnqFCI/AAAAAAAAFcE/jLrp5jCGvBk/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D_%E5%89%AF%E6%9C%AC.png){width="320"
height="60"}](http://4.bp.blogspot.com/-7mODFAk_E7o/VK5g_rnqFCI/AAAAAAAAFcE/jLrp5jCGvBk/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D_%E5%89%AF%E6%9C%AC.png)
:::

不過到了學校系統一看發現\...\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-fyDhy4fCKcM/VK5haDiaOAI/AAAAAAAAFcM/VoXDo7ZTlPE/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="175"}](http://2.bp.blogspot.com/-fyDhy4fCKcM/VK5haDiaOAI/AAAAAAAAFcM/VoXDo7ZTlPE/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

中文字的部分通通被設置為了問號\...Otz.\
於是用封包工具攔截一下看出了什麼狀況\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-iXlpVzEkFD0/VK5h7-lBdPI/AAAAAAAAFcc/458IaRos9V4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="134"}](http://4.bp.blogspot.com/-iXlpVzEkFD0/VK5h7-lBdPI/AAAAAAAAFcc/458IaRos9V4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

原來Indy控件組內的IdHTTP在做POST的時候對漢字解析上有問題\...\
會自動把漢字變成了問號(找不到對應字詞做發送)\
所以能知道的事情是,我們在POST前先做URL Encode,\
把原本的文字轉%XX%XX的形式那麼IdHTTP做發送就不會有無法解析中文字的問題.\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-hxxgDrNWOPM/VK5ir8gz9hI/AAAAAAAAFck/Poj689pfpJw/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="126"}](http://1.bp.blogspot.com/-hxxgDrNWOPM/VK5ir8gz9hI/AAAAAAAAFck/Poj689pfpJw/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

\
翻了一下,學校的asp網站採用的編碼為Big5.\
所以我們得設計一個URL Encode去把當前UncodeString轉Big5編碼再做URL
Encode.\
\
做法上因為我對URL Encode整個機制處理上沒那麼清楚,\
所以問了一下C++Builder前輩[蕭沖](https://www.facebook.com/aftcast.hugh)大大\
[Big5編碼URL Encode的Delphi
Code寫法在這](http://pastebin.com/gt1Jf4Cv)(原版)\
\
我重新用C++Builder寫一份\

``` {.brush: .cpp;}
String nURLEncode(String S,bool InQueryString){
  String Ret = "";
  TByteDynArray bys = TEncoding::GetEncoding(950)->GetBytes(S); //採用Big5(950)設置轉換用途編碼
  for (int i = 0; i < (bys.Length); i++)
  {
  if (((bys[i] >= 0x41)&&(bys[i] <= 0x5A))||
   ((bys[i] >= 0x61)&&(bys[i] <= 0x7A))||
   ((bys[i] >= 0x30)&&(bys[i] <= 0x39))||
   (bys[i] == 0x2D)||(bys[i] == 0x5F)|| (bys[i] == 0x2E)) {

   Ret += char(bys[i]);

  }else if (bys[i] == 0x20) {
   Ret += (InQueryString?"+":"%20");
  }else{
   Ret += "%" + IntToHex(bys[i],2);
  }
  }
  return Ret;
 }
```

\
針對可能有中文字的參數做了URL Encode\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-1hJ-NJnN2iA/VK5kC4VoeVI/AAAAAAAAFcw/4F62GZP-Uwk/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D_%E5%89%AF%E6%9C%AC.png){width="320"
height="59"}](http://3.bp.blogspot.com/-1hJ-NJnN2iA/VK5kC4VoeVI/AAAAAAAAFcw/4F62GZP-Uwk/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D_%E5%89%AF%E6%9C%AC.png)
:::

ok,發送出去之後,攔截一下封包可以看到很乖的用URL Encode之後的資料送出去\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-JkYAPCwFBaA/VK5kf2Ov3DI/AAAAAAAAFc4/SAN5LfCobSI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="78"}](http://3.bp.blogspot.com/-JkYAPCwFBaA/VK5kf2Ov3DI/AAAAAAAAFc4/SAN5LfCobSI/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

然後回學校網站看一下\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-L3Lgkfe-xwA/VK5kopO27wI/AAAAAAAAFdA/ys9KDP6Y8QM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="179"}](http://3.bp.blogspot.com/-L3Lgkfe-xwA/VK5kopO27wI/AAAAAAAAFdA/ys9KDP6Y8QM/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

Ok,學校網站已經可以正常吃到漢字囉!\
\
