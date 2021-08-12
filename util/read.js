
let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": AWS_ACCESS_KEY_ID, "secretAccessKey": AWS_SECRET_ACCESS_KEY
};
AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient({});

function fetchOneByKey() { 
    return new Promise(function(resolve, reject){
        var params = {
            TableName: "Articles",
            Key: {
                "UUID": "1"
            }
        };
    
    // Call DynamoDB to read the item from the table via callback
    x = docClient.get(params, function(err, data) {
        if (err) {
            reject(err);
        } else {
            resolve(data.Item);
        }
    });})

}