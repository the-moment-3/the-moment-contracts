import originData from "../_data/allow-list/1";
import { writeFileSync } from "fs";
import { join } from "path";

// 删除重复地址
const data: Record<string, number> = {};
for (let key in originData) {
  // @ts-ignore
  data[key] = data[key] || originData[key];
}

writeFileSync(
  join(__dirname, "../_data/allow-list/2/index.ts"),
  JSON.stringify(data)
);
