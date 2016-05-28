import Sequelize from 'sequelize';
import Mongoose from 'mongoose';
import casual from 'casual';
import _ from 'lodash';
import rp from 'request-promise';



const sequelize = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
});

const AuthorModel = sequelize.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
});

const PostModel = sequelize.define('post', {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
});

const mongo = Mongoose.connect('mongodb://localhost/views');
const ViewSchema = Mongoose.Schema({
  postId: Number,
  views: Number,
});
const View = Mongoose.model('views', ViewSchema);

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

const FortuneCookie = {
  getOne() {
    const url = 'http://fortunecookieapi.com/v1/cookie';
    return rp('http://fortunecookieapi.com/v1/cookie')
      .then(res => JSON.parse(res))
      .then(res => {
        return { text: res[0].fortune.message };
      });
  },
};

// create mock data with a seed, so we always get the same
casual.seed(123);
sequelize.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: 'Scott',
      lastName: 'McPherson',
    }).then(author => {
      _.times(3, () => {
        return author.createPost({
          title: `A post by ${author.firstName}`,
          text: casual.sentences(3),
        }).then(post => {
          return View.update(
            { postId: post.id },
            { views: casual.integer(0, 100) },
            { upsert: true });
        });
      })
    });
  });
});

const Author = sequelize.models.author;
const Post = sequelize.models.post;

export { Author, Post, View, FortuneCookie };
