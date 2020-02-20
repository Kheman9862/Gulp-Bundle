const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
const origin = "src";
const destination = "build";
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const concatenate = require("gulp-concat");
const sass = require("gulp-sass");

sass.compiler = require("node-sass");

async function clean(cb) {
  await del(destination);
  cb();
}

//In this i am using globs to get any html file
function html(cb) {
  src(`${origin}/**/*.html`).pipe(dest(destination));
  cb();
}

//No need to take bootstarp file since that is importing through style.scss file.
function css(cb) {
  src([`${origin}/css/animate.css`]).pipe(dest(`${destination}/css`));

  src(`${origin}/css/style.scss`)
    .pipe(
      sass({
        outputStyle: "compressed"
      })
    )

    .pipe(dest(`${destination}/css`));

  cb();
}

function js(cb) {
  src(`${origin}/js/lib/**/*.js`).pipe(dest(`${destination}/js/lib`));

  src(`${origin}/js/script.js`)
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(dest(`${destination}/js`));
  cb();
}

function watcher(cb) {
  watch(`${origin}/**/*.html`).on("change", series(html, browserSync.reload));
  watch(`${origin}/**/*.scss`).on("change", series(css, browserSync.reload));
  watch(`${origin}/**/*.js`).on("change", series(js, browserSync.reload));
  cb();
}

function server(cb) {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: destination
    }
  });
  cb();
}

// exports.html = html;
// exports.css = css;
// exports.js = js;

// There is a shorcut for exporting below
exports.default = series(clean, parallel(html, css, js), server, watcher);
