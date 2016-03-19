var gulp          = require('gulp');
// ===== Postcss
var postcss       = require('gulp-postcss');
var assets        = require('postcss-assets');
// ===== CSS/Sass
var autoprefixer  = require('autoprefixer');
var csswring      = require('csswring');
var sass          = require('gulp-sass');
var scsslint      = require('gulp-scss-lint');
var sourcemaps    = require('gulp-sourcemaps');
// ===== JS
var browserify = require('gulp-browserify');
// var webpack       = require('webpack-stream');
// ===== SVG Stuff
var svgstore      = require('gulp-svgstore');
var svgmin        = require('gulp-svgmin');
var postcssSVG    = require('postcss-svg');
// ===== Other Stuff
var cache         = require('gulp-cached');
var watch         = require('gulp-watch');
var browsersync   = require('browser-sync').create();


/*
 *    Setup SVG Workflow - Combine individual SVGs into an SVG sprite/symbol
 */
gulp.task('svg', function() {
    return gulp.src('./svg/src/**/*.svg')
    .pipe(svgstore({
        fileName: 'symbols.svg',
        transformSvg: function (svg, cb) {
            svg.find('[fill]').removeAttr('fill');
            cb(null);
        }
    }))
    .pipe(gulp.dest('./svg/dist'));
});


/*
 *    Compile Sass to CSS
 */
gulp.task('sass', function() {
    var processors = [
        autoprefixer('last 2 version', 'ie 9'),
        assets({
          loadPaths: ['/images']
        }),
        csswring,
        postcssSVG({
          paths: ['/svg/src/'],
        }),
    ];
    return gulp.src('./scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe(browsersync.stream({ match: '/**/*.css' }));
});

/*
 *    Build All JS files
 */
gulp.task('scripts', function() {
  return gulp.src('./js/src/index.js')
      .pipe(browserify({
  		  insertGlobals : true
  		}))
      .pipe(gulp.dest('./js/dist/'));
});


/*
 *    Setup Browser Sync
 */
gulp.task('bs', function() {
    browsersync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('bs-reload', function() {
    browsersync.reload();
});


/*
 *    Setup Gulp watch task
 *
 *    DESC: Watches for changes inside SCSS and JS files and reloads browser after recompiling
 */
gulp.task('watch', function() {
    gulp.watch('./scss/**/*.scss', ['sass', 'bs-reload']);
    gulp.watch('./js/src/**/*.js', ['scripts', 'bs-reload']);
});


/*
 *    Default gulp task, runs on `gulp`
 */
gulp.task('default', ['svg', 'sass', 'scripts', 'watch', 'bs']);
