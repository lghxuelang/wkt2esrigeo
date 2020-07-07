define([
  "esri/identity/OAuthInfo",
  "esri/identity/IdentityManager",
], function(OAuthInfo, esriId) {
  return function() {
    var info = new OAuthInfo({
      appId: window.appcfg.appId,
      portalUrl: window.appcfg.portalConfig.portal,
      popup: false,
    });

    esriId.registerOAuthInfos([info]);

    return esriId.checkSignInStatus(info.portalUrl + '/sharing')
      .then(function() {
        return esriId.getCredential(info.portalUrl + "/sharing");
      })
      .catch(function() {

      });
  };
});
