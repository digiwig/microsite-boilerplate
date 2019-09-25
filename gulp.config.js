module.exports = function() {

    return {
        sass: {
            input: ['./app/scss/**/*.scss', './app/modules/**/*.scss'],
            base: ['./app/scss/app.scss'],
            output: './dist/css/'
        },
        js: {
            input: ['./app/js/**/*.js', './app/modules/**/*.js'],
            base: ['./app/js/**/*.js', './app/modules/**/*.js'],
            output: './dist/js/'
        },
        options: {
            sass: {
                errLogToConsole: true,
                outputStyle: 'compressed'
            },
            autoprefixer: {
                remove: false,
                browsers: ['last 3 versions']
            }
        }
    };

};
