import FeedParser from 'feedparser'
import request from 'request-promise'
import db from '../data/index'
import ServerError from '../util/ServerError'
import * as Toolkit from '../util/Toolkit'
import { validteUserCategory } from './category'

export const getFeedById = async(userId, feedId) => {
    const data = await db.feed.findById(feedId);
    Toolkit.assertNotNull(data, 'The request feed does not exist!');
    await validteUserCategory(userId, data.category);
    return data.toJSON();
}
export const addFeed = async(userId, categoryId, attributes) => {
    await validteUserCategory(userId, categoryId);
    const result = await db.sequelize.transaction(async t => {
        let category;
        let feed = await db.feed.find({
            where: {
                address: attributes.address
            }
        });
        if (feed == null) {
            await parseFeed(attributes.address)
                .then(meta => {
                    attributes.name = meta.title;
                    attributes.description = meta.description;
                })
                .catch(err => {
                    throw new ServerError(`The feed returns invalid data! Error:${err}`);
                });
            feed = await db.feed.create({
                name: attributes.name,
                address: attributes.address,
                description: attributes.description
            }, { transaction: t });
        } else {
            category = await db.category.find({
                where: {
                    id: categoryId
                },
                include: [{ model: db.feed, as: 'feeds', where: { id: feed.id }
                     }]
            });
            Toolkit.assertNull(category, 'You have already had this feed!');
        }
        category = await db.category.findById(categoryId);
        category = await category.addFeed(feed, {
            transaction: t
        });
        return feed;
    })
    .catch(err => {
        throw new ServerError(`Create failed! ${err}`, ServerError.DATA_TRANSACTION_FAIL);
    });
    return result.toJSON();
}
export const deleteFeed = async(userId, categoryId, id) => {
    await validteUserCategory(userId, categoryId);
    const feed = await db.feed.findById(id);
    Toolkit.assertNotNull(feed, 'The request feed does not exist!');
    const result = await db.sequelize.transaction(async t => {
            const category = await db.category.findById(categoryId);
            const res = await category.removeFeed(feed, { transaction: t });
            return res;
    })
    .catch(err => {
        throw new ServerError(`Delete failed! ${err.name}`, ServerError.DATA_TRANSACTION_FAIL);
    });
    return result === 1 ? 'Delete success!' : 'You have already deleted the feed yet!';
}
export const parseFeed = address => {
    const options = {
        url: address,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml'
        }
    }
    const feedParser = new FeedParser();
    request(options)
        .on('error', err => {
            throw new ServerError(`Meet some error when request feed: ${err}`);
        })
        .on('response', res => {
            if (res.statusCode != 200) {
                throw new ServerError('The feed return invalid data.');
            }
        })
        .pipe(feedParser);
    return new Promise((resolve, reject) => {
        let meta;
        feedParser.on('readable', function() {
            let item;
            meta = this.meta;
            while (item = this.read()) {
            }
        });
        feedParser.on('error', err => {
            reject(err);
        });
        feedParser.on('end', () => {
            resolve(meta);
        });
    });
}
