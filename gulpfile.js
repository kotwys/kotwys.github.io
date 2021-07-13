const { src, dest, watch } = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');

const styles = () => src('src/styles/main.scss')
  .pipe(sass())
  .pipe(postcss([
    require('autoprefixer'),
  ]))
  .pipe(cleanCSS({ level: 2 }))
  .pipe(dest('dist/styles'));

exports.styles = styles;

exports.watchStyles = () => {
  watch('src/styles/**/*.scss', {
    ignoreInitial: false,
  }, styles);
};