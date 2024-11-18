"use strict";
// shared/src/types/product.types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStockStatus = exports.ProductCategory = void 0;
/**
 * Product category enumeration
 */
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["ROMAN"] = "ROMAN";
    ProductCategory["GREEK"] = "GREEK";
    ProductCategory["BUST"] = "BUST";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
/**
 * Product stock status enumeration
 */
var ProductStockStatus;
(function (ProductStockStatus) {
    ProductStockStatus["IN_STOCK"] = "IN_STOCK";
    ProductStockStatus["LOW_STOCK"] = "LOW_STOCK";
    ProductStockStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    ProductStockStatus["PRE_ORDER"] = "PRE_ORDER";
    ProductStockStatus["DISCONTINUED"] = "DISCONTINUED";
})(ProductStockStatus || (exports.ProductStockStatus = ProductStockStatus = {}));
