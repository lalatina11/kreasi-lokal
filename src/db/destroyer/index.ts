import db from "..";
import userDestroyer from "./userDestroyer";

const main = async () => {
  await userDestroyer();
};

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .then(async () => {
    await db.$client.end();
  });
