module.exports = {
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: "all",
  bracketSpacing: true,
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
