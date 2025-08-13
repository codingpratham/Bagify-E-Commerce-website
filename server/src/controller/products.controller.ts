import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middleware/protectedRoute";
import cloudinary from "../utils/cloudinary";


export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addProducts = async (req: AuthRequest, res: Response) => {
  const Id = req.user?.id;
  const { title, description, price, category, stock } = req.body;

  if (!Id) {
    return res.status(401).json({ message: "Unauthorized - User ID not found" });
  }

  try {

    let imageUrl = ""

    if(req.file){
      const result = await new Promise<{secure_url: string}>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder: "products",
          resource_type: "image",
        }, (error: any, result:any) => {
          if (error) {
            return reject(error);
          }
          resolve(result as { secure_url: string });
        })
        stream.end(req.file?.buffer)
      })
      imageUrl = result.secure_url
    }
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        image:imageUrl,
        category,
        stock: parseInt(stock),
        userId: Id,
        status: "PENDING"
      },
    });
    res.status(201).json({ message: "Product added successfully", data: product , imageUrl});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateProduct = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, description, price, category, stock , status} = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - User ID not found" });
  }

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct || existingProduct.userId !== userId) {
      return res.status(403).json({ message: "Forbidden - Not allowed to update this product" });
    }

    let imageUrl = existingProduct.image;

    if (req.file) {
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder: "products",
          resource_type: "image",
        }, (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result as { secure_url: string });
        });
        stream.end((req as any).file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        image: imageUrl,
        category,
        stock: parseInt(stock),
        userId,
        status: status
      },
    });

    res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - User ID not found" });
  }

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct || existingProduct.userId !== userId) {
      return res.status(403).json({ message: "Forbidden - Not allowed to delete this product" });
    }

    await prisma.product.delete({ where: { id } });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductOrders = async (req:AuthRequest,res:Response)=>{
  const userId = req.user?.id

  if(!userId){
    return res.status(401).json({message:"Unauthorized"})
  }

  const {id} = req.params

  if(!id){
    return res.status(400).json({message:"Product ID is required"})
  }

  try {
    const product = await prisma.product.findUnique({where:{id}})

    if(!product){
      return res.status(404).json({message:"Product not found"})
    }

    const orders = await prisma.order.findMany({
      where:{
        productId:id,
        userId:userId
      }
    })
    return res.status(200).json({message:"Orders fetched successfully",orders})
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Internal Server Error"})
  }
}

export const getProdectDescription = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        title: true,
        description: true,
        price: true,
        image: true,
        category: true,
        stock: true,
        status: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product description fetched successfully", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

export const getOnlyAdminProducts = async(req:AuthRequest,res:Response)=>{
  const userId = req.user?.id
  const role = req.user?.role


  if(!userId){
    return res.status(401).json({message:"Unauthorized"})
  }

  if(role !== "ADMIN"){
    return res.status(403).json({message:"Forbidden"})
  }
  

  try {
    const products = await prisma.product.findMany({
      where:{
        userId:userId
      }
    })
    res.status(200).json({message:"Products fetched successfully",data:products})

  }
  catch (error) {

  }
}

