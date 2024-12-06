import {PageTitle} from "@/app/components/pagetitle";

export default function Accounts() {
    return (
        <>
            <PageTitle title={`Applications Explorer`}/>
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-0">
                        <div className="card">
                            <div className="card-body"><h5 className="card-title">Top Accounts</h5>
                                <table id="accounts" className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col" className="text-center">Attached object</th>
                                        <th scope="col" className="text-center">Object ID</th>
                                        <th scope="col" className="text-end">Balance (CMTS)</th>
                                        <th scope="col" className="text-center">Fees TX</th>
                                        <th scope="col" className="text-center">Other TX</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td><a
                                            href="explorer/microchain/0x0000000000000000000000000000000000000000000000000000000000000000"
                                            className="mono">0x00000000 ⋯ 00</a></td>
                                        <td className="text-center">-</td>
                                        <td className="text-center">-</td>
                                        <td className="text-end">999 000 000.00</td>
                                        <td className="text-center">0</td>
                                        <td className="text-center">1</td>
                                    </tr>
                                    <tr>
                                        <td><a
                                            href="explorer/microchain/0x0000000000000000000000000000000000000000000000000000000000000000"
                                            className="mono">0x00000000 ⋯ 00</a></td>
                                        <td className="text-center">node</td>
                                        <td className="text-center"><a
                                            href="explorer/microchain/0x0000000000000000000000000000000000000000000000000000000000000000"
                                            className="mono">0x00000000 ⋯ 00</a></td>
                                        <td className="text-end">1 000 000.00</td>
                                        <td className="text-center">0</td>
                                        <td className="text-center">1</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <nav id="pagination"></nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}