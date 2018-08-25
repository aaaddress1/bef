var fs  = require("fs");

fs.readFile('./doc/2015-09-04-ollyicewinapitrick_4.md', function(err, f){
    var array = f.toString()

    m = array.match(/title: \\"([^\x22]+)/);
    console.log(m)

    if (m != null)
    title = m.
    	replace(/\\\[/g, '[').
    	replace(/\\\]/g, ']').
    	replace(/\\/g, '');

    date = ( array.match(/date: \\'([^'']+)/)[1] ).
    	replace(/\\\[/g, '[').
    	replace(/\\\]/g, ']').
    	replace(/\\/g, '');

    tag = ( array.match(/tags: (.+) modif/)[1] ).
    	replace(/\\\[/g, '[').
    	replace(/\\\]/g, ']').
    	replace(/\\/g, '').
    	replace(/-/g, ',')

    img = ( array.match(/thumbnail:(.+)blogger/)[1] ).
    	replace(/\\\[/g, '[').
    	replace(/\\\]/g, ']').
    	replace(/\\/g, '').
    	replace(/-/g, ',')

    console.log(
`---
layout: post
title: "${title}"
date: "${date}"
tag: [${tag}]
description:
img: ${imge}
---
`)

    require "jekyll-import";
        JekyllImport::Importers::Blogger.run({
          "source"                => "~/Download/blog-08-24-2018.xml",
          "no-blogger-info"       => false, # not to leave blogger-URL info (id and old URL) in the front matter
          "replace-internal-link" => false, # replace internal links using the post_url liquid tag.
        })
/*
---
layout: post
title: "[DEFCON] 投稿吹水雜談遊記"
img: https://4.bp.blogspot.com/-LirdZsULNbo/W3HhMGG0i3I/AAAAAAAAIxM/UgGVS1wFVG4I4lwP0u1CnPQxzsgPOfocACK4BGAYYCw/s72-c/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2018-08-13%2B%25E4%25B8%258B%25E5%258D%258812.51.01.png 
date: 2018-08-13 12:43:00.00 +0700
description: 
tag: [DEFCON, Slide]
---
*/

    // use the array
});
