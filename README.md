## Description

Fire Hydrant Locator - enter an address or zoom in to a location to find the nearest fire hydrants. Limited to fire hydrants located in Poland.
Fire hydrant data comes from [OpenStreetMap](https://www.openstreetmap.org/).

## Requirements

- Node.js >= 12.x
- PostgreSQL 13
- PostGIS 3.x

## Installation

```bash
$ npm install
```

```bash
$ npm run setup:osm
```

```bash
$ createdb <DB_NAME>
```

```bash
$ psql -U <DB_USERNAME> -d <DB_NAME> -c 'CREATE EXTENSION postgis'
```

```bash
$ ogr2ogr \
    -nln fire_hydrants \
    -nlt POINT \
    -lco GEOMETRY_NAME=geom \
    -lco FID=gid \
    -t_srs EPSG:4326 \
    -sql "SELECT \"fire_hydrant:diameter\" AS diameter, \"fire_hydrant:position\" AS position, \"fire_hydrant:type\" AS type from hydrants" \
    -overwrite \
    -f "PostgreSQL" PG:"dbname=<DB_NAME> user=<DB_USERNAME>" \
    "<ABSOLUTE_PATH>/data/hydrants.json"
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Website is available at [localhost:3000](http://localhost:3000) by default.
