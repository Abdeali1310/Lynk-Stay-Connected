/* eslint-disable react-refresh/only-export-components */
import { Box, Typography } from "@mui/material"
import AppLayout from "../components/layout/AppLayout"

const Home = () => {
  return (
    <Box bgcolor={"rgba(0,0,0,0.1)"} height={"100%"}>
      <Typography textAlign={"center"} variant="h4" p={"2rem"}>Select a friend to chat!</Typography>
    </Box>
  )
}

export default AppLayout()(Home)