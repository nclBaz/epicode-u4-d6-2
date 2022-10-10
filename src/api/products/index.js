import express from "express"
import { getProducts } from "../../lib/fs/tools.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

export default productsRouter
