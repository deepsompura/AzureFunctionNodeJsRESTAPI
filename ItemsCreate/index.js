
// Reference to the Azure Storage SDK
const azure = require('azure-storage');
// Reference to the uuid package which helps us to create 
// unique identifiers for our PartitionKey
const uuid = require('uuid/v1');

// The TableService is used to send requests to the database
const tableService = azure.createTableService();
// 
const tableName = "items";

module.exports = async function (context, req) {
    context.log('Start ItemCreate');

    if (req.body) {

        // TODO: Add some object validation logic & 
        //       make sure the object is flat

        // Adding PartitionKey & RowKey as they are required for any data stored in Azure Table Storage
        const item = req.body;
        item["PartitionKey"] = "Partition";
        item["RowKey"] = uuid();

        // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
        tableService.insertEntity(tableName, item, { echoContent: true }, function (error, result, response) {
            if (!error) {
                // This returns a 201 code + the database response inside the body
                // Calling status like this will automatically trigger a context.done()
                context.res.status(201).json(response);
            } else {
                // In case of an error we return an appropriate status code and the error returned by the DB
                context.res.status(500).json({ error: error });
            }
        });
    }
    else {
        // Return an error if we don't revceive an object
        context.res = {
            status: 400,
            body: "Please pass an item in the request body"
        };
        context.done();
    }
};