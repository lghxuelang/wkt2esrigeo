var dojoConfig = {
  async: true,

  // for jsapi ver. >= 4.9
  // deps: ['@dojo/framework/shim/main'],

  // for jsapi ver. <= 4.8
  // deps: ['@dojo/shim/main'],

  packages: [
    {
      name: 'agsextend',
      location:
        window.location.origin + window.location.pathname.replace(/\/[^/]+$/, '') + '/agsextend',
    },
  ],

  has: {
    'esri-promise-compatibility': 1, // Use native Promises by default
    'esri-featurelayer-webgl': 1, // Enable FeatureLayer WebGL capabilities
  },
};
