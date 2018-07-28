#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const async = require('async');
const MapboxClient = require('@mapbox/mapbox-sdk');
const MapboxStyles = require('@mapbox/mapbox-sdk/services/styles');
const MapboxTilesets = require('@mapbox/mapbox-sdk/services/tilesets');
const MapboxDatasets = require('@mapbox/mapbox-sdk/services/datasets');

const MapboxUnpaginate = require('./MapboxUnpaginate');

const mapboxClient = MapboxClient({ accessToken: argv['access-token'] || process.env.MAPBOX_ACCESS_TOKEN });
const stylesService = MapboxStyles(mapboxClient);
const tilesetService = MapboxTilesets(mapboxClient);
const datasetsService = MapboxDatasets(mapboxClient);

const MAX_CONCURRENT = 5;

if (!argv.username) {
    console.error('--username required')
    process.exit(1);
}

if (argv['delete-all-datasets']) {
    MapboxUnpaginate.listAllDatasets(datasetsService, (err, datasets) => {
        if (err) {
            console.error(err);
        }

        if (datasets.length) {
            console.log(`Deleting ${datasets.length} datasets in ${datasets[0].owner}`)
            async.parallelLimit(datasets.map((dataset) => {
                return callback => {
                    if (dataset.owner === argv.username) {
                        if (argv['dry-run']) {
                            console.log(`DELETE ${dataset.owner}.${dataset.id} (${dataset.name})`)
                            callback(null, null);
                        } else {
                            datasetsService.deleteDataset({ datasetId: dataset.id })
                                .send()
                                .then(
                                    response => { callback(null, response) },
                                    error => { callback(error, null) }
                                );
                        }
                    }
                }
            }), MAX_CONCURRENT, (err, results) => {
                if (err)
                    console.error(err);
            });
        } else {
            console.log('No datasets');
        }
    })
}
