export default [
    {
        ignores: [".next/**/*", "node_modules/**/*", "out/**/*", "dist/**/*"],
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
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
        },
    },
];
