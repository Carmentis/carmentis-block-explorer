'use client'

import {MicroBlock} from "@/app/interfaces/getMasterBlockResponse";
import {Formatters} from "@/app/utils/formatters";
import Link from "next/link";

export default function TableMicroBlocks(input: { blocks: MicroBlock[] }) {

    return (
        <table id="masterBlockBody" className="table">
            <thead>
            <tr>
                <th scope="col">Micro Block</th>
                <th scope="col" className="text-center">Index</th>
                <th scope="col" className="text-center">Offset</th>
                <th scope="col">Micro Chain</th>
                <th scope="col">Object type</th>
                <th scope="col" className="text-center">Nonce</th>
                <th scope="col">Size</th>
                <th scope="col" className="text-center">Sections</th>
            </tr>
            </thead>
            <tbody>
                {
                    input.blocks.length === 0 &&
                    <tr>
                        <td colSpan={8}>(no entry)</td>
                    </tr>
                }
                {
                input.blocks.length !== 0 &&
                    <>
                    {input.blocks.map((block: MicroBlock) => {
                        return <tr key={block.nonce}>
                            <td><Link
                                href={"/explorer/microblock?blockId=" + Formatters.formatHash(block.hash)}
                                className="mono">{
                                    Formatters.reduceHashSize(
                                        Formatters.formatHash(block.hash)
                                    )
                                }</Link></td>
                            <td className="text-center">--</td>
                            <td className="text-center">--</td>
                            <td>
                                <Link
                                href={"/explorer/virtualBlockchain?chainId=" + Formatters.formatHash(block.microChainId)}
                                className="mono">{Formatters.formatHash(block.microChainId)}</Link></td>
                            <td>Virtual Blockchain</td>
                            <td className="text-center">{block.nonce}</td>
                            <td>{Formatters.formatByteSize(block.size)}</td>
                            <td className="text-center">{block.nSection}</td>
                        </tr>
                    })
                    }
                    </>
                }
            </tbody>
        </table>
    );
}