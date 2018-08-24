#!/usr/bin/env node

const { writeFile } = require('fs')
const { promisify } = require('util')

const { get, asJson } = require('simple-get-promise')

const writeFileP = promisify(writeFile)

const params = {
  url: 'https://api.github.com/repos/tlvince/talks/contents?ref=gh-pages',
  headers: {
    'user-agent': 'tlvince.github.io'
  }
}

const filterFiles = files => files
  .map(file => file.name)
  .filter(file => file.endsWith('.html') && file !== 'index.html')
  .map(file => file.replace('.html', ''))

const startCase = str => {
  const [first, ...rest] = str.split('')
  return [first.toUpperCase(), ...rest].join('')
}

const format = files => files.map(file => {
  const [year, month, day, ...names] = file.split('-')
  return {
    url: `https://talks.tlvince.com/${file}`,
    date: `${year}-${month}-${day}`,
    title: names.map(startCase).join(' ')
  }
})

const write = talks => {
  const json = JSON.stringify(talks, null, 2)
  return writeFileP('_data/talks.json', json)
}

get(params)
  .then(asJson)
  .then(filterFiles)
  .then(format)
  .then(write)
  .catch(err => console.error(err))
