const path = require('path');
const genericNames = require('generic-names');

const generate = genericNames('[name]__[local]___[hash:base64:5]', {
  context: process.cwd(),
});

const generateScopedName = (localName, filePath) =>
  filePath.includes('node_modules') ? localName : generate(localName, filePath);

const autoprefixer = {
  enable: true,
  config: {
    browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
    remove: false,
  },
};

const cssModules = {
  enable: false,
  config: {
    generateScopedName,
    namingPattern: 'global', // 转换模式，取值为 global/module
  },
};

const config = {
  projectName: 'jason-taroui',
  date: '2019-2-13',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        [
          'env',
          {
            modules: false,
          },
        ],
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-object-rest-spread',
      ],
    },
  },
  defineConstants: {},
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    components: path.resolve(__dirname, '..', 'src/components'),
    models: path.resolve(__dirname, '..', 'src/models'),
    utils: path.resolve(__dirname, '..', 'src/utils'),
    package: path.resolve(__dirname, '..', 'package.json'),
    styles: path.resolve(__dirname, '..', 'src/styles'),
  },
  copy: {
    patterns: [],
    options: {},
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer,
        cssModules,
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 10240, // 设定转换尺寸上限
          },
        },
      },
    },
  },
  h5: {
    esnextModules: ['taro-ui'],
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer,
        cssModules,
      },
    },
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js',
    },
  },
};

if (process.env.TARO_BUILD_TYPE === 'ui') {
  Object.assign(config.h5, {
    enableSourceMap: false,
    enableExtract: false,
    enableDll: false
  })
  config.h5.webpackChain = chain => {
    chain.plugins.delete('htmlWebpackPlugin')
    chain.plugins.delete('addAssetHtmlWebpackPlugin')
    chain.merge({
      output: {
        path: path.join(process.cwd(), 'dist', 'h5'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'jason-taroui'
      },
      externals: {
        nervjs: 'commonjs2 nervjs',
        classnames: 'commonjs2 classnames',
        '@tarojs/components': 'commonjs2 @tarojs/components',
        '@tarojs/taro-h5': 'commonjs2 @tarojs/taro-h5',
        'weui': 'commonjs2 weui'
      }
    })
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
