const { makeExecutableSchema } = require('@graphql-tools/schema');
const userResolver = require('./resolvers/userResolver');
const taskResolver = require('./resolvers/taskResolver');
const groupResolver = require('./resolvers/groupResolver');

// Define all types including User and Task-related ones
const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Task {
    id: ID!
    taskName: String!
    startDate: String!
    endDate: String!
    repeat: String
    assignedTo: User!  # This references the User type
    points: Int
    type: String
    createdBy: User!   # This also references the User type
  }

type Group {
  id: ID!
  groupName: String!
  members: [User!]!  # List of Users who are members of the group
  createdAt: String!
  updatedAt: String!
    createdBy: User!   # This also references the User type
  filteredTasks: [Task!]!  # Ensure this is included in the Group type


}

# Define a response type for getUserTasksInGroup
type UserTasksResponse {
  id: ID!
  username: String!
  filteredTasks: [Task!]!  # List of tasks assigned to the user
}


    type Query {
    hello: String!  # Add hello query here
      getGroup(groupId: ID!): Group  # Query to get a group by its ID
  getUserTasksInGroup(groupId: ID!, userId: ID!): UserTasksResponse  # Correct response type
  getTask(taskId: ID!) : Task
  
  }
  type ResponseMessage {
    message: String!
  }

# Define the UpdatedTaskInput type for editing tasks
input UpdatedTaskInput {
    taskName: String
    startDate: String
    endDate: String
    repeat: String
    assignedTo: ID
    points: Int
    type: String
}

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    forgotPassword(email: String!): ResponseMessage  
    resetPassword(resetToken: String!, newPassword: String!): ResponseMessage  
    createTask(taskName: String!, startDate: String!, endDate: String!, repeat: String, assignedTo: ID!, points: Int!, type: String!): Task
   createGroup(groupName: String!, members: [ID!]!): Group  # Define createGroup mutation
    editTask(taskId: ID!, updatedTaskDetails: UpdatedTaskInput!): Task  # Define editTask mutation
  }
`;

// Merge userResolver and taskResolver
const resolvers = {
  Query: {
    ...userResolver.Query,      // Merge user-related queries
    ...taskResolver.Query,   
    ...groupResolver.Query  // Merge task-related queries
  },
  Mutation: {
    ...userResolver.Mutation,   // Merge user-related mutations
    ...taskResolver.Mutation,    // Merge task-related mutations
    ...groupResolver.Mutation  // Merge group-related mutations
  },
};

// Create the executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
