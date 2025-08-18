import { src, dest } from "gulp";
import spritesmith from "gulp.spritesmith";
import imagemin from "gulp-imagemin";
import plumber from "gulp-plumber";
import browserSyncLib from "browser-sync";

import path from "./path.js";

const browserSync = browserSyncLib.create();

// Копіювання зображень (без icons та sprite.scss)
function moveImage() {
  return src([path.src.img, `!${path.src.icons}`, `!${path.src.sprite}*.scss`])
    .pipe(dest(path.dist.img))
    .pipe(browserSync.stream());
}

// Генерація спрайту
function sprite() {
  return src(path.src.icons)
    .pipe(plumber())
    .pipe(
      spritesmith({
        imgName: "sprite.png",
        cssName: "sprite.scss",
        algorithm: "binary-tree",
        padding: 20,
      })
    )
    .pipe(dest(path.src.sprite));
}

// Оптимізація зображень
function minimage() {
  return src(`${path.dist.img}**/*`)
    .pipe(plumber())
    .pipe(
      imagemin(
        [
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { removeAttrs: true }],
          }),
          imagemin.gifsicle({
            optimizationLevel: 3,
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(dest(path.dist.img));
}

export { moveImage, sprite, minimage };
