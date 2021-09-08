const gql = require('graphql-tag');
const {ApolloServer , PubSub} = require("apollo-server");

const pubSub = new PubSub();
const NEW_ITEM = "NEW_ITEM" ;

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

   type Item {
    task : String!
   }

   type Mutation {
       settings(input : NewSettingsInput) : Settings!,
       createItem(task : String!) : Item!
   }

   type Subscription {
    newItem : Item
   }
`

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
        },
       createItem(_,{task}){
           const item = {task} ;
           pubSub.publish(NEW_ITEM,{newItem:item});
           return item;
       }
    },

    Subscription:{
        newItem : {
            subscribe : ()=>pubSub.asyncIterator(NEW_ITEM)
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
    resolvers,
    context({connection,req}){
        if(connection){
           return {...connection.context}
        }
    },
    subscription:{
      onConnect(params){

      }
    }

})



server.listen().then(({url})=>{
console.trace(`server on ${url}`)
})