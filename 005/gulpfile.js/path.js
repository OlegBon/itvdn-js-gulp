import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, ".."); // корінь проєкту

const path = {
  src: {
    root: resolve(root, "web-page"),
    html: resolve(root, "web-page/*.html"),
    scss: resolve(root, "web-page/styles/**/*.scss"),
    js: resolve(root, "web-page/scripts/**/*.js"),
    img: resolve(root, "web-page/img/**/*.{jpg,jpeg,png,svg,gif,webp}"),
    icons: resolve(root, "web-page/img/icons/*.png"),
    sprite: resolve(root, "web-page/img/sprite/"),
  },
  dist: {
    root: resolve(root, "dist"),
    html: resolve(root, "dist"),
    styles: resolve(root, "dist/styles"),
    scripts: resolve(root, "dist/scripts"),
    img: resolve(root, "dist/img"),
    all: resolve(root, "dist/**/*"),
  },
};

export default path;
