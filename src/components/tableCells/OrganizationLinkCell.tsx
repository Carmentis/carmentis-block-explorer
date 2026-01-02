import {Hash} from "@cmts-dev/carmentis-sdk/client";
import Link from "next/link";

type OrganizationLinkCellProps = {
    orgName: string,
    orgId: Hash
}

/**
 * This component is used to create a clickable link to access an organization
 */
export default function OrganizationLinkCell(orgProps: OrganizationLinkCellProps) {
    return    <Link href={`/organisations/${orgProps.orgId.encode()}`}>
        <p>{orgProps.orgName}</p>
    </Link>
}