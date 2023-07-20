const { src, dest, watch, series } = require('gulp');
const filter = require('gulp-filter');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');

const transformStyles = (stream) => stream
  .pipe(sass())
  .pipe(postcss([
    require('postcss-logical')({
      dir: 'ltr',
    }),
    require('@csstools/postcss-is-pseudo-class')(),
    require('autoprefixer'),
  ]))
  .pipe(cleanCSS({ level: 2 }))
  .pipe(dest('dist/styles'));

const STYLES_ENTRY_POINTS = [
  'src/styles/main.scss',
  'src/styles/pages/index.scss',
  'src/styles/pages/article.scss',
  'src/styles/themes/light.scss',
  'src/styles/themes/dark.scss',
];

const styles = series(
  ...STYLES_ENTRY_POINTS.map(
    (path) => () => transformStyles(src(path))
  )
);

exports.styles = styles;

exports.watchStyles = () => {
  watch('src/styles/**/*.scss', {
    ignoreInitial: false,
  }, styles);
};

exports.icons = () => src('node_modules/remixicon/**/*.svg')
  .pipe(filter(f => [
    'twitter-line',
    'github-line',
    'send-plane-2-line',
    'mastodon-line',
    'menu-2-line',
    'settings-line',
    'close-line',
    'arrow-down-s-line'
  ].includes(f.stem)))
  .pipe(svgSprite({
    shape: {
      id: {
        separator: '',
      },
    },
    mode: {
      symbol: {
        sprite: 'sprite.svg',
        dest: '.',
      },
    },
  }))
  .pipe(dest('dist/assets/icons'))
