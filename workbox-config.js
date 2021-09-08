module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'index.html',
		'offline.html',
		'favicon.png',
		'assets/**/*',
		'scripts/**/*.js',
		'styles/**/*.css'
	],
	swDest: 'dist/sw.js'
};