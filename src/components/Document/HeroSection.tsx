import React, { Fragment } from "react";
// next
import Image from "next/image";
import NextLink from "next/link";
// mui components
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link as MuiLink } from "@mui/material";
// styles, interface and config
import config from "@src/utils/config";
import useGlobalStyle from "@src/styles";
import { DocumentFunc } from "./interfaceType";
// app components
// icons
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";

const HeroSection: DocumentFunc = ({
  id,
  name,
  authors,
  subscriberCount,
  description,
  fileUrl = "#",
}) => {
  const globalStyle = useGlobalStyle();

  return (
    <Fragment>
      <Box
        component="section"
        className="hero-section"
        sx={{ pt: 4, pb: 8, px: { md: 6 } }}
      >
        <Container maxWidth="xl">
          <Typography mb={1} paragraph>
            <Typography variant="h6" component="span">
              Publication ID
            </Typography>{" "}
            {id}
          </Typography>
          <Typography mb={1} variant="h3" component="h1">
            {name}
          </Typography>
          <Stack direction="row" spacing={2} mt={0}>
            <Typography paragraph display="flex" alignItems="center">
              <PeopleOutlineOutlinedIcon color="primary" /> {subscriberCount}{" "}
              Readers
            </Typography>
          </Stack>
          <Stack
            mt={3}
            mb={1}
            spacing={4}
            direction={{ xs: "column", md: "row" }}
          >
            <Typography variant="h6">Author(s):</Typography>
            <Stack direction="row" flexWrap="wrap" justifyContent="start">
              {authors?.map(({ name, imageUrl }, index) => (
                <Stack
                  mr={4}
                  mb={1}
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  key={index + "author"}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Image
                      alt="user"
                      layout="fill"
                      objectFit="contain"
                      src={imageUrl || "/images/avatar.png"}
                    />
                  </Avatar>
                  <Typography paragraph>{name}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
          <Typography my={1} paragraph>
            {description}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              color="secondary"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              Save
            </Button>
          </Stack>
          <Box mt={2}>
            <NextLink passHref href={fileUrl}>
              <Button
                download
                size="large"
                disableElevation
                variant="contained"
                component={MuiLink}
                className={globalStyle.bgGradient}
                display={{ xs: "block", sm: "inline-block" }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <FileDownloadOutlinedIcon /> &nbsp; Download
                </Stack>
              </Button>
            </NextLink>
          </Box>
        </Container>
      </Box>
    </Fragment>
  );
};
export default HeroSection;
