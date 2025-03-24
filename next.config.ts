import type { NextConfig } from "next";
import {makeEnvPublic} from "next-runtime-env";

makeEnvPublic("NODE_URL")
const nextConfig: NextConfig = {
  /* config options here */
    env: {
        NEXT_PUBLIC_NODE_URL: process.env.NODE_URL
    }
};

export default nextConfig;
