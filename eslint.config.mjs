import nextConfig from "eslint-config-next/core-web-vitals";
import prettierPlugin from "eslint-plugin-prettier/recommended";

const eslintConfig = [
  ...nextConfig,
  prettierPlugin
];

export default eslintConfig;
