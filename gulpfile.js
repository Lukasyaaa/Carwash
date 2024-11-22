import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";
//Задачи
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { zip } from "./gulp/tasks/zip.js";
import { server } from "./gulp/tasks/server.js";

global.app = {
    isBuild: process.argv.includes("--build"),
    isDev: !process.argv.includes("--build"),
    path: path,
    gulp: gulp,
    plugins: plugins
};

function watcher(){
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
}

const fontsTasks = gulp.series(otfToTtf, ttfToWoff, fontsStyle);
const mainTasks = gulp.series(reset, fontsTasks, gulp.parallel(html, scss, js, images));
const postTasks = gulp.parallel(watcher, server);

const dev = gulp.series(mainTasks, postTasks);
const build = gulp.series(mainTasks);
const deployZIP = gulp.series(mainTasks, zip);

export { dev };
export { build };
export { deployZIP };

gulp.task('default', dev);