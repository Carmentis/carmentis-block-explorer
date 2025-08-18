import {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {useSearchParams} from "next/navigation";


export default function SearchBar({search, updateSearch}: {search: string, updateSearch: (search: string) => void}) {

    return <TextField
        fullWidth
        variant={"standard"}
        placeholder={"Search"}
        value={search}
        onChange={e => updateSearch(e.target.value)}
    />
}

