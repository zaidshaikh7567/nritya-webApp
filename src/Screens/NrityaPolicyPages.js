import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography,tabsClasses } from '@mui/material';
import policies from '../policies.json'; // Importing the policies JSON
import { useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

const NrityaPolicyPages = () => {
  const { selected } = useParams() || 0; 
  const [selectedTab, setSelectedTab] = useState(0);
  const [policyData, setPolicyData] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus); 
  useEffect(() => {
    setPolicyData(policies);
  }, []);

  useEffect(() => {
    const selectedTabValue = parseInt(selected) || 0; // Convert selected to an integer, default to 0 if NaN or undefined
    if (selectedTabValue >= 0 && selectedTabValue <= 3) {
      setSelectedTab(selectedTabValue); // Only allow valid values between 0 and 3
    } else {
      setSelectedTab(0); // Default to 0 if the value is out of range
    }
  }, [selected]);


  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const colorstyles = {
      color: isDarkModeOn ? 'white' : 'black',
  };
  const renderPolicyContent = () => {
    if (!policyData) return null;

    const getEffectiveDate = () => {
        switch (selectedTab) {
            case 0: return policyData.privacyPolicy.effectiveDate;
            case 1: return policyData.termsConditions.effectiveDate;
            case 2: return policyData.cancellationRefundPolicy.effectiveDate;
            case 3: return policyData.serviceDeliveryPolicy.effectiveDate;
            default: return '';
        }
    };

    const getPolicyContent = () => {
        switch (selectedTab) {
            case 0: return policyData.privacyPolicy.content;
            case 1: return policyData.termsConditions.content;
            case 2: return policyData.cancellationRefundPolicy.content;
            case 3: return policyData.serviceDeliveryPolicy.content;
            default: return [];
        }
    };

    const effectiveDate = getEffectiveDate();
    const policyContent = getPolicyContent();

    return (
        <Box>
            <Typography variant="subtitle1" style={{ ...colorstyles, fontStyle: 'italic', textTransform: 'none' }}>
                Effective Date: {effectiveDate}
            </Typography>

            {policyContent.map((paragraph, index) => {
                // Split the paragraph by newline characters
                const segments = paragraph.split('\n');

                return (
                    <div key={index} style={{ ...colorstyles, whiteSpace: 'pre-wrap', marginTop: '16px' }}>
                        {segments.map((segment, segmentIndex) => {
                            // Check if the segment starts with a number or a letter
                            const isNumberedList = /^\d+\.\s/.test(segment); // Matches segments like "1. "
                            const isLetteredList = /^\s*[a-z]\.\s/.test(segment); // Matches segments like "a. "

                            let fontSize = 'inherit'; // Default font size
                            let fontWeight = 'normal'; // Default font weight

                            if (isNumberedList) {
                                fontSize = '1.2rem'; // Larger size for numbered lists
                                fontWeight = 'bold';
                            } else if (isLetteredList) {
                                fontSize = '1.1rem'; // Slightly larger size for lettered lists
                                fontWeight = 'bold';
                            }

                            return (
                                <Typography
                                    key={segmentIndex}
                                    variant="body1"
                                    style={{
                                        fontSize,
                                        fontWeight,
                                    }}
                                >
                                    {segment}
                                </Typography>
                            );
                        })}
                    </div>
                );
            })}
        </Box>
    );
};


  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        centered
        aria-label="visible arrows tabs example"
        sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
      >
        <Tab style={colorstyles} label="Privacy Policy" />
        <Tab style={colorstyles} label="Terms & Conditions" />
        <Tab style={colorstyles} label="Cancellation & Refund" />
        <Tab style={colorstyles} label="Service Delivery" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {renderPolicyContent()}
      </Box>
    </Box>
  );
};

export default NrityaPolicyPages;
