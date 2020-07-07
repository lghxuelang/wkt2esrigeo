import '@/utils/language';

// 中间件注册
import { createView } from './middleware/arcgis-view';
export const dva=  {
    config: {
        onAction: [
            createView(),
        ],
        onError(err: ErrorEvent) {
            err.preventDefault();
            console.error(err.message);
        },
    },
};
