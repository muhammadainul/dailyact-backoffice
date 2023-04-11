'use strict'

const debug = require('debug')
const _ = require('lodash')
const jwt = require('jsonwebtoken')

const { post, postWithFiles } = require('../libs/request')
const service = require('../config/service')

let generateJWT = () =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(
                jwt.sign(
                    {
                        backoffice: true
                    },
                    myConfig.session_secret,
                    { expiresIn: 10 }
                )
            )
        } catch (error) {
            reject(error)
        }
    })

exports.checkinGuest = data =>
    new Promise(async (resolve, reject) => {
        var log = debug('queries:business:checkinGuest')
        log('[DA][Query] checkinGuest', { data })
        try {
            let url = service.business + 'checkin/guest'
            let headers = {}
            let body = data
            log('url, headers, body', { url, headers, body })
            let response = await post(url, headers, body)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
