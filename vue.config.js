// vue.config.js

module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    svgRule.uses.clear();

    // add replacement loader(s)
    svgRule
      .test(/\.(svg)$/)
      .use('html-loader')
      .loader('html-loader')
      .options({
        attrs: ['div:v-html'],
      });

    config.module
      .rule('fonts')
      .test(/\.(woff|woff2|eot|ttf)$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        name: '../assets/fonts/[name].[ext]',
      });
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [{
            loader: 'vue-svg-inline-loader',
          }],
        }],
    },
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      css: {
        sourceMap: true,
      },
      sass: {
        // ~@/ is an alias to src/
        // so this assumes you have a file named `src/style.scss`
        data: '@import "~@/style/style.scss";',
      },
    },
  },
};
