// import gql
import { gql } from "@apollo/client";

export const GET_ME = gql`
{
    me{
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
}
`;
// created file, used keywords given in front end specifications, file completed