import db from "..";
import { tables } from "../tables";

const userDestroyer = async () => {
  await db.delete(tables.user);
  console.log("Success to delete all users");
};

export default userDestroyer;
