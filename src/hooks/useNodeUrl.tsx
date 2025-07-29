import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";

export function useNodeUrl() {
    const node = useAtomValue(networkAtom);
    return node;
}