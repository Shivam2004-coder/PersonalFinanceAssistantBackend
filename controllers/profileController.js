
export const profileView = async (req,res) => {
    try{
        const user = req.user;

        res.status(200).json({
            user,
            message: "Profile Fetched Successfully"
        });
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    }
};