import { OpenAPIV3 } from "openapi-types";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { parsePaths } from "./paths";
import { parseComponents } from "./components";

export function parse(fileName: string) {
  try {
    let fileContents = fs.readFileSync(fileName, "utf8");
    let data = yaml.load(fileContents) as OpenAPIV3.Document;

    return {
      components: parseComponents(data),
      queries: parsePaths(data),
    };
  } catch (e) {
    console.log(e);
  }
}
