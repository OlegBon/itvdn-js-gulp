import { src, dest } from "gulp";
import plumber from "gulp-plumber";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import combineMediaQuery from "postcss-combine-media-query";
import { deleteAsync } from "del";
import browserSyncLib from "browser-sync";

import path from "./path.js";

const browserSync = browserSyncLib.create();
const sass = gulpSass(dartSass);

// Компіляція SCSS → style.css
function scss2css() {
  return src(path.src.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rename("style.css"))
    .pipe(
      sass({
        includePaths: ["node_modules"],
      }).on("error", sass.logError)
    )
    .pipe(sourcemaps.write())
    .pipe(dest(path.dist.styles))
    .pipe(browserSync.stream());
}

// Оптимізація CSS → style.min.css
function postcss2css() {
  const plugins = [autoprefixer(), combineMediaQuery(), cssnano()];
  return src(`${path.dist.styles}*.css`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .pipe(rename("style.min.css"))
    .pipe(dest(path.dist.styles));
}

// Видалення старого style.css
// function removeOldStyle(callback) {
//   deleteAsync(`${path.dist}style.css`);
//   callback();
// }

// deleteAsync - промісова. Тому можна використовувати асинхронну функцію
async function removeOldStyle() {
  // await deleteAsync(`${path.dist}style.css`);
  const deleted = await deleteAsync(`${path.dist.styles}style.css`);
  if (deleted.length) {
    console.log(`Видалено: ${deleted.join(", ")}`);
  } else {
    console.log("Нічого не видалено — файлів не знайдено.");
  }
}

export { scss2css, postcss2css, removeOldStyle };
