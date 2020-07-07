import { jsapi } from '@/utils/arcgis';
/**
 * utility method that synchronizes the viewpoint of a view to other views
 */
const synchronizeView = async function(view, others) {
  const [watchUtils] = await jsapi.load([
    'esri/core/watchUtils',
  ]);
  others = Array.isArray(others) ? others : [others];

  let viewpointWatchHandle;
  let viewStationaryHandle;
  let otherInteractHandlers;
  let scheduleId;

  const clear = function() {
    if (otherInteractHandlers) {
      otherInteractHandlers.forEach(function(handle) {
        handle.remove();
      });
    }
    viewpointWatchHandle && viewpointWatchHandle.remove();
    viewStationaryHandle && viewStationaryHandle.remove();
    scheduleId && clearTimeout(scheduleId);
    otherInteractHandlers = viewpointWatchHandle =
      viewStationaryHandle = scheduleId = null;
  };

  const interactWatcher = view.watch('interacting,animation',
    function(newValue) {
      if (!newValue) {
        return;
      }
      if (viewpointWatchHandle || scheduleId) {
        return;
      }

      // start updating the other views at the next frame
      scheduleId = setTimeout(function() {
        scheduleId = null;
        viewpointWatchHandle = view.watch('viewpoint',
          function(newValue) {
            others.forEach(function(otherView) {
              otherView.viewpoint = newValue;
            });
          });
      }, 0);

      // stop as soon as another view starts interacting, like if the user starts panning
      otherInteractHandlers = others.map(function(otherView) {
        return watchUtils.watch(otherView,
          'interacting,animation',
          function(
            value) {
            if (value) {
              clear();
            }
          });
      });

      // or stop when the view is stationary again
      viewStationaryHandle = watchUtils.whenTrue(view,
        'stationary', clear);
    });

  return {
    remove: function() {
      this.remove = function() {
      };
      clear();
      interactWatcher.remove();
    },
  };
};

/**
 * utility method that synchronizes the viewpoints of multiple views
 */
const synchronizeViews = function(views) {
  let handles = views.map(function(view, idx, views) {
    const others = views.concat();
    others.splice(idx, 1);
    return synchronizeView(view, others);
  });

  return {
    remove: function() {
      this.remove = function() {
      };
      handles.forEach(function(h) {
        h.remove();
      });
      handles = null;
    },
  };
};

export default  synchronizeViews;
