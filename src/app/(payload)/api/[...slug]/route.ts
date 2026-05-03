/* THIS FILE IS GENERATED FROM THE PAYLOAD TEMPLATE. DO NOT EDIT.
 * Payload mounts its REST API here at /api/* (e.g. /api/users/login,
 * /api/posts, etc.). Our marketing /api/trial route is at /api/trial,
 * which Next routes BEFORE this catch-all because it's more specific.
 */
import config from "@payload-config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
