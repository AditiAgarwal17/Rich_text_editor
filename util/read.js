
let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": AWS_ACCESS_KEY_ID, "secretAccessKey": AWS_SECRET_ACCESS_KEY
  };

AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient({});

async function fetchOneByKey(tableName) {
  const params = {
      TableName: tableName
  };

  let items = [];
  return new Promise((resolve, reject) => {
      function onScan(err, data) {
          if (err) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
              reject();
          } else {
              items = items.concat(data.Items);

              if (typeof data.LastEvaluatedKey !== "undefined") {
                  params.ExclusiveStartKey = data.LastEvaluatedKey;
                  docClient.scan(params, onScan);
              } else {
                  resolve(items);
              }
          }
      }
      docClient.scan(params, onScan);
  });
}
  
  