const { mode, entry } = global.webpack;
const { defaultEnv } = require('./config/constant.js');

const AMap = mode !== defaultEnv
    ? '' : `<script type="text/javascript" src="//webapi.amap.com/maps"></script>`;

const env = `<script>
  +function (g) {
    var GLOBAL_CONFIG = {
      ENV: '${mode}'
    }

    g.__ENV__ = {
      get: function (gN) {
        return GLOBAL_CONFIG[gN];
      }
    }
  }(window);
</script>`;

console.log('=====================', entry)

module.exports = {
    // 通过entry做默认设置
    ...Object.keys(entry).reduce((res, entryName) => {
        res[entryName] = {
            before: [{
                scripts: [AMap],
                anchor: '</head>',
            },],
            after: [{
                scripts: [env],
                anchor: '</body>',
            },],
        }
        return res;
    }),
    // 具名页面的方式覆盖上述的默认设置中的某些特殊页面
    'from-one': {
        before: [{
            scripts: [env, AMap],
            anchor: '</head>',
        },],
    },
    'from-two': {
        before: [{
            scripts: [env],
            anchor: '</head>',
        }, {
            scripts: [AMap],
            anchor: '</body>',
        },],
    },
}