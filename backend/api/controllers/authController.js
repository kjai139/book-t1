

exports.auth_check_get = async (req, res) => {
    if (req.user) {
        res.json({
            user: req.user
        })
    }
}