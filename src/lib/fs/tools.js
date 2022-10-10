import fs from "fs-extra"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const { writeJSON, readJSON } = fs

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/products.json"
)

console.log(productsJSONPath)

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = productsArray =>
  writeJSON(productsJSONPath, productsArray)
