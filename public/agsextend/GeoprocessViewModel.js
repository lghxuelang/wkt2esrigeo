define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/Stateful',
  'esri/portal/Portal',
  'agsextend/customgp/utils',
  'agsextend/oauth-login',
  'agsextend/user-login',
], function(declare, lang, arrayUtils, Stateful, Portal, gpUtils, oauthLogin, userLogin) {
  return declare([Stateful], {
    declaredClass: 'geomap.analysis.GeoprocessViewModel',
    constructor: function() {
      this.watch('taskUrl', lang.hitch(this, this.fetchTaskInfo));
      this.watch('portalUrl', lang.hitch(this, this.initPortal));
      this.watch('portalSelf', lang.hitch(this, this.initPortal));
    },
    _taskUrlSetter: function(a) {
      this.taskUrl = a;
    },
    _taskInfoSetter: function(a) {
      this.taskInfo = a;
    },
    _serverInfoSetter: function(a) {
      this.serverInfo = a;
    },
    _inputParamsSetter: function(a) {
      this.inputParams = a;
    },
    _outputParamsSetter: function(a) {
      this.outputParams = a;
    },
    _nameSetter: function(a) {
      this.name = a;
    },
    _titleSetter: function(a) {
      this.title = a;
    },
    _viewSetter: function(a) {
      this.view = a;
    },
    _analysisLayersSetter: function(a) {
      this.analysisLayers = a;
    },
    _portalUrlSetter: function(a) {
      this.portalUrl = a;
    },
    _portalSelfSetter: function(a) {
      this.portalSelf = a;
    },
    _helpUrlSetter: function(a) {
      this.helpUrl = a;
    },
    _useResultMapServerSetter: function(a) {
      this.useResultMapServer = a;
    },

    fetchTaskInfo: function() {
      this.taskUrl &&
        gpUtils.getServiceDescription(this.taskUrl).then(
          lang.hitch(this, function(resp) {
            this.set('taskInfo', resp);
            this.set('serverInfo', resp.serverInfo);
            this.set('title', resp.displayName);
            this.set('name', this.taskUrl.substring(this.taskUrl.indexOf('GPServer/') + 9));
            this.set('helpUrl', resp.helpUrl);
            this.set('useResultMapServer', resp.useResultMapServer);
            const d = [];
            const c = [];
            arrayUtils.forEach(
              resp.parameters,
              function(p) {
                p.label = p.displayName;
                delete p.displayName;
                'esriGPParameterDirectionInput' === p.direction ? d.push(p) : c.push(p);
                delete p.direction;
                p.visible = true;
                p.required = 'esriGPParameterTypeRequired' === p.parameterType;
                delete p.parameterType;
                if ('GPFeatureRecordSetLayer' === p.dataType) {
                  p.analysisLayers = this.analysisLayers;
                  p.featureSetMode = 'layers';
                }
              },
              this,
            );
            this.set('gp', this.taskUrl);
            this.set('inputParams', d);
            this.set('outputParams', c);
          }),
          lang.hitch(this, function() {}),
        );
    },

    initPortal: function() {
      if (this.portalUrl || this.portalSelf) {
        this.portal = this.portalSelf
          ? new Portal({
              url: this.portalUrl,
              // ?self
            })
          : new Portal({
              url: this.portalUrl,
            });

        var loginPromise;
        if (window.appcfg.portalConfig.useOauth) {
          loginPromise = oauthLogin();
        } else {
          loginPromise = userLogin();
        }

        if (loginPromise) {
          loginPromise.then(
            function() {
              this.portal.load().then(
                lang.hitch(this, function() {
                  this.user = this.portal.user;
                }),
              );
            }.bind(this),
          );
        }
      }
    },
    checkServiceNameAvailable: function(name) {
      return gpUtils.checkServiceNameAvailable(this.user, this.portalUrl, name);
    },
  });
});
