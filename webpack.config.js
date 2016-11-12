module.exports = {
    entry: {
        app: ["./src/app"]
    },
    output: {
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.ts/,
                loaders: ['ng-annotate', 'ts'],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    }
};