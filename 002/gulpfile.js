// Задание 1
// Создайте структуру проекта, в котором есть index.html, папка со стилями и папка со скриптами. Напишите таск, который делает выборку всех файлов и делает перенос в новую директорию build.
import { src, dest } from "gulp";

function copy() {
  return src("app/**/*.*").pipe(dest("build"));
}

export { copy };

// Задание 2
// Создайте новый таск в предыдущем проекте. Создайте таск, который выбирает все файлы кроме файлов стилей и переносит в директорию no-css.

function noCss() {
  return src(["app/**/*.*", "!app/**/*.css"]).pipe(dest("no-css"));
}

export { noCss };

// Задание 3
// Создайте таск, который выполняет параллельное выполнение двух предыдущих тасков.
import { parallel } from "gulp";

export const parallelTask = parallel(copy, noCss);

// Дополнительное задание
// Создать приватные и публичные файлы и проверить правильность выполнения через команду gulp --tasks.

// Приватные таски
function copyHTML() {
  return src("app/**/*.html").pipe(dest("output"));
}

function copyCSS() {
  return src("app/**/*.css").pipe(dest("output"));
}

function copyJS() {
  return src("app/**/*.js").pipe(dest("output"));
}

// Публичные таски
export const publicTask = parallel(copyHTML, copyCSS, copyJS);
