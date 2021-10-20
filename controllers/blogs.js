const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if(authorization && authorization.toLowerCase().startsWith('bearer')) {
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
   const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
   response.json(blogs.map(blog => blog.toJSON()))
   
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  //const token = getTokenFrom(request)
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if(!request.token || !decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }
  //  const user = await User.findById(decodedToken.id)

  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user
  })
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog.toJSON)
  } 
  catch(exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
   //const user = await User.findById(decodedToken.id)
    const user = request.user
  try {
    const blog = await Blog.findById(request.params.id)
    console.log(blog.user.toString())
    console.log(decodedToken.id)
    
    if(blog.user.toString() === decodedToken.id) {
      await Blog.findByIdAndRemove(blog.id)
      console.log('blog removed')
      response.status(204).end()
    }
  } catch (exception) {
      next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

  const updated =  await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updated.toJSON)
})

module.exports = blogsRouter