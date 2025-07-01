const { src, dest, watch, series, parallel } = require("gulp");
const fileInclude = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer").default;
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const { deleteAsync } = require("del");
const browserSync = require("browser-sync").create();
const gulpIf = require("gulp-if");
const webp = require("gulp-webp");
const replace = require("gulp-replace");
const imagemin = require("gulp-imagemin");
const gifsicle = require("imagemin-gifsicle");

const isProd = process.env.NODE_ENV === "production";

const paths = {
  html: {
    src: "src/html/*.html",
    watch: "src/html/**/*.html",
    dest: "dist/",
  },
  styles: {
    src: "src/scss/**/*.scss",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js/",
  },
  images: {
    src: "src/images/**/*.{jpg,jpeg,png}",
    dest: "dist/images/",
  },
  gifs: {
    src: "src/images/**/*.gif",
    dest: "dist/images/",
  },
  fonts: {
    src: "src/fonts/**/*.{ttf,otf}",
    dest: "dist/fonts/",
  },
  icons: {
    src: "src/icons/**/*.svg",
    dest: "dist/icons/",
  },
};

function clean() {
  return deleteAsync(["dist"]);
}

function html() {
  return src(paths.html.src)
    .pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
    .pipe(replace(/\.(jpg|jpeg|png)/g, ".webp"))
    .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true })))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.styles.src)
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulpIf(isProd, cleanCSS()))
    .pipe(gulpIf(!isProd, sourcemaps.write()))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(gulpIf(isProd, uglify()))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function images() {
  return src(paths.images.src)
    .pipe(webp())
    .pipe(dest(paths.images.dest));
}

function gifs() {
  return src(paths.gifs.src)
    .pipe(gulpIf(isProd, imagemin([
      gifsicle({ interlaced: true, optimizationLevel: 3 })
    ])))
    .pipe(dest(paths.gifs.dest));
}

function fonts() {
  return src(paths.fonts.src)
    .pipe(dest(paths.fonts.dest));
}

function icons() {
  return src(paths.icons.src)
    .pipe(dest(paths.icons.dest));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    notify: false,
    open: true,
    port: 3000,
  });

  watch(paths.html.watch, html);
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.images.src, images);
  watch(paths.gifs.src, gifs);
  watch(paths.fonts.src, fonts);
  watch(paths.icons.src, icons);
}

exports.build = series(
  () => {
    process.env.NODE_ENV = "production";
  },
  clean,
  parallel(html, styles, scripts, images, gifs, fonts, icons)
);

exports.default = series(
  clean,
  parallel(html, styles, scripts, images, gifs, fonts, icons),
  serve
);