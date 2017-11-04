// Project Configuration
var url = 'localhost:8888/norwoodfoodhub'; // url of the project


// Load plugins
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    minifycss = require('gulp-uglifycss'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');


// List all javascript files in the order they should load
var config = {
      scripts: [
        // Place libraries in the vendor directory
        // './assets/vendor/*.js',
        // Load custom scripts in the js folder
        './assets/js/custom.js'
      ]
    };


/*
**  Browser Sync
**
**  This section borrowed from Ahmad Awais
**  https://ahmadawais.com/my-advanced-gulp-workflow-for-wordpress-themes/
*/

gulp.task('browser-sync', function() {
  var files = [
    '**/*.php',
    '**/*.{png,jpg,gif}',
    '**/*.css'
  ];
  browserSync.init(files, {
    // Read here http://www.browsersync.io/docs/options/
    proxy: url,
    port: 3000,
    // Tunnel the Browsersync server through a random Public URL
    // tunnel: true,
    // Attempt to use the URL "http://my-private-site.localtunnel.me"
    // tunnel: "foodhub",
    // Inject CSS changes
    injectChanges: true
  });
});


/*
**  Styles
**
**  This section borrowed from Ahmad Awais
**  https://ahmadawais.com/my-advanced-gulp-workflow-for-wordpress-themes/
*/

gulp.task('styles', function () {
  return gulp.src('./assets/sass/custom.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      // outputStyle: 'compact',
      // outputStyle: 'nested',
      // outputStyle: 'expanded',
      precision: 10
    }))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer('last 2 version', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest('./custom/'))
    .pipe(filter('**/*.css')) // Filtering stream to only css files
    .pipe(reload({stream:true})) // Inject Styles when style file is created
    .pipe(minifycss({ 
    // Use a ! in any comments that need to remain in the final stylesheet
      maxLineLen: 80
    }))
    
    .pipe(gulp.dest('./custom/'))
    .pipe(reload({stream:true})) // Inject Styles when min style file is created
    .pipe(notify({ message: 'Styles task complete', onLast: true }));
});


/*
** Scripts
**
** This section borrowed from Jay Hoffmann
** https://jayhoffmann.com/gulp-livereload-sass-wordpress/
*/

gulp.task('scripts', function() {
  return gulp.src(config.scripts)
    .pipe(concat('custom.js'))
    .pipe(gulp.dest('./custom/'))
    // Comment out the following three lines for debugging
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./custom/'));
});


/*
** Watch Task
*/

gulp.task('default', ['styles', 'scripts', 'browser-sync'], function () {
  gulp.watch('./custom/img/*'); 
  gulp.watch('./custom/fonts/*'); 
  gulp.watch('./assets/sass/**/*.scss', ['styles']);
  gulp.watch('./assets/js/**/*.js', ['scripts', browserSync.reload]);
});
