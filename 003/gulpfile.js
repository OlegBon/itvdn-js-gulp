// Задание 1
// Создайте файлы scss и создайте таск для их компиляции.

import { src, dest } from "gulp";
import * as dartSass from "sass"; // Для роботи с scss
import gulpSass from "gulp-sass"; // Для роботи с scss
import plumber from "gulp-plumber"; // Для обробки помилок
import sourcemaps from "gulp-sourcemaps"; // Для створення карт
import rename from "gulp-rename"; // Для перейменування
import concat from "gulp-concat"; // Для об'єднання
import cssnano from "cssnano"; // Для оптимізаці css
import postcss from "gulp-postcss"; // Для роботи з css

const sass = gulpSass(dartSass);

const path = {
  scss: "src/styles/scss/**/*.scss",
  js: "src/scripts/js/**/*.js",
  html: "src/**/*.html",
};

const destPath = {
  css: "dist/css",
  js: "dist/js",
  html: "dist",
};

function scss2css() {
  const plugins = [cssnano()]; // Збираємо плагіни для postcss
  return src(path.scss)
    .pipe(plumber()) // Для обробки помилок
    .pipe(sourcemaps.init()) // Ініціалізація карт
    .pipe(sass().on("error", sass.logError)) // Компіляція scss
    .pipe(concat("style.css")) // Об'єднання файлів в один
    .pipe(postcss(plugins)) // Оптимізація css за допомогою плагінів
    .pipe(sourcemaps.write()) // Створення карт
    .pipe(rename({ suffix: ".min" })) // Перейменування
    .pipe(dest(destPath.css)); // Перенос файлів в папку виходу
}

export { scss2css };

// Задание 2
// Создайте файлы js c современным синтаксисом и создайте таск для их обработки с помощью babel.

import babel from "gulp-babel";
import uglify from "gulp-uglify-es";
import eslint from "gulp-eslint";

const uglifyEs = uglify.default;

function lintjs() {
  return (
    src(path.js)
      .pipe(eslint({ fix: true }))
      .pipe(eslint.format())
      // .pipe(dest((file) => file.base))
      .pipe(eslint.failAfterError())
  );
}

export { lintjs };

function babeljs() {
  return src(path.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-transform-spread"],
      })
    )
    .pipe(concat("main.js"))
    .pipe(uglifyEs())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(destPath.js));
}

export { babeljs };

// Задание 3
// Создайте таск watcher, который будет следить за изменениями в файлах вашего проекта и будет запускать таски с задания 1 и 2.

import { watch, series } from "gulp";
import htmlValidator from "gulp-html";
import htmlmin from "gulp-htmlmin";
import { deleteAsync } from "del";

const watchPath = {
  scss: [path.scss, "!dist/css/**/*.css"], // виключаємо згенеровані файли
  js: [path.js, "!dist/js/**/*.js"], // виключаємо згенеровані файли
  html: [path.html, "!dist/**/*.html"], // виключаємо згенеровані файли
};

function clean() {
  return deleteAsync(["dist/**", "!dist"]);
}

function moveHtml() {
  return src(path.html)
    .pipe(plumber())
    .pipe(htmlValidator({ verbose: true }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest(destPath.html));
}

function watcher() {
  watch(watchPath.scss, scss2css);
  watch(watchPath.js, series(lintjs, babeljs));
  watch(watchPath.html, moveHtml);
}

const dev = series(clean, moveHtml, scss2css, lintjs, babeljs, watcher);
const build = series(clean, moveHtml, scss2css, babeljs);

export { dev, build, moveHtml, clean };

// Дополнительное задание
// Изучить возможности плагинов babel и расширить возможности таска с урока путем установки новых плагинов.
