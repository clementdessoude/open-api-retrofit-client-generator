import { OpenAPIV3 } from "openapi-types";

export function isParameterObject(
  parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject
): parameter is OpenAPIV3.ParameterObject {
  return (parameter as OpenAPIV3.ParameterObject).in !== undefined;
}

export function isReferenceObject(
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject | OpenAPIV3.ResponseObject | OpenAPIV3.SchemaObject
): schema is OpenAPIV3.ReferenceObject {
  return schema !== undefined && (schema as OpenAPIV3.ReferenceObject)["$ref"] !== undefined;
}

export function isArraySchemaObject(
  schema: OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject
): schema is OpenAPIV3.ArraySchemaObject {
  return schema !== undefined && (schema as OpenAPIV3.ArraySchemaObject).items !== undefined;
}
