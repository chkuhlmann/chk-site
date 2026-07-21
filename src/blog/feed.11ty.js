const { excerptText } = require("../../lib/blog-utils");

module.exports = class BlogFeed {
  data() {
    return {
      permalink: "/blog.json",
      eleventyExcludeFromCollections: true,
      layout: null
    };
  }

  render({ collections }) {
    const posts = collections.blog.map((post) => {
      const excerpt = post.data.description || excerptText(post.templateContent);

      return {
        title: post.data.title || "Untitled",
        date: post.date.toISOString(),
        displayDate: post.date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC"
        }),
        category: post.data.category || "General",
        description: post.data.description || excerpt,
        excerpt,
        url: post.url,
        image: post.data.image || null
      };
    });

    return JSON.stringify(posts, null, 2);
  }
};
