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
    env: {
      browser: true,
      es6: true
    },
    rules: {
      ...eslintRecommended.configs.recommended.rules,
      ...solidPlugin.configs.recommended.rules,

      // Relax rules for warnings
      "no-unused-vars": "warn",
      "no-undef": "error",
      "solid/jsx-no-undef": "warn"
    }
  },
  prettierConfig
];
