// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseStack extends Stack {

  readonly messagesTable: Table;
  readonly channelsTable: Table;
  readonly connectionsTable: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sharedDynamoSettings = {
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production use
      encryption: TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: false, // set to "true" to enable PITR      
    }

    this.connectionsTable = new Table(this, 'Connections', {
      partitionKey: { name: 'connectionId', type: AttributeType.STRING },
      ...sharedDynamoSettings,
    });

    this.channelsTable = new Table(this, 'serverless-chat-channels', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'serverless-chat-channels',
      ...sharedDynamoSettings,
    });

    this.messagesTable = new Table(this, 'serverless-chat-messages', {
      partitionKey: {
        name: 'channelId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'sentAt',
        type: AttributeType.STRING
      },
      tableName: 'serverless-chat-messages',
      ...sharedDynamoSettings,
    });
  }
};
