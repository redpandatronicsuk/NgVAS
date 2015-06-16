var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({branch: 'gh-pages'}));
});