declare module 'simple-graphql-assembler' {
  type GraphQLAssemblerError = {
    name: string;
    error: string;
  };

  type Resolvers = {
    [key: string]: any;
  };

  type GraphQLBundle = {
    typeDefs: string | null;
    resolvers: Resolvers | null;
    errros: GraphQLAssemblerError[] | null;
  };

  function assemble(root: string): GraphQLBundle;
}
