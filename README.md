<p align="center">
  <img width="186" height="90" src="https://user-images.githubusercontent.com/218949/44782765-377e7c80-ab80-11e8-9dd8-fce0e37c235b.png" alt="Beyonk" />
</p>

# Artillery Chance Plugin

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![CircleCI](https://circleci.com/gh/beyonk-adventures/eslint-config.svg?style=shield)](https://circleci.com/gh/beyonk-adventures/eslint-config)

Makes [chance.js](https://chancejs.com) available for [Artillery](https://artillery.io/) loadtest configurations.

This plugin has been built on the excellent work of [artillery-plugin-faker](https://www.npmjs.com/package/artillery-plugin-faker)

## Install

```sh
$ npm install -g artillery-plugin-chance
```

## Usage

Add the plugin to your loadtest configuration:

```yaml
config:
  plugins:
    chance: {}
```

### Example

Creating a block called `chance` in config will allow you to set a series of variables using chance which will be changed (and used) in each request.

It has been done this way rather than at the top level to prevent an expensive `Object.keys` search on the whole configuration, which might otherwise limit your ability to produce rapid requests at volume.

Note that any conflicting variable names will overwrite the variables you have alrady defined at the top level.

Then, you can use these functions as you usually would in your scenarios:

```yaml
config:
  plugins:
    chance: {}
  variables:
    chance:
      - fullName: 'name'
      - englishWithMiddle:
          method: 'name'
          middle: true
          nationality: 'en'
  scenarios:
    - flow:
      - get:
          url: "/search?q={{ englishWithMiddle }}"
    - flow:
      - get:
          url: "/search?q={{ fullName }}"
```

For a complete list of available *chance.js* functions, have a look at the [chance.js documentation](https://chancejs.com).

*Have a look at the `example.yml` file for a fully working example.*
