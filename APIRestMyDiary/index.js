/**
 * Importamos express
 */

const express = require('express');

const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

/**
 * Constante que obtiene una instancia de Express
 */
const app = express();

app.use(bodyParser.json());



/**
 * MySql.
 * Conexión a la base de datos de Mysql.
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'administrador',
    database: 'mydiarydb'
});






/************************************************************************************************** */

/**
 * Rutas
 */



/**Rutas para Usuarios */

/**getAllUsers 
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * from usuario;'
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('No tenemos resultados');
        }
    })
});*/


/**
 * Login
 * Get Usuario por correo 
 * */

app.get('/login/:email', (req,res)=>{
    const{email}=req.params;
    const sql = `SELECT Nombre,Correo,Rol,Contrasenia,Apellidos FROM usuario WHERE usuario.Correo="${email}"`;
    connection.query(sql,(error,result)=>{

        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No existe este usuario');
        }
    });


});


/**Add Usuarios */
app.post('/addUser/',(req,res)=>{
        //Objeto usuario
        const objUsu={
            Nombre: req.body.Nombre,
            Apellidos: req.body.Apellidos,
            Correo: req.body.Correo,
            Contrasenia: req.body.Contrasenia,
            Rol:req.body.Rol
        };
    
    const sql=`INSERT INTO usuario SET Nombre="${objUsu.Nombre}",Apellidos="${objUsu.Apellidos}",Correo="${objUsu.Correo}", Contrasenia=MD5("${objUsu.Contrasenia}"), Rol="${objUsu.Rol}"`;

    connection.query(sql,objUsu, error=>{
        if(error)throw error;
        res.json('Usuarios creado correctamente');
    });
});

/**Añadir nuevo Profesor, pasando IdUsuario.
 * Ruta: /idProf/:email
 * Pasar IdTarea
 * Ruta: /idTarea
 */
app.post('/addProf/',(req,res)=>{
    const objProf={
        IdUsuario:req.body.IdUsuario,
        IdTarea:req.body.IdTarea
    };
    const sql = `INSERT INTO profesor SET IdUsuario=${objProf.IdUsuario}, IdTarea=${objProf.IdTarea};`;
    connection.query(sql,objProf, error=>{
        if(error)throw error;
        res.json('Profesor creado');
    });
        
});


/**Eliminar por correo a un Usuario, vale para profesor y alumno */

app.delete('/delUser/:email',(req,res)=>{
    const {email}= req.params;
    const sql = `DELETE FROM usuario WHERE usuario.Correo='${email}'`;

    connection.query(sql,error=>{
        if(error)throw error;
        res.json({"mensaje":'Usuario eliminado con éxito'});
    })
});

/**Mirar Bien como hacer esto, ya que no se tienen porque actualizar todos los campos */



/**Comprobar que existe el usuario para añadirlo*/
app.get('/validar/:email', (req,res)=>{
    const{email}=req.params;
    const sql = `SELECT Correo FROM usuario WHERE usuario.Correo="${email}"`;
    
    connection.query(sql,(error,result)=>{

        if (error) throw error;

        if (result.length > 0) {
            res.json({var:"exist"});
           
        } else {
            res.json({var:"nonexist"});
            
        }
    });

});


/**Obtener el id Usuario  para añadir un nuevo alumno */

app.get('/idUsu/:email', (req, res) => {
    const{email}=req.params;
    const sql = `SELECT IdUsuario from usuario where Correo = "${email}";`
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('No tenemos resultados');
        }
    })
});

app.get('/idAlum/:idUsu',(req,res)=>{
    const {idUsu} = req.params;
    const sql = `SELECT alumno.IdAlumno FROM alumno WHERE alumno.IdUsuario=${idUsu}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('No tenemos resultados');
        }
    })
})


/*************************************************************************************************************** */

/**Rutas para Profesores */

/**getAllProfesores */

app.get('/allProfesores', (req, res) => {
    const sql = 'SELECT profesor.IdProfesor, usuario.Nombre, usuario.Apellidos, usuario.Correo, materia.Nombre as Asignatura FROM usuario INNER JOIN profesor ON usuario.IdUsuario=profesor.IdUsuario INNER JOIN materia ON materia.IdProfesor=profesor.IdProfesor WHERE usuario.Rol="Profesor"';
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No tenemos profesores');
        }
    })
});


app.get('/oneProfesor/:idUsu',(req,res)=>{
    const{idUsu}=req.params;
    const sql = `SELECT IdProfesor FROM profesor WHERE IdUsuario=${idUsu}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No tenemos profesor');
        }
    })
});

/**
 * Crear tarea para una clase
 */




/**Rutas para Alumnos*/


/**Todos los alumnos */

app.get('/allAlumns', (req, res) => {
    const sql = 'select IdAlumno,Nombre,Apellidos,Correo,Clase from usuario, alumno where usuario.IdUsuario=alumno.IdUsuario and usuario.Rol="Alumno"';
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('No tenemos alumnos');
        }
    })
});

/**Alumnos por clase */

app.get('/alumClase/:clase', (req, res) => {
    const {clase} = req.params;
    const sql = `SELECT alumno.IdAlumno, usuario.Nombre, usuario.Apellidos, usuario.Correo, alumno.Clase FROM alumno INNER JOIN usuario ON usuario.IdUsuario=alumno.IdUsuario WHERE alumno.Clase='${clase}'`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('No tenemos alumnos');
        }
    })
});


/**IdAlumnos por clase */

app.get('/idAlumClase/:clase', (req, res) => {
    const {clase} = req.params;
    const sql = `SELECT  alumno.IdAlumno FROM alumno WHERE alumno.Clase='${clase}'`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No tenemos alumnos');
        }
    })
});

/**Añadir nuevo alumno, pasando IdUsuario.
 * Ruta: /idUsu/:email
 */
app.post('/addAlumn/',(req,res)=>{
    const objAl={
        IdUsuario:req.body.IdUsuario,
        Clase:req.body.Clase
    };
    const sql = `INSERT INTO alumno SET IdUsuario=${objAl.IdUsuario}, Clase='${objAl.Clase}';`;
    connection.query(sql,objAl, error=>{
        if(error)throw error;
        res.json('Alumno creado');
    });
        
});


app.get('/getTareasAl/:idAl',(req,res)=>{
    const {idAl} = req.params;
    const sql=`SELECT tarea.IdTarea,tarea.Titulo,tarea.Descripcion,tarea.Fecha, materia.Nombre as Asignatura FROM materia INNER JOIN tarea ON materia.IdMateria=tarea.IdMateria INNER JOIN tarea_alumno ON tarea.IdTarea=tarea_alumno.IdTarea  WHERE tarea_alumno.IdAlumno="${idAl}"`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No hay tareas');
        }
    })
});





/**Rutas para las Tareas */

/**
 * @method
 * Trae todas las Tareas existentes,
 * 
 */
app.get('/allTareas', (req, res) => {
    const sql = 'SELECT tarea.IdTarea, tarea.Titulo, tarea.Descripcion,tarea.Fecha, materia.Nombre as Asignatura FROM tarea INNER JOIN materia ON tarea.IdMateria=materia.IdMateria';
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('No tenemos Tareas');
        }
    })
});


/**Crear Tarea asignada  */

app.post('/addTarea/',(req,res)=>{
    const objTa= {
        Titulo: req.body.Titulo,
        Descripcion: req.body.Descripcion,
        Fecha: req.body.Fecha,
        IdMateria: req.body.IdMateria
    }
    const sql = `INSERT INTO tarea SET Titulo='${objTa.Titulo}', Descripcion='${objTa.Descripcion}', Fecha='${objTa.Fecha}', IdMateria= ${objTa.IdMateria};`;
    connection.query(sql,objTa, error=>{
        if(error)throw error;
        res.json('Tarea Creada');
    });
        
});


/**Actualizar IdTarea en Profesor */
app.put('/tareaUpdProf/',(req,res)=>{
    const obj = {
        IdTarea:req.body.IdTarea,
        IdProfesor:req.body.IdProfesor
    }
    const sql = `UPDATE profesor SET IdTarea =${obj.IdTarea} WHERE profesor.IdProfesor = ${obj.IdProfesor}`;

    connection.query(sql,obj, error=>{
        if(error)throw error;
        res.json('Tarea Creada');
    });

})
  

/**Asignar Alumnos a Profesores */

app.get('/lastIdTarea',(req,res) =>{
    const sql = 'SELECT MAX(IdTarea) AS IdTarea FROM tarea';
    connection.query(sql,(result,error)=>{
     
        if(result>0){
            res.json(result);
        }else{
            res.send(error)
        }
    })
});



app.post('/alumProf/',(req,res)=>{
    const obj={
        IdAlumno:req.body.IdAlumno,
        IdProfesor:req.body.IdProfesor
    };
    const sql = `INSERT INTO profesor_alumno SET IdProfesor=${obj.IdProfesor}, IdAlumno=${obj.IdAlumno};`;
    connection.query(sql,obj, error=>{
        if(error)throw error;
        res.json('Relación creada');
    });
});





/**Asignar Tareas a Alumnos */


app.post('/tareaAlum/',(req,res)=>{
    const obj={
        IdTarea:req.body.IdTarea,
        IdAlumno:req.body.IdAlumno
    };
    const sql = `INSERT INTO tarea_alumno SET IdTarea=${obj.IdTarea}, IdAlumno=${obj.IdAlumno};`;
    connection.query(sql,obj, error=>{
        if(error)throw error;
        res.json('Relación tarea-alumno creada');
    });
});


/**Delete tarea */
app.delete('/delTarea/:id',(req,res)=>{
    const {id}= req.params;
    const sql = `DELETE FROM tarea WHERE tarea.IdTarea='${id}'`;

    connection.query(sql,error=>{
        if(error)throw error;
        res.json({"mensaje":'Tarea eliminad con éxito'});
    })
});





/**Ruta Materias */



app.post('/addMateria/',(req,res)=>{
    const objMat={
        IdProfesor:req.body.IdProfesor,
        Nombre:req.body.Nombre
    };
    const sql = `INSERT INTO materia SET IdProfesor=${objMat.IdProfesor}, Nombre='${objMat.Nombre}';`;
    connection.query(sql,objMat, error=>{
        if(error)throw error;
        res.json('Materia creado');
    });
        
});


app.get('/profIdMateria/:idProf',(req,res)=>{
    const{idProf}=req.params;
    const sql =`SELECT profesor.IdProfesor, materia.IdMateria FROM profesor INNER JOIN materia ON profesor.IdProfesor=materia.IdProfesor WHERE profesor.IdProfesor=${idProf}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No hay profesores asociados');
        }
    })
    
});


















/**
 * Comprobación de conexión a la base de datos
 */

connection.connect(error => {
    if (error) throw error;
    console.log('La base de Datos está en funcionamiento.');
});

app.listen(PORT, () => { console.log(`Servidor corriendo en el puerto ${PORT}`); })