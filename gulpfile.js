import gulp from 'gulp';
import browserSync from 'browser-sync';
import nunjucksRender from 'gulp-nunjucks-render';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';

const clients = ['example'];
const browser = browserSync.create();

//  Start Browser
gulp.task('browser', () => {
	browser.init({
		server: {
			baseDir: "./",
			directory: true
		}
	});
});

// Error Handler
var onError = (err) => {
	notify.onError({
		title: 'Compile Error',
		message: '<%= error.message %>'
	})(err);
	this.emit('end');
}

// Templating
gulp.task('nunjucks', async () => {
    const promises = [];

    clients.forEach(client => {
      // Gets .html and .nunjucks files in pages
      var promise = gulp
        .src('src/emails/' + client + '/*.+(html|nunjucks)')
        .pipe(plumber({ errorHandler: onError }))
        //.pipe(inlineCss())
        .pipe(nunjucksRender({ path: ['src/templates/' + client] }))
        // Output files in each clients app folder
        .pipe(gulp.dest(client));

      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      return true;
    });
  });

//Watch 
gulp.task('watch', gulp.series('nunjucks', 'browser', () => {
	gulp.watch('build/**/*.html', browser.reload);
	gulp.watch(['src/templates/**/*.nunjucks', 'src/emails/**/*.nunjucks'], ['nunjucks'], browser.reload);
}));