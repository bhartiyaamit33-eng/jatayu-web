"use client";

import React, { useEffect, useState } from "react";
import { Link, toast, useAuth, useConfig } from "@payloadcms/ui";
import { requests } from "@payloadcms/ui/utilities/api";
import { formatAdminURL } from "payload/shared";

type PendingItem = {
  id: string;
  kind: "collection" | "global";
  slug: string;
  title: string;
  reviewStatus: string;
  updatedAt?: string;
  adminPath: string;
};

export function ReviewQueue() {
  const { user } = useAuth();
  const { config } = useConfig();
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    routes: { admin: adminRoute, api: apiRoute },
  } = config;

  useEffect(() => {
    if (user?.role !== "super_admin") {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const pending: PendingItem[] = [];

        for (const collection of config.collections) {
          if (!collection.versions?.drafts) continue;
          const response = await requests.get(
            formatAdminURL({
              apiRoute,
              path: `/${collection.slug}?where[reviewStatus][equals]=pending_review&limit=50&depth=0`,
            }),
          );
          if (!response.ok) continue;
          const json = (await response.json()) as {
            docs?: Record<string, unknown>[];
          };
          for (const doc of json.docs ?? []) {
            pending.push({
              id: String(doc.id),
              kind: "collection",
              slug: collection.slug,
              title:
                (doc.title as string | undefined) ??
                (doc.name as string | undefined) ??
                (doc.headline as string | undefined) ??
                String(doc.id),
              reviewStatus: String(doc.reviewStatus),
              updatedAt: doc.updatedAt as string | undefined,
              adminPath: formatAdminURL({
                adminRoute,
                path: `/collections/${collection.slug}/${doc.id}`,
              }),
            });
          }
        }

        for (const global of config.globals) {
          if (!global.versions?.drafts) continue;
          const response = await requests.get(
            formatAdminURL({ apiRoute, path: `/globals/${global.slug}?depth=0` }),
          );
          if (!response.ok) continue;
          const doc = (await response.json()) as Record<string, unknown>;
          if (doc.reviewStatus !== "pending_review") continue;
          pending.push({
            id: global.slug,
            kind: "global",
            slug: global.slug,
            title:
              typeof global.label === "string"
                ? global.label
                : global.slug,
            reviewStatus: String(doc.reviewStatus),
            updatedAt: doc.updatedAt as string | undefined,
            adminPath: formatAdminURL({
              adminRoute,
              path: `/globals/${global.slug}`,
            }),
          });
        }

        setItems(pending);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not load review queue",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [adminRoute, apiRoute, config.collections, config.globals, user?.role]);

  if (user?.role !== "super_admin") {
    return (
      <div className="jatayu-review-queue">
        <p>Only super admins can access the review queue.</p>
      </div>
    );
  }

  return (
    <div className="jatayu-review-queue">
      <h1>Review queue</h1>
      <p>Drafts submitted by editors waiting for your approval.</p>

      {loading ? <p>Loading…</p> : null}

      {!loading && items.length === 0 ? (
        <p>No items are waiting for review.</p>
      ) : null}

      {!loading && items.length > 0 ? (
        <ul className="jatayu-review-queue__list">
          {items.map((item) => (
            <li key={`${item.kind}-${item.slug}-${item.id}`}>
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.kind === "global" ? "Global" : "Collection"} ·{" "}
                  {item.slug}
                </p>
                {item.updatedAt ? (
                  <p>Updated {new Date(item.updatedAt).toLocaleString()}</p>
                ) : null}
              </div>
              <Link href={item.adminPath} prefetch={false}>
                Review & publish
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
