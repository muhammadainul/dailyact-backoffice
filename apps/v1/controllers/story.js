'use strict'

const debug = require('debug')
const _ = require('lodash')

const Story = require('../queries/story')

let getAccessToken = async headers => {
    var log = debug('page:getAccessToken')
    let str = _.split(headers.authorization, ' ')
    log('access token: Bearer ', str[1])
    return { access_token: str[1] }
}

exports.storyPage = async (req, res, next) => {
    let log = debug('bo:storyPage')
    log('[DA] Render Story Page')
    try {
        log('req.session', req.session)
        res.render('pages/story/story_summary')
    } catch (error) {
        next(error)
    }
}

exports.storyDetailPage = async (req, res, next) => {
    let log = debug('bo:storyDetailPage')
    let param = req.params
    log('[DA] Render Story Detail Page', { param })
    try {
        let story = await Story.getStoryData({ storyId: param.storyid })
        res.render('pages/story/detail', { story })
    } catch (error) {
        next(error)
    }
}

exports.getAllStory = async (req, res, next) => {
    let log = debug('bo:getAllStory')
    let data = req.body
    log('[DA] get all stories', data)
    try {
        data.searchOrder = ''
        if (data.order[0].column == '4') {
            data.searchOrder = 'createdAt'
        }

        if (data.order[0].dir == 'desc') {
            data.searchOrder = '-' + data.searchOrder
        }

        let result = await Story.getAllStoryData({ data })
        res.send(result).data
    } catch (error) {
        next(error)
    }
}
