const { all } = require("../app");
const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0) {
        return 0
    } 
    else {
        const reducer = (sum, blog) => {
            return sum + blog.likes
        }
        return blogs.reduce(reducer, 0)
    }
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return {}
    }
    const favorite = blogs.reduce((a, b) => a.likes > b.likes ? a : b)
    return favorite
}

const mostBlogs = (blogs) => {
    const uniqueWriters = [...new Set(blogs.map(blog => blog.author))]
    const resultArray = []

    uniqueWriters.forEach(writer => {
        var amount = 0;
        blogs.forEach(blog => {
            blog.author === writer ? amount++ : amount
        })
        resultArray.push({
            author:writer,
            blogs: amount
        })
    })
    return resultArray.reduce((a, b) => a.blogs > b.blogs ? a : b)
}

const mostLikes = (blogs) => {
    const uniqueWriters = [...new Set(blogs.map(blog => blog.author))]
    const resultArray = []
    
    uniqueWriters.forEach(writer => {
        var amount = 0;
        blogs.forEach(blog => {
            blog.author === writer ? amount += blog.likes : amount
         })

        resultArray.push({
            author:writer,
            likes: amount
        })
    })
    return resultArray.reduce((a, b) => a.likes > b.likes ? a : b)
}


module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}