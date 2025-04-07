import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import yaml from "js-yaml";
import CleanCSS from "clean-css";
import { stripHtml } from "string-strip-html";
import { execSync } from 'child_process';

import pluginFilters from "./_config/filters.js";

export default async function(eleventyConfig) {
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	eleventyConfig.addFilter("stripHtml", function(content) {
		return stripHtml(content).result;
	  });

	eleventyConfig
		.addPassthroughCopy({
			"./public/": "/"
		})
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
	});
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
	});
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		templateData: {
			eleventyNavigation: {
				key: "Feed",
				order: 4
			}
		},
		collection: {
			name: "posts",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "Blog Title",
			subtitle: "This is a longer description about your blog.",
			base: "https://example.com/",
			author: {
				name: "Your Name"
			}
		}
	});

  eleventyConfig.on('eleventy.after', () => {
		execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
	  })

	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addPlugin(IdAttributePlugin, {
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

 eleventyConfig.addCollection("categories", function(collectionApi) {
    const categoryMap = new Map();

    // Mengelompokkan item berdasarkan kategori
    collectionApi.getAll().forEach(item => {
      const category = item.data.category;
      if (!category) return; // Abaikan jika kategori tidak ada
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }

      categoryMap.get(category).push(item);
    });

    // Ubah menjadi objek agar lebih mudah diakses
    return Object.fromEntries(categoryMap);
  });


};

export const config = {
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],
	markdownTemplateEngine: "njk",

	htmlTemplateEngine: "njk",

	dir: {
		input: "content",
		includes: "../_includes",
		data: "../_data",
		output: "_site"
	},

};
