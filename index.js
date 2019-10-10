const debug = require('debug')('plugin:chance')
const Chance = require('chance')
const chance = Chance()

module.exports.Plugin = ChancePlugin
module.exports.pluginInterfaceVersion = 2

function ChancePlugin (script, events) {
  this.script = script
  this.events = events

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

  const variables = ctx.vars

  if (!variables || variables.length === 0 || !variables.chance) {
    debug('No variables found! Do you have a `chance` block in your variables?')
    return cb()
  }

  const chanceConfig = variables.chance

  Object.keys(chanceConfig).forEach(key => {
    const value = chanceConfig[key]
    const complex = typeof value === 'object'
    const conf = complex ? { ...value } : {}
    const method = complex ? conf.method : value

    if (complex) {
      delete conf.method
    }

    debug(`Calling chance: chance.${method}(${JSON.stringify(conf)})`)
    variables[key] = chance[method](conf)
    debug(`Created variable: ${key} -> ${variables[key]}`)
  })

  return cb()
}
