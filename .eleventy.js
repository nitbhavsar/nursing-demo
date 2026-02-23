module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("images");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "includes",
      layouts: "layouts"
    }
  };
};