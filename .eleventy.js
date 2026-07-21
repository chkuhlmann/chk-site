module.exports = function(eleventyConfig) {
  // Pass through images and the admin folder
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy({
    "src/assets/images/re_4284_portra 400_014281-r1-072-34a.PNG":
      "re_4284_portra 400_014281-r1-072-34a.PNG"
  });

  // Format date for the blog
  eleventyConfig.addFilter("formatDate", function(dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  });

  eleventyConfig.addFilter("dateToIso", function(dateObj) {
    return dateObj ? new Date(dateObj).toISOString() : "";
  });

  eleventyConfig.addFilter("excerptText", function(html, limit = 240) {
    if (!html) return "";
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length <= limit) return text;
    const shortened = text.slice(0, limit + 1);
    const lastSpace = shortened.lastIndexOf(" ");
    return `${shortened.slice(0, lastSpace > 0 ? lastSpace : limit).trim()}…`;
  });

  // Clean up HTML content so it doesn't break a JSON string
  eleventyConfig.addFilter("encodePostContent", function(content) {
    if (!content) return "";
    return content
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  });

  // Create a blog collection from the 'blog' folder
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.{md,MD}").sort((a, b) => {
      return b.date - a.date; // sort descending
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
