module.exports = function(eleventyConfig) {
  // Pass through images and the admin folder
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("*.PNG");
  eleventyConfig.addPassthroughCopy("*.jpg");
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("*.gif");

  // Format date for the blog
  eleventyConfig.addFilter("formatDate", function(dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
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
    return collectionApi.getFilteredByGlob("blog/*.{md,MD}").sort((a, b) => {
      return b.date - a.date; // sort descending
    });
  });

  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};