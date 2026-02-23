module.exports = function (eleventyConfig) {

  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());
  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes"
    }
  };
};