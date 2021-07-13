const { URL } = require('url');
const htmlmin = require('html-minifier');
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

  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/scripts');
  config.addPassthroughCopy('src/**/*.(html|png|jpg)');

  config.addCollection('articles', api =>
    api.getFilteredByGlob('src/articles/**/index.md')
  );

  config.addPairedShortcode('highlight', content =>
    `<p class="highlight">${content}</p>`
  );

  config.addShortcode('image', (url, alt, caption) => 
    `<figure>
      <img alt="${alt}" src="${url}"/>
      ${caption ? `<figcaption>${caption}</figcaption>` : ''}
    </figure>`
  );

  config.addShortcode('word', (hash, declension) =>
    `<button data-word="${hash}">${declension}</button>`
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

  config.addFilter('removeWords', content =>
    content.replace(
      /<button.*?data-word.*?>(.*?)<\/button>/g,
      '$1'
    )
  );

  config.addFilter('relative', relative);

  config.addFilter('isoDate', date => date.toISOString());
  config.addFilter('udmDate', date =>
    new IntlPolyfill.DateTimeFormat('udm', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date).replace(/ аре$/, '')
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