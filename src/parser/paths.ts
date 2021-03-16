import { OpenAPIV3 } from "openapi-types";
import { lowercaseFirstLetter } from "./string-utils";
import { isParameterObject, isReferenceObject } from "./typeguards";
import { getObjectTypeFromSchema } from "./schemas";

export interface ParsedQuery {
  path: string;
  responseDto: string;
  pathParameters: { name: string; type: string }[];
  method: string;
  queryParameters: { name: string; type: string }[];
  methodName: any;
  requestBodyDtoName: string;
  requestBodyDto: string;
}

export function parsePaths(openApiConfig: OpenAPIV3.Document): ParsedQuery[] {
  const paths = Object.entries(openApiConfig.paths);

  return paths.flatMap(([path, routes]) =>
    Object.entries(routes).map(([method, description]) => {
      const requestBodyDto = getRequestBodyDto(description?.requestBody);
      const requestBodyDtoName = requestBodyDto ? lowercaseFirstLetter(requestBodyDto) : "";

      const responseDto = getResponseDto(description?.responses);

      const pathParameters = getPathParameter(description);
      const queryParameters = getQueryParameter(description);

      return {
        method: method.toUpperCase(),
        path,
        methodName: description.operationId,
        requestBodyDto,
        requestBodyDtoName,
        responseDto,
        pathParameters,
        queryParameters,
      };
    })
  );
}

function getPathParameter(description: OpenAPIV3.OperationObject) {
  const parameters = description.parameters;

  if (parameters === undefined) return [];

  return parameters
    .filter(isParameterObject)
    .filter(param => param.in === "path")
    .map(param => {
      return { name: param.name, type: getParameterType(param) };
    });
}

function getQueryParameter(description: OpenAPIV3.OperationObject) {
  const parameters = description.parameters;

  if (parameters === undefined) return [];

  return parameters
    .filter(isParameterObject)
    .filter(param => param.in === "query")
    .map(param => {
      return { name: param.name, type: getParameterType(param) };
    });
}

function getParameterType(parameter: OpenAPIV3.ParameterObject) {
  return getObjectTypeFromSchema(parameter.schema);
}

function getRequestBodyDto(requestBody: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject) {
  if (requestBody === undefined) return;

  if (isReferenceObject(requestBody)) {
    throw new Error("Error");
  }

  const schemaContent = requestBody.content["application/json"];

  if (schemaContent === undefined) return;

  return getObjectTypeFromSchema(schemaContent.schema);
}

function getResponseDto(responses: OpenAPIV3.ResponsesObject) {
  const okResponse = responses["200"] || responses["201"] || responses["204"];

  if (okResponse === undefined || isReferenceObject(okResponse)) {
    console.error("Error");
    return "Error";
  }

  if (okResponse.content) {
    return getObjectTypeFromSchema(okResponse?.content["*/*"]?.schema);
  } else {
    return "Void";
  }
}
