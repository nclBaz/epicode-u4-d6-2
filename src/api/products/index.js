import express from "express"
import createHttpError from "http-errors"
import multer from "multer"
import { extname } from "path"
import {
  findProductById,
  findProductByIdAndDelete,
  findProductByIdAndUpdate,
  findProducts,
  saveNewProduct,
} from "../../lib/db/products.js"
import {
  findReviewById,
  findReviewByIdAndDelete,
  findReviewByIdAndUpdate,
  saveNewReview,
} from "../../lib/db/reviews.js"
import { saveProductsImages } from "../../lib/fs/tools.js"
import {
  checkNewProductSchema,
  checkUpdateProductSchema,
  checkValidationResult,
} from "./productsValidation.js"

const productsRouter = express.Router()

productsRouter.post(
  "/",
  checkNewProductSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const id = await saveNewProduct(req.body)
      res.status(201).send({ id })
    } catch (error) {
      next(error)
    }
  }
)

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

productsRouter.put(
  "/:productId",
  checkUpdateProductSchema,
  checkValidationResult,
  async (req, res, next) => {
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
  }
)

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    await findProductByIdAndDelete(req.params.productId)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

productsRouter.patch(
  "/:productId/image",
  multer().single("productPicture"),
  async (req, res, next) => {
    try {
      // 1. Create a unique name for that picture (name will be something like productId.gif)
      const fileName = req.params.productId + extname(req.file.originalname)

      // 2. Update the product record with the image Url
      const product = await findProductByIdAndUpdate(req.params.productId, {
        imageUrl: "/imgs/products/" + fileName,
      })

      if (product) {
        // 3. Save the file into the public folder (only if that product is found in db)
        await saveProductsImages(fileName, req.file.buffer)
        res.send(product)
      } else {
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
  }
)

productsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const updatedProduct = await saveNewReview(req.params.productId, req.body)
    console.log(updatedProduct)
    if (updatedProduct) {
      res.send(updatedProduct)
    } else {
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

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const { reviews } = await findProductById(req.params.productId)
    res.send(reviews)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await findReviewById(
      req.params.productId,
      req.params.reviewId
    )
    if (review) {
      res.send(review)
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      )
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const updatedReview = await findReviewByIdAndUpdate(
      req.params.productId,
      req.params.reviewId,
      req.body
    )
    res.send(updatedReview)
  } catch (error) {
    next(error)
  }
})

productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      await findReviewByIdAndDelete(req.params.productId, req.params.reviewId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

export default productsRouter
