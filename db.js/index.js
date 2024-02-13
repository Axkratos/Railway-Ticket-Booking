const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://anupadhikari269:anup123@cluster0.8bro0ce.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connection Successful`);
}).catch((error) => {
    console.error('Connection Error:', error);
});
