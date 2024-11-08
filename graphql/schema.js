const { makeExecutableSchema } = require('@graphql-tools/schema');
const userResolver = require('./resolvers/userResolver');
const taskResolver = require('./resolvers/taskResolver');
const groupResolver = require('./resolvers/groupResolver');
const rewardResolver = require('./resolvers/rewardResolver');

const mealResolver = require('./resolvers/mealResolver');
const recipeResolver = require('./resolvers/recipeResolver');


// Define all types including User and Task-related ones
const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
    points: Int  # Added points field for users
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
    category:String
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

# Define the Reward type 
type Reward {
  id: ID!
  name: String!
  pointsAssigned: Int!
  expiryDate: String!
  assignedTo: User!  # This references the User type
  category: String!
  createdBy: User!
}

# Define a response type for getUserTasksInGroup
type UserTasksResponse {
  id: ID!
  username: String!
  filteredTasks: [Task!]!  # List of tasks assigned to the user
}

  type Step {
    number: Int
    step: String
  }

type Recipe {
    _id: ID!
    id: String
    title: String
    image: String
    summary: String
    readyInMinutes: String
    healthScore: String
    cuisines: [String]
    servings: String
    instructions: String
    steps: [Step]
    ingredients: [Ingredient]
  }

 type Ingredient {
    id: Int
    amount: Float
    unit: String
    unitLong: String
    unitShort: String
    aisle: String
    name: String
    original: String
    originalName: String
    meta: [String]
    extendedName: String
    image: String
  }

  type Meal {
    id: Int
    title: String
    usedIngredientCount: Int
    missedIngredientCount: Int
    missedIngredients: [Ingredient]
    usedIngredients: [Ingredient]
    unusedIngredients: [Ingredient]
    likes: Int
    image: String
    imageType: String
  }

type MealsByCuisine {
  mealStyle: String
  cuisine: String
  meals: [Meal]
  offset: Int
  number: Int
  totalResults: Int
}

type MealPlanItem {
    date: String
    mealId: String
    mealTitle: String
    mealType: String
    image: String
    servings: Int
  }

  type MealPlan {
    groupId: ID!
    mealPlanItems: [MealPlanItem]
    createdAt: String
    updatedAt: String
  }


    type Query {
    hello: String!  # Add hello query here
   getGroup(groupId: ID): Group  # Query to get a group by its ID
  getUserTasksInGroup(groupId: ID!,userId: ID!): UserTasksResponse  # Correct response type
  getMyTasksInGroup:UserTasksResponse
  getTask(taskId: ID!) : Task
  getPoints(userId: ID!): UserPoints
  getReward(rewardId: ID!): Reward
  getRedeemedRewards: [Reward!]!
  getUserRewardList: [Reward!]! # Correctly defined as returning an array of non-nullable Reward types
  myProfile:User
  getMeals(mealStyle: String, cuisine: String, title: String, ingredients: [String]): MealsByCuisine
    getRecipeById(id: Int!): Recipe
    getRecipeByName(title: String!): [Recipe]
    getMealPlanByGroup(groupId: ID!): MealPlan

  }
  
  type UserPoints {
    userId: ID!
    points: Int!
  }

  type ResponseMessage {
    message: String!
  }

  type RedeemedReward {
    rewardId: ID!
    name: String!
    pointsAssigned: Int!
    category: String!
    redeemedAt: String!
  }
  
  
  type RedeemRewardResponse {
    message: String!
    userId: ID!
    updatedPoints: Int!
    redeemedRewards: [RedeemedReward!]!
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


#Define Recipe Inputs

input StepInput {
  number: Int
  step: String
}
  
  input RecipeInput {
    id: Int
    title: String
    image: String
    summary: String
    readyInMinutes: String
    healthScore: String
    cuisines: [String]
    servings: String
    instructions: String
    steps: [StepInput]
    ingredients: [IngredientInput]
  }

# Define meal Inputs

 input MealInput {
    id: Int
    title: String
    usedIngredientCount: Int
    missedIngredientCount: Int
    missedIngredients: [IngredientInput]
    usedIngredients: [IngredientInput]
    unusedIngredients: [IngredientInput]
    likes: Int
    image: String
    imageType: String
  }

  input IngredientInput {
    id: Int
    amount: Float
    unit: String
    unitLong: String
    unitShort: String
    aisle: String
    name: String
    original: String
    originalName: String
    meta: [String]
    extendedName: String
    image: String
  }

   input MealPlanItemInput {
    date: String
    mealId: String
    mealTitle: String
    mealType: String
    image: String
    servings: Int
  }


# Define the UpdatedRewardInput type for editing rewards
input UpdatedRewardInput {
  name: String
  pointsAssigned: Int
  expiryDate: String
  category: String
}

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    forgotPassword(email: String!): ResponseMessage  
    resetPassword(resetToken: String!, newPassword: String!): ResponseMessage  
    createTask(taskName: String!, startDate: String!,endDate: String!, repeat: String, assignedTo: ID!, points: Int,description:String, type: String!,category : String!): Task
   createGroup(groupName: String!, members: [ID!]!): Group  # Define createGroup mutation
    editTask(taskId: ID!, updatedTaskDetails: UpdatedTaskInput!): Task  # Define editTask mutation
    createReward(name: String!, pointsAssigned: Int!, expiryDate: String!,assignedTo:ID! category: String!): Reward 
    editReward(rewardId: ID!, updatedRewardDetails: UpdatedRewardInput!): Reward  # Mutation to edit a reward
    testMutation: String
    redeemReward(rewardId: ID!): Reward
    completeTask(taskId: ID!) :Task
    googleSignIn(username: String!, email:String!,googleId:ID!) :User

       addMeal(mealStyle: String!, cuisine: String!, meal: MealInput!): MealsByCuisine
    deleteMeal(mealStyle: String!, cuisine: String!, mealId: Int!): MealsByCuisine
    addRecipe(recipe: RecipeInput!): Recipe
    updateRecipe(id: Int!, recipe: RecipeInput!): Recipe
    deleteRecipe(id: Int!): String
    saveMealPlan(groupId: ID!, mealPlanItems: [MealPlanItemInput]!): MealPlan

  }
`;  

// Merge userResolver and taskResolver
const resolvers = {
  Query: {
    ...userResolver.Query,      // Merge user-related queries
    ...taskResolver.Query,   
    ...groupResolver.Query,  // Merge task-related queries
    ...rewardResolver.Query,
     ...mealResolver.Query,
     ...recipeResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,   // Merge user-related mutations
    ...taskResolver.Mutation,    // Merge task-related mutations
    ...groupResolver.Mutation,  // Merge group-related mutations
    ...rewardResolver.Mutation,
    ...mealResolver.Mutation,
    ...recipeResolver.Mutation,
  },
};

// Create the executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
