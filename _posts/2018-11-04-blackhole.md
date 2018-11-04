---
layout: post
title: "Make a blackhole in 45 lines with Netfilter in Kernel-land"
img: 2018-11-04-blackhole/07A4F7C6-F65B-4270-83EF-61A59BDD1E0E.png# Add image post (optional)
date: 2018-11-04 12:55:00 +0300
description: 
tag: []
---


<style>
img {
  width: 80%;
  border: none;
  background: none;
}
</style>

## Source 

```
 // blackhole (telescope) for port 3000, by aaaddress1@chroot.org 
 #include <linux/kernel.h>
 #include <linux/module.h>
 #include <linux/netfilter.h>
 #include <linux/netfilter_ipv4.h>
 #include <linux/skbuff.h>
 #include <linux/tcp.h>
 #include <linux/udp.h>
 #include <linux/ip.h>

static struct nf_hook_ops nfho; //net filter hook option struct
struct tcphdr *tcp_header; //udp header struct (not used)
struct iphdr *ip_header; //ip header struct

unsigned int hook_func(
  const struct nf_hook_ops *ops, 
  struct sk_buff *skb, 
  const struct net_device *in, 
  const struct net_device *out, 
  int (*okfn)(struct sk_buff *)) {

  ip_header = (struct iphdr *)skb_network_header(skb); //grab network header using accessor

  if (ip_header->protocol == /* TCP */ 6) {
    tcp_header = tcp_hdr(skb);
    u32 saddr, daddr;
    u16 sport, dport;
    saddr = ntohl(ip_header->saddr);
    daddr = ntohl(ip_header->daddr);
    sport = ntohs(tcp_header->source);
    dport = ntohs(tcp_header->dest);

    if (sport == 3000) { // if packet from local port 3000, drop it.
      printk(KERN_INFO "got tcp packet at 3000 port.\n");
      return NF_DROP;
    }
  }
  return NF_ACCEPT;
}

int init_module() {
  nfho.hook = hook_func;
  nfho.hooknum = NF_INET_LOCAL_OUT;
  nfho.pf = PF_INET;
  nfho.priority = NF_IP_PRI_FIRST;
  nf_register_hook(&nfho);
  return 0;
}

void cleanup_module() {
  nf_unregister_hook(&nfho);
}

```

## Makefile

```
MOD := hookModule
obj-m += $(MOD).o
KVERSION := $(shell uname -r)

all:
	$(MAKE) -C /lib/modules/$(KVERSION)/build M=$(PWD) modules

clean:
	$(MAKE) -C /lib/modules/$(KVERSION)/build M=$(PWD) clean

install:
	/sbin/insmod $(MOD).ko

remove:
	/sbin/rmmod $(MOD).ko
```

![](/assets/img/2018-11-04-blackhole/07A4F7C6-F65B-4270-83EF-61A59BDD1E0E.png)

![](/assets/img/2018-11-04-blackhole/A12B118B-14C5-49B7-8D59-0C6DDD87E021.png)

## Reference

[Roll Your Own Firewall with Netfilter | Linux Journal](https://www.linuxjournal.com/article/7184)

[Netfilter Hook 程式範例](http://neokentblog.blogspot.com/2014/06/netfilter-hook.html)

[两个netfilter的例子 - 小猪爱拱地 - CSDN博客](https://blog.csdn.net/CaspianSea/article/details/43730021)


## Detail about Netfilter

[Linux netfilter源码分析(4)](http://staff.ustc.edu.cn/~james/linux/netfilter-4.html)

## Grab TCP Header

[C - Linux - kernel module - TCP header - Stack Overflow](https://stackoverflow.com/questions/16528868/c-linux-kernel-module-tcp-header)

## ‘NF_IP_LOCAL_OUT’ undeclared

* [SOLVED "NF_IP_PRE_ROUTING" macro not found](https://www.linuxquestions.org/questions/linux-networking-3/nf_ip_pre_routing-macro-not-found-4175431483/)
* [基于Netfilter hook功能的数据包拦截---有关DCN优化的碎碎念 -  - ITeye博客](http://iam42.iteye.com/blog/1661816)

## Error compiling kernel module linux/module.h: No such file or directory found

[c - Error compiling kernel module linux/module.h: No such file or directory found - Stack Overflow](https://stackoverflow.com/questions/30021405/error-compiling-kernel-module-linux-module-h-no-such-file-or-directory-found)
