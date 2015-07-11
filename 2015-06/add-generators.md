# Agregar un generador a ember-cli-page-object

## 1. Contar algo mínimo de ember-cli-page-object

Usar como ejemplo [ember-cli-todos](https://github.com/ember-cli/ember-cli-todos)
y crear un page object

## 2. Crear un blueprint

Para crear un blueprint usamos un generador

```js
$ ember generate blueprint page-object
```

Luego vemos muy por arriba los archivos que se generan.

```
installing
  create blueprints/.jshintrc
  create blueprints/page-object/index.js
installing
  create app/blueprints/page-object.js
```

Y lo probamos en el proyecto ember-cli-todos (usamos npm link)

Y vemos que aparece en la lista de generadores disponibles

```
Available blueprints:
  ember-cli-page-object:
    page-object <name>
      Generates a page object for acceptance tests.
```

## 3. Agregamos la funcionalidad

Creamos el archivo `blueprints/page-object/files/tests/pages/__name__.js` con el contenido

```js
import PageObject from '../page-object';

let {
  visitable
} = PageObject;

export default PageObject.build({
  visit: visitable('/');
});
```

Luego repetimos con un blueprint para componentes

## 4. Abrimos un PR

Done.

## Más info

https://gist.github.com/kristianmandrup/ae3174217f68a6a51ed5
