const prisma = require("../config/prisma");


// Obtener todos los libros
exports.getBooks = async (req, res) => {

    try {

        const libros = await prisma.libro.findMany();

        res.json(libros);


    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// Obtener libro por ID
exports.getBookById = async (req, res) => {

    try {

        const { id } = req.params;


        const libro = await prisma.libro.findUnique({
            where:{
                id:Number(id)
            }
        });


        if(!libro){

            return res.status(404).json({
                error:"Libro no encontrado"
            });

        }


        res.json(libro);


    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



// Crear libro
exports.createBook = async (req,res)=>{

    try{


        const libro = await prisma.libro.create({

            data:req.body

        });


        res.status(201).json({

            mensaje:"Libro creado correctamente",
            libro

        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



// Actualizar libro
exports.updateBook = async(req,res)=>{

    try{

        const {id}=req.params;


        const libro = await prisma.libro.update({

            where:{
                id:Number(id)
            },

            data:req.body

        });


        res.json(libro);



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



// Eliminar libro
exports.deleteBook = async(req,res)=>{


    try{

        const {id}=req.params;


        await prisma.libro.delete({

            where:{
                id:Number(id)
            }

        });


        res.json({
            mensaje:"Libro eliminado"
        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};