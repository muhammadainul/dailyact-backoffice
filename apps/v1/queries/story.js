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

exports.getStoryData = ({ storyId }) =>
    new Promise(async (resolve, reject) => {
        var log = debug('queries:story:getStoryData')
        log('[DA][Query] get a story data', { storyId })
        try {
            let url = service.story + 'get'
            let headers = { Authorization: 'Bearer ' + (await generateJWT()) }
            let body = { storyId }
            log('url, headers, body', { url, headers, body })
            let response = await post(url, headers, body)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })

exports.addThumbnailStory = () =>
    new Promise(async (resolve, reject) => {
        var log = debug('queries:story:addThumbnailStory')
        log('[DA][Query] add thumbnail story images')
        try {
            let url = service.story + 'thumbnail/add'
            let headers = { Authorization: 'Bearer ' + (await generateJWT()) }
            let body = {}
            log('url, headers, body', { url, headers, body })
            let response = await post(url, headers, body)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })

exports.getStatistic = () =>
    new Promise(async (resolve, reject) => {
        var log = debug('queries:story:getStatistic')
        log('[DA][Query] get story statistic')
        try {
            let url = service.story + 'statistic/get'
            let headers = { Authorization: 'Bearer ' + (await generateJWT()) }
            let body = {}
            log('url, headers, body', { url, headers, body })
            let response = await post(url, headers, body)
            log('response', response.data)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })

exports.getAllStoryData = ({ data }) =>
    new Promise(async (resolve, reject) => {
        var log = debug('queries:story:getAllStoryData')
        log('[DA][Query] get all story data', { data })
        try {
            let url = service.story + 'get/all'
            let headers = { Authorization: 'Bearer ' + (await generateJWT()) }
            let body = data
            log('url, headers, body', { url, headers, body })
            let response = await post(url, headers, body)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })

exports.getLocationByStory = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:story:location by story data");
        log("[DA][Query] location by story data");
        try {
            let url     = service.story + "location/province";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            log("response", response.data);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });


