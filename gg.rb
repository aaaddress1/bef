require "jekyll-import";
    JekyllImport::Importers::Blogger.run({
      "source"                => "/Users/aaaddress1/Downloads/blog-08-24-2018.xml",
      "no-blogger-info"       => false, # not to leave blogger-URL info (id and old URL) in the front matter
      "replace-internal-link" => false, # replace internal links using the post_url liquid tag.
    })
