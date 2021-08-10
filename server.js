const gql = require('graphql-tag');
const {ApolloServer} = require("apollo-server");

const typeDefs = gql`
  type User{
      id:ID!
      username : String!
      createdAt:Int!
  }

  type Settings{
      user : User!
      theme : String!
  }

  input NewSettingsInput{
      user :ID!,
      theme :String!
  }
   type Query{
       me:User!
       settings(user:ID!): Settings!
   }

   type Mutation {
       settings(input : NewSettingsInput) : Settings!
   }
`;

const resolvers = {
    Query : {

        me(){
            return {
                id:'123',
                username : 'ahmad',
                theme :"happy theme"
            }
        },
        settings(_,{user}){
            console.log("🚀 ~ file: server.js ~ line 39 ~ settings ~ _", _);
            return {
                user,
                theme : "shadow theme"
            }
        },

    },

    Mutation : {
        settings(_,{input}){
            return input
        }
    },

    Settings : {
        user(){
             return {
                id:'123',
                username : 'ahmad',
                theme :"happy theme"
            }
        }
    }

}


const server  = new ApolloServer({
    typeDefs,
    resolvers
})



server.listen().then(({url})=>{
console.trace(`server on ${url}`)
})