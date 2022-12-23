﻿using Amazon.CDK;
using Infrastructure.Stacks;

namespace Infrastructure
{
    public enum LogLevel
    {
        DEBUG,
        INFO,
        WARN,
        ERROR
    }
    
    sealed class Program
    {
        public static void Main(string[] args)
        {
            var defaultLogLevel = LogLevel.ERROR;
            var app = new App();
            
            var authStack = new AuthenticationStack(app, "AuthenticationStack", new StackProps{ });
            var databaseStack = new DatabaseStack(app, "DatabaseStack", new StackProps{ });

            var websocketApiStack = new WebsocketApiStack(app, "WebsocketApiStack", new WebsocketApiStackProps
            {
                LogLevel = defaultLogLevel,
                MessagesTable = databaseStack.MessagesTable,
                ChannelsTable = databaseStack.ChannelsTable,
                CognitoUserPoolId = authStack.CognitoUserPoolId,
                ConnectionsTable = databaseStack.ConnectionsTable
            });
            websocketApiStack.AddDependency(databaseStack);
            websocketApiStack.AddDependency(authStack);
            
            var restApiStack = new RestApiStack(app, "RestApiStack", new RestApiStackProps
            {
                LogLevel = defaultLogLevel,
                MessagesTable = databaseStack.MessagesTable,
                ChannelsTable = databaseStack.ChannelsTable,
                CognitoUserPoolId = authStack.CognitoUserPoolId,
                WebSocketApi = websocketApiStack.WebSocketApi,
                ConnectionsTable = databaseStack.ConnectionsTable
            });
            restApiStack.AddDependency(authStack);
            restApiStack.AddDependency(websocketApiStack);
            restApiStack.AddDependency(databaseStack);
            
            var frontendStack = new FrontendStack(app, "FrontendStack", new FrontendStackProps
            {
                RestApi = restApiStack.RestApi,
                WebsocketApi = websocketApiStack.WebSocketApi,
                CognitoUserPoolId = authStack.CognitoUserPoolId,
                CognitoDomainPrefix = "serverless-chat-users"
            });
            frontendStack.AddDependency(restApiStack);
            
            var observabilityStack = new ObservabilityStack(app, "ObservabilityStack", new StackProps{ });
            
            app.Synth();
        }
    }
}
