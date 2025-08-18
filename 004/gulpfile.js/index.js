import { series, parallel, watch } from "gulp";
import browserSyncLib from "browser-sync";
import { deleteAsync } from "del";

import path from "./path.js";
import { moveHtml, validation, pathRewrite, minify } from "./templates.js";
import { scss2css, postcss2css, removeOldStyle } from "./styles.js";
import { moveScripts, scriptLint, jsModify, delOldScript } from "./scripts.js";
import { moveImage, sprite, minimage } from "./images.js";

const browserSync = browserSyncLib.create();

// Видалення старих файлів
// Видалення старого dist
// function cleanOldFiles(callback) {
//   deleteAsync(`${path.dist}**`);
//   callback();
// }

// deleteAsync - промісова. Тому можна використовувати асинхронну функцію
async function cleanOldFiles() {
  const deleted = await deleteAsync(
    [path.dist.styles, path.dist.scripts, path.dist.img, path.dist.html],
    { force: true }
  );
  console.log(
    deleted.length
      ? `Видалено: ${deleted.join(", ")}`
      : "Нічого не видалено — файлів не знайдено."
  );
}

// Слідкування
function watcher() {
  browserSync.init({
    server: {
      baseDir: path.dist.root,
    },
  });
  watch(path.src.scss, series(scss2css));
  watch(path.src.html, series(moveHtml));
  watch(path.src.js, series(moveScripts));
  watch(path.dist.all).on("change", browserSync.reload);
}

// Лог білда
// function logBuildTime(callback) {
//   console.log(`Білд завершено: ${new Date().toLocaleString()}`);
//   callback();
// }

// Таймер
let startTime;

// Запуск таймера
function startTimer(callback) {
  startTime = performance.now(); // Точніше, ніж Date.now()
  callback();
}

// Лог білда і тривалості
function logBuildTime(callback) {
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2); // до сотих мілісекунди

  const now = new Date();
  const time = now.toLocaleTimeString("uk-UA", { hour12: false });
  const date = now.toLocaleDateString("uk-UA");

  console.log(`Білд завершено: ${date} ${time}.${now.getMilliseconds()} мс`);
  console.log(`Тривалість білду: ${duration} мс`);
  callback();
}

const dev = series(
  cleanOldFiles,
  moveHtml,
  sprite,
  moveImage,
  moveScripts,
  scss2css,
  watcher
);

// const build = parallel(
//   series(postcss2css, removeOldStyle),
//   series(jsModify, delOldScript),
//   series(pathRewrite, minify),
//   series(minimage)
// );

const linter = scriptLint;
const htmllint = validation;

const cssBuild = series(postcss2css, removeOldStyle);
const jsBuild = series(jsModify, delOldScript);
const htmlBuild = series(pathRewrite, minify);
const imgBuild = series(minimage);

const build = parallel(cssBuild, jsBuild, htmlBuild, imgBuild);
const buildTime = series(build, logBuildTime);
const buildLogTime = series(startTimer, build, logBuildTime);

export { dev, build, linter, htmllint, buildTime, buildLogTime };
