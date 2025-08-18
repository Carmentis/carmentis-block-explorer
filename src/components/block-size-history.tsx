import React, {useEffect, useMemo, useRef, useState} from "react";
import {BarChart} from "@mui/x-charts";
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";
import {BlockchainFacade} from "@cmts-dev/carmentis-sdk/client";
import useLatestBlockHeight from "@/hooks/useLatestBlockHeight";
import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { useTheme } from "@mui/material/styles";

type MicroblocksPerHeight = { height: number; microblocks: number };

const CONCURRENCY = 8;
const ACCOUNTED_BLOCKS_NUMBER = 100;

export default function BlockSizeHistory() {
    const endpoint = useAtomValue(networkAtom);
    const { lastBlockHeight, loading } = useLatestBlockHeight();
    const theme = useTheme();
    const router = useRouter();

    const client = useMemo(
        () => (endpoint ? BlockchainFacade.createFromNodeUrl(endpoint) : null),
        [endpoint]
    );

    // Map<height, microblocks>
    const [dataMap, setDataMap] = useState<Map<number, number>>(new Map());
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Empêche les doublons de fetch pendant qu’une hauteur est déjà en cours
    const inFlight = useRef<Set<number>>(new Set());

    // Reset cache si l’endpoint change
    useEffect(() => {
        setDataMap(new Map());
        setError(null);
        inFlight.current.clear();
    }, [client]);

    // Fetch incrémental lorsque la hauteur évolue
    useEffect(() => {
        if (loading || !client || lastBlockHeight.isNone()) return;

        const latest = lastBlockHeight.unwrap();
        const startHeight = Math.max(1, latest - ACCOUNTED_BLOCKS_NUMBER + 1);
        const endHeight = latest;

        const targetHeights: number[] = Array.from(
            { length: endHeight - startHeight + 1 },
            (_, i) => startHeight + i
        );

        // Filtrer les hauteurs manquantes (non en cache et pas déjà en cours)
        const missing = targetHeights.filter(
            (h) => !dataMap.has(h) && !inFlight.current.has(h)
        );

        if (missing.length === 0) {
            // Rien à charger; on purge seulement les entrées hors fenêtre
            setDataMap((prev) => {
                let changed = false;
                const next = new Map(prev);
                for (const h of prev.keys()) {
                    if (h < startHeight || h > endHeight) {
                        next.delete(h);
                        changed = true;
                    }
                }
                return changed ? next : prev;
            });
            return;
        }

        let cancelled = false;
        setFetching(true);
        setError((e) => e); // ne change rien, mais garde la référence si déjà présente

        // Marque toutes les hauteurs "manquantes" comme en cours
        missing.forEach((h) => inFlight.current.add(h));

        const fetchOne = async (h: number): Promise<MicroblocksPerHeight | null> => {
            try {
                const content = await client.getBlockContent(h);
                return { height: h, microblocks: content.numberOfContainedMicroBlocks() };
            } catch (e: unknown) {
                console.error("Error loading block", h, e);
                setError("Error loading history.");
                return null;
            }
        };

        (async () => {
            try {
                for (let i = 0; i < missing.length && !cancelled; i += CONCURRENCY) {
                    const batch = missing.slice(i, i + CONCURRENCY);
                    const batchResults = await Promise.all(batch.map(fetchOne));

                    if (cancelled) break;

                    setDataMap((prev) => {
                        const next = new Map(prev);
                        for (const res of batchResults) {
                            if (res) {
                                next.set(res.height, res.microblocks);
                            }
                        }
                        // Purge des hauteurs qui sortent de la fenêtre
                        for (const h of next.keys()) {
                            if (h < startHeight || h > endHeight) {
                                next.delete(h);
                            }
                        }
                        return next;
                    });

                    // Libère les in-flight de ce lot
                    batch.forEach((h) => inFlight.current.delete(h));
                }
            } finally {
                // S’assure de libérer tous les in-flight en cas d’annulation
                if (cancelled) {
                    missing.forEach((h) => inFlight.current.delete(h));
                }
                if (!cancelled) setFetching(false);
            }
        })();

        return () => {
            cancelled = true;
            setFetching(false);
        };
    }, [client, loading, lastBlockHeight]);

    // État d’attente: pas d’endpoint ou pas encore de hauteur
    if (!client || loading || lastBlockHeight.isNone()) {
        return <div>Chargement de l’historique des tailles…</div>;
    }

    // Prépare les données du graphe sous forme de fenêtre glissante
    const latest = lastBlockHeight.unwrap();
    const startHeight = Math.max(1, latest - ACCOUNTED_BLOCKS_NUMBER + 1);
    const endHeight = latest;
    const xData = Array.from({ length: endHeight - startHeight + 1 }, (_, i) => startHeight + i);
    const yData = xData.map((h) => {
        const v = dataMap.get(h);
        // null autorise une valeur manquante en cours de fetch; sinon vous pouvez utiliser 0
        return v ?? null;
    });

    return (
        <div style={{ position: "relative" }}>
            <BarChart
                xAxis={[
                    {
                        scaleType: "band",
                        data: xData,
                        label: "Bloc",
                    },
                ]}
                series={[
                    {
                        data: yData,
                        label: "Micro-blocs",
                        color: theme.palette.secondary.main,
                        valueFormatter: (v) => (v == null ? 'Chargement…' : `${v} micro-bloc${v === 1 ? '' : 's'}`),
                    },
                ]}
                height={320}
                grid={{ vertical: true, horizontal: true }}
                borderRadius={6}
                onItemClick={(_, item) => {
                    const height = xData[item.dataIndex];
                    router.push(routes.explorer.block(height));
                }}
                slotProps={{
                    bar: { style: { cursor: 'pointer', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' } },
                }}
            />
            {fetching && (
                <div
                    style={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        background: "rgba(255,255,255,0.9)",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        border: "1px solid #ddd",
                    }}
                >
                    Updating...
                </div>
            )}
            {error && (
                <div style={{ marginTop: 8, color: "#b91c1c", fontSize: 12 }}>
                    {error}
                </div>
            )}
        </div>
    );
}