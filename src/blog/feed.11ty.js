function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function excerptText(html, limit = 240) {
  const text = decodeEntities(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= limit) return text;
  const shortened = text.slice(0, limit + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 0 ? lastSpace : limit).trim()}…`;
}

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
          year: "numeric"
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
