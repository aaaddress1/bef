\-\-- layout: post title: Linux ELF Loader Note date:
\'2018-04-30T11:11:00.003-07:00\' author: 聖豪馬 tags: - Linux - ELF
modified\_time: \'2018-04-30T11:14:37.052-07:00\' blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-6543163871243118298
blogger\_orig\_url:
http://helloadr.blogspot.com/2018/04/linux-elf-loader-note.html \-\--
之前玩 ELF 一直不懂為啥 \_start 走進去後居然是去呼叫：\
\_\_libc\_start\_main(main, \_\_libc\_csu\_init, \_\_libc\_csu\_fini)\
\
然後莫名其妙的就走進去 main function 了；有別於 Windows PE \_start
進去後就是初始化 CRT 接著呼叫 exit(main(argc, argv, envp))。\
\

::: {.text_exposed_show}
看完 \[1\], \[2\] 之後大概就可以知道：\
\
1. \_\_libc\_start\_main 在於 Process 中程式文件被 Mapping
到正確記憶體分配後，負責處理一些初始化的作業，比方說有用到第三方函數庫或全域變數初始化等等都會負責呼叫
\_\_libc\_csu\_init 來協助完成這些初始化作業（實際初始化方式也僅是透過
ELF 自帶的 .init section 程式碼呼叫、其他第三方函數庫家載後 .init
也得呼叫）\
\
2. \_\_libc\_start\_main 完成初始化後透過 .plt 來呼叫系統函數來取得
argc, argv, envp 作為參數傳遞給開發者的 main 函數\
\
3. 等待開發者 main 函數返回後，在跳至 .fini section
的程式碼做一些後續關閉 Process 必要的清理作業（比方說記憶體回收之類的）\
\
感覺上大概就是把 Windows 編譯器產出的 CRTStartup 這件事情封裝在 glibc
內分成三塊來處理XD\
\
\[1\]: <https://blog.csdn.net/gary_ygl/article/details/8506007>\
\[2\]:
[https://stackoverflow.com/.../whats-going-on-in-libc-start-ma...](https://stackoverflow.com/questions/16970281/whats-going-on-in-libc-start-main)\
\[3\]:
https://felixzhang00.github.io/2016/12/24/2016-12-24-ELF%E6%96%87%E4%BB%B6%E8%A3%85%E8%BD%BD%E9%93%BE%E6%8E%A5%E8%BF%87%E7%A8%8B%E5%8F%8Ahook%E5%8E%9F%E7%90%86/
:::
