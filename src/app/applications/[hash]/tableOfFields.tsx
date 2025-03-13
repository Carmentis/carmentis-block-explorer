import {Field} from "../../../../../carmentis-core/dist/client";
import {GenericTable} from "@/app/components/generic-table";
import {Box, Chip, Typography} from "@mui/material";

export function TableOfFields(input: { fields: Field[] }) {
    return <>
        <GenericTable
            headers={['Name', "Category", "Property"]}
            rows={
                input.fields.map((field) => {
                    return [
                        <Typography key={0}>{field.getName()}</Typography>,
                        <Typography key={1}>{field.getFieldCategory()}</Typography>,
                        <>
                            <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                                {field.isArray() && <Chip label={"Array"}/>}
                                {field.isHashable() && <Chip label={"Hashable"}/>}
                                {field.isPublic() && <Chip label={"Public"}/>}
                                {field.isRequired() && <Chip label={"Required"}/>}
                            </Box>
                        </>
                    ]
                })
            }
        />
    </>
}