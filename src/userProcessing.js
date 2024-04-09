const OpenAI = require('openai');
const admin = require('firebase-admin');

// Initialize the OpenAI instance with your API key
const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
});

// Your existing Assistant ID
const assistantId = 'asst_S3FmsRstYXkFsRzGLx7JcIc1'; // Replace with your actual Assistant ID

// Initialize the Firebase Admin SDK with your service account credentials
const serviceAccount = require('./iam1-e3294-firebase-adminsdk-dg0qq-5dec1954d7.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function runAssistant(userInput) {
  console.log("Starting runAssistant with userInput:", userInput);
  const db = admin.firestore();

  // Function to write to Firestore
  const writeToFirestore = async (collection, data) => {
    const docRef = db.collection(collection).doc();
    await docRef.set(data);
    console.log(`${collection} document added successfully to Firestore.`);
  };

  // Create a Thread in OpenAI
  const thread = await openai.beta.threads.create();
  console.log("OpenAI Thread created with ID:", thread.id);

  // Add a user message to the Thread using userInput
  await openai.beta.threads.messages.create(thread.id, { role: "user", content: userInput });
  console.log("User message added to OpenAI Thread.");

  const responseRef = db.collection('responses');
  responseRef.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        const response = change.doc.data();
        console.log("New response added:", response);
        // Process the response as needed
      }
    });
  });
  
  // Create and Stream a Run using the existing Assistant
  const runStream = openai.beta.threads.runs.createAndStream(thread.id, { assistant_id: assistantId });

  runStream.on('toolCallDelta', async (toolCallDelta) => {
    let jsonBuffer = '';
    jsonBuffer += toolCallDelta.function.arguments;

    if (jsonBuffer.trim().endsWith('}')) {
      try {
        const parsedArgs = JSON.parse(jsonBuffer);
        jsonBuffer = '';
        console.log("Parsed function arguments:", parsedArgs);

        // Handling parsed arguments based on your application logic
        if ('date' in parsedArgs) {
          await writeToFirestore('reminder_notes', {
            person_name: parsedArgs.person_name,
            note_content: parsedArgs.note_content,
            date: parsedArgs.date,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else if ('e_mail' in parsedArgs || 'person_description' in parsedArgs) {
          const peopleRef = db.collection('people');
          const snapshot = await peopleRef.where('person_name', '==', parsedArgs.person_name).get();
          
          if (snapshot.empty) {
            await writeToFirestore('people', {
              person_name: parsedArgs.person_name,
              e_mail: parsedArgs.e_mail ? [parsedArgs.e_mail] : [],
              person_description: parsedArgs.person_description ? [parsedArgs.person_description] : [],
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
          } else {
            const existingDocRef = snapshot.docs[0].ref;
            const updateData = {};
            
            if (parsedArgs.e_mail && parsedArgs.e_mail.trim() !== '') {
              updateData.e_mail = admin.firestore.FieldValue.arrayUnion(parsedArgs.e_mail);
            }
            if (parsedArgs.person_description && parsedArgs.person_description.trim() !== '') {
              updateData.person_description = admin.firestore.FieldValue.arrayUnion(parsedArgs.person_description);
            }
            await existingDocRef.update(updateData);
            console.log("Existing person document updated with new information in Firestore.");
          }
        } else {
          // Handle other cases or default action
          await writeToFirestore('general_notes', {
            person_name: parsedArgs.person_name,
            note_content: parsedArgs.note_content,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error parsing accumulated JSON:', jsonBuffer, error);
        // Consider writing the error to a Firestore document for logging/monitoring
      }
    }
  });

  // Handling other events from runStream as needed for your application
}

module.exports = { runAssistant };