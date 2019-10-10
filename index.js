'use strict'

const debug = require('debug')('plugin:chance')
const Chance = require('chance')
const chance = Chance()

module.exports.Plugin = ChancePlugin
module.exports.pluginInterfaceVersion = 2

let prefix

function ChancePlugin (script, events) {
  this.script = script
  this.events = events

  prefix = script.config.plugins.chance.prefix || '~'

  script.config.processor = script.config.processor || {}
  script.config.processor.createVariables = createVariables

  script.scenarios.forEach(scenario => {
    scenario.beforeRequest = scenario.beforeRequest || []
    scenario.beforeRequest.push('createVariables')
  })

  debug('Plugin initialized')
  return this
}

function createVariables (req, userContext, events, done) {
  let ctx = userContext
  let cb = done

  if (arguments.length === 3) {
    // called as a "function"
    ctx = req
    cb = events
  }

  let variables = ctx.vars
  if (variables && Object.keys(variables).length) {
    Object.keys(variables).forEach(key => {
      if (key[0] !== prefix) { return }
      let value = variables[key]
      let complex = typeof value === 'object'
      let conf = complex ? { ...value } : {}
      let method = complex ? conf.method : value

      if (complex) {
        delete conf.method
      }

      let realKey = key.slice(1)
      debug(`Calling chance: chance.${method}(${JSON.stringify(conf)})`)
      variables[realKey] = chance[method](conf)
      debug(`Created variable: ${realKey} -> ${variables[realKey]}`)
    })
  }

  return cb()
}
