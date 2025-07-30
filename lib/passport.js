import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import pool from './db';
import bcrypt from 'bcrypt';

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return done(null, false, { message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;
