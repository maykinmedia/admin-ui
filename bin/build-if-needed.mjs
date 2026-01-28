import child_proces from "child_process";
import fs from "fs";

if (!fs.existsSync("dist")) {
  console.log("Building package...");
  child_proces.execSync("npm run build", {
    stdio: "inherit",
  });
}
