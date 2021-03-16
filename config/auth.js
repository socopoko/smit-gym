module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please login to view this resource');
        res.redirect('/users/login');
    },
    ensureAdmin: function (req, res, next) {
        if(req.user.admin) {
            return next();
        }
        req.flash('error_msg', 'You are not authorized to perform this operation');
        res.redirect('/dashboard');
    }
}