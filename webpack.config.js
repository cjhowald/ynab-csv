module.exports = {
    devtool: 'inline-source-map',
    entry: {
        app: ["./src/app"]
    },
    output: {
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.ts/, loaders: ['ng-annotate', 'ts']},
            {test: /\.css/, loaders: ['style', 'css']}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    devServer: {
        inline: true,
        stats: {
            chunks: false
        }
    }
};