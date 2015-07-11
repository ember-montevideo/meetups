# Crear una aplicación desde 0

Utilizando el template de aplicación `reading-list` del proyecto
[ten](https://github.com/san650/ten)

Lo siguiente son algunas notas muy por arriba del orden en que se construyó la
aplicación.

Aquí puedes acceder al [código de la aplicación](https://github.com/ember-montevideo/reading-list)

## Algunas notas de la construcción paso a paso

1. Copiar assets y HTML

$ cp ../../ten/dist/reading-list/stylesheets/main.css app/styles/app.css
$ cp ../../ten/dist/reading-list/index.html app/templates/application.hbs
Y dejar en el template solo la parte del contenido.

2. Obtener la lista de libros de un modelo

Copiamos la lista de modelos del README de ten y le agregamos un atributo shelves a cada libro.

Listamos todos los libros de una para ver como conectamos el modelo con el template.

3. Pasar la lista de libros a un componente

Y que filtre la lista de libros por un shelve.

Primero muevo el template al componente y veo como se engancha facil. Luego creo una propiedad calculada para filtrar la lista. Ahí me doy cuenta que preciso que los modelos sean Ember.Object.

También aprovecho para ordenar la lista.

4. Reemplazo todos los listados por el componente

Reemplazo y hago que se filtre por el shelve que le paso al componente

5. Creo la ruta next

Vemos que la ruta de inicio es index y no application Vemos como las rutas y los templates se anidan

6. Agregar las rutas to buy y history

Es lo mismo

7. Arreglamos el estilo para que agarre el 100% en altura

8. Agregamos la ruta search

Agrego la ruta y el template. Agrego la subruta result y vemos como funciona Luego agrego la accion search y la engancho con el valor del input

9. Leer resultados del servicio web

La URL es https://openlibrary.org/search.json?q=the+lord+of+the+rings donde tenemos que usar + en vez de espacios.

El formato del resultado tiene la siguiente estructura:

Un primer nivel con la cantidad de resultados

{
    "numFound": 629,
    "docs": [
        {...},
        {...},
        {...},
        ...
        {...}]
}
y cada resultado dentro de docs tiene el siguiente formato

{
    cover_i: 258027,
    has_fulltext: true,
    edition_count: 120,
    title: "The Lord of the Rings",
    author_name: [
        "J. R. R. Tolkien"
    ],
    first_publish_year: 1954,
    key: "OL27448W",
    ia: [
        "returnofking00tolk_1",
        "lordofrings00tolk_1",
        "lordofrings00tolk_0",
        "lordofrings00tolk_3",
        "lordofrings00tolk_2",
        "lordofrings00tolk",
        "twotowersbeingse1970tolk",
        "lordofring00tolk",
        "lordofrings56tolk",
        "lordofringstolk00tolk",
        "fellowshipofring00tolk_0"
    ],
    author_key: [
        "OL26320A"
    ],
    public_scan_b: true
}
Configurar CORS

if (environment === 'development') {
  ENV.contentSecurityPolicy = {
    'default-src': "'self' http://localhost:4200",
    'connect-src': "'self' http://localhost:4200 https://openlibrary.org"
  }
}
Tips

Para usar JSONP y limitar la cantidad:

return $.getJSON('https://openlibrary.org/search.json?q=' + term + '&limit=30&callback=')
10. Show spinner on searching

Agregar el template loading...

Se puede usar un spinner de aca http://tobiasahlin.com/spinkit/
