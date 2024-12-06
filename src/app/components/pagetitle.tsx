'use client'

export function PageTitle( input: { title: string } ) {
    return (
        <div className="pagetitle"><h1>{input.title}</h1>
            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item active">{input.title}</li>
                </ol>
            </nav>
        </div>
    );
}