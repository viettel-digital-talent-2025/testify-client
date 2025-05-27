import { HttpMethod } from "@/scenarios/types/config";

export const getMethodColor = (method: HttpMethod) => {
  switch (method) {
    case HttpMethod.GET:
      return "green";
    case HttpMethod.POST:
      return "blue";
    case HttpMethod.PUT:
      return "purple";
    case HttpMethod.PATCH:
      return "orange";
    case HttpMethod.DELETE:
      return "red";
    case HttpMethod.OPTIONS:
      return "cyan";
    case HttpMethod.HEAD:
      return "purple";
    case HttpMethod.TRACE:
      return "gold";
    default:
      return "default";
  }
};
