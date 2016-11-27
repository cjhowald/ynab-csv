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
            {test: /\.ts/, loaders: ['ng-annotate-loader', 'ts-loader']},
            {test: /\.css/, loaders: ['style-loader', 'css-loader']}
        ]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    devServer: {
        inline: true,
        stats: {
            chunks: false
        }
    }
};