const { src, dest, watch, series, parallel } = require('gulp'),
    bs = require('browser-sync').create(),
    // del = require('del'),
    fileinclude = require('gulp-file-include');
    autoprefixer = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    sass = require('gulp-sass')(require('sass'));
    sourcemaps = require('gulp-sourcemaps'),
    ttf2woff = require('gulp-ttf2woff'),
    uglify = require('gulp-uglify');
    svgSprite = require('gulp-svg-sprite'),
    cheerio  = require('gulp-cheerio');

const isDev = false,
      isProd = !isDev;

function serve() {
    bs.init({
        server: {
            baseDir: 'dist/'
        },
        notify: false
    })
}

function html() {
    return src('src/*.html')
    .pipe(fileinclude())
    .pipe(dest('dist/'))
    .pipe(bs.stream())
}

function scss() {
    return src('src/scss/style.scss')
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer())
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(dest('dist/css/'))
    .pipe(bs.stream())
}

function css_libs() {
    return src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/swiper/swiper-bundle.min.css',
        'node_modules/@fancyapps/ui/dist/fancybox.css',
        'node_modules/vanilla-calendar-pro/build/vanilla-calendar.min.css',
    ])
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(dest('dist/css/libs/'))
    .pipe(bs.stream())
}

function js() {
    return src('src/js/**/*.js')
    // .pipe(gulpif(isProd, uglify()))
    .pipe(dest('dist/js/'))
    .pipe(bs.stream())
}

function js_libs() {
    return src([
        'node_modules/swiper/swiper-bundle.min.js',
        'node_modules/@fancyapps/ui/dist/fancybox.umd.js',
        'node_modules/vanilla-calendar-pro/build/vanilla-calendar.min.js',
        'node_modules/imask/dist/imask.min.js',
    ])
    .pipe(gulpif(isProd, uglify()))
    .pipe(dest('dist/js/libs/'))
    .pipe(bs.stream())
}

function fonts() {
    return src('src/fonts/**/*')
    .pipe(changed('dist/fonts/', {
        extension: '.woff',
        hasChanged: changed.compareLastModifiedTime
    }))
    .pipe(ttf2woff())
    .pipe(dest('dist/fonts/'))
    .pipe(bs.stream())
}


function images() {
    return src([
        'src/img/**/*',
        '!src/img/sprite/**/*.svg'
    ])
    .pipe(changed('dist/img/', {
        hasChanged: changed.compareLastModifiedTime
    }))
    .pipe(imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
    }))
    .pipe(dest('dist/img/'))
    .pipe(bs.stream())
}

function svgSprites() {
    return src('src/img/sprite/**/*.svg')
    .pipe(cheerio({
        run: $ => {
           $("[fill]").removeAttr("fill");
           $("[stroke]").removeAttr("stroke");
           $("[style]").removeAttr("style");
        },
        parserOptions: {xmlMode: true}
     }))
     .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../sprite.svg'
            }
        },
    }))
    .pipe(dest('dist/img/icons/'))
    .pipe(bs.stream())
}

function startWatch() {
    watch('src/**/*.html', html);
    watch('src/scss/**/*.scss', scss);
    watch('src/js/**/*.js', js);
    watch('src/fonts/**/*', fonts);
    watch('src/img/**/*', images);
    watch('src/img/sprite/**/*.svg', svgSprites);
}

function clean() {
    return del("dist/**/*")
}

exports.serve = serve;
exports.html = html;
exports.scss = scss;
exports.css_libs = css_libs;
exports.js = js;
exports.js_libs = js_libs;
exports.fonts = fonts;
exports.images = images;
exports.svgSprites = svgSprites;
exports.startWatch = startWatch;

exports.clean = clean;

exports.default = parallel(html, scss, css_libs, js, js_libs, fonts, images, svgSprites, serve, startWatch);