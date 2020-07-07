define(['dijit/_WidgetBase', 'dojo/_base/lang'], function(_WidgetBase, lang) {
  var _Widget = _WidgetBase.createSubclass({
    declaredClass: 'geomap.dijit.analysis.Widget',
    viewModel: null,
    viewModelType: null,
    create(b, e) {
      b = lang.mixin({ viewModel: {} }, b);
      b.viewModel = this._ensureViewModelInstance(b.viewModel);
      this.inherited(arguments, [b, e]);
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

  return _Widget;
});
