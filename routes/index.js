const express = require('express');
const router = express.Router();
const multer = require('multer');
const stripTags = require('striptags');
const HtmlFileSchema = require('../schema/HtmlContentSchema')

const upload = multer();

router.post('/upload', upload.array('HtmlFile'), (req, res, next) =>
{
    let files = req.files;
    let savedFiles = files.map(htmlfile =>
    {
        if (htmlfile.mimetype !== 'text/html') {
            res.send("Please Upload Html file");
        }
        let originalFileName = htmlfile.originalname;
        let htmltext = stripTags(htmlfile.buffer.toString('utf-8'));
        let htmlFileData = new HtmlFileSchema({
            "fileName": originalFileName,
            "htmlContent": htmltext
        });
        try {
            HtmlFileSchema.find({ "fileName": originalFileName }, (err, response) =>
            {
                if (err) res.json("Error fetching data")
                else {
                    console.log("response :: ", response);
                    if (response.length > 0) {
                        res.status(200).send(`File is already exists in the name : ${originalFileName} | Please upload new file`);
                    } else {
                        htmlFileData.save()
                            .then(item =>
                            {
                                console.log("Response from DB : ", item);
                                res.status(200).send('Html file content is successfully saved to database');
                            })
                            .catch(err =>
                            {
                                console.log("error occured while storing file into DB : ", err);
                                res.status(400).send("unable to save to database");
                            }
                            );
                    }
                }
            });
        } catch (error) {
            console.log("Error occured : ", error);
        }
    });
});

//Ideally this should be an PUT API call. Since plane Html doesn't support PUT, using POST here for temporary fix
router.post('/modifyFileContent', (req, res) =>
{
    let ModifiedContent = req.query.content;
    let fileId = req.query.fileName;
    let updatedQuery = { $set: { "htmlContent": ModifiedContent } };

    HtmlFileSchema.updateOne({ "fileName": fileId }, updatedQuery, (err, response) =>
    {
        if (err) res.json("Error fetching data", err);
        else {
            res.status(200).send("Successfully updated!!!");
        }
    });
});

router.get('/listFiles', (req, res) =>
{
    let pageNo = parseInt(req.query.pageNo) || 1;
    let size = parseInt(req.query.size) || 10;
    let query = {}
    if (pageNo < 0 || pageNo === 0) {
        return res.json("Invalid page number, should start with 1")
    }
    query.skip = size * (pageNo - 1)
    query.limit = size;

    try {
        HtmlFileSchema.find({}, {}, query, (err, response) =>
        {
            if (err)
                res.json("Error fetching data", err);
            else {
                let fileArr = response.map(eachFile =>
                {
                    return {
                        "fileName": eachFile.fileName,
                        "htmlContent": eachFile.htmlContent
                    }
                });
                res.status(200).send(fileArr);
            }
        }); 
    } catch (error) {
        res.send(error);
    }
       
});

router.get('/getFileByName', (req, res) =>
{
    let file = req.query.fileName;

    HtmlFileSchema.find({ "fileName": file }, (err, response) =>
    {
        if (err)
            res.json("Error fetching data", err);
        else {
            let fileArr = response[0].htmlContent;
            res.status(200).send(fileArr.toString());
        }
    });
});



module.exports = router;