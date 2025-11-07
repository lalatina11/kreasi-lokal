import db from "..";
import categorySeeder from "./categorySeeder";
import productSeeder from "./productSeeder";
import userSeeder from "./userSeeder";

const main = async () => {
  await userSeeder();
  await categorySeeder();
  await productSeeder()
};

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .then(() => {
    db.$client.end();
  });
