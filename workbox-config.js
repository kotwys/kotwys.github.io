module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'index.html',
		'offline.html',
		'favicon.png',
		'assets/**/*',
		'scripts/**/*.js',
		'styles/**/*.css'
	],
	swDest: 'build/sw.js'
};