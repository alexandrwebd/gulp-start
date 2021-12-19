// папки с файлами
const project_folder = require('path').basename(__dirname) // вмемто папки dist создает папку с названием проэкта
const source_folder = 'src'

const fs = require('fs') //file system fs для подключения шрыфтов к стилям

// обьект с путями к файлами
const path = {
  build: {
    // к финальным файлам
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    images: project_folder + '/images/',
    fonts: project_folder + '/fonts/',
    json: project_folder + '/json/',
  },
  src: {
    // к исходникам
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'], // исключаю файлы с подчеркиванием при перемещении в продакшен
    css: source_folder + '/scss/style.scss',
    js: source_folder + '/js/files/script.js',
    images: source_folder + '/images/**/*.{jpg,JPG,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/*.{ttf,woff,woff2}',
    json: source_folder + '/json/*.*',
    slickCss: 'node_modules/slick-carousel/slick/slick.css',
    slickJs: 'node_modules/slick-carousel/slick/slick.js',
    swiperCss: 'node_modules/swiper/swiper-bundle.css',
    swiperJs: 'node_modules/swiper/swiper-bundle.js',
  },
  watch: {
    // пути к файлам которые нужно постоянно слушать
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    images: source_folder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
    json: source_folder + '/json/*.*',
  },
  clean: './' + project_folder + '/', // путь по которому делаеться удаление после каждого запуска gulp
}

//                        *** Прочти ***
// Библиотеки сначала установить, добавить путь в обьект с путями - подключать в функцию libs, добавить путь к css и js в масив src([path.src.swiperCss]) и return src([path.src.swiperJs])
// для конвертации шрифтов поместить шрифты ttf2 в папку src/fonts
// для коректной выгрузки иконок с figma, выделяю shift + comand + O
// перед конвертацией шрифтов файл _fonts.scss должен быть абсолютно пустым без пробелов, после в нем поменять font-weight и поменять в единое семейство шрифта в первом слове, можно вынести в отдельную функцию
// gulp svgSprite создает svg sprite (собирает все svg в один файл) , вызываеться отдельно в новом терминале командой gulp svgSprite, создает html файл презентацию иконок (открываем в редакторе и смотрим как подключить svg в верстке)
// gulp otf2ttf конвертирует шрифты otf2 в ttf и перемещает в папку исходников для дальнейшей конвертации, запускаеться отдельной командой в новом терминале gulp otf2ttf, ошибка пути перемещает файл  в src
// для исправления пути otf2ttf открываем node_module/gulp-fonter/dist/index.js находим строку newFont.path = source.dirname + '\\' меняем на '/'
// gulp deploy выгружает проэкт на gitHub создает github Pages, запускаеться командой gulp deploy
// функция libs конвертирует файлы используемых библиотек в файл libs. Библиотеки устанавливать и добавлять путь в мвссив src
// стили сброшены normalize css, подключены @import в style.scss и в параметрах плагина scss
// протестировать плагины webp css оставить один, протестировать webp html
//  lazysizes поюзать плагин ленивой подгрузки картинок

// Определяем константы Gulp и присваиваю переменные для написания сценария
const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'), //подключает файлы (html, js) в новой версии плагина обьявлять переменную не нужно
  del = require('del'), //удаляет файлы
  scss = require('gulp-sass'),
  concat = require('gulp-concat'), // конкатенирует и переименовывает файлы
  autoprefixer = require('gulp-autoprefixer'), //добавляет вендерные префиксы
  group_media = require('gulp-group-css-media-queries'), // собирает по css мадиа запросы и помещает их в конец файла
  plumber = require('gulp-plumber'), // Отслеживает ошибки и выводит их в консоль
  clean_css = require('gulp-clean-css'), // чистит и сжимает css
  rename = require('gulp-rename'), // переименовывает файл
  babel = require('gulp-babel'), //переводит js-файлы в формат понятный формат, конвертирует javascript стандарта ES6 в ES5
  uglify = require('gulp-uglify-es').default, //сжимает js файлы
  imagemin = require('gulp-imagemin'), //минифицирует images
  newer = require('gulp-newer'), // Проверяем, было ли изменено (сжато) изображение ранее
  webp = require('gulp-webp'), //конвертирует images в webp
  gulpWebpHtml2 = require('gulp-webp-in-html'), //подключает в html изображения через picture, изображения.webp если его потдерживает браузер
  // webpcss = require('gulp-webpcss'), //подключает изображения.webp в css
  webpCss = require('gulp-webp-css'), //заменяет предыдущую функцию
  svgSprite = require('gulp-svg-sprite'), //создает svg sprite
  ttf2woff = require('gulp-ttf2woff'), //шрифт ttf2 в woff
  ttf2woff2 = require('gulp-ttf2woff2'), //шрифт ttf2 в woff2
  fonter = require('gulp-fonter'), //шрифт otf в ttf2 запускаеться отдельной командой gulp otf2ttf
  ghPages = require('gulp-gh-pages'), // выгружает проэкт на gitHub в github Pages запускаеться командой gulp deploy
  sourcemaps = require('gulp-sourcemaps') //рисует карту слитого воедино файла, чтобы было понятно, что из какого файла бралось

//   обновляет браузер
function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/',
    },
    notify: false, // Отключаем уведомления
    port: 3000,
  })
}

// копирует json
function json() {
  return src(path.src.json).pipe(plumber()).pipe(dest(path.build.json))
}

// обрабатывает html
function html() {
  return src(path.src.html)
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    ) //подключает другие файлы к нужному
    .pipe(gulpWebpHtml2()) //подключает webp в html замена верхнего
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

// обрабатывает css
function css() {
  return (
    src(path.src.css)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(
        scss({
          outputStyle: 'expanded',
          includePaths: require('node-normalize-scss').includePaths,
        })
      ) //конвертирует scss
      .pipe(group_media()) //собирает медиазапросы
      .pipe(
        autoprefixer({
          overrideBrowserslist: ['last 5 versions'],
          grid: true,
          cascade: true,
        })
      ) //добавляем вендерные префиксы
      // .pipe(
      //   webpcss({
      //     webpClass: '.webp',
      //     noWebpClass: '.no-webp',
      //   })
      // ) //добавляет изображения webp
      .pipe(webpCss()) //замена функции webpcss
      .pipe(sourcemaps.write())
      .pipe(dest(path.build.css)) //выгружаем не сжатый файл
      .pipe(clean_css()) //сжимаем
      .pipe(
        rename({
          extname: '.min.css',
        })
      ) //переименовываем
      .pipe(sourcemaps.write())
      .pipe(dest(path.build.css)) //выгружаем сжатый файл
      .pipe(browsersync.stream())
  )
}

// конвертирует файлы используемых библиотек в файл libs. Библиотеки устанавливать и добавлять путь в мвссив src
function libs() {
  src(path.src.swiperCss) // берем css файлы используемых библиотек
    .pipe(concat('libs.min.css')) // конкатенируем, переименовываем
    .pipe(clean_css()) //сжимаем
    .pipe(dest(path.build.css)) //выгружаем сжатый файл
  return src(path.src.swiperJs) // берем js файлы используемых библиотек
    .pipe(concat('libs.min.js')) // конкатенируем
    .pipe(uglify()) // сжимаем
    .pipe(dest(path.build.js)) // выгружаем
}

// обрабатывает js (добавить babal)
function js() {
  return src(path.src.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    ) //конвертирует javascript стандарта ES6 в ES5
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    ) // подключает файлы внутри
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.js))
    .pipe(uglify()) // сжимает js
    .pipe(
      rename({
        extname: '.min.js',
      }) // переименовываем
    )
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.js)) // выгружаем
    .pipe(browsersync.stream())
}

// обрабатывает images, выгружаем webp и обычные изображения для старых браузеров
function images() {
  return src(path.src.images)
    .pipe(newer(path.build.images)) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(
      webp({
        quality: 70,
      })
    ) // конвертирует в webp
    .pipe(dest(path.build.images)) // выгружает в продакшен webp
    .pipe(src(path.src.images)) // снова берет изображения
    .pipe(newer(path.build.images)) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3, // 0 to 7
      })
    ) // минифицирует изображения
    .pipe(dest(path.build.images)) //выгружает в продакшен обычные форматы
    .pipe(browsersync.stream())
}

// удаляет файлы
function clean(params) {
  return del(path.clean)
}

// конвертирует шрифты шрифты в ttf2woff и ttf2woff2 добавил async
function fonts(params) {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts))
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts))
}

// конвертирует шрифты otf2 в ttf и перемещает в папку исходников для дальнейшей конвертации, запускаеться отдельной командой в новом терминале gulp otf2ttf
gulp.task('otf2ttf', function () {
  return src([source_folder + '/fonts/*.otf'])
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(dest(source_folder + '/fonts/')) //ошибка пути копирует в src
})

// создает svg sprite (собирает все svg в один файл) , вызываеться отдельно в новом терминале командой gulp svgSprite
gulp.task('svgSprite', function () {
  return gulp
    .src([source_folder + '/iconsprite/*.svg'])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons/icons.svg', // sprite file name
            example: true, //создает html файл презентацию иконок (открываем в редакторе и смотрим как подключить svg в верстке)
          },
        },
      })
    )
    .pipe(dest(path.build.images))
})

// выгружает проэкт на gitHub создает github Pages, запускаеться командой gulp deploy
gulp.task('deploy', function () {
  return gulp.src('./' + project_folder + '/**/*').pipe(ghPages())
})

// Кастомная функция подключает файлы шрифтов к стилям, записывет имена файлов шрифтов в fonts.scss
function fontsStyle(params) {
  let file_content = fs.readFileSync(source_folder + '/scss/_fonts.scss')
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/_fonts.scss', '', cb)
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.')
          fontname = fontname[0]
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + '/scss/_fonts.scss',
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            )
          }
          c_fontname = fontname
        }
      }
    })
  }
}

function cb() {} // функция колбек необходима для коректной работы fontsStyle

// следит за файлами
function watchFiles(params) {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.images], images)
  gulp.watch([path.watch.json], json)
}

// сценарий выполнения поочередно, деляю первым и передаю в слежение
const build = gulp.series(
  clean,
  gulp.parallel(html, css, js, json, images, fonts, libs),
  fontsStyle
)
// сценарий выполнения паралельно
const watch = gulp.parallel(build, watchFiles, browserSync)

// совмещаю переменные с gulp - экспортирую функции в gulp task
exports.html = html
exports.scss = scss
exports.js = js
exports.jsons = json
exports.libs = libs
exports.fontsStyle = fontsStyle
exports.fonts = fonts
exports.images = images
exports.build = build
exports.watch = watch
exports.default = watch
