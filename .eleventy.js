const { excerptText } = require("./lib/blog-utils");
const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");
const path = require("node:path");

module.exports = function(eleventyConfig) {
  eleventyConfig.ignores.add("src/README.md");
  if (process.env.SPOTIFY_CREDITS_PREVIEW !== "1") {
    eleventyConfig.ignores.add("src/credits-preview/**");
  }

  // Pass through the admin interface and all browser assets.
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets");

  // New asset contents get a new cache key at both the CDN and the browser.
  eleventyConfig.addFilter("assetUrl", assetPath => {
    const content = readFileSync(path.join(__dirname, "src", assetPath));
    const version = createHash("sha256").update(content).digest("hex").slice(0, 12);
    return `${assetPath}?v=${version}`;
  });

  // Preserve the portrait's original public URL for compatibility.
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
      year: 'numeric',
      timeZone: 'UTC'
    });
  });

  eleventyConfig.addFilter("dateToIso", function(dateObj) {
    return dateObj ? new Date(dateObj).toISOString() : "";
  });

  eleventyConfig.addFilter("releaseDate", value => {
    if (/^\d{4}$/.test(value)) return value;
    const monthOnly = /^\d{4}-\d{2}$/.test(value);
    const date = new Date(`${value}${monthOnly ? '-01' : ''}T00:00:00Z`);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short',
      ...(monthOnly ? {} : {day: 'numeric'}), timeZone: 'UTC' }).format(date);
  });

  eleventyConfig.addFilter("excerptText", function(html, limit = 240) {
    return excerptText(html, limit);
  });

  // Keep embedded JSON data from closing its script element.
  eleventyConfig.addFilter("jsonLd", value =>
    JSON.stringify(value).replace(/</g, "\\u003c")
  );

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
