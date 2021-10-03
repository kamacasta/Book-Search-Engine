const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.User) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('follows')
                .populate('videos');

                return userData;
            }
            throw new AuthenticationError("Not logged in")
        },
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('follows')
            .populate('videos');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError("You have entered the incorrect email or username!");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("You have entered the incorrect password!");
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { content }, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addtoSet: { saveBooks: content } },
                    { new: true }
                );
                return user;
            }
            
            throw new AuthenticationError("To continue login is required...");
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                // findByIdAndUpdate method
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: {savedBooks: { bookId: bookId } } },
                );
                return user;
            }
            throw new AuthenticationError("You must be logged in to remove books!")
        },
    },
};
module.exports = resolvers;