import bcrypt from "bcrypt";
(async () => {
  const hashedPassword = await bcrypt.hash("Nepal@123", 10);
  console.log(hashedPassword);
})();
