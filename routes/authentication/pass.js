module.exports = function(passport, LocalStrategy){
  //DB connection for user db
  var mongoose = require('mongoose');
  var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');

  var UserSchema = require('../../models/user');
  var UserModel = db.model('user', UserSchema);

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      var bcrypt = require('bcryptjs');

      UserModel.findOne({ username_lower: username.toLowerCase() }, function(err, user) {
        if (err) { return done(err);  }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.pass_hash, function(err, res) {
          if(err) return done(null, false, { message: 'Error occurred.' });

          if(res == false){
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user, { message: 'Success' });
        });

      });
    }
  ));
};
