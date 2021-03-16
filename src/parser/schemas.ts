import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "./typeguards";

export function getObjectTypeFromSchema(schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) {
  if (isReferenceObject(schema)) {
    const schemaRef = schema["$ref"];
    const schemaRefResponse = schemaRef.split("/");
    return schemaRefResponse && schemaRefResponse[schemaRefResponse.length - 1];
  }

  switch (schema.type) {
    case "integer":
      return "Long";
    case "string":
      return "String";
    case "boolean":
      return "Boolean";
    default:
      console.error(`Unsupported parameter type: ${schema.type}`);
      return "Object";
  }
}
