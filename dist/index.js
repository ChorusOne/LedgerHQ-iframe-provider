
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./iframe-provider.cjs.production.min.js')
} else {
  module.exports = require('./iframe-provider.cjs.development.js')
}
