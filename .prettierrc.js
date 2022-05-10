module.exports = {
    printWidth: 120,
    trailingComma: "all",
    overrides: [{
        files: '*.md',
        options: {
            tabWidth: 2,
            proseWrap: "never"
        }
    },
        {
            files: "*.{yml,yaml}",
            options: {
                tabWidth: 2,
            }
        }]
}
