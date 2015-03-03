module.exports = function( config ){
	config.set({
		basePath : '../',

		files : [

			'./dist/dual-list-picker.js',

			//helpers
			'./test/helpers/**/*.js',

			//tests
			'./test/dual-list-picker/**/*.js'

		],

		autoWatch: false,

		frameworks: [ 'jasmine' ],

		browsers : [ 'PhantomJS' ],

		reporters: [ 'progress', 'junit', 'coverage' ],

		logLevel: config.LOG_INFO,

		singleRun: true,

		plugins : [
			'karma-ng-html2js-preprocessor',
			'karma-junit-reporter',
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-safari-launcher',
			'karma-junit-reporter',
			'karma-coverage',
			'karma-jasmine'
		],

		preprocessors: {
			'**/dist/dual-list-picker.js': 'coverage'
		},

		coverageReporter: {
			type : 'html',
			dir : './test/coverage/dual-list-picker/'
		}

	});

};