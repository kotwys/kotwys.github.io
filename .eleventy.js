const { readFileSync } = require('fs');
const yaml = require('js-yaml');
const { URL } = require('url');
const htmlmin = require('html-minifier');
const xmlmin = require('minify-xml');
const { parse: htmlParse } = require('node-html-parser');
const readingTime = require('reading-time');
const escapeHtml = require('escape-html');

const IntlPolyfill = require('intl');
require('./locale/udm');

const site = require('./src/data/site');

const relative = function (url, base) {
  return new URL(url, site.url + base).href;
}

const optionalAbsolute = function (url, base) {
  if (/^(https?:)?\/\//.test(url)) {
    return url;
  }

  return base + url;
}

module.exports = (config) => {
  config.setDataDeepMerge(true);

  const dictionary = yaml.load(readFileSync(__dirname + '/src/data/words.yml'));

  /** @type {import('markdown-it').Options} */
  const mdOptions = {
    html: true,
  };
  const md = require('markdown-it')(mdOptions)
    .use(require('markdown-it-anchor'))
    .use(require('markdown-it-texmath'), {
      engine: require('katex'),
    })
    .use(require('markdown-it-footnote'))
    .use(require('./utils/word-parser'), {
      dictionary: Object.fromEntries(
        dictionary.map(({ initial,def }) => [initial, def])
      ),
    });
  
  md.renderer.rules.footnote_block_open = () => (
    '<section class="main-margin">' +
    '<h2>Валэктонъёс</h2>' +
    '<ol class="footnotes-list">'
  );
  
  config.setLibrary('md', md);
  config.addDataExtension('yml', contents => yaml.load(contents));

  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/fonts');
  config.addPassthroughCopy('src/sw.js');
  config.addPassthroughCopy('src/**/*.(html|png|jpg)');

  config.addCollection('articles', api =>
    api.getFilteredByGlob('src/articles/**/index.md')
  );

  config.addShortcode('relative', relative);

  config.addShortcode('mkMeta', function (meta) {
    if (!meta)
      return '';

    return Object.entries(meta).map(([key, value]) =>
      `<meta name="${escapeHtml(key)}" content="${escapeHtml(value)}">`
    ).join('\n');
  });

  config.addShortcode('mkRdf', function (rdf) {
    if (!rdf)
      return '';

    const pairs = [];
    const addProperty = (prefix, prop, value) => {
      // Transform properties marked with ! to an absolute URL
      if (prop.endsWith('!')) {
        prop = prop.slice(0, -1);
        value = relative(value, this.page.url);
      }
      const qualified = (prefix ? (prefix + ':') : '') + prop;
      return [qualified, value];
    };
    for (const key in rdf) {
      if (typeof rdf[key] === "object")
        pairs.push(...Object.entries(rdf[key])
          .map(([prop, value]) => addProperty(key, prop, value))
        );
      else
        pairs.push(addProperty('', key, rdf[key]));
    }

    return pairs.map(([key, value]) => 
      `<meta property="${escapeHtml(key)}" content="${escapeHtml(value)}">`
    ).join('\n');
  });

  config.addShortcode('mkPrefix', prefix => 
    Object.entries(prefix).map(([k, v]) => `${k}: ${v}`).join(' ')
  );

  config.addFilter('optionalAbsolute', optionalAbsolute);

  config.addFilter('headings', content => {
    const document = htmlParse(content);
    return document
      .querySelectorAll('h1, h2, h3, h4, h5, h6')
      .map((el) => ({
        id: el.id,
        level: parseInt(el.tagName[1]),
        content: el.textContent,
      }));
  });

  config.addFilter('isoDate', date => date.toISOString());
  config.addFilter('udmDate', date =>
    new IntlPolyfill.DateTimeFormat('udm', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  );

  config.addFilter('langname', lang =>
    new Intl.DisplayNames(lang, { type: 'language' }).of(lang)
  );

  config.addFilter('readTime', content => {
    const { minutes } = readingTime(content);
    const minutes_ = Math.round(minutes);
    return (minutes_ < 1)
      ? 'минутлэсь ичи лыдӟон'
      : `${minutes_} минут лыдӟон`;
  });

  config.addFilter('limit', (val, n) => val.slice(0, n));

  config.addFilter('byYear', (arr) => {
    return arr.reduce((all, v) => {
      const year = v.date.getFullYear();
      if (!all.has(year))
        all.set(year, []);
      all.get(year).push(v);
      return all;
    }, new Map());
  });

  config.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
      });
    }

    return content;
  });

  config.addTransform('xmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.xml')) {
      return xmlmin.minify(content);
    }

    return content;
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      data: 'data',
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', '11ty.js'],
  };
};