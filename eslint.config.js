import eslintRecommended from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import solidPlugin from "eslint-plugin-solid";

export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      solid: solidPlugin
    },
    rules: {
      ...eslintRecommended.configs.recommended.rules,
      ...solidPlugin.configs.recommended.rules,

      // Relax rules for warnings
      "no-unused-vars": "off",
      "no-undef": "off",
      "solid/jsx-no-undef": "warn"
    }
  },
  prettierConfig
];
