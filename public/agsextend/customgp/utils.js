define([
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/Deferred',
  'dojo/query',
  'esri/request',
], function(arrayUtils, lang, Deferred, query, esriRequest) {
  return {
    promisifyGetValue: function(prop) {
      var d = prop.getValue;
      prop.getValue = function() {
        const prev = d.apply(prop);
        if (null !== prev && prev.then) {
          return prev;
        }

        var defer = new Deferred();
        defer.resolve(prev);
        return defer;
      };
    },

    allowShareResult: function(gp) {
      return arrayUtils.some(gp.outputParams, d => {
        return (
          'GPRecordSet' === d.dataType ||
          ('GPFeatureRecordSetLayer' === d.dataType &&
            d.defaultValue &&
            d.defaultValue.geometryType)
        );
      });
    },

    getServiceDescription: function(serv) {
      var result;
      var that = this;
      return esriRequest(serv, {
        query: { f: 'json' },
        responseType: 'json',
      }).then(resp => {
        result = resp.data;
        return that.getGPServerDescription(serv).then(resp2 => {
          result.serverInfo = resp2;
          result.useResultMapServer = resp2.hasResultMapServer;
          return this.uploadSupported(resp2).then(resp3 => {
            result.serverInfo.supportsUpload = resp3.supportsUpload;
            'maxUploadFileSize' in resp3 &&
              (result.serverInfo.maxUploadFileSize = resp3.maxUploadFileSize);
            return result;
          });
        });
      });
    },

    getGPServerDescription: function(serv) {
      var params = {
        query: { f: 'json' },
        responseType: 'json',
        useProxy: !1,
      };
      const url = this.getGPServerUrl(serv)
      return esriRequest(url, params).then(resp => {
        var result = {};
        result.currentVersion = resp.data.currentVersion || 0;
        result.url = url;
        result.hasResultMapServer =
          'esriExecutionTypeAsynchronous' === resp.data.executionType &&
          'resultMapServerName' in resp.data &&
          '' !== resp.data.resultMapServerName;
        result.resultMapServerName = resp.data.resultMapServerName;
        return result;
      });
    },

    getGPServerUrl: function(serv) {
      if (!/\/GPServer\/.+$/.test(serv)) {
        return '';
      }
      var d = serv.search(/[\w]+[^\/]*$/g);
      return serv.substr(0, d);
    },

    getResultMapServerUrl: function(url, d) {
      if (!/\/rest\/services\//.test(url)) {
        return '';
      }

      var a = url.search(/\/rest\/services\//);
      return url.substr(0, a + 15) + d + '/MapServer';
    },

    uploadSupported: function(serv) {
      if (10.1 <= serv.currentVersion) {
        return esriRequest(serv.url + 'uploads/info', {
          query: { f: 'json' },
          responseType: 'json',
        }).then(
          resp => {
            return { supportsUpload: true, maxUploadFileSize: resp.maxUploadFileSize };
          },
          () => {
            return new Promise(r => r({ supportsUpload: false }));
          },
        );
      }
    },

    getResultMapLayers: function(serv, folder) {
      var param = {
        url: this.getResultMapServerUrl(serv, folder),
        content: { f: 'json' },
        handleAs: 'json',
        callbackParamName: 'callback',
      };
      return esriRequest(param, { useProxy: !1 }).then(resp => {
        const names = arrayUtils.map(resp.layers, l => l.name);
        arrayUtils.forEach(resp.tables, t => names.push(t.name));
        return names;
      });
    },

    useDynamicSchema: function(b, d) {
      return 'useDynamicSchema' in b ? !0 === b.useDynamicSchema : !0 === d.useDynamicSchema;
    },

    sanitizeHTML: function(b) {
      return b;
    },

    stripHTML: function(b) {
      return b
        ? -1 < b.indexOf('\x3c') && -1 < b.indexOf('\x3e')
          ? b.replace(/<(?:.|\s)*?>/g, '')
          : b
        : b;
    },

    setVerticalCenter: function() {
      setTimeout(function() {}, 10);
    },

    getItemQueryStringByTypes: function(type) {
      var d = '',
        a = this.getAllItemTypes();
      if (type && 0 < type.length) {
        var f = '';
        arrayUtils.forEach(type, function(a, d) {
          f += ' type:"' + a + '" ';
          d !== type.length - 1 && (f += ' OR ');
        });
        d = ' ( ' + f + ' ) ';
        a = type.concat(a);
        a = arrayUtils.filter(a, function(a) {
          return arrayUtils.every(type, function(c) {
            return 0 > c.toLowerCase().indexOf(a.toLowerCase());
          });
        });
        arrayUtils.forEach(a, function(a) {
          d += ' -type:"' + a + '" ';
        });
      }
      return d;
    },

    checkServiceNameAvailable: function(user, portalUrl, name) {
      return esriRequest({
        url: portalUrl + '/sharing/rest/portals/' + user.orgId + '/isServiceNameAvailable',
        content: { name: name, type: 'Feature Service', f: 'json' },
      });
    },
  };
});
