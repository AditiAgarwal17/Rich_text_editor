let awsConfig = {
  "region": "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId": AWS_ACCESS_KEY_ID, "secretAccessKey": AWS_SECRET_ACCESS_KEY
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function () {
  return new Promise(function (resolve, reject) {
    var params = {
        TableName: 'Articles',
        Key: {'UUID': 1}
       };
    x = docClient.get(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
};

// function fetchOneByKey() {
//     const params = {
//       TableName: "Articles",
//       Key: {
//         "UUID": '1'
//       }
//     };

//     return Promise.resolve(docClient.get(params));
//   }

//   let result;
//   fetchOneByKey()
//     .then((data1) => {
//         data1.then((data)=>{
//         result = data.result;
//         console.log("Last login: " + result);
//         })
//       })
//     .catch((err) => {
//       console.log(err);
//     });

// var fetchOneByKey = new Promise(function(resolve, reject) {
//     let docClient = new AWS.DynamoDB.DocumentClient();
//     var params = {
//         TableName: "Articles",
//         Key: {
//             "UUID": "1"
//         }
//     };
//     docClient.get(params, function (err, data) {
//         if (err) {
//             reject();
//         }
//         else {
//             resolve();

//         }

//     });
//     let result;
//     fetchOneByKey().
//       then(function (data) {
//         result = JSON.stringify(data, null, 2);
//         console.log("Content: " + result);
//       }).
//       catch(function (err) {
//         console.log(err);
//       })
//     });
