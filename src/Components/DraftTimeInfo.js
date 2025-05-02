import React from 'react';
import { Typography, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getDraftStatus } from '../utils/timeUtils';

const DraftTimeInfo = ({ creationTimeString }) => {
  const { creationTime, minutesLeft, isDraftActive } = getDraftStatus(creationTimeString);

  return (
    <Tooltip title={creationTime.format("DD MMM YYYY, hh:mm A")}>
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1,
          cursor: 'default',
          color: isDraftActive ? 'text.primary' : 'error.main',
        }}
      >
        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
        Draft time available
        {isDraftActive ? ` — ${minutesLeft} min left` : ' — expired'}
      </Typography>
    </Tooltip>
  );
};

export default DraftTimeInfo;
