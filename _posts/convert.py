import codecs
import re
import chardet   #需要导入这个模块，检测编码格式
'''
---
layout: post
title: "[DEFCON] 投稿吹水雜談遊記"
img: https://4.bp.blogspot.com/-LirdZsULNbo/W3HhMGG0i3I/AAAAAAAAIxM/UgGVS1wFVG4I4lwP0u1CnPQxzsgPOfocACK4BGAYYCw/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-08-13%2B%25E4%25B8%258B%25E5%258D%258812.51.01.png 
date: 2018-08-13 12:43:00.00 +0700
description: 
tag: [DEFCON, Slide]
---
'''

def genMdPayload(src): 
	pos = context.index('title: \\"')
	posend = context.index('"', pos + 10)
	a = context[pos+10: posend]
	a = re.sub(r"\[", r"[", a)

	return ("aa" + a)

import os
for root, dirs, files in os.walk("./doc/"):
	for file in files:
		if file.endswith(".md"):
			fname = (os.path.join(root, file))
			print(fname)
			with codecs.open(fname, encoding='utf-8') as f:
				context = f.read()
				

				with codecs.open('ggg.markdown', 'w', encoding='utf-8') as w:
					w.write(genMdPayload(context))
			break
