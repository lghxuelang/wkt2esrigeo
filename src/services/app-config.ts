import request from '@/services/request';
import { AjaxResponse } from '../../types/common';
import { LayerConfig } from '../../types/app';

export async function loadCatalogJson(): Promise<AjaxResponse<Array<LayerConfig>>> {
  return request('./config/layers/catalog.json', {
    method: 'GET',
    handleAs: 'JSON',
  });
}
