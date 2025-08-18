import { src, dest } from "gulp";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import plumber from "gulp-plumber";
import babel from "gulp-babel";
import concat from "gulp-concat";
import uglify from "gulp-uglify-es";
import eslint from "gulp-eslint";
import { deleteAsync } from "del";
import browserSyncLib from "browser-sync";

import path from "./path.js";

const browserSync = browserSyncLib.create();

// Копіювання JS-файлів
function moveScripts() {
  return src(path.src.js)
    .pipe(dest(path.dist.scripts))
    .pipe(browserSync.stream());
}

// Лінтинг з автофіксом
function scriptLint() {
  return src(path.src.js)
    .pipe(plumber())
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(dest((file) => file.base))
    .pipe(eslint.failAfterError());
}

// Трансформація + мінімізація
function jsModify() {
  return src(path.src.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-transform-spread"],
      })
    )
    .pipe(concat("index.js"))
    .pipe(uglify.default()) // важливо: .default для ESM
    .pipe(sourcemaps.write())
    .pipe(rename("index.min.js"))
    .pipe(dest(path.dist.scripts));
}

// Видалення старого index.js
// function delOldScript(callback) {
//   deleteAsync(`${path.dist}index.js`);
//   callback();
// }

// deleteAsync - промісова. Тому можна використовувати асинхронну функцію
async function delOldScript() {
  // await deleteAsync(`${path.dist}index.js`);
  const deleted = await deleteAsync(`${path.dist.scripts}index.js`);
  if (deleted.length) {
    console.log(`Видалено: ${deleted.join(", ")}`);
  } else {
    console.log("Нічого не видалено — файлів не знайдено.");
  }
}

export { moveScripts, scriptLint, jsModify, delOldScript };
