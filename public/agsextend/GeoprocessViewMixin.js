define([
  'dojo/_base/declare',
  'dojo/Evented',
  'dojo/on',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/Deferred',
  'esri/tasks/Geoprocessor',
  'esri/request',
  'agsextend/_Widget',
  'agsextend/GeoprocessViewModel',
], function(
  declare,
  Evented,
  on,
  lang,
  arrayUtils,
  Deferred,
  Geoprocessor,
  esriRequest,
  _Widget,
  GeoprocessViewModel,
) {
  return declare([_Widget, Evented], {
    declaredClass: 'geomap.analysis.GeoprocessViewMixin',
    viewModelType: GeoprocessViewModel,
    _resultLayerGPTypes: ['GPFeatureRecordSetLayer', 'GPRecordSet'],

    constructor: function(props) {
      this.drawTools = [];
    },
    destroy: function() {
      this._clearLastInput();
      this._clearLastResult();
      this._clearMessageInterval();
      this.inherited(arguments);
    },
    postMixInProperties: function() {
      this.inherited(arguments);
      this.i18n = {};
      this._initModelWatchers();
    },
    postCreate: function() {
      this.inherited(arguments);
      this._loadConnections();
      this.renderUI();
      this.resultLayerNames = [];
    },
    _loadConnections: function() {
      this.own(
        this.on(
          'start',
          lang.hitch(this, function() {}),
        ),
      );
    },
    startup: function() {},
    renderUI: function() {
      // editManager
      // resultRenderManager

      // this.viewModel.title && this._updateTitle();
      this.viewModel.inputParams && this._createInputNodes();
      this.viewModel.outputParams && this._createResultNameNodes();
      this.viewModel.taskUrl && this._setUpGP();
      // this.viewModel.helpUrl && this._updateHelpUrl();
      this.viewModel.view && this._updateMap();
    },
    _initModelWatchers: function() {
      this.own(
        this.viewModel.watch('inputParams', lang.hitch(this, this._createInputNodes)),
        this.viewModel.watch('outputParams', lang.hitch(this, this._createResultNameNodes)),
        this.viewModel.watch('taskUrl', lang.hitch(this, this._setUpGP)),
      );
    },
    _setUpGP: function() {
      this.gp = new Geoprocessor({ url: this.viewModel.taskUrl });
      this.gp.outSpatialReference = this.viewModel.view.spatialReference;
      // this.own(on(this.gp, ))
      // bind gp events
      // onExecuteComplete
      // onJobComplete
      // onJobCancel
      // onStatusUpdate
      // onGetResultDataComplate
      // onGetResultImageLayerComplete
      // onError
    },
    _createInputNodes: function() {
      // destroy if exists
      if (this.inputNodes && this.inputNodes.length > 0) {
        arrayUtils.forEach(this.inputNodes, function() {}, this);
      }

      this.inputNodes = [];
      this.drawnLayers = [];
      this.hasESRIFSOutput = this.viewModel.inputParams.some(function(a) {
        return 'esri_out_feature_service_name' === a.name;
      });
      arrayUtils.forEach(
        this.viewModel.inputParams,
        function(a, c) {
          this._createInputNode(a, c);
        },
        this,
      );
      this._createInputFieldNodes();
    },
    _createInputNode: function(d, b) {
      var f = {};
      f.param = d;
      if ('esri_out_feature_service_name' === d.name) {
        this.featureServiceInpututNode = f;
      }

      this.drawTools = [];

      if ('GPFeatureRecordSetLayer' === d.dataType) {
        //e.inputEditor.on("analysislayer-change", k.hitch(this, this._handleInputLayerChange, e));
      }

      // 原来装的是微件，现在改造为对象
      this.inputNodes.push(f);
      return f;
    },
    _createInputFieldNodes: function() {
      if (this.inputNodes && this.inputNodes.length !== 0) {
        this.inputFieldNodes = this.inputNodes.filter(function(a) {
          return !!a && !!a.param && 'Field' === a.param.dataType && a.param.dependency;
        });
      }
    },

    _getInputFieldDepNode: function(a) {
      return this.inputNodes.filter(function(c) {
        if (c.param.name === a) {
          return c;
        }
      })[0].param;
    },

    _createResultNameNodes: function() {
      if (this.resultNameNodes && this.resultNameNodes.length > 0) {
        arrayUtils.forEach(this.resultNameNodes, function(c, b) {
          // destroy
        });
      }

      this.resultLayerParams = [];
      this.resultNameNodes = [];

      arrayUtils.forEach(
        this.viewModel.outputParams,
        function(a, c) {
          'GPFeatureRecordSetLayer' === a.dataType && this.resultLayerParams.push(a);
        },
        this,
      );
      arrayUtils.forEach(
        this.resultLayerParams,
        function(a, c) {
          this._createResultNameNode(a, this.inputNodes.length + c);
        },
        this,
      );
    },

    _createResultNameNode: function(c, b) {
      var e = {};
      e.param = c;
      e.resultNameNode = {};
      this.resultNameNodes.push(e);
      // e原来是DOM对象， resultNameNode是微件
      return e;
    },

    _handleFSNameChange: function(a) {
      var c = 0 < a.length;
      this.resultNameNodes.forEach(function(a) {
        if (a.param && 'GPFeatureRecordSetLayer' === a.param.dataType && a.resultNameNode) {
        }
      });
    },

    _handleResultNameNodeChange: function(a) {
      var c = this.resultNameNodes.some(function(a) {
        return 0 < a.resultNameNode.get('value').length;
      });

      if (this.featureServiceInpututNode) {
        // disabled editor
      }
    },

    _handleCancelBtnClick: function() {
      this.cancel(this.jobInfo);
    },

    _handleSaveBtnClick: function() {
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

    _submitJob: function(a) {
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

    onJobSubmitted: function(job) {
      var { jobId } = job;
      var options = {
        interval: 3000,
        statusCallback: lang.hitch(this, this.onStatusUpdate),
      };
      var that = this;
      this.gp.waitForJobCompletion(jobId, options).then(() => {
        that.onJobComplete(job);
      });
    },

    onJobComplete: function(job) {
      this.set('disableRunAnalysis', !1);
      if (job.jobStatus !== 'job-cancelled' && job.jobStatus !== 'job-cancelling') {
        this._clearMessageInterval();
        job.jobParams = this.jobParams;
        this.resultLayerNames &&
          0 < this.resultLayerNames.length &&
          (job.jobParams.resultName = this.resultLayerNames[0]);
        var c;
        if (job.messages && job.messages.length > 0) {
          c = arrayUtils.filter(job.messages, m => {
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
          var d = arrayUtils.filter(
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
          arrayUtils.some(this.viewModel.outputParams, function(a) {
            if ('MapServiceLayer' === a.dataType) return !0;
          });
          arrayUtils.forEach(
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
          arrayUtils.forEach(
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

    _getInputParamValues: function() {
      var defer = new Deferred();
      var c = {};
      var b = [];
      var d;
      var e = '';
      arrayUtils.forEach(
        this.inputNodes,
        function(a) {
          // TODO: getValue
          d = a.getValue();
          d.param = a.param;
          b.push(d);
        },
        this,
      );
      Promise.all(b).then(
        lang.hitch(this, function(d) {
          for (var q = 0; q < d.length; q++) {
            if (!b[q].param.required || (null !== d[q] && void 0 !== d[q])) {
              c[b[q].param.name] = d[q];
            } else {
              e = b[q].param.label + ' ' + this.i18n.requiredInfo;
              defer.reject(e);
              return;
            }

            defer.resolve(c);
          }
        }),
        function(c) {
          defer.reject(c);
        },
      );

      return defer;
    },

    _createOutputNodes: function(a) {
      var c = [];
      this.resultNodes = [];
      this.resultLayers = [];
      arrayUtils.forEach(
        this.viewModel.outputParams,
        function(b, d) {
          c.push(this._createOutputNode(b, a[d]));
        },
        this,
      );
      if (
        arrayUtils.some(c, function(a) {
          return a !== null;
        })
      ) {
        var b = [];
        arrayUtils.forEach(
          a,
          lang.hitch(this, function(a) {
            if (
              'GPFeatureRecordSetLayer' === a.dataType &&
              (a = a.value && a.value.features) &&
              0 < a.length
            ) {
              b = b.concat(a);
            }
          }),
        );
        if (0 < b.length) {
          try {
            // var d =
          } catch {

          }
        }
      }
    },

    _getCustomResultData: function(jobId, resultName, d, b, f) {
      var n = this.gp._getResultDataHandler;
    },
    cancel: function(a) {
      this.gp.cancelJob(a.jobId);
    },
    onJobCancel: function(job) {
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
      arrayUtils.some(this.viewModel.outputParams, function(c) {
        if ('MapServiceLayer' === c.dataType) return (a = c), !0;
      });
      return a;
    },

    validateOutputNames: function() {
      // if (!(this.resultNameNodes &&
      //   0 !== this.resultNameNodes.length || this.featureServiceInpututNode)) return !0;
      // var a = this.resultNameNodes.some(function(a) { return 0 < a.resultNameNode.get("value").length });
      // (a = a || this.featureServiceInpututNode && 0 < this.featureServiceInpututNode.inputEditor.gEditor.get("value").length) || this._showMessage(this.i18n.outputnameMissingMsg, "error");
      // return a

      // validate 交到UI层去验证，这里直接跳过
      return true;
    },

    _getOutputParamByName: function(a) {
      for (var c = 0; c < this.viewModel.outputParams.length; c++)
        if (this.viewModel.outputParams[c].name === a) return this.viewModel.outputParams[c];
    },

    _clearLastInput: function() {},

    _clearLastResult: function() {
      arrayUtils.forEach(
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
});
