module Jekyll
  class TagPage < Page
    def initialize(site, base, tag, items)
      @site = site
      @base = base
      @dir  = "tags/#{Jekyll::Utils.slugify(tag)}"
      @name = "index.html"

      process(@name)
      read_yaml(File.join(base, "_layouts"), "tag.html")

      data["tag"]   = tag
      data["title"] = tag
      data["posts"] = items
    end
  end

  class TagGenerator < Generator
    safe true
    priority :low

    def generate(site)
      til = site.collections["til"] ? site.collections["til"].docs : []

      tags = {}

      site.posts.docs.each do |post|
        Array(post.data["tags"]).each do |tag|
          (tags[tag] ||= []) << post
        end
      end

      til.each do |til|
        Array(til.data["tags"]).each do |tag|
          (tags[tag] ||= []) << til
        end
      end

      tags.each do |tag, items|
        sorted = items.sort_by { |i| i.date }.reverse
        site.pages << TagPage.new(site, site.source, tag, sorted)
      end
    end
  end
end
