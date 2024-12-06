import {PageTitle} from "@/app/components/pagetitle";

export default function Accounts() {
    return (
        <>
            <PageTitle title={`Nodes Explorer`}/>
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-0">
                        <div className="card">
                            <div className="card-body"><h5 className="card-title">Nodes</h5>
                                <table id="nodes" className="table"></table>
                                <nav id="pagination"></nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}