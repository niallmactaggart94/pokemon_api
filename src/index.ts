import { startApp } from "./app";

startApp().catch((error) => {
  console.error(error, "startApp error");
  process.exit(1);
});
