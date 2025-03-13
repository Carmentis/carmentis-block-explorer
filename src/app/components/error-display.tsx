import {Alert, AlertTitle, Box, Card, CardContent} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";


export const ErrorDisplay = ({error}: {error: unknown}) => {
    console.error(error)
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <Card sx={{maxWidth: 500, boxShadow: 3, textAlign: "center"}}>
                <CardContent>
                    <ErrorOutlineIcon color="error" sx={{fontSize: 50, mb: 2}}/>
                    <Alert severity="error">
                        <AlertTitle>An error occurred</AlertTitle>
                        {typeof error === "string" && error}
                        {typeof error !== "string" && "Unknown error"}
                    </Alert>
                </CardContent>
            </Card>
        </Box>
    );
};