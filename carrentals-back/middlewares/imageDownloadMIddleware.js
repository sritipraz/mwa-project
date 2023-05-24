const { downloadFromS3 } = require("../aws/s3");

module.exports.downloadFile = async (req, res) => {
    try {
        const key = req.params.key;
        const readStream = await downloadFromS3(key);
        readStream.pipe(res);
    } catch (error) {
        next(error);
    }
};
