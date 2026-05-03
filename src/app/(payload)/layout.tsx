/* THIS FILE IS GENERATED FROM THE PAYLOAD TEMPLATE. DO NOT EDIT.
 * Payload mounts its own admin UI here. The site's SiteHeader/SiteFooter
 * intentionally do not render under this route group.
 */
import config from "@payload-config";
import "@payloadcms/next/css";
import {
  RootLayout,
  handleServerFunctions,
  type ServerFunctionClient,
} from "@payloadcms/next/layouts";
import type { ReactNode } from "react";

import { importMap } from "./admin/importMap";
import "./custom.scss";

type Args = {
  children: ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
