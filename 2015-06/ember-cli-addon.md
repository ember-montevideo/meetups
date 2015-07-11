# Crear el addon {{scroll-to-here}}

Nos vamos a basar en el paso a paso de la página de ember-cli
http://www.ember-cli.com/#developing-addons-and-blueprints

## 1. Generar un addon usando el blueprint de ember-cli

```sh
$ ember addon ember-cli-scroll-to-here
```

La infraestructura de un addon esta basada en la filosifía __convention over configuration__

La estructura de carpetas es la siguiente

```
app/ - merged with the application’s namespace.
addon/ - part of the addon’s namespace.
blueprints/ - contains any blueprints that come with the addon, each in a separate folder
public/ - static files which will be available in the application as /your-addon/*
test-support/ - merged with the application’s tests/
tests/ - test infrastructure including a “dummy” app and acceptance test helpers.
vendor/ - vendor specific files, such as stylesheets, fonts, external libs etc.
Brocfile.js - Compilation configuration
package.json - Node meta-data, dependencies etc.
index.js - main Node entry point (as per npm conventions)
```

## 2. Mirar el package.json y actualizar la descripción

Actualizar usuario y descripción. Contar sobre el keyword "ember-addon"

```
"description": "Scroll the page to a given point in the page",
"author": "Santiago Ferreira <san650@gmail.com>",
```

## 3. Levantar ember-cli-todos

Contar qué es el proyecto y mostrar el proyecto corriendo

## 4. Crear test de aceptación

Contar sobre la app dummy que hay en tests

```sh
$ ember g acceptance-test use-the-component
```

__!!__ Recordar que hay que arreglar el import `import startApp from '../helpers/start-app';`

## 5. Crear el componente

a. Usamos el generador de ember-cli

```sh
$ ember g component scroll-to-here
```

b. Miramos los archivos que se generaron y contamos muy por arriba lo del archivo `app/components/scroll-to-here.js`

c. Intentamos ejecutar los tests que se generaron pero al ejecutar los tests recibimos un error

> Addon templates were detected, but there are no template compilers registered for `ember-cli-scroll-to-here`. Please make sure your template precompiler (commonly `ember-cli-htmlbars`) is listed in `dependencies` (NOT `devDependencies`) in `ember-cli-scroll-to-here`'s `package.json`.

d. Lo arreglamos!

e. Luego miramos los tests generados

## 6. Agregamos la funcionalidad

```js
let $ = Ember.$;

function Window() {
  let w = $(window);

  this.top = w.scrollTop();
  this.bottom = this.top + (w.prop('innerHeight') || w.height());
}

function Target(selector) {
  let target = $(selector);

  this.isEmpty = !target.length;
  this.top = target.offset().top;
  this.bottom = this.top + target.height();
}

Target.prototype.isOffscreen = function() {
  let w = new Window();

  return this.top < w.top || this.bottom > w.bottom;
};

Target.prototype.scroll = function() {
  if (!this.isEmpty && this.isOffscreen()) {
    Ember.run.schedule('afterRender', () => {
      $('html,body').animate({ scrollTop: this.top }, 1000);
    });
  }
};

function scrollTo(selector) {
  new Target(selector).scroll();
}

export default Ember.Component.extend({
  layout: layout,

  scrollToComponent: Ember.on('didInsertElement', function() {
    scrollTo(`#${this.elementId}`);
  })
});
```

Repasamos el código muy por arriba

## 7. Probamos el componente en ember-cli-todos

a. Usamos `npm link` en nuestro addon para que se pueda referenciar fácil

```js
$ npm link
```

b. Agregamos el addon al package.json del proyecto ember-cli-todos

```js
"ember-cli-scroll-to-here": "0.0.0"
```

Utilizamos la versión actual del paquete npm

c. Hacemos npm link para hacer referencia al addon

```sh
$ npm link ember-cli-scroll-to-here
```

d. Colocamos el componente en el template `app/components/todos-route/template.hbs`

e. Lo probamos y anda!

## 8. Creamos el repositorio de github y hacemos push

## 9. Generamos una nueva versión y publicamos en npm

```sh
$ npm version 0.0.1
$ git push github master
$ git push github --tags
$ npm publish
```

## 10. Utilizamos la nueva versión del addon desde el proyecto ember-cli-todos

## X. Evitar que se ejecute la animación en modo tests

```js
if (ENV.environment !== 'test') {
}
```
