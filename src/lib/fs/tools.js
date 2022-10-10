import fs from "fs-extra"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const { writeJSON, readJSON, writeFile } = fs

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/products.json"
)
const publicFolderPath = join(process.cwd(), "./public/imgs/products")

console.log(productsJSONPath)

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = productsArray =>
  writeJSON(productsJSONPath, productsArray)

export const saveProductsImages = (fileName, file) =>
  writeFile(join(publicFolderPath, fileName), file)
