import { AlternateEmail, CalendarToday, Face } from "@mui/icons-material";
import { Avatar, Stack, Typography } from "@mui/material";
import moment from "moment";

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={"kiadjiniaqn"} Icon={""}/>
      <ProfileCard heading={"Username"} text={"me_abc"} Icon={<AlternateEmail />}/>
      <ProfileCard heading={"Name"} text={"Mr. ABC"} Icon={<Face />}/>
      <ProfileCard heading={"Joined"} text={moment('2024-05-05T00:00:00.000Z').fromNow()} Icon={<CalendarToday />}/>
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color={"white"}
      textAlign={"center"}
    >

        {Icon && Icon}

        <Stack>
            <Typography variant="body1">{text}</Typography>
            <Typography color={"gray"} variant="caption">{heading}</Typography>
        </Stack>
    </Stack>
  );
};

export default Profile;
