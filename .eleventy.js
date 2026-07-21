const { excerptText } = require("./lib/blog-utils");

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
    return excerptText(html, limit);
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
