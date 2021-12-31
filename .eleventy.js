const { readFileSync } = require('fs');
const yaml = require('js-yaml');
const { URL } = require('url');
const htmlmin = require('html-minifier');
const xmlmin = require('minify-xml');
const readingTime = require('reading-time');

const IntlPolyfill = require('intl');
require('./locale/udm');

const site = require('./src/data/site');

const relative = function (url) {
  return new URL(url, site.url + this.page.url).href;
}

const flattenRdf = (rdf) => {
  const aux = (path, o) => {
    if (Array.isArray(o)) {
      return o.map(v => [path, v]);
    }
    if (typeof o === 'object') {
      return Object.entries(o)
        .flatMap(([ key, value ]) =>
          aux(path.concat(key), value)
        );
    }
    return [[path, o]];
  };

  return aux([], rdf);
};

const rdfTransform = (property) => {
  return {
    'og:image': relative,
    'twitter:image': relative,
  }[property] ?? (v => v);
};

module.exports = (config) => {
  config.setDataDeepMerge(true);

  const dictionary = yaml.load(readFileSync(__dirname + '/src/data/words.yml'));

  /** @type {import('markdown-it').Options} */
  const mdOptions = {
    html: true,
  };
  const md = require('markdown-it')(mdOptions)
    .use(require('markdown-it-texmath'), {
      engine: require('katex'),
    })
    .use(require('./utils/word-parser'), {
      dictionary: Object.fromEntries(
        dictionary.map(({ initial,def }) => [initial, def])
      ),
    });
  
  config.setLibrary('md', md);

  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/**/*.(html|png|jpg)');

  config.addCollection('articles', api =>
    api.getFilteredByGlob('src/articles/**/index.md')
  );

  config.addShortcode('rdfmeta', function (data) {
    return flattenRdf(data)
      .map(([path, value]) => {
        const property = path.join(':');
        const content = rdfTransform(property).call(this, value);
        return `<meta property="${property}" content="${content}">`;
      })
      .join('\n');
  });

  config.addFilter('relative', relative);

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