const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

require('laravel-mix-purgecss');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .js('resources/js/Client/app.js', 'public/js')
    .js('resources/js/Admin/app.js', 'public/js/admin')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/appClient.scss', 'public/css')
    .sass('resources/sass/appAdmin.scss', 'public/css')
    .options({
        postCss: [tailwindcss('./tailwind.config.js')],
    })
    .version()
    // .purgeCss({
    //     enabled: mix.inProduction(),
    //     folders: ['src', 'templates'],
    //     extensions: ['html', 'js', 'php', 'vue'],
    // })
    ;
