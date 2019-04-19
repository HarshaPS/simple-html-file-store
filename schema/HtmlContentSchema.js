const mongoose = require('mongoose');

const htmlFileSchema = new mongoose.Schema({
    fileName: String,
    htmlContent: String
});
   
const HtmlFile = mongoose.model("HtmlFile", htmlFileSchema);

module.exports =  HtmlFile;