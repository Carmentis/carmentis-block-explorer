'use client';

import {atom} from "jotai/index";
import {env} from "next-runtime-env";

//const DEFAULT_NETWORK = "http://localhost:3500"
const DEFAULT_NETWORK = "https://dev-node.beta.carmentis.io"
export const networkAtom = atom(
    env("NEXT_PUBLIC_NODE_URL") || DEFAULT_NETWORK
)