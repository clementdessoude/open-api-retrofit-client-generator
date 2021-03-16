import { parse } from "./parser/openapi-parser";
import * as apiTemplate from "./templates/ApiClient.hbs";
import * as dtoTemplate from "./templates/Dto.hbs";
import { ParsedQuery } from "./parser/paths";
import * as fs from "fs";

function shouldAddCommas(queries: ParsedQuery[]) {
  return queries.map(query => {
    const { requestBodyDto, pathParameters, queryParameters } = query;

    const shouldAddCommaAfterPathParameter = pathParameters.length > 0 && (requestBodyDto !== undefined || queryParameters.length > 0);
    const shouldAddCommaAfterRequestBody = requestBodyDto !== undefined && queryParameters.length > 0;

    return { ...query, shouldAddCommaAfterPathParameter, shouldAddCommaAfterRequestBody };
  });
}

function createClient(fileName: string, outputFilePath: string) {
  let { queries = [], components = [] } = parse(fileName);

  queries = shouldAddCommas(queries);
  const className = "SubscriptionApiClient";

  fs.writeFile(
    `${outputFilePath}/${className}.java`,
    apiTemplate({ queries, className, apiPackage: "fr.bpifrance.client.subscription" }),
    function (err) {
      if (err) return console.log(err);
      console.log(`Creating ${className} !`);
    }
  );

  components.forEach(comp => createDto(comp, outputFilePath));
}

function createDto(comp: any, outputFilePath: string) {
  fs.writeFile(
    `${outputFilePath}/dtos/${comp.name}.java`,
    dtoTemplate({ ...comp, apiPackage: "fr.bpifrance.client.subscription.fr.bpifrance.client.subscription.dtos" }),
    function (err) {
      if (err) return console.log(err);
      console.log(`Creating ${comp.name} !`);
    }
  );
}

createClient("./simple.yml", "./examples/fr/bpifrance/client/subscription");
