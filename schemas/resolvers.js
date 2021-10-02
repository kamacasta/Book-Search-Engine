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
        // users: async () => {
        //     return User.find()
        //     .select('-__v -password')
        //     .populate('follows')
        //     .populate('videos');
        // }
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
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
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
            
            throw new AuthenticationError("To continue you must be logged in please!");
        },
    }

}