const functions = require("firebase-functions");
const {
  runAssistant,
} = require("./src/userProcessing"); // Broken into multiple lines

exports.processUserInput = functions.https.onRequest(async (req, res) => {
  const {userInput} = req.body;
  try {
    const result = await runAssistant(userInput);
    res.json({message: "User input processed successfully", result});
  } catch (error) {
    console.error("Error processing user input:", error);
    res.status(500).json({error: "Error processing user input"});
  }
});
