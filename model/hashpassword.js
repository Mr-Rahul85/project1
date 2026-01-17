import bcrypt from "bcryptjs";

const password = "Rahul@2005@2003@BOB";
const saltRounds = 10;

const hash = await bcrypt.hash(password, saltRounds);
console.log(hash);
