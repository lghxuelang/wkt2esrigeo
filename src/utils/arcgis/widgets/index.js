import { jsapi } from '@/utils/arcgis';
/**
 * 创建卷帘对比功能
 * @author  lee  
 * @param {object} view  场景
 * @param {String} leadingLayers  场景
 * @param {String} trailingLayers  场景
 * @returns {object}  basemap 底图
 */
let swipe = null;
async function createSwipe(view, leadingLayers, trailingLayers) {
    const [Swipe] = await jsapi.load(['esri/widgets/Swipe']);
    swipe = new Swipe({
        leadingLayers: [leadingLayers],
        trailingLayers: [trailingLayers],
        position: 50, // set position of widget to 35%
        view: view
    });

    // add the widget to the view
    view.ui.add(swipe);
}

async function destroySwipe() {
    swipe.destroy();
}

/**
 * 创建图层编辑功能
 * @author  lee  
 * @param {object} view  场景
 * @param {String} leadingLayers  场景
 * @param {String} trailingLayers  场景
 * @returns {object}  basemap 底图
 */
let editor = null;
async function createEditor(view) {
    const [Editor] = await jsapi.load(["esri/widgets/Editor"]);
    editor = new Editor({
        view: view
    });
    view.ui.add(editor, "bottom-right");
}
async function destroyEidtor(){
    editor.destroy();
}

const widgetsUtils = {
    createSwipe,
    destroySwipe,
    createEditor,
    destroyEidtor
};

export default widgetsUtils;
