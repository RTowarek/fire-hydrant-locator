import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { MapService } from './map/map.service';
import { ClusterExpansionZoomDto, ClustersDto } from './types';

@Controller()
export class AppController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  @Render('index')
  async root() {
    return {};
  }

  @Post('api/clusters')
  async getClusters(@Body() body: ClustersDto) {
    return this.mapService.getClusters(body.bbox, body.zoom);
  }

  @Post('api/clusterExpansionZoom')
  async getClusterExpansionZoom(@Body() body: ClusterExpansionZoomDto) {
    return this.mapService.getClusterExpansionZoom(body.clusterId);
  }
}
