import { OpenAPIV3 } from "openapi-types";
import { isArraySchemaObject, isReferenceObject } from "./typeguards";
import { getObjectTypeFromSchema } from "./schemas";

export const parseComponents = ({ components }: OpenAPIV3.Document<{}>) => {
  const schemas = components.schemas;

  return Object.entries(schemas).map(([name, description]) => parseComponent(name, description));
};

const parseComponent = (name: string, schema: OpenAPIV3.ReferenceObject | OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject) => {
  if (isReferenceObject(schema)) {
    return { name };
  } else if (isArraySchemaObject(schema)) {
    return parseArraySchemaObject(name, schema);
  } else {
    return parseNonArraySchemaObject(name, schema);
  }
};

function parseArraySchemaObject(name: string, schema: OpenAPIV3.ArraySchemaObject) {
  return { name };
}

function parseNonArraySchemaObject(name: string, schema: OpenAPIV3.NonArraySchemaObject) {
  const parsedProperties = Object.entries(schema.properties || {}).map(([propertyName, property]) => ({
    name: propertyName,
    type: getObjectTypeFromSchema(property),
  }));

  return {
    name,
    properties: parsedProperties,
  };
}
