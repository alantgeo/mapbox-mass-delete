module.exports.listAllStyles = function (stylesService, callback) {
  var styles = []

  stylesService.listStyles().eachPage((error, response, next) => {
    if (error) {
      callback(error, null)
      return
    }

    if (response.body && response.body) {
      styles = styles.concat(response.body)
    }
    if (!response.links.next) {
      // this is the last page
      callback(null, styles)
    }
    next()
  })
}

module.exports.listAllTilesets = function (tilesetsService, callback) {
  var tilesets = []

  tilesetsService.listTilesets().eachPage((error, response, next) => {
    if (error) {
      callback(error, null)
      return
    }

    if (response.body && response.body) {
      tilesets = tilesets.concat(response.body)
    }
    if (!response.links.next) {
      // this is the last page
      callback(null, tilesets)
    }
    next()
  })
}

module.exports.listAllDatasets = function (datasetsService, callback) {
  var datasets = []

  datasetsService.listDatasets().eachPage((error, response, next) => {
    if (error) {
      callback(error, null)
      return
    }

    if (response.body && response.body) {
      datasets = datasets.concat(response.body)
    }
    if (!response.links.next) {
      // this is the last page
      callback(null, datasets)
    }
    next()
  })
}

module.exports.listAllFeatures = function (datasetsService, datasetId, callback) {
  var features = []

  datasetsService.listFeatures({
    datasetId: datasetId
  }).eachPage((error, response, next) => {
    if (error) {
      callback(error, null)
      return
    }

    if (response.body && response.body.features) {
      features = features.concat(response.body.features)
    }
    if (!response.links.next) {
      // this is the last page
      callback(null, features)
    }
    next()
  })
}

