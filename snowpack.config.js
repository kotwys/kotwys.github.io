/** @type {import("snowpack").SnowpackUserConfig} */
module.exports = {
  plugins: [
    ['@snowpack/plugin-typescript'],
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'eleventy',
        watch: '$1 --watch',
      },
    ],
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'gulp styles',
        watch: 'gulp watchStyles',
      },
    ],
  ],
  mount: {
    dist: '/',
  },
  optimize: {
    target: 'es2020',
    minify: true,
    bundle: true,
  }
};