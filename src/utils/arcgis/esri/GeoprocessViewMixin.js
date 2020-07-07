import _ from 'lodash';
import jsapi from '../jsapi';
import loadViewModel from './GeoprocessViewModel';

let cls;

export default async () => {
  if (cls) {
    return cls;
  }

  const ViewModelCls = await loadViewModel();
  const [declare, _WidgetBase, Evented, on, lang, Geoprocessor, esriRequest] = await jsapi.load([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/Evented',
    'dojo/on',
    'dojo/_base/lang',
    'esri/tasks/Geoprocessor',
    'esri/request',
  ]);
  const _Widget = _WidgetBase.createSubclass({
    declaredClass: 'geomap.dijit.analysis.Widget',
    viewModel: null,
    viewModelType: null,
    create(b, e) {
      b = lang.mixin({ viewModel: {} }, b);
      b.viewModel = this._ensureViewModelInstance(b.viewModel);
      //this.inherited(arguments, [b, e]);
      _WidgetBase.create.call(this, arguments, [b, e]);
    },
    destroy() {
      this.inherited(arguments);
      this.viewModel.destroy && this.viewModel.destroy();
      this.viewModel = null;
    },
    _setViewModelAttr: function(b) {
      this._set('viewModel', this._ensureViewModelInstance(b));
    },
    _ensureViewModelInstance(b) {
      return b && !b.declaredClass && this.viewModelType ? new this.viewModelType(b) : b;
    },
  });

  cls = declare([_Widget, Evented], {
    declaredClass: 'geomap.analysis.GeoprocessViewMixin',

    viewModelType: ViewModelCls,
    _resultLayerGPTypes: ['GPFeatureRecordSetLayer', 'GPRecordSet'],

    constructor(props) {
      this.drawTools = [];
    },
    destroy() {
      this._clearLastInput();
      this._clearLastResult();
      this._clearMessageInterval();
      this.inherited(arguments);
    },
    postMixInProperties() {
      this.inherited(arguments);
      this.i18n = {};
      this._initModelWatchers();
    },
    postCreate() {
      this.inherited(arguments);
      this._loadConnections();
      this.renderUI();
      this.resultLayerNames = [];
    },
    _loadConnections() {},
    startup: function() {},
    renderUI: function() {
      // this.viewModel.title && this._updateTitle();
      this.viewModel.inputParams && this._createInputNodes();
      // this.viewModel.outputParams && this._createResultNameNodes();
      this.viewModel.taskUrl && this._setUpGP();
      // this.viewModel.helpUrl && this._updateHelpUrl();
      this.viewModel.map && this._updateMap();
    },
    _initModelWatchers() {
      this.own(this.viewModel.watch('taskUrl', lang.hitch(this, this._setUpGP)));
    },
    _setUpGP() {
      this.gp = new Geoprocessor({ url: this.viewModel.taskUrl });
      this.gp.outSpatialReference = this.viewModel.view.spatialReference;
      // this.own(on(this.gp, ))
    },
    _createInputNodes() {
      this.hasESRIFSOutput = this.viewModel.inputParams.some(function(a) {
        return 'esri_out_feature_service_name' === a.name;
      });
    },

    _handleSaveBtnClick() {
      // validate
      if (this.validateOutputNames()) {
        this._clearLastResult();
        this._getInputParamValues().then(
          lang.hitch(this, function(a) {
            this.jobParams = a;
            this.resultLayerNames = [];
            if (0 < this.resultLayerNames.length) {
              a.resultName = a.esri_out_feature_service_name
                ? a.esri_out_feature_service_name
                : this.resultLayerNames[0];
              a.returnFeatureCollection = !(
                this.viewModel.serverInfo.resultMapServerName || a.esri_out_feature_service_name
              );
            }
            a.esri_out_feature_service_name && 0 < a.esri_out_feature_service_name.length
              ? this.viewModel.checkServiceNameAvailable(a.esri_out_feature_service_name).then(
                  lang.hitch(this, function(c) {
                    if (c.available) {
                      this._submitJob(a);
                    } else {
                      this._showMessage(this.i18n.servNameExists, 'error');
                      this.set('disableRunAnalysis', !1);
                    }
                  }),
                  lang.hitch(this, function(a) {
                    this.set('disableRunAnalysis', !1);
                  }),
                )
              : this._submitJob(a);
          }),
          lang.hitch(this, function(a) {
            this._showMessage(a, 'error');
            this.set('disableRunAnalysis', !1);
          }),
        );
      }
    },

    _submitJob(a) {
      this.emit(
        'start',
        lang.mixin({}, a, { isWebTool: !0, addToMap: 0 < this.resultLayerNames.length }),
      );
      this.viewModel.serverInfo.isSynchronous ||
      'esriExecutionTypeAsynchronous' !== this.viewModel.taskInfo.executionType
        ? this.gp.execute(a)
        : this.gp.submitJob(a).then(lang.hitch(this, this.onJobSubmitted));
      this.emit(
        'job-submit',
        lang.mixin({}, a, { isWebTool: !0, addToMap: 0 < this.resultLayerNames.length }),
      );
    },

    onJobSubmitted(job) {
      const { jobId } = job;
      const options = {
        interval: 3000,
        statusCallback: lang.hitch(this, this.onStatusUpdate),
      };
      const that = this;
      this.gp.waitForJobCompletion(jobId, options).then(() => {
        that.onJobComplete(job);
      });
    },

    onJobComplete(job) {
      this.set('disableRunAnalysis', !1);
      if (job.jobStatus !== 'job-cancelled' && job.jobStatus !== 'job-cancelling') {
        this._clearMessageInterval();
        job.jobParams = this.jobParams;
        this.resultLayerNames &&
          0 < this.resultLayerNames.length &&
          (job.jobParams.resultName = this.resultLayerNames[0]);
        var c;
        if (job.messages && job.messages.length > 0) {
          c = _.filter(job.messages, m => {
            return m.type === 'warning' || m.type === 'error';
          });
          if (c.length > 0) {
            this._createErrorMessages(c, job);
            if (job.jobStatus !== 'job-succeeded') {
              return;
            }
          }
        }

        this.emit(
          'job-success',
          lang.mixin({}, job, { isWebTool: !0, addToMap: 0 < this.resultLayerNames.length }),
        );
        if (this.viewModel.useResultMapServer) {
          c = this.viewModel.taskUrl.replace('GPServer', 'MapServer');
          c = c.substring(0, c.lastIndexOf('/'));
          c += '/jobs/' + this.jobId;
          var d = _.filter(
              this.resultNameNodes,
              function(c, d) {
                return c.param && c.param.name === job.jobParams.resultName;
              },
              this,
            ),
            d =
              0 < d.length && d[0].resultNameNode
                ? d[0].resultNameNode.get('value')
                : job.resultName; // TODO:
          this.emit('job-result', {
            value: { url: c, type: 'ArcGISDynamicMapServiceLayer' },
            outputLayerName: d,
            isWebTool: !0,
            addToMap: !0,
          });
          _.some(this.viewModel.outputParams, function(a) {
            if ('MapServiceLayer' === a.dataType) return !0;
          });
          _.forEach(
            this.viewModel.outputParams,
            function(c) {
              c.visible &&
                'GPFeatureRecordSetLayer' !== c.dataType &&
                'GPRasterDataLayer' !== c.dataType &&
                'GPRecordSet' !== c.dataType &&
                this.gp.getResultData(job.jobId, c.name);
            },
            this,
          );
        } else {
          _.forEach(
            this.viewModel.outputParams,
            function(c) {
              if (c.visible) {
                if (
                  'GPFeatureRecordSetLayer' !== c.dataType ||
                  !this.viewModel.serverInfo ||
                  this.viewModel.serverInfo.resultMapServerName ||
                  this.jobParams.esri_out_feature_service_name
                ) {
                  this.gp.getResultData(job.jobId, c.name);
                } else {
                  this._getCustomResultData(job.jobId, c.name, { returnFeatureCollection: !0 });
                }
              }
            },
            this,
          );
        }
      }
    },

    _getCustomResultData(jobId, resultName, d, b, f) {
      var n = this.gp._getResultDataHandler;
    },
    cancel: function(a) {
      this.gp.cancelJob(a.jobId);
    },
    onJobCancel(job) {
      this._clearMessageInterval();
      this.resultLayerNames &&
        0 < this.resultLayerNames.length &&
        (job.resultName = this.resultLayerNames[0]);
      this.emit(
        'job-cancel',
        lang.mixin({}, job, { isWebTool: !0, addToMap: 0 < this.resultLayerNames.length }),
      );
    },

    onStatusUpdate: function(a) {
      this.jobId = a.jobId;
      a.jobStatus === 'job-succeeded' && this._clearMessageInterval();
      !this.messageInterval && this.jobId && this._setupMessageInterval();
      a.jobParams = this.jobParams;
      this.resultLayerNames &&
        0 < this.resultLayerNames.length &&
        (a.jobParams.resultName = this.resultLayerNames[0]);
      this.jobInfo = a;
      this.emit(
        'job-status',
        lang.mixin({}, a, { isWebTool: !0, addToMap: 0 < this.resultLayerNames.length }),
      );
    },

    onGetResultDataComplate: function(a) {},

    onGetResultImageLayerComplete: function(a) {},

    onError: function() {
      this._clearMessageInterval();
    },

    _createErrorMessages: function(a, c) {},

    _setupMessageInterval: function() {},

    _updateJobMessage: function() {},

    _clearMessageInterval: function() {
      this.jobId = '';
      if (this.messageInterval) {
        clearInterval(this.messageInterval);
        this.messageInterval = null;
      }
    },

    _getResultMapServiceParam: function() {
      var a;
      _.some(this.viewModel.outputParams, function(c) {
        if ('MapServiceLayer' === c.dataType) return (a = c), !0;
      });
      return a;
    },

    _getOutputParamByName: function(a) {
      for (var c = 0; c < this.viewModel.outputParams.length; c++)
        if (this.viewModel.outputParams[c].name === a) return this.viewModel.outputParams[c];
    },

    _clearLastInput: function() {},

    _clearLastResult: function() {
      _.forEach(
        this.resultLayers,
        function(a) {
          null !== a && this.viewModel.view.map.layers.remove(a);
        },
        this,
      );
      this.resultLayers = [];
    },

    _updateMap: function() {
      this.viewModel.view && this.set('view', this.viewModel.view);
    },
  });

  return cls;
};
