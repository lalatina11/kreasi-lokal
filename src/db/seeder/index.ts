import db from "..";
import userSeeder from "./userSeeder";

const main = async () => {
  await userSeeder();
};

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .then(() => {
    db.$client.end();
  });
