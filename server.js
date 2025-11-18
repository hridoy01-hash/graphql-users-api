// server.js
require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const User = require('./data'); // make sure this is your Mongoose model

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
  try {
    // MongoDB connect
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Enable Playground in production
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,   // allow introspection in production
      playground: true,      // enable GraphQL Playground / Apollo Sandbox
    });

    const PORT = process.env.PORT || 4000;
    const { url } = await server.listen({ port: PORT });
    console.log(`🚀 Server ready at ${url}`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

start();
