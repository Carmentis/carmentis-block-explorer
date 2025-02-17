import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {useEffect} from "react";

export function NodeConnectionStatus() {
    const network = useAtomValue(networkAtom);
    /*
    const {isLoading, error, mutate} = useSWR(network);

    useEffect(() => {
        mutate()
    }, [network, mutate]);

    if (isLoading) return <>Loading...</>
    if (error) return <>:(</>
    return <>:)</>

     */
    return <></>
}