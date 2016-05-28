const typeDefinitions = `
type Author {
  id: Int
  firstName: String
  lastName: String
  posts: [Post]
}

type Post {
  id: Int
  title: String
  text: String
  views: Int
  author: Author
  fortuneCookie: FortuneCookie
}

type FortuneCookie {
  text: String
}

type Query {
  author(firstName: String, lastName: String): Author
  getFortuneCookie: FortuneCookie
}

schema {
  query: Query
}
`;

export default [typeDefinitions];
