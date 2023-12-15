
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';


export default defineConfig({
    plugins: [
        laravel({
            input: [
                './resources/index.html',
                './resources/css/index.css',
                './resources/css/jefeDeDepartamento.css',
                './resources/css/teacherSheets.css',
                './resources/js/app.js',
                './resources/js/bootstrap.js',
                './resources/js/jefeDeDepartamento.js',
                './resources/js/jefeDeEstudios.js',
                './resources/js/main.js',
                './resources/js/profesoresDepartamento.js',
                './resources/js/teacherSheets.js',
                './resources/views/jefeDeDepartamento.html',
                './resources/views/jefeDeEstudios.html',
                './resources/views/profesoresDepartamento.html',
                './resources/views/teacherSheets.html',
                './resources/images/LogoMoodle1.jpg'
            ],
            refresh:true
        }),
    ],
   
});
