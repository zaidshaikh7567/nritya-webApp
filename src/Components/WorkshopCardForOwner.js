import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Stack, Chip, Tooltip, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DraftTimeInfo from "./DraftTimeInfo"; 
import { formatDateToReadable, getDraftStatus } from '../utils/timeUtils';
import  Dance8  from '../Components/DanceImg/Dance8.jpg';
import { STORAGES } from "../constants";

const WorkshopCardForOwner = ({ workshop, isDarkModeOn, onEdit, onDelete, readDocumentWithImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(Dance8);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      const url = await readDocumentWithImageUrl(STORAGES.WORKSHOPICON, workshop.workshop_id);
      setImageUrl(url);
    };
    fetchImage();
  }, [workshop.workshop_id, readDocumentWithImageUrl]);

  return (
    <Card sx={{ background: isDarkModeOn ? '#333' : '#fafafa' }}>
      <img
        src={imageUrl || "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
        alt={workshop.name}
      />
      <CardContent>
        <Typography variant="h6" style={{ textTransform: 'none' }}>{workshop.name}</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {workshop.dance_styles?.split(",").map((form, i) => (
            <Chip key={i} label={form} size="small" />
          ))}
        </Stack>

        <Typography variant="body2" mt={1}>{workshop.city} | {formatDateToReadable(workshop.start_date)}</Typography>
        <Typography variant="h6" mt={1}>₹{workshop.min_price}</Typography>
        <hr />
        {workshop.creation_time && <DraftTimeInfo creationTimeString={workshop.creation_time} />}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Tooltip title={getDraftStatus(workshop.creation_time) ? "Edit workshop" : "Draft time expired"}>
            <span>
              <Button
                variant="outlined"
                onClick={() => onEdit(workshop)}
                disabled={!getDraftStatus(workshop.creation_time).isDraftActive}
              >
                Edit
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={getDraftStatus(workshop.creation_time) ? "Delete workshop" : "Draft time expired"}>
            <span>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(workshop)}
                disabled={!getDraftStatus(workshop.creation_time).isDraftActive}
              >
                Delete
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" color="info" onClick={() => navigate(`/workshopFullDetails2/${workshop?.workshop_id}`)}>
            Full Page
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => navigate(`/workshopRevenue/${workshop?.workshop_id}`)}
          >
            Revenue
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WorkshopCardForOwner;
