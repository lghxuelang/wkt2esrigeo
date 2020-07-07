import _ from 'lodash'
import jsapi from '../../jsapi';

export default {
    promisifyGetValue(prop) {
        const d = prop.getValue;
        prop.getValue = function () {
            const prev = d.apply(prop);
            if (null !== prev && prev.then) {
                return prev;
            }

            const promise = new Promise(r => r(prev));
            return promise;
        };
    },

    allowShareResult(gp) {
        return _.some(gp.outputParams, d => {
            return "GPRecordSet" === d.dataType || "GPFeatureRecordSetLayer" === d.dataType && d.defaultValue && d.defaultValue.geometryType
        });
    },

    async getServiceDescription(serv) {
        const [esriRequest] = await jsapi.load(['esri/request']);

        let result
        const that = this;
        return esriRequest({ url: serv, content: { f: "json" }, handleAs: "json", callbackParamName: "callback" }).then((resp) => {
            result = resp;
            return that.getGPServerDescription(serv).then((resp2) => {
                result.serverInfo = resp2;
                result.useResultMapServer = resp2.hasResultMapServer;
                return this.uploadSupported(serv).then((resp3) => {
                    result.serverInfo.supportsUpload = resp3.supportsUpload;
                    "maxUploadFileSize" in resp3 && (result.serverInfo.maxUploadFileSize = resp3.maxUploadFileSize);
                    return result;
                });
            })
        })
    },

    async getGPServerDescription(serv) {
        const params = {
            url: this.getGPServerUrl(serv),
            content: { f: "json" }, handleAs: "json", callbackParamName: "callback"
        }
        const [esriRequest] = await jsapi.load(['esri/request']);
        return esriRequest(params, { useProxy: !1 }).then(resp => {
            const result = {};
            result.currentVersion = resp.currentVersion || 0;
            result.url = params.url;
            result.hasResultMapServer = "esriExecutionTypeAsynchronous" === resp.executionType && "resultMapServerName" in resp && "" !== resp.resultMapServerName;
            result.resultMapServerName = resp.resultMapServerName;
            return result;
        })
    },

    getGPServerUrl(serv) {
        if (!/\/GPServer\/.+$/.test(serv)) {
            return '';
        }
        var d = serv.search(/[\w]+[^\/]*$/g);
        return serv.substr(0, d)
    },

    getResultMapServerUrl(url, d) {
        if (!/\/rest\/services\//.test(url)) {
            return '';
        }

        var a = url.search(/\/rest\/services\//);
        return url.substr(0, a + 15) + d + "/MapServer"
    },

    async uploadSupported(serv) {
        const [esriRequest] = await jsapi.load(['esri/request']);
        if (10.1 <=
            serv.currentVersion) {
            return esriRequest({ url: serv.url + 'uploads/info', content: { f: "json" }, handleAs: "json" })
                .then(resp => {
                    return { supportsUpload: true, maxUploadFileSize: resp.maxUploadFileSize }
                }, () => {
                    return new Promise(r => r({ supportsUpload: false }))
                })
        }
    },

    async getResultMapLayers(serv, folder) {
        const param = {
            url: this.getResultMapServerUrl(serv, folder),
            content: { f: "json" }, handleAs: "json", callbackParamName: "callback" 
        };
        const [esriRequest] = await jsapi.load(['esri/request']);
        return esriRequest(param, { useProxy: !1 }).then(resp => {
            const names = _.map(resp.layers, l => l.name);
            _.forEach(resp.tables, t => names.push(t.name));
            return names;
        })
    },

    useDynamicSchema(b,d) {
        return "useDynamicSchema" in b ? !0 === b.useDynamicSchema : !0 === d.useDynamicSchema
    },

    sanitizeHTML: function(b) { return b },

    stripHTML: function(b) { return b ? -1 < b.indexOf("\x3c") && -1 < b.indexOf("\x3e") ? b.replace(/<(?:.|\s)*?>/g, "") : b : b },

    setVerticalCenter() {
        setTimeout(function() {

        }, 10)
    },

    getItemQueryStringByTypes(type) {

    },

    
};