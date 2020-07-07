import { jsapi, layerCreator, viewUtils, layerUtils } from '@/utils/arcgis';
// 添加 building scenlayer 
const add = async (view, opt) => {

    const currentLayer = await layerCreator.create(opt);
    // console.log(currentLayer)
    view.map.add(currentLayer);
    // setFullModel(currentLayer);
    // layerUtils.zoomTolayer(view, currentLayer);
}
// 将building 
const setFullModel = (layer) => {
    if (layer) {
        layer.when(() => {
            if (layer.sublayers) {
                layer.sublayers.forEach(function (sublayer) {
                    if (sublayer.modelName === 'FullModel') {
                        sublayer.visible = true;
                    } else {
                        sublayer.visible = false;
                    }
                });
            }

        })
    }

}

// 适用对象：buildingSceneLayer ,还原初始状态
const filter = async (view, layerName, filters) => {
    const buildingLayer = viewUtils.getLayerByTitle(view, layerName);
    if (buildingLayer) {
        setFullModel(buildingLayer);
        let filterExpression = '';
        // 如果有过滤条件，则通过条件过滤，如果没有则还原到初始状态
        if (filters) {
            const params = filters.map((name) => `'${name}'`);
            console.log(params);
            filterExpression = `ObjectId in (${params})`;
            console.log(filterExpression);
        }

        const [BuildingFilter] = await jsapi.load(['esri/layers/support/BuildingFilter']);
        const buildingFilter = new BuildingFilter({
            filterBlocks: [
                {
                    filterExpression: filterExpression,
                    filterMode: {
                        type: "solid"
                    }
                }
            ]
        });
        buildingLayer.filters = [buildingFilter];
        buildingLayer.activeFilterId = buildingFilter.id;
    }

};


const buildingUtils = {
    add,
    filter,
    setFullModel,
}

export default buildingUtils