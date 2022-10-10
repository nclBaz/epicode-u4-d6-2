import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"
import { findProductBySKU } from "../../lib/db/products.js"

const productsSchema = {
  name: {
    isString: {
      errorMessage: "Name field cannot be empty!",
    },
  },
  description: {
    isString: {
      errorMessage: "Description field cannot be empty!",
    },
  },
  price: {
    isDecimal: {
      errorMessage:
        "Price field cannot be empty and needs to be a valid decimal number!",
    },
  },
  category: {
    isIn: {
      options: [["smartphone", "computer", "tablet"]],
      errorMessage: "Category must be either smartphone, computer or tablet!",
    },
  },
  sku: {
    custom: {
      options: async value => {
        // search in db if that sku is already in use
        const product = await findProductBySKU(value)

        console.log("product: ", product)

        // if it is you have to reject
        if (product) return Promise.reject("SKU already in use!")
        // if it is not that's ok
        else return product
      },
    },
  },
}

const productsUpdatesSchema = {
  name: {
    isString: {
      errorMessage: "Name field cannot be empty!",
    },
    optional: true,
  },
  description: {
    isString: {
      errorMessage: "Description field cannot be empty!",
    },
    optional: true,
  },
  price: {
    isDecimal: {
      errorMessage:
        "Price field cannot be empty and needs to be a valid decimal number!",
    },
    optional: true,
  },
  category: {
    isIn: {
      options: [["smartphone", "computer", "tablet"]],
      errorMessage: "Category must be either smartphone, computer or tablet!",
    },
    optional: true,
  },
}

export const checkNewProductSchema = checkSchema(productsSchema)
export const checkUpdateProductSchema = checkSchema(productsUpdatesSchema)

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Product Validation Error!", {
        errorsList: errors.array(),
      })
    )
  } else {
    next()
  }
}
