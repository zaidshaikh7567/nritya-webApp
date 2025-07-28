'use client'

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ClientHeader = dynamic(() => import('../../components/ClientHeader'), {
  ssr: false
});

const ClientFooter = dynamic(() => import('../../components/ClientFooter'), {
  ssr: false
});

const NrityaPolicyPages = () => {
  const params = useParams();
  const router = useRouter();
  const selected = parseInt(params.selected) || 0;
  const [selectedTab, setSelectedTab] = useState(selected);

  const policies = {
    privacyPolicy: {
      title: "Privacy Policy",
      effectiveDate: "2nd Sept 2024",
      content: [
        "1. Introduction\nWelcome to Nritya! We are committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of information that you may provide through our website and services. By using our website, you agree to the terms outlined in this policy.",
        "2. Information We Collect\nWe may collect the following types of information from users:",
        "\ta. Personal Information:\n\tThis includes any information that can be used to identify you personally, such as your name, email address, phone number, and billing information when you register, book a workshop, or contact us.",
        "\tb. Non-Personal Information:\n\tWe collect information that does not directly identify you. This may include usage data, browser type, operating system, device information, and IP addresses.",
        "\tc. Payment Information:\n\tIf you make a purchase through our platform, we may collect your payment information, including credit card numbers or other financial data. However, payment transactions are processed by third-party payment processors, and we do not store your credit card information.",
        "3. How We Use Your Information\n\tWe use the information we collect for the following purposes:\n\tTo provide and manage our services: Including processing bookings, managing accounts, and providing customer support.\n\tTo communicate with you: Sending confirmations, updates, promotional materials, and responding to your inquiries.\n\tTo improve our services: Analyzing usage patterns to enhance our website, services, and user experience.\n\tTo comply with legal obligations: Including fraud prevention, enforcement of our terms of service, and other legal requirements.",
        "4. Sharing Your Information\n\tWe do not sell, rent, or trade your personal information to third parties. However, we may share your information in the following circumstances:\n\tWith service providers: We may share information with third-party vendors who perform services on our behalf, such as payment processing, email delivery, and marketing.\n\tWith business partners: We may share information with our partners who co-sponsor events or workshops.\n\tFor legal reasons: If required by law, regulation, or legal request, or if necessary to protect the rights, property, or safety of our company, users, or others.",
        "5. Cookies and Tracking Technologies\nWe use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us recognize you, remember your preferences, and improve our website's functionality. You can control cookies through your browser settings, but some features of our website may not function properly if cookies are disabled.",
        "6. Data Security\nWe take reasonable steps to protect your personal information from unauthorized access, use, or disclosure. However, no Internet transmission is entirely secure, and we cannot guarantee the security of your information.",
        "7. Third-Party Links\nOur website may contain links to third-party websites. We are not responsible for the privacy practices or content of these sites. We encourage you to read the privacy policies of any third-party sites you visit.",
        "8. Your Rights\nDepending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or restrict our use of your data. To exercise these rights, please contact us at [nritya@nritya.co.in].",
        "9. Changes to This Privacy Policy\nWe may update this Privacy Policy periodically. We will notify you of any changes by posting the new policy on our website and updating the 'Effective Date' at the top. We encourage you to review this policy regularly.",
        "10. Contact Us\nIf you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:\nNritya (NrityaTech Solutions Pvt. Ltd.)",
        "\n\nEmail: nritya@nritya.co.in\nPhone: 6392074436"
      ]
    },
    termsConditions: {
      title: "Terms and Conditions",
      effectiveDate: "2nd Sept 2024",
      content: [
        "Welcome to Nritya! These Terms and Conditions (\"Terms\") govern your use of our website and services. By accessing or using our website, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use our services.",
        "1. Use of Our Website and Services\nBy using our website, you represent that you are at least 18 years old or have the consent of a parent or guardian to use our services. You agree to use our website and services only for lawful purposes and in accordance with these Terms.",
        "2. Account Registration\nTo book workshops or use certain features of our website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.",
        "3. Workshop Bookings\nAll bookings made through our website are subject to availability and confirmation. We reserve the right to cancel or refuse any booking for any reason, including but not limited to errors in pricing or availability.",
        "4. Payment\nPayment for workshops must be made at the time of booking or to the organizers directly. We accept various payment methods, and you agree to provide accurate and complete payment information. All transactions are processed securely, and we do not store your credit card information.",
        "5. Changes to Workshops\nStudios reserve the right to make changes to workshop schedules, instructors, and venues. We will notify you of any significant changes as soon as possible.",
        "6. Intellectual Property\nAll content on our website, including text, graphics, logos, and images, is the property of Nritya or our content suppliers and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on our website without our prior written consent.",
        "7. Limitation of Liability\nTo the fullest extent permitted by law, Nritya shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our website or services.",
        "8. Indemnification\nYou agree to indemnify and hold Nritya, its affiliates, and their respective officers, directors, employees, and agents harmless from any claims, losses, liabilities, damages, costs, or expenses (including reasonable attorneys' fees) arising out of or related to your use of our website or services, your violation of these Terms, or your violation of any rights of another.",
        "9. Governing Law\nThese Terms shall be governed by and construed in accordance with the laws without regard to its conflict of law principles.",
        "10. Changes to These Terms\nWe reserve the right to update or modify these Terms at any time. We will notify you of any changes by posting the new Terms on our website. Your continued use of our website and services following the posting of any changes constitutes acceptance of those changes.",
        "11. Contact Us\nIf you have any questions or concerns about these Terms, please contact us at:\nNritya (NrityaTech Solutions Pvt. Ltd.)",
        "\n\nEmail: nritya@nritya.co.in\nPhone: 6392074436"
      ]
    },
    cancellationRefundPolicy: {
      title: "Cancellation and Refund Policy",
      effectiveDate: "2nd Sept 2024",
      content: [
        "At Nritya, we aim to provide a seamless booking experience for our customers. This Cancellation and Refund Policy outlines our policies regarding cancellations and refunds for workshop bookings.",
        "1. Cancellation by Customers\nNo Cancellations: Currently, we do not allow customers to cancel their bookings once confirmed. All sales are final, and no refunds will be issued for changes in personal circumstances or any other reason.",
        "2. Cancellation by Nritya or Studios\n",
        "\ta. Studio or Nritya Cancellations: \n\tIf a workshop is canceled by Nritya or the studio due to unforeseen circumstances, we will notify you as soon as possible. In such cases, a full refund will be issued to your original payment method.\n",
        "\tb. Responsibility: \n\tWe are not responsible for any additional costs or expenses you may incur due to the cancellation of a workshop.",
        "3. Refund Process\nProcessing Time: Refunds will be processed within 15 business days of notification of a workshop cancellation by Nritya or the studio.\nRefund Method: Refunds will be issued to the original payment method used at the time of booking.",
        "4. Non-Refundable Fees\nFees: Any service fees, transaction fees, or processing fees are non-refundable unless the workshop is canceled by Nritya or the studio.",
        "5. Contact Us\nIf you have any questions or need assistance regarding cancellations or refunds, please contact our customer support team at:\nNritya (NrityaTech Solutions Pvt. Ltd.)",
        "\n\nEmail: nritya@nritya.co.in\nPhone: 6392074436"
      ]
    },
    serviceDeliveryPolicy: {
      title: "Service Delivery and Booking Confirmation Policy",
      effectiveDate: "2nd Sept 2024",
      content: [
        "This Service Delivery and Booking Confirmation Policy outlines how we manage the booking process for free trial classes and workshops on Nritya, and what you can expect after making a booking.",
        "1. Booking Confirmation\n\tUpon successfully booking a free trial class or paid workshop, you will receive a confirmation email containing details of your booking, including the date, time, location, and any special instructions; however, booking confirmation depends solely on the studios.\n\tIf you do not receive a confirmation email within 24 hours, please check your spam folder or contact our support team.",
        "2. Accessing Services\n\tFor free trial classes, you will receive details on how to attend the class, including any necessary instructions or materials.\n\tFor paid workshops, you will receive detailed information on how to access the workshop, including venue details or virtual meeting links if the workshop is online.",
        "3. Cancellations and Changes\n\tIf there are any changes or cancellations to your booking, we will notify you via email as soon as possible. In case of a cancellation, please refer to our Cancellation and Refund Policy for details on refunds.\n\tYou can also manage your bookings through your account on our website.",
        "4. Support and Assistance\n\tIf you have any issues accessing your booked classes or workshops, please contact our support team at nritya@nritya.co.in or call us at 6392074436 for assistance.",
        "5. Contact Us\nFor any further questions regarding our Service Delivery and Booking Confirmation Policy, please reach out to us at:\nNritya (NrityaTech Solutions Pvt. Ltd.)",
        "\n\nEmail: nritya@nritya.co.in\nPhone: 6392074436"
      ]
    }
  };

  useEffect(() => {
    const selectedTabValue = parseInt(selected) || 0;
    if (selectedTabValue >= 0 && selectedTabValue <= 3) {
      setSelectedTab(selectedTabValue);
    } else {
      setSelectedTab(0);
    }
  }, [selected]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    router.push(`/npolicies/${newValue}`);
  };

  const getEffectiveDate = () => {
    switch (selectedTab) {
      case 0: return policies.privacyPolicy.effectiveDate;
      case 1: return policies.termsConditions.effectiveDate;
      case 2: return policies.cancellationRefundPolicy.effectiveDate;
      case 3: return policies.serviceDeliveryPolicy.effectiveDate;
      default: return '';
    }
  };

  const getPolicyContent = () => {
    switch (selectedTab) {
      case 0: return policies.privacyPolicy.content;
      case 1: return policies.termsConditions.content;
      case 2: return policies.cancellationRefundPolicy.content;
      case 3: return policies.serviceDeliveryPolicy.content;
      default: return [];
    }
  };

  const effectiveDate = getEffectiveDate();
  const policyContent = getPolicyContent();

  const renderPolicyContent = () => {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ fontStyle: 'italic', textTransform: 'none', mb: 3 }}>
          Effective Date: {effectiveDate}
        </Typography>

        {policyContent.map((paragraph, index) => {
          const segments = paragraph.split('\n');

          return (
            <div key={index} style={{ whiteSpace: 'pre-wrap', marginTop: '16px' }}>
              {segments.map((segment, segmentIndex) => {
                const isNumberedList = /^\d+\.\s/.test(segment);
                const isLetteredList = /^\s*[a-z]\.\s/.test(segment);

                let fontSize = 'inherit';
                let fontWeight = 'normal';

                if (isNumberedList) {
                  fontSize = '1.2rem';
                  fontWeight = 'bold';
                } else if (isLetteredList) {
                  fontSize = '1.1rem';
                  fontWeight = 'bold';
                }

                return (
                  <Typography
                    key={segmentIndex}
                    variant="body1"
                    sx={{
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              centered
              aria-label="policy tabs"
              sx={{
                mb: 4,
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }
              }}
            >
              <Tab label="Privacy Policy" />
              <Tab label="Terms & Conditions" />
              <Tab label="Cancellation & Refund" />
              <Tab label="Service Delivery" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {renderPolicyContent()}
            </Box>
          </Box>
        </Container>
      </main>
      <ClientFooter />
    </div>
  );
};

export default NrityaPolicyPages; 