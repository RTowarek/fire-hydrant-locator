import { Injectable } from '@nestjs/common';
import { query } from 'src/database';
import Supercluster = require('supercluster');

@Injectable()
export class MapService {
  private index: Supercluster;

  constructor() {
    this.init();
  }

  private async init() {
    const fireHydrants = await this.getFireHydrants();
    this.index = new Supercluster({
      radius: 128,
    }).load(fireHydrants.rows[0].json_build_object.features);
  }

  private async getFireHydrants() {
    return await query(`
      SELECT
        json_build_object('type', 'FeatureCollection', 'features', json_agg(json_build_object('type', 'Feature', 'geometry', ST_AsGeoJSON(geom)::json, 'properties', json_build_object('diameter', diameter, 'type', type, 'position', position))))
      FROM
        fire_hydrants;`);
  }

  public getClusterExpansionZoom(clusterId: number) {
    return { zoomLevel: this.index.getClusterExpansionZoom(clusterId) };
  }

  public getClusters(bbox: GeoJSON.BBox, zoom: number) {
    return this.index.getClusters(bbox, zoom);
  }
}
