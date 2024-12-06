'use client'


import {PageTitle} from "@/app/components/pagetitle";

export default function Home() {
    return (
        <>
            <PageTitle title={"Applications Explorer"}/>
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-0">
                        <div className="card">
                            <div className="card-body"><h5 className="card-title">Applications</h5>
                                <table id="applications" className="table"></table>
                                <nav id="pagination"></nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    );
}
