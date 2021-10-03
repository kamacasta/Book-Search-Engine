// import gql
const { gql } = require("apollo-server-express");

// typeDefs start after back ticks

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Init
        savedBooks: [Book]
    }

    type Book {
        authors: String
        bookId: ID
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    input SavedBookInput {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(content: bookData!): User
        removeBook(bookId: String!): User
        
    }

    typer Auth {
        token: ID!
        user: User!
    }

    type Query {
        me: User
    }
`;
module.exports = typeDefs;
