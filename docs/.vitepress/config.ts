import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FediMod FIRES",
  description: "Fediverse moderation Intelligence Replication Endpoint Server",
  head: [
    ["meta", { property: "og:image", content: "/opengraph-banner.png" }],
    [
      "meta",
      {
        property: "og:image:alt",
        content:
          "FediMod FIRES - Fediverse Intelligence Replication Endpoint Server. A protocol and reference server implementation for storing and distributing moderation advisories and recommendations over time for the Fediverse.",
      },
    ],
    ["meta", { property: "og:image:width", content: "1024" }],
    ["meta", { property: "og:image:height", content: "512" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "FediMod FIRES" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Fediverse moderation Intelligence Replication Endpoint Server",
      },
    ],
  ],
  transformPageData(pageData) {
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push([
      "meta",
      {
        property: "og:title",
        content:
          pageData.frontmatter.layout === "home"
            ? `FediMod FIRES`
            : `${pageData.title} | FediMod FIRES`,
      },
    ]);
  },
  themeConfig: {
    footer: {
      message:
        'Released under the <a href="https://github.com/fedimod/fires/blob/main/LICENSE">AGPL License</a>.',
      copyright:
        'Copyright © 2024 <a href="/contributors/">FediMod FIRES Project</a>',
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Concepts", link: "/concepts/", activeMatch: "^/concepts" },
      {
        text: "Protocol Reference",
        link: "/reference/protocol/",
        activeMatch: "^/reference/protocol",
      },
      { text: "Conformance Tests", link: "/reference/testing/" },
      { text: "Reference Server Manual", link: "/manuals/reference-server/" },
      /*{
        text: "Manuals",
        activeMatch: "^/manuals",
        items: [
          {
            text: "Reference Server",
            link: "/manuals/reference-server/",
          },
          /* {
            text: "Example Provider",
            link: "/manuals/example-provider/",
          },
          {
            text: "Example Consumer",
            link: "/manuals/example-consumer/",
          },
          * /
        ],
      },*/
    ],

    sidebar: {
      "/concepts/": [
        {
          text: "Concepts",
          link: "/concepts/",
          items: [
            {
              text: "Federation Management",
              link: "/concepts/federation-management",
            },
            {
              text: "Managing Changes",
              link: "/concepts/changes",
              items: [
                {
                  text: "Advisories",
                  link: "/concepts/changes/advisories",
                },
                {
                  text: "Recommendations",
                  link: "/concepts/changes/recommendations",
                },
                { text: "Retractions", link: "/concepts/changes/retractions" },
                { text: "Tombstones", link: "/concepts/changes/tombstones" },
              ],
            },
            { text: "Entities", link: "/concepts/entities" },
            { text: "Filters", link: "/concepts/filters" },
            { text: "Labels", link: "/concepts/labels" },
          ],
        },
        {
          text: "Definitions",
          items: [
            {
              text: "Data Provider",
              link: "/concepts/terms/data-provider",
            },
            {
              text: "Data Consumer",
              link: "/concepts/terms/data-consumer",
            },
            {
              text: "Label Provider",
              link: "/concepts/terms/label-provider",
            },
          ],
        },
        {
          text: "Project Background",
          items: [
            {
              text: "Introduction",
              link: "/concepts/background/",
            },
            {
              text: "Goals & Objectives",
              link: "/concepts/background/goals-and-objectives",
            },
            {
              text: "Historical Context",
              link: "/concepts/background/historical-context",
            },
            {
              text: "Prior Art",
              link: "/concepts/background/prior-art",
            },
            {
              text: "Why Not&hellip;?",
              link: "/concepts/background/why-not",
            },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Protocol Reference",
          items: [
            {
              text: "Introduction",
              link: "/reference/protocol/",
            },
            {
              text: "Data Model",
              items: [
                {
                  text: "Labels",
                  link: "/reference/protocol/data-model/labels",
                },
                {
                  text: "Datasets",
                  link: "/reference/protocol/data-model/datasets",
                },
                {
                  text: "Changes",
                  link: "/reference/protocol/data-model/changes",
                },
              ],
            },
            {
              text: "API",
              items: [
                {
                  text: "Labels",
                  link: "/reference/protocol/api/labels",
                },
                {
                  text: "Datasets",
                  link: "/reference/protocol/api/datasets",
                },
              ],
            },
          ],
        },
        {
          text: "Protocol Tooling",
          items: [
            {
              text: "Conformance Tests",
              link: "/reference/testing/",
            },
          ],
        },
      ],

      "/manuals/": [
        {
          text: "Reference Server Manual",
          items: [
            {
              text: "Installation",
              link: "/manuals/reference-server/",
            },
            {
              text: "Enviroment Variables",
              link: "/manuals/reference-server/environment",
            },
          ],
        },
        /*{
          text: "Example Provider",
          items: [
            {
              text: "Introduction",
              link: "/manuals/example-provider/",
            },
          ],
        },
        {
          text: "Example Consumer",
          items: [
            {
              text: "Introduction",
              link: "/manuals/example-consumer/",
            },
          ],
        },*/
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/fedimod/fires" },
      { icon: "mastodon", link: "https://mastodon.social/@fedimod" },
    ],
  },
});
