import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
    {
        ignores: [".next/**/*", "node_modules/**/*", "out/**/*", "dist/**/*"],
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react: react,
            "react-hooks": reactHooks,
        },
        rules: {
            // Prevent direct import from deprecated stores
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: [
                                "@/stores/modal-store",
                                "@/stores/sidebar-store",
                                "@/stores/toast-store",
                            ],
                            message:
                                "These store files have been deprecated. Use @/stores/ui-store instead.",
                        },
                    ],
                },
            ],

            // Turn off conflicting rules
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",

            // React rules
            "react/react-in-jsx-scope": "off", // Not needed in Next.js
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
