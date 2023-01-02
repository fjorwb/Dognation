const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const helper = require('../helpers/helper')

// Set up the Passport strategy:
passport.use(
	new LocalStrategy(function (username, password, done) {
		helper.findByUsername(username, async (error, user) => {
			if (error) {
				return done(error)
			}
			const match = await bcrypt.compare(password, user.password)
			if (!user || !match) {
				return done(null, false)
			}
			console.log('user', user)
			return done(null, user)
		})
	})
)

// Serialize a user
passport.serializeUser((user, done) => {
	done(null, user.id)
})

// Deserialize a user
passport.deserializeUser((id, done) => {
	helper.findById(id, function (error, user) {
		if (error) {
			return done(error)
		}
		return done(null, user)
	})
})
