'use strict'

const debug = require('debug')
const _ = require('lodash')

const Community = require('../queries/community')

let getAccessToken = async headers => {
    var log = debug('page:getAccessToken')
    let str = _.split(headers.authorization, ' ')
    log('access token: Bearer ', str[1])
    return { access_token: str[1] }
}

exports.communityPage = async (req, res, next) => {
    let log = debug('bo:communityPage')
    log('[DA] Render Community Page')
    try {
        log('req.session', req.session)
        res.render('pages/community/list')
    } catch (error) {
        next(error)
    }
}

exports.communityDetailPage = async (req, res, next) => {
    let log = debug('bo:communityDetailPage')
    let param = req.params
    log('[DA] Render Community Detail Page', { param })
    try {
        let community = await Community.getCommunityData({ communityId: param.communityid })
        res.render('pages/community/detail', { community })
    } catch (error) {
        next(error)
    }
}

exports.getAllCommunity = async (req, res, next) => {
    let log = debug('bo:getAllCommunity')
    let data = req.body
    log('[DA] get all communities', data)
    try {
        data.query = data.search.value
        data.searchOrder = ''
        if (data.order[0].column == '4') {
            data.searchOrder = 'createdAt'
        }

        if (data.order[0].dir == 'desc') {
            data.searchOrder = '-' + data.searchOrder
        }

        let result = await Community.getAllCommunityData({ data })
        res.send(result).data
    } catch (error) {
        next(error)
    }
}
