import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) return done(null, false, { message: "User not found" });

      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword)
        return done(null, false, { messsage: "Password is incorrect" });

      return done(null, user);
    } catch (e) {
      done(e);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("We are inside serializing function");
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  console.log("We are inside deserializing function");
  try {
    const user = await User.findById(_id);

    done(null, user);
  } catch (e) {
    done(user);
  }
});
