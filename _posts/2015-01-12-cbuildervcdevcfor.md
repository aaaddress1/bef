\-\-- layout: post title:
\"\[C++Builder\]\[VC++\]\[DevC++\]逆向分析for迴圈能否使用多重條件句\"
date: \'2015-01-12T20:43:00.001-08:00\' author: 聖豪馬 tags: - CBuilder
- Dev C++ - Visual C++ - CPlus modified\_time:
\'2015-06-01T04:43:40.379-07:00\' thumbnail:
http://2.bp.blogspot.com/-ZnBX4ICcQQ0/VLScbV67vCI/AAAAAAAAFlI/ZfygoYigJnA/s72-c/%E6%9C%AA%E5%91%BD%E5%90%8D.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-5541429431719973152
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/01/cbuildervcdevcfor.html \-\--
for迴圈標準寫法:\
\
for(int i = 0 ; (i \< 10); i++);\
或者可以用建構式初始化起始值\
for(int i(0) ; (i \< 10) ; i++);\
\
for迴圈在編譯器解釋上是把;;前中後三個拆解成三個block來處理\
所以可以寫:\
for(int i(0),t(0),k(0), (i\<10); i++);\
這樣for迴圈\"內\"就可以一次使用三個變數\
\
所以當然也可以在最後一個尾巴的block加上額外的運算方法:\
for(int i(0),t(0),k(0), (i\<10); t = i+1, k = t\*2; i++);\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-ZnBX4ICcQQ0/VLScbV67vCI/AAAAAAAAFlI/ZfygoYigJnA/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="153"}](http://2.bp.blogspot.com/-ZnBX4ICcQQ0/VLScbV67vCI/AAAAAAAAFlI/ZfygoYigJnA/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

\
理論上既然for迴圈內以逗號隔開應該是會被解析的,\
那麼for(; 條件句1,條件句2,條件句3;);\
應該這麼寫編譯器應該也是會過的\

::: {.separator style="clear: both; text-align: center;"}
:::

編譯一下,過了\

::: {.separator style="clear: both; text-align: center;"}
:::

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-1_mWTnxvcBo/VLScq--DrGI/AAAAAAAAFlQ/5Q5yQycNvJo/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="118"}](http://2.bp.blogspot.com/-1_mWTnxvcBo/VLScq--DrGI/AAAAAAAAFlQ/5Q5yQycNvJo/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

來分析一下記憶體上是怎麼跑的\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-VfWvF8BZauA/VLSdIfOwnFI/AAAAAAAAFlY/o-bG_CBRfb4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="112"}](http://2.bp.blogspot.com/-VfWvF8BZauA/VLSdIfOwnFI/AAAAAAAAFlY/o-bG_CBRfb4/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

用Cheat Engine動態跟蹤一下很快就能找到存取點了(那個k值的地址) :P\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-xOVYTjqOwCI/VLSdgzDG4sI/AAAAAAAAFlg/gWRdUiRvG6s/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="229"}](http://4.bp.blogspot.com/-xOVYTjqOwCI/VLSdgzDG4sI/AAAAAAAAFlg/gWRdUiRvG6s/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

跟蹤回去,可以找到int main()架構在這裡\
看來Dev C++ 在組合語言上只保留了k == 99這個條件句了\
(對於 i \< 10這個條件句已經被無視了Otz)\
\
為了避免是Dev C++對於for迴圈解析的問題\
另外拿了Visual C++做了測試:\

::: {.separator style="clear: both; text-align: center;"}
[![](http://2.bp.blogspot.com/-fvKIlUD7X5g/VLSfHQ9qe0I/AAAAAAAAFls/fkfPei4kUdc/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="175"}](http://2.bp.blogspot.com/-fvKIlUD7X5g/VLSfHQ9qe0I/AAAAAAAAFls/fkfPei4kUdc/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

用Cheat Engine跟蹤一下int main()的結果:\

::: {.separator style="clear: both; text-align: center;"}
[![](http://1.bp.blogspot.com/-ZKLLbGLz4xA/VLSflfKCGgI/AAAAAAAAFl0/GkPISpZJlA0/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="187"}](http://1.bp.blogspot.com/-ZKLLbGLz4xA/VLSflfKCGgI/AAAAAAAAFl0/GkPISpZJlA0/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

VC++的解析狀況也是選擇只保留最後一個條件句,把 i \<
10條件句給遺忘了T\_\_T\
\
不信邪的再拿CBuilder測一下\

::: {.separator style="clear: both; text-align: center;"}
[![](http://4.bp.blogspot.com/-IupUtSfwgs8/VLSggMlOnVI/AAAAAAAAFmA/CTyMEQIHjJY/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="262"}](http://4.bp.blogspot.com/-IupUtSfwgs8/VLSggMlOnVI/AAAAAAAAFmA/CTyMEQIHjJY/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

用Cheat Engine跟蹤:\

::: {.separator style="clear: both; text-align: center;"}
[![](http://3.bp.blogspot.com/-7x9J5L89V54/VLSg_l3TndI/AAAAAAAAFmI/hLU7kOMBhNg/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png){width="320"
height="124"}](http://3.bp.blogspot.com/-7x9J5L89V54/VLSg_l3TndI/AAAAAAAAFmI/hLU7kOMBhNg/s1600/%E6%9C%AA%E5%91%BD%E5%90%8D.png)
:::

C++Builder編譯後的結果也是選擇把條件句 i \< 10做遺忘,只取最後一個\
\
看起來各個版本的C++IDE做解析都會把\
for (int i = 0 ; i \< 10 , i \< 9, i \< 8; i++);\
只解析最後一個條件句(意思是如這個for迴圈i只會跑0\~7)\
\
查了一下國外討論串[Are multiple conditions allowed in a for
loop?](http://stackoverflow.com/questions/17638730/are-multiple-conditions-allowed-in-a-for-loop)結論也是這樣Otz.\
\
