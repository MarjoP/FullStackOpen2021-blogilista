const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    })

jest.setTimeout(30000);
test('returns two json-format blogs', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(initialBlogs.length)
    })

test('blog has an identifying id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.id.toBeDefined())
})

test('a blog can be added', async () => {
    const newBlog = {
        title: "blogTestTitle",
        author: "Marjo P.",
        url: "www.blogTestTitle.com",
        likes: 8
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/notes')
        const title = response.body.map(r => r.title)

        expect(response.body).toHaveLength(initialBlogs.length +1)
        expect(title).toContain('blogTestTitle')
})

test('if amount of likes is not given when posting a blog it is set as 0', async () => {
    const newBlog = {
      title: "bestBlogEver",
      author: "Marjo P",
      url: "www.myBlogIsBest.com"
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(200)

      const response = await api.get('api/notes')
      const addedBlog = response.body.filter(r => r.title === "bestBlogEver")
      expect(addedBlog.likes.ToBe(0))
})

afterAll(() => {
  mongoose.connection.close()
})