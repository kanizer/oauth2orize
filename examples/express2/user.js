/**
 * Module dependencies.
 */
var passport = require('passport')

exports.info = function(req, res, next) {
  passport.authenticate('bearer', { session: false }, function(err, obj, info) {
    // req.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`.  It is typically used to indicate scope of the token,
    // and used in access control checks.  For illustrative purposes, this
    // example simply returns the scope in the response.
    return res.json({ user_id: req.user.id, name: req.user.name, scope: info.scope })
  })(req, res, next)
}

