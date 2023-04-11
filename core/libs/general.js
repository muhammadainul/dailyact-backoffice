'use strict';

var crypto = require('crypto');

function return_empty()
{
    return {
        draw : 0,
        recordsTotal : 0,
        recordsFiltered : 0,
        data : []
    };
}
/*[William]: for testing purpose*/
// function test(q)
// {
//     var ctr, rej, p = new Promise(function (resolve, reject) {
//         ctr = setTimeout(function(){
//             console.log("Run " + q + " 1");
//             resolve();
//         }, 10000);
//         rej = reject;
//     });
//     p.cancel = function(){ clearTimeout(ctr); rej(Error("Cancelled"))};
//     return p; 
// }

function randomString(){
   let rand_string =  Math.random().toString(36).substr(2, 6);

   return rand_string;
}

let query = bluebird.coroutine(function*(db, q) { 
    let data = yield db.getConnection().query(q,{ type: Sequelize.QueryTypes.SELECT});
    return data;
    //[William] : for testing purpose
    // yield test(q);
    // return [];
});

//[William]: suggest change format to datatables
exports.getDataPaging = bluebird.coroutine(function* (db, queryFrom, uniqueId, columns, posts) {
    posts = Object.assign({
        length: 10,
        start: 0,
        sorting: '',
        filtering: '',
        order:'',
        search:''
    }, posts);
    posts.filtering = posts['search']
    let length = parseInt(posts['length']) || 10
    let start = parseInt(posts['start']) || 0

    if(columns.length == 0 || uniqueId == undefined || uniqueId == '' || queryFrom == undefined || queryFrom == '') {
        return resolve(return_empty())
    }
    //for mysql
    let limit = 'LIMIT ' + start + ',' + length
    let order = ''

    if(posts.sorting != '') {
        posts.sorting = JSON.parse(posts.sorting)
    }else{
        posts.sorting = []
    }

    /*if(typeof posts.sorting == 'object' && posts.sorting.length > 0) {
        for(let i in posts.sorting)
        {
            if(order != '') {
                order += ' , '
            }
            let dir = 'asc'
            if(Boolean(posts.sorting[i].desc)) {
                dir = 'desc'
            }
            order += posts.sorting[i].id + ' ' + dir;
        }
        order = 'ORDER BY ' + order;
    }*/
    let oder_obj = posts['order']
    if(typeof posts['order'] !== undefined && posts['order'].length > 0) {
        for(let o in oder_obj) {
            order += columns[parseInt(oder_obj[o]['column'])] + " " + oder_obj[o]['dir'] + ", "
        }
        order += "DELETETHIS"
        order = order.replace(', DELETETHIS', '')
        order = 'ORDER BY ' + order
    }

    let where = ""
    // if(posts.filtering != '')
    // {
    //     posts.filtering = JSON.parse(posts.filtering);
    // }
    // else
    //     posts.filtering = [];

    // if(typeof(posts.filtering) == 'object' && posts.filtering.length > 0)
    // {
    //     for ( let i in posts.filtering )
    //     {
    //         if(columns.indexOf(posts.filtering[i].id) >= 0)
    //         {
    //             if(where != '')
    //                 where += ' OR ';
    //             where += posts.filtering[i].id + " LIKE '%" + posts.filtering[i].value + "%' ";
    //         }
    //     }
    //     where = "WHERE (" + where;
    //     where += ')';
    // }
    // console.log(posts)
    if(typeof posts['search'] !== undefined && posts['search'] != "") {
        where = "WHERE (";
        for(let i in posts.columns){
            let col = posts.columns[i]
            if(col.data != "" && col.searchable == "true"){
                where += col.data + " LIKE '%" + posts['search']['value'] + "%' OR "
            }
        }
        where += "DELETETHIS"
        where = where.replace('OR DELETETHIS', '')
        where += ")"
    }

    if(posts.columns != undefined){
        for(let i in posts.columns){
            let col = posts.columns[i]
            if(col.data != ""){
                if(col.search.value != ""){
                    if(where != ""){
                        where += " AND "
                    }
                    where += " " + col.data + " like '%" + col.search.value + "%' "
                }
            }
        }
    }
        /*
        * SQL queries
        * Get data to display
        */
        //mysql only

    let q = "SELECT SQL_CALC_FOUND_ROWS " + columns.join(',') + " FROM " + queryFrom + " " + where + " " + order + " " + limit

    // let datares = [];
    let datares = yield query(db, q)
    /* Data set length after filtering */

    let queryFiltered = "SELECT count(*) as count FROM " + queryFrom + " " + where
    console.log(queryFiltered)
    let result = yield query(db, queryFiltered)
    let numFiltered = result[0].count

    /* Total data set length */
    let queryTotal = "SELECT COUNT(" + uniqueId + ") as count FROM " + queryFrom

    result = yield query(db, queryTotal)
    let numDatas = result[0].count

    /*
    * Output
    */
    return {
        draw : 0,
        recordsTotal : numDatas,
        recordsFiltered : numFiltered,
        data : datares
    }
})