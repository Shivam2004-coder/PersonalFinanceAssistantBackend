const { GoogleGenAI, createPartFromUri } = require("@google/genai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { Readable } = require("stream");
const dotenv = require("dotenv");
dotenv.config();

exports.geminiSearch = async (req, res) => {

    const { data } = req.body;
    // console.log("I am in gemini search !!");
    // console.log(data);

    try {

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build content array
        const geminiQuery =
            "I wanted to parse this pdf and extract data and fill this five fields which best suits the pdf if it doesn't suits any keep the field empty "+
            "I want you to return the object like this { type : String , amount : number , category : String , notes : String , date : Date }"+
            "{ type : one of the fields which the pdf transaction content best suits ( income or expense ) "+
            "{ amount : { final amount of transaction happened } } "+
            "{ category : one of the category among these five which best suits pdf content , if it doesn't suits any keep write others { Food , Travel , Shopping , Salary , Investment } } "+
            "{ notes : { about what this transaction is in 5 - 100 words main main points in a proper sentence } } "+
            "{ date : { date of main transaction happened you give it in (Format: yyyy-MM-dd) } } ."+
            "If you find this pdf anything else other than transaction or invoice or bill you return object {message : This pdf does not contains any transaction }"+
            "Return ONLY the JSON object, no extra text.";

        const result = await model.generateContent([
            {
                inlineData: {
                    data: data.file,
                    mimeType: data.type,
                },
            },
            geminiQuery,
        ]);

        // console.log(result);
        let outputText = result.response.text();

        // Remove triple backticks if present
        outputText = outputText.replace(/```json|```/g, "").trim();

        let parsedObject;
        try {
        parsedObject = JSON.parse(outputText);
        } catch (e) {
        // console.error("Failed to parse Gemini output:", e, outputText);
        return res.status(500).json({ error: "Invalid JSON from Gemini" });
        }

        res.status(200).json({ data: parsedObject });

    } catch (error) {
        // console.error("Error parsing PDF:", error);
        res.status(500).send("Internal server error");
    }
};