\-\-- layout: post title: \"\[C\]\[ASM\]微軟的函數頭定義要mov
edi,edi的原因\" date: \'2015-01-27T11:32:00.000-08:00\' author: 聖豪馬
tags: - Stack - CPlus - ASM modified\_time:
\'2015-06-01T04:43:40.367-07:00\' blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-2188760304798161534
blogger\_orig\_url:
http://helloadr.blogspot.com/2015/01/casmmov-ediedi.html \-\--
在C的規範下的組語,函數頭形式會做\
push ebp\
mov ebp,esp\
sup esp, n//stack資料轉區域變數空間\
/\*\...接著就可以存取\[ebp+4\*k\]的參數\...\*/\
add esp, n ( or ret n)//平衡堆疊\
pop ebp\
ret\
幾個比較神奇的事情:\
\
1.\
MASM為啥頭函數要多一個mov edi,edi\
該不會是為了湊足五個字節方便我們破解者Hook吧XD?\
\
2.\
為啥wsprintf要使用者自己平衡堆疊?\
\
3.\
有些函數明明就不需要參數\
為啥還是需要做enter跟leave?\
\
[]{#more}\
\
1.的答案google一下國外是\
微軟為了\"Hot Pataching\"作的設計\
參考http://www.ragestorm.net/blogs/?p=17\
微軟的API函數定義是這樣:\
mov edi,edi\
push ebp\
mov ebp,esp\
第一個部分mov edi,edi其實根本沒有意義\
同等於兩個nop\
不過基於x86 asm code指令的運算考量上\
mov只需讀取一次而nop得讀取兩次,所以選用mov edi,edi來占用兩個Byte\
另個比較有趣的事情是如果要下短跳躍(short jump)得用兩個Byte\
長跳躍得花五個Byte,不過一個enter的處理C的規範下只需要三個Byte\
如果想做長跳躍就會破壞後面的code(意思是得自己作還原)\
微軟應該是考量到這個才多補了兩個Byte.\
(也就是補了mov edi,edi，日後打Patch想做長跳短跳都方便)\
\
2.cdecl類型的函數因為有那種參數可以無限推入的情形,\
所以無法在堆疊上結算需要恢復多少個堆疊資料\
所以設計考量上得使用者自己做恢復\
\
3.函數內可能需要運算用到額外的變數去做處理,所以還是得新增區域變數來保存.