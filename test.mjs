console.log("RDP installed version:");
import fs from "fs"
console.log(JSON.parse(fs.readFileSync("node_modules/react-day-picker/package.json", "utf8")).version);
