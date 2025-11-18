// server.js
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const User = require('./data');
require('dotenv').config(); // for .env file

// ------------- TYPE DEFINITIONS -------------
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    description: String
    rating: Float
    product: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  input UserInput {
    name: String!
    email: String!
    phone: String!
    description: String
    rating: Float
    product: String
  }

  type Mutation {
    addUser(input: UserInput!): User!
  }
`;

// ------------- RESOLVERS -------------
const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
  },

  Mutation: {
    addUser: async (_, { input }) => {
      const newUser = new User(input);
      await newUser.save();
      return newUser;
    }
  }
};

// ------------- START SERVER -------------
async function start() {
  // MongoDB connect
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("✅ MongoDB connected");

  // Start Apollo server
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`Server ready at ${url}`);
}

start().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
