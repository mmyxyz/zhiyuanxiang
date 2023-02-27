// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
    traceUser: true
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    const dbname = 'articles'

    // 详细信息
    if (event.type === 'EntrustDetail') {
        let id = event.id
        const EntrustList = await db.collection(dbname)
            .orderBy('updateTime', 'desc')
            .where({
                '_id': id
            }).get()
        return EntrustList
    }

    // 获取articles列表
    if (event.type === 'getarticles') {
        if (event.hasOwnProperty('tag')) {
            if (event.tag == '全部') {
                const EntrustList = await db.collection('articles')
                    .aggregate()
                    .sort({
                        updateTime: -1,
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                            use_id: event.loginUserId
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$_id', '$$art_id']),
                                $.eq(['$user_id', '$$use_id'])
                            ])))
                            .project({
                                like_status: 1,
                            })
                            .done(),
                        as: 'likestatus',
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$_id', '$$art_id']),
                                $.eq(['$like_status', 1])
                            ])))
                            .done(),
                        as: 'likesumarr',
                    })
                    .lookup({
                        from: 'user',
                        localField: 'open_id',
                        foreignField: '_openid',
                        as: 'user',
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
                    })
                    .project({
                        likestatus: 0
                    })
                    .end()

                return EntrustList
            } else {
                const EntrustList = await db.collection('articles')
                    .aggregate()
                    .sort({
                        updateTime: -1,
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                            use_id: event.loginUserId
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$_id', '$$art_id']),
                                $.eq(['$user_id', '$$use_id'])
                            ])))
                            .project({
                                like_status: 1,
                            })
                            .done(),
                        as: 'likestatus',
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$_id', '$$art_id']),
                                $.eq(['$like_status', 1])
                            ])))
                            .done(),
                        as: 'likesumarr',
                    })
                    .lookup({
                        from: 'user',
                        localField: 'open_id',
                        foreignField: '_openid',
                        as: 'user',
                    })
                    .match({
                        EntrustType: db.RegExp({
                            regexp: event.tag,
                            options: 'i', //大小写不区分
                        })
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
                    })
                    .project({
                        likestatus: 0
                    })
                    .end()

                return EntrustList

            }
        } else {
            // searchValue 判断是否是搜索内容
            if (event.searchValue == '' || !event.hasOwnProperty('searchValue')) {
                const EntrustList = await db.collection('articles')
                    .aggregate()
                    .sort({
                        updateTime: -1,
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                            use_id: event.loginUserId
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$_id', '$$art_id']),
                                $.eq(['$user_id', '$$use_id'])
                            ])))
                            .project({
                                like_status: 1,
                            })
                            .done(),
                        as: 'likestatus',
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$_id', '$$art_id']),
                                $.eq(['$like_status', 1])
                            ])))
                            .done(),
                        as: 'likesumarr',
                    })
                    .lookup({
                        from: 'user',
                        localField: 'open_id',
                        foreignField: '_openid',
                        as: 'user',
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
                    })
                    .project({
                        likestatus: 0
                    })
                    .end()

                return EntrustList

            } else {
                const EntrustList = await db.collection('articles')
                    .aggregate()
                    .sort({
                        updateTime: -1,
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                            use_id: event.loginUserId
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$_id', '$$art_id']),
                                $.eq(['$user_id', '$$use_id'])
                            ])))
                            .project({
                                like_status: 1,
                            })
                            .done(),
                        as: 'likestatus',
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$_id', '$$art_id']),
                                $.eq(['$like_status', 1])
                            ])))
                            .done(),
                        as: 'likesumarr',
                    })
                    .lookup({
                        from: 'user',
                        localField: 'open_id',
                        foreignField: '_openid',
                        as: 'user',
                    })
                    .match({
                        "FormData.title": db.RegExp({
                            regexp: event.searchValue,
                            options: 'i', //大小写不区分
                        })
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
                    })
                    .project({
                        likestatus: 0
                    })
                    .end()

                return EntrustList

            }
        }


    }
    // 查询文章详情
    if (event.type === 'getarticledetail') {
        const EntrustList = await db.collection('articles')
        .aggregate()
        .sort({
            updateTime: -1,
        })
        .match({
            _id: event.articleid
        })
        .lookup({
            from: 'likes',
            let: {
                art_id: '$_id',
                use_id: '$open_id',
            },
            pipeline: $.pipeline()
                .match(_.expr($.and([
                    $.eq(['$_id', '$$art_id']),
                    $.eq(['$user_id', '$$use_id'])
                ])))
                .project({
                    like_status: 1,
                })
                .done(),
            as: 'likestatus',
        })
        .lookup({
            from: 'likes',
            let: {
                art_id: '$_id',
            },
            pipeline: $.pipeline()
                .match(_.expr($.and([
                    $.eq(['$_id', '$$art_id']),
                    $.eq(['$like_status', 1])
                ])))
                .done(),
            as: 'likesumarr',
        })
        .lookup({
            from: 'user',
            localField: 'open_id',
            foreignField: '_openid',
            as: 'user',
        })
        .replaceRoot({
            newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
        })
        .project({
            likestatus: 0
        })
        .end()

    return EntrustList
    }

      // 查询自己的文章列表
      if (event.type === 'getmyarticles') {
        const EntrustList = await db.collection('articles')
        .aggregate()
        .sort({
            updateTime: -1,
        })
        .match({
            open_id: event.userid
        })
        .lookup({
            from: 'likes',
            let: {
                art_id: '$_id',
                use_id: event.userid
            },
            pipeline: $.pipeline()
                .match(_.expr($.and([
                    $.eq(['$_id', '$$art_id']),
                    $.eq(['$user_id', '$$use_id'])
                ])))
                .project({
                    like_status: 1,
                })
                .done(),
            as: 'likestatus',
        })
        .lookup({
            from: 'likes',
            let: {
                art_id: '$_id',
            },
            pipeline: $.pipeline()
                .match(_.expr($.and([
                    $.eq(['$_id', '$$art_id']),
                    $.eq(['$like_status', 1])
                ])))
                .done(),
            as: 'likesumarr',
        })
        .lookup({
            from: 'user',
            localField: 'open_id',
            foreignField: '_openid',
            as: 'user',
        })
        .replaceRoot({
            newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
        })
        .project({
            likestatus: 0
        })
        .end()

    return EntrustList
    }

}