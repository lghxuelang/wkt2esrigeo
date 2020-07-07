define(['esri/identity/IdentityManager', 'esri/identity/ServerInfo'], function(esriId, ServerInfo) {
  return function() {
    var info = new ServerInfo({
      server: window.appcfg.portalConfig.portal,
      tokenServiceUrl: window.appcfg.portalConfig.portal + 'sharing/rest/generateToken',
    });

    esriId.registerServers([info]);
    return esriId
      .generateToken(info, {
        username: 'admin',
        password: 'esri1234',
      })
      .then(function(tokenResponse) {
        if (tokenResponse) {
          esriId.registerToken({
            server: window.appcfg.portalConfig.portal,
            ssl: true,
            token: tokenResponse.token,
            userId: 'admin',
            expires: tokenResponse.expires,
          });
        }
      });
  };
});
