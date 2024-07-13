
# Node.js Kick-off Workshop: Proyecto Real

## Introducción
Bienvenidos al proyecto de introducción a Node.js. Este proyecto está diseñado para aplicar los conceptos básicos de Node.js y Express que has aprendido durante la primera semana del curso. Crearás una API RESTful que interactúa con el sistema de archivos en lugar de una base de datos.

## Instrucciones de Entrega
1. Crea un repositorio en GitHub llamado `nodejs-first-project`.
2. Sigue las instrucciones y completa los objetivos establecidos en este documento.
3. Sube tu proyecto a GitHub y comparte el enlace del repositorio.

## Objetivos
- Configurar un entorno de desarrollo Node.js.
- Crear un servidor web utilizando Node.js y Express.
- Implementar rutas y middlewares en Express.
- Leer y escribir datos en el sistema de archivos utilizando el módulo `fs`.
- Manejar errores y asegurar la API con middlewares.

## Descripción del Proyecto
Crearás una API RESTful para gestionar una lista de tareas (To-Do List). Las tareas se almacenarán en un archivo JSON en el sistema de archivos.

## Historias de Usuario

### 1. Como usuario, quiero poder crear una nueva tarea para agregarla a mi lista de tareas.
- **Ruta:** POST `/tasks`
- **Cuerpo de la solicitud:**
  ```json
  {
    "title": "Nombre de la tarea",
    "description": "Descripción de la tarea"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Tarea creada exitosamente",
    "task": {
      "id": 1,
      "title": "Nombre de la tarea",
      "description": "Descripción de la tarea"
    }
  }
  ```

### 2. Como usuario, quiero poder ver todas mis tareas para revisarlas.
- **Ruta:** GET `/tasks`
- **Respuesta:**
  ```json
  [
    {
      "id": 1,
      "title": "Nombre de la tarea",
      "description": "Descripción de la tarea"
    },
    ...
  ]
  ```

### 3. Como usuario, quiero poder ver una tarea específica por su ID para conocer sus detalles.
- **Ruta:** GET `/tasks/:id`
- **Respuesta:**
  ```json
  {
    "id": 1,
    "title": "Nombre de la tarea",
    "description": "Descripción de la tarea"
  }
  ```

### 4. Como usuario, quiero poder actualizar una tarea existente para modificar su información.
- **Ruta:** PUT `/tasks/:id`
- **Cuerpo de la solicitud:**
  ```json
  {
    "title": "Nuevo nombre de la tarea",
    "description": "Nueva descripción de la tarea"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Tarea actualizada exitosamente",
    "task": {
      "id": 1,
      "title": "Nuevo nombre de la tarea",
      "description": "Nueva descripción de la tarea"
    }
  }
  ```

### 5. Como usuario, quiero poder eliminar una tarea para mantener mi lista organizada.
- **Ruta:** DELETE `/tasks/:id`
- **Respuesta:**
  ```json
  {
    "message": "Tarea eliminada exitosamente"
  }
  ```

## Requisitos del Proyecto

### 1. Configuración del Entorno
- Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/). Recomendamos la versión LTS.
- Verifica la instalación con los siguientes comandos:
  ```sh
  node -v
  npm -v
  ```

### 2. Inicialización del Proyecto
- Inicia un nuevo proyecto Node.js:
  ```sh
  mkdir nodejs-first-project
  cd nodejs-first-project
  npm init -y
  ```

### 3. Instalación de Dependencias
- Instala Express:
  ```sh
  npm install express
  ```

### 4. Creación de la API RESTful

#### Estructura del Proyecto
```
nodejs-first-project/
├── data/
│   └── tasks.json
├── src/
│   ├── routes/
│   │   └── tasks.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   └── app.js
├── package.json
└── index.js
```

#### 1. Crear el archivo `tasks.json`
- Crea la carpeta `data` y el archivo `tasks.json`:
  ```sh
  mkdir data
  echo "[]" > data/tasks.json
  ```

#### 2. Crear el Servidor con Express
- Crea la carpeta `src` y el archivo `app.js`:
  ```js
  const express = require("express"); // Importamos Express
  const tasksRoutes = require("./routes/tasks"); // Importamos las rutas de la API
  const errorHandler = require("./middlewares/errorHandler"); // Importamos el middleware para manejo de errores

  const app = express(); // Instanciamos Express
  const PORT = 3000; // Puerto del servidor en donde se ejecutará la API

  app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes en formato JSON. Tambien conocido como middleware de aplicación.
  app.use("/tasks", tasksRoutes); // Middleware para manejar las rutas de la API. Tambien conocido como middleware de montaje o de enrutamiento.
  app.use(errorHandler); // Middleware para manejar errores.

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
  ```

#### 3. Crear las Rutas de la API
- Crea la carpeta `routes` y el archivo `tasks.js`:
  ```js
  const express = require("express");
  const fs = require("fs");
  const path = require("path");

  const router = express.Router();
  const tasksFilePath = path.join(__dirname, "../../data/tasks.json");

  // Leer tareas desde el archivo
  const readTasks = () => {
    const tasksData = fs.readFileSync(tasksFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
    return JSON.parse(tasksData); // Retornar los datos en formato JSON.
  };

  // Escribir tareas en el archivo
  const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2)); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
  };

  // Crear una nueva tarea
  router.post("/", (req, res) => {
    const tasks = readTasks();
    const newTask = {
      id: tasks.length + 1, // simulamos un id autoincrementable
      title: req.body.title, // obtenemos el titulo de la tarea desde el cuerpo de la solicitud
      description: req.body.description, // obtenemos la descripcion de la tarea desde el cuerpo de la solicitud
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json({ message: "Tarea creada exitosamente", task: newTask });
  });

  // Obtener todas las tareas
  router.get("/", (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
  });

  // Obtener una tarea por ID
  router.get("/:id", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json(task);
  });

  // Actualizar una tarea por ID
  router.put("/:id", (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    const updatedTask = {
      ...tasks[taskIndex],
      title: req.body.title,
      description: req.body.description,
    };
    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);
    res.json({ message: "Tarea actualizada exitosamente", task: updatedTask });
  });

  // Eliminar una tarea por ID
  router.delete("/:id", (req, res) => {
    const tasks = readTasks();
    const newTasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
    if (tasks.length === newTasks.length) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    writeTasks(newTasks);
    res.json({ message: "Tarea eliminada exitosamente" });
  });

  module.exports = router;
  ```

#### 4. Crear Middleware para Manejo de Errores
- Crea la carpeta `middlewares` y el archivo `errorHandler.js`:
  ```js
  const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Ocurrió un error en el servidor" });
  };

  module.exports = errorHandler;
  ```

#### 5. Archivo de Entrada del Proyecto
- Crea el archivo `index.js` en la raíz del proyecto:
  ```js
  require("./src/app");
  ```

## 5. Ejecución del Proyecto
- Ejecuta el proyecto con el siguiente comando:
  ```sh
  node index.js
  ```

- Deberás ver un mensaje similar al siguiente:
  ```
  Server running at http://localhost:3000/
  ```

- Abre tu navegador y accede a [http://localhost:3000/tasks](http://localhost:3000/tasks) para probar la API.

## 6. Probando la API (Ejemplo con POST)

Para probar nuestra API, podemos utilizar herramientas como [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/). Descarga e instala una de estas aplicaciones para realizar las siguientes pruebas.

Para este ejemplo, consideraremos que estamos utilizando Postman. Una vez descargado e instalado, sigue los pasos a continuación:

1. Abre Postman y encontrarás una interfaz similar a la siguiente:

<img src="./assets/postman_1.png" alt="Postman" width="500">

2. Le daremos click al boton `new` para crear una colección de peticiones. 

3. Se nos abrirá una venta donde elegiremos colección. En postman, las colecciones son grupos de peticiones que se pueden ejecutar juntas. Es mas que todo para organizar las peticiones que haremos a nuestra API y poder compartirlas con otros desarrolladores.

<img src="./assets/postman_2.png" alt="Postman" width="500">

4. Le damos un nombre a nuestra colección, en este caso `Node.js Kick-off Project`. A este punto puedes indagar más sobre funcionalidades de postman como variables de entorno, autenticación, etc. Te dejaré un link a la documentación oficial de postman [aquí](https://learning.postman.com/docs/getting-started/introduction/). Y un video de youtube que explica como usar postman mas a profundidad [aquí](https://www.youtube.com/watch?v=iFDQ3NFs95M&list=PLDbrnXa6SAzUsLG1gjECgFYLSZDov09fO).

<img src="./assets/postman_3.png" alt="Postman" width="500">

<img src="./assets/postman_4.png" alt="Postman" width="500">

5. Ahora crearemos una petición para crear una tarea. Para ello, le daremos click al boton `...` que se encuentra al lado de la colección que acabamos de crear y seleccionaremos `Add request`.

<img src="./assets/postman_5.png" alt="Postman" width="500">

6. Se nos abrirá una ventana donde podremos configurar nuestra petición. Le daremos un nombre a nuestra petición, en este caso `Create Task`. En el campo `Request URL` colocaremos la dirección de nuestra API, en este caso `http://localhost:3000/tasks`. En el campo `Request type` seleccionaremos `POST`. En el campo `Body` seleccionaremos `raw` y en el tipo de dato seleccionaremos `JSON` y en el campo inferior colocaremos el siguiente JSON:

```json
{
  "title": "Comprar leche",
  "description": "Ir al supermercado y comprar leche"
}
```

<img src="./assets/postman_6.png" alt="Postman" width="500">

<img src="./assets/postman_7.png" alt="Postman" width="500">

7. Ahora le daremos click al boton `Send` y veremos la respuesta de nuestra API.

<img src="./assets/postman_8.png" alt="Postman" width="500">

A este punto, ya debes suponer que el archivo `tasks.json` creado en la carpeta `data` contiene la tarea que acabamos de crear. 

<img src="./assets/tasks.json_1.png" alt="Postman" width="500">

Si no ves una respuesta similar a la que se muestra en la imagen, es posible que haya un error en tu código. Revisa el paso a paso y asegúrate de que todo esté configurado correctamente.

## 7. Probando la API (Resto de Verbos HTTP)

Como trabajo autonomo, prueba el resto de los verbos HTTP que se mencionan en las historias de usuario los cuales son:

- GET `/tasks`
- GET `/tasks/:id`
- PUT `/tasks/:id`
- DELETE `/tasks/:id`

## 8. Preguntas de Reflexión y trabajo investigativo

1. ¿Qué _es el filesystem (fs) en Node.js y para qué se utiliza?
- El filesystem (fs) es una API de Node.js que nos ayuda a leer, actualizar, borrar, renombrar y manipular archivos que se encuentran en el sistema de archivos. sus comandos basicos son `readFile`, `writeFile`, `unlink`, `rename`, `stat` y `mkdir`.
2. ¿Qué es un middleware en Express y cuál es su propósito?
- El middleware en express es una fucion que ejecuta un codigo el cual va antes o despues de una ruta de las api ya gestionadas. Este puede modificar, manipular, gestionar y ejeutar el codigo de la ruta.
3. ¿Qué es un endpoint en una API RESTful y cuál es su función?
- Un enpoint es donde las rutas de las apis pueden ser accedidas, esto puede ser utilizado como CRUD (crear, leer, actualizar y borrar), esto se utiliza para el publico o cosa que este dirigido.
4. ¿Qué son los verbos HTTP y cuáles son los más comunes?
- los verbos HTTP son comandos que se pueden utilizar para acceder a una api, los mas comunes son GET, POST, PUT y DELETE.
5. ¿Qué es JSON y por qué es utilizado en las API RESTful?
- JSON es un formato de datos que se utiliza para mandar y recibir datos en las apis, es el mas comun ya que es facil de manipulas, leer y entender, ademas de que es soportado por la mayoria de los navegadores, incluso es una fuente de comunicacion entre el frontend y backend.
6. En lo que respecta al envio de datos a lo largo de los verbos http responde:
    - ¿Qué es el body de una petición?
    - El cuerpo de una peticiòn es donde se encuentran los datos que seran enviados a la base de datos, estos datos son enviados en formato JSON.
    - ¿Qué es el body de una respuesta?
    - EL cuerpo de respuesta es los datos que son recibidos de la base de datos y que seran mostrados al usuario, estos datos pueden ser mostrados en formato JSON, HTML, XML, etc.
    - ¿Qué es el query de una petición?
    - el query es donde se incluyen parametros en la url que seran enviados a la api, estos parametros pueden ser utilizados para filtrar los datos que se van a mostrar.
    - ¿Qué es el params de una petición?
    - el params (parametros) es donde se puede definir variables especificas que ayuden a identificar productos o rutas dinamicas.
7. En lo que respecta al verbo POST responde:
    - ¿Qué es un verbo POST y cuál es su propósito?
    - POST se encarga de enviar los datos al servidor donde seran procesados y almacenados en una base de datos.
    - ¿Cuándo se utiliza un verbo POST?
    - POST tiene dos funciones, mandar datos al servidor para crear un nuevo recurso y el otro es para manejar datos sensibles, entiendase sensibles como contraseñas, tokens, etc.
    - ¿Como se envian datos en un verbo POST?
    - Primero hay que declarar el JSON con la URL donde se enviaran los datos para ser tratados despues se le pone una como y se empieza a realizar la peticion post asì: 
    ```
    json('http://localhost:3000/tasks', {
        head: 'content-type: application/json',
        body: JSON.stringify({
            title: 'Comprar leche',
            description: 'Ir al supermercado y comprar leche'
        })
    });
    ```
    - POST lo que hace es enviar datos al servidor para su procesamiento, sea crear nuevos datos o realizar acciones.
8. En lo que respecta al verbo GET responde:
    - ¿Qué es un verbo GET y cuál es su propósito?
    - GET lo que realiza es obtener los datos que son pedidos por el usuario y mostrarlos en el navegador.
    - ¿Cuándo se utiliza un verbo GET?
    - GET se utiliza cuando quiero obtener datos que quiero ver como quedaron guardados o solo para informacion, no para modificar datos.
    - ¿En qué se diferencia un verbo GET de los otros verbos HTTP como POST, PUT y DELETE?
    - GET se utiliza para obtener datos, no para modificar datos.
9. En lo que respecta al verbo PUT responde:
    - ¿Qué es un verbo PUT y cuál es su propósito?
    PUT es un verbo de modificaciòn de datos exitentes, lo que hace es enviar datos al servidor y buscar los que desean ser modificados con la informacion enviada.
    - ¿Cuándo se utiliza un verbo PUT?
    Put se utiliza especialmente para modificar datos que ya existen en el servidor.
    - ¿En qué se diferencia un verbo PUT de los otros verbos HTTP como POST, GET y DELETE?
    - PUT se utiliza para modificar datos que ya existen en el servidor.
10. En lo que respecta al verbo DELETE responde:
    - ¿Qué es un verbo DELETE y cuál es su propósito? 
    - DELETE es la forma de eliminar datos del servidor, se busca informacion en el servidor y la elimina.
    - ¿Cuándo se utiliza un verbo DELETE?
    - Cuando se quiere eliminar datos del servidor.
    - ¿En qué se diferencia un verbo DELETE de los otros verbos HTTP como POST, GET y PUT?
    - Cada verbo tiene su funcion, delete es la forma de eliminar datos del servidor.
11. ¿Qué es un status code y cuáles son los más comunes?
- Un status code son codigos de 3 digitos que entrega HTTP para indicar la respuesta del servidor sobre la solicitud realizada, Los codigos mas comunes son: 200 Que es OK, 201 Que es Creado, 204 Que es Sin contenido, 400 Que es Error, 401 Que es No autorizado, 404 Que es No encontrado, 500 Que es Error interno.
12. ¿Cuales son los status code mas comunes para el verbo POST?
- 201 Que es Creado, 204 Sin contenido, 400 es Error de entendimiento o malformacion, 401 No autorizado para realizar la accion, 404 No encontrado, 500Error interno.
13. ¿Cuales son los status code mas comunes para el verbo GET?
- 200, 201, 304, 400, 401, 404, 500, 503 Este ultimo es que el servidor no esta disponible para el momento.
14. ¿Cuales son los status code mas comunes para el verbo PUT?
- 200, 201, 304, 400, 401, 404, 500, 503 y 409 el cual es que no se puede modificar el dato ya que contiene informacion que no se puede modificar o qeu generan conflictos
15. ¿Cuales son los status code mas comunes para el verbo DELETE?
- Para este verbo se usan los status code 200, 201, 204, 400, 401, 404, 500, 503 y 409 que son los mas comunes.