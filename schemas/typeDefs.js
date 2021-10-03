// import gql
const { gql } = require("apollo-server-express");

// typeDefs start after back ticks

const typeDefs = gql`
    type {
        _id: ID
        username: String
        email: String
        bookCount: Init
        savedBooks: [Book]
    }
    type Book {
        authors: String
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
`
