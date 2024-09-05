

async function checkIfExists(model, query) {
    try {
        // Use exists method to check if a document matching the query exists
        const exists = await model.exists(query);
        return exists !== null; // Returns true if a document exists, otherwise false
    } catch (error) {
        console.error("Error checking if document exists:", error);
        return false;
    }
}


module.exports={
    checkIfExists
}