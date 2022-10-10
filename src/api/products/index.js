import express from "express"
import createHttpError from "http-errors"
import {
  findProductById,
  findProductByIdAndDelete,
  findProductByIdAndUpdate,
  findProducts,
  saveNewProduct,
} from "../../lib/db/products.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const id = await saveNewProduct(req.body)
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await findProducts()
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await findProductById(req.params.productId)
    if (product) {
      res.send(product)
    } else {
      // 404
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await findProductByIdAndUpdate(
      req.params.productId,
      req.body
    )
    if (updatedProduct) {
      res.send(updatedProduct)
    } else {
      // 404
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    await findProductByIdAndDelete(req.params.productId)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default productsRouter
