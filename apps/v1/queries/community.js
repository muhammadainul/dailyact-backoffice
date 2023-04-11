'use strict'

const debug = require('debug')
const _ = require('lodash')
const jwt = require('jsonwebtoken')

const { post } = require('../libs/request')
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

exports.getCommunityData = ({ communityId }) =>
    new Promise(async (resolve, reject) => {
        var log = debug('queries:community:getCommunityData')
        log('[DA][Query] get a community data', { communityId })
        try {
            let url = service.community + 'backoffice/get'
            let headers = { Authorization: 'Bearer ' + (await generateJWT()) }
            let body = { communityId }
            log('url, headers, body', { url, headers, body })
            let response = await post(url, headers, body)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })

exports.getAllCommunityData = ({ data }) =>
    new Promise(async (resolve, reject) => {
        var log = debug('queries:community:getAllCommunityData')
        log('[DA][Query] get all community data', { data })
        try {
            let url = service.community + 'backoffice/get/all'
            let headers = { Authorization: 'Bearer ' + (await generateJWT()) }
            let body = data
            log('url, headers, body', { url, headers, body })
            let response = await post(url, headers, body)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
