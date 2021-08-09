
let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": AWS_ACCESS_KEY_ID, "secretAccessKey": AWS_SECRET_ACCESS_KEY
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function () {
    var params = {
        TableName: "Articles",
        Key: {
            "UUID": "1"
        }
    };
    var content;
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            content= JSON.stringify(data, null, 2);
            console.log("users::fetchOneByKey::success - " + content);
            
        }
        
    })
    console.log(content)
    return content;
    
}

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
