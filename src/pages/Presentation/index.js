/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Images
import bgImage from "assets/images/bg-presentation.jpg";
import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MKButton from "components/MKButton";

function Presentation() {
  const [data, setData] = useState([]);
  const [dataOld, setDataOld] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [manipulatedData, setManipulatedData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          "http://103.175.217.173:8080/api/v1/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          setData(result.data);
          setDataOld(result.data);
        } else {
          console.error("Failed to fetch data", result);
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    fetchDataLeader();
  }, []);

  const fetchDataLeader = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(
        "http://103.175.217.173:8080/api/v1/leaderboard",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setLeaderboard(result.data);
      } else {
        console.error("Failed to fetch data", result);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleItemClick = (item, index) => {
    const newData = [...data];
    const newManipulatedData = [...manipulatedData];

    // Remove the clicked item from data and add it to manipulatedData
    newData.splice(index, 1);
    newManipulatedData.push(item);

    setData(newData);
    setManipulatedData(newManipulatedData);
  };

  const handleItemClickManipulate = (item, index) => {
    const newData = [...data];
    const newManipulatedData = [...manipulatedData];

    // Remove the clicked item from manipulatedData and add it back to data
    newManipulatedData.splice(index, 1);
    newData.push(item);

    setData(newData);
    setManipulatedData(newManipulatedData);
  };

  const handleSubmitScore = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const data = manipulatedData.map((item) => item.id);

    try {
      const response = await fetch(
        "http://103.175.217.173:8080/api/v1/points",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_ids: data }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setManipulatedData([]);
        fetchDataLeader();
        setData(dataOld);
      } else {
        console.error("Failed to fetch data", result);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <MKBox
        minHeight='75vh'
        width='100%'
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid
            container
            item
            xs={12}
            lg={12}
            justifyContent='center'
            mx='auto'
          >
            {leaderboard?.map((item, index) => (
              <Grid
                flexDirection={"row"}
                key={index}
                pt={5}
                container
                item
                xs={12}
                lg={6}
                justifyContent='center'
                mx='auto'
              >
                <HorizontalTeamCard
                  image='https://picsum.photos/200'
                  position={{ color: "info", label: "Rank " + (index + 1) }}
                  description={`Total Points: ${item.TotalPoint}`}
                  key={item.id}
                  name={item.Name}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) =>
            rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox pt={5} pb={6}>
          {manipulatedData?.map((item, index) => (
            <Grid
              onClick={() => handleItemClickManipulate(item, index)}
              pt={5}
              container
              item
              xs={12}
              lg={7}
              justifyContent='center'
              mx='auto'
            >
              <HorizontalTeamCard
                image='https://picsum.photos/200'
                position={{ color: "info", label: "Player" }}
                description='Capsa Gamer Competition'
                key={item.id}
                name={item.name}
              />
            </Grid>
          ))}
        </MKBox>
        {manipulatedData.length > 0 && (
          <MKBox mt={4} mb={1}>
            <MKButton
              onClick={handleSubmitScore}
              variant='gradient'
              color='info'
              fullWidth
            >
              Submit Score
            </MKButton>
          </MKBox>
        )}
        <MKBox pt={5} pb={6}>
          {data?.map((item, index) => (
            <Grid
              onClick={() => handleItemClick(item, index)}
              pt={5}
              container
              item
              xs={12}
              lg={7}
              justifyContent='center'
              mx='auto'
            >
              <HorizontalTeamCard
                image='https://picsum.photos/200'
                position={{ color: "info", label: "Player" }}
                description='Capsa Gamer Competition'
                key={item.id}
                name={item.name}
              />
            </Grid>
          ))}
        </MKBox>
      </Card>
    </>
  );
}

export default Presentation;
