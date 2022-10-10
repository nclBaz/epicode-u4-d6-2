import createHttpError from "http-errors"
import uniqid from "uniqid"
import {
  deleteProductsImages,
  getProducts,
  writeProducts,
} from "../fs/tools.js"

export const saveNewProduct = async newProductData => {
  const products = await getProducts()
  const newProduct = {
    ...newProductData,
    createdAt: new Date(),
    id: uniqid(),
    reviews: [],
  }
  products.push(newProduct)
  await writeProducts(products)

  return newProduct.id
}

export const findProducts = async () => getProducts()

export const findProductById = async productId => {
  const products = await getProducts()

  const foundProduct = products.find(product => product.id === productId)

  return foundProduct
}

export const findProductByIdAndUpdate = async (productId, updates) => {
  const products = await getProducts()
  const index = products.findIndex(product => product.id === productId)

  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date() }
    await writeProducts(products)

    return products[index]
  } else {
    return null
  }
}

export const findProductByIdAndDelete = async productId => {
  const products = await getProducts()

  const product = await findProductById(productId)

  if (product) {
    await deleteProductsImages(product.imageUrl)

    const remainingProducts = products.filter(
      product => product.id !== productId
    )

    await writeProducts(remainingProducts)
  } else {
    throw createHttpError(404, `Product with id ${productId} not found!`)
  }
}

export const findProductBySKU = async sku => {
  const products = await getProducts()
  const foundProduct = products.find(product => product.sku === sku)
  return foundProduct
}
