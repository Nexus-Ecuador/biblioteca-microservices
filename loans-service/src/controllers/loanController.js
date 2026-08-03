const prisma = require("../config/prisma");

async function enriquecer(p) {
  const u = await prisma.usuario.findUnique({where:{id:p.usuarioId}});
  const l = await prisma.libro.findUnique({where:{id:p.libroId}});
  return {
    id:p.id, usuarioId:p.usuarioId, libroId:p.libroId,
    fechaPrestamo:p.fechaPrestamo, fechaDevolucion:p.fechaDevolucion, estado:p.estado,
    usuario: u||{id:p.usuarioId,nombre:"Desconocido",correo:"-",cedula:"-"},
    libro: l||{id:p.libroId,titulo:"Desconocido",autor:"-",isbn:null,categoria:null,disponible:false}
  };
}

exports.getLoans = async (req,res)=>{
  try{ const r=await prisma.prestamo.findMany({orderBy:{id:"asc"}}); res.json(await Promise.all(r.map(enriquecer))); }
  catch(e){ console.error(e); res.status(500).json({error:e.message}); }
};

exports.getLoanById = async (req,res)=>{
  try{ const p=await prisma.prestamo.findUnique({where:{id:Number(req.params.id)}}); if(!p)return res.status(404).json({error:"No encontrado"}); res.json(await enriquecer(p)); }
  catch(e){ console.error(e); res.status(500).json({error:e.message}); }
};

exports.createLoan = async (req,res)=>{
  try{
    const {usuarioId,libroId}=req.body;
    if(!usuarioId||!libroId)return res.status(400).json({error:"usuarioId y libroId obligatorios"});
    const uid=Number(usuarioId), lid=Number(libroId);
    if(isNaN(uid)||isNaN(lid))return res.status(400).json({error:"IDs deben ser numeros"});
    const u=await prisma.usuario.findUnique({where:{id:uid}});
    if(!u)return res.status(404).json({error:"Usuario no encontrado"});
    const l=await prisma.libro.findUnique({where:{id:lid}});
    if(!l)return res.status(404).json({error:"Libro no encontrado"});
    if(!l.disponible)return res.status(400).json({error:"Libro ya prestado"});
    const p=await prisma.prestamo.create({data:{usuarioId:uid,libroId:lid}});
    await prisma.libro.update({where:{id:lid},data:{disponible:false}});
    res.status(201).json({mensaje:"Prestamo realizado",prestamo:await enriquecer(p)});
  }catch(e){ console.error(e); res.status(500).json({error:e.message}); }
};

exports.updateLoan = async (req,res)=>{
  try{
    const id=Number(req.params.id);
    const p=await prisma.prestamo.findUnique({where:{id}});
    if(!p)return res.status(404).json({error:"No encontrado"});
    const a=await prisma.prestamo.update({where:{id},data:{estado:"DEVUELTO",fechaDevolucion:new Date()}});
    await prisma.libro.update({where:{id:p.libroId},data:{disponible:true}});
    res.json({mensaje:"Devuelto",prestamo:await enriquecer(a)});
  }catch(e){ console.error(e); res.status(500).json({error:e.message}); }
};

exports.deleteLoan = async (req,res)=>{
  try{ await prisma.prestamo.delete({where:{id:Number(req.params.id)}}); res.json({mensaje:"Eliminado"}); }
  catch(e){ console.error(e); res.status(500).json({error:e.message}); }
};