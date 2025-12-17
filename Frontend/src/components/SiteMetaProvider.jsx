import React, { useEffect } from "react";
import axios from "axios";
import { server } from "../server";

const CONFIG_URL = `${server}/settings/config`;

const SiteMetaProvider = ({ children }) => {
  useEffect(() => {
    async function fetchSiteMeta() {
      try {
        const res = await axios.get(CONFIG_URL);
        const data = res.data.data;

        // Set document title
        if (data.appName) document.title = data.appName;

        // Set meta description
        let descTag = document.querySelector('meta[name="description"]');
        if (!descTag) {
          descTag = document.createElement('meta');
          descTag.name = "description";
          document.head.appendChild(descTag);
        }
        descTag.content = data.homepageContent?.description || "";

        // Set favicon
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = data.appIcon || "/favicon.ico";
      } catch (err) {
        console.error("Failed to fetch site meta", err);
      }
    }
    fetchSiteMeta();
  }, []);

  return <>{children}</>;
};

export default SiteMetaProvider;
