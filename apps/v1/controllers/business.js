'use strict'

const debug = require('debug')
const {
    assign, //
    isEmpty,
    map,
    toString
} = require('lodash')
const fs = require('fs')

exports.checkinGuest = async (req, res, next) => {
    let log = debug('bo:business:checkinGuest')
    let data = req.body
    log('[DA] business checkinGuest')
    try {
        let result = await req.queries('business').checkinGuest(data)
        res.send(result)
    } catch (error) {
        next(error)
    }
}
