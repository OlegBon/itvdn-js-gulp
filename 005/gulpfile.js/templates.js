import { src, dest } from "gulp";
import htmlmin from "gulp-htmlmin";
import plumber from "gulp-plumber";
import browserSyncLib from "browser-sync";
import processhtml from "gulp-processhtml";
import htmlValidator from "gulp-html";

import path from "./path.js";

const browserSync = browserSyncLib.create();

// Переміщення HTML + live reload
function moveHtml() {
  return src(path.src.html)
    .pipe(dest(path.dist.html))
    .pipe(browserSync.stream());
}

// Переписування шляхів у HTML
function pathRewrite() {
  return src(path.src.html).pipe(processhtml()).pipe(dest(path.dist.html));
}

// Валідація HTML через gulp-html
function validation() {
  return src(path.src.html)
    .pipe(plumber())
    .pipe(htmlValidator({ verbose: true }));
}

// Мінімізація HTML
function minify() {
  return src(`${path.dist.html}*.html`)
    .pipe(plumber())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest(path.dist.html));
}

export { moveHtml, pathRewrite, validation, minify };
