import React, { useState } from 'react'

import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    EmailShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TelegramShareButton,
    EmailIcon,
    LinkedinIcon,
    RedditIcon,
    TelegramIcon,
} from 'react-share';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

const ShareButton = ({ shareUrl }) => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    };

    return (
        <>

            {/* Share Button */}
            <button
                style={{
                    alignSelf: 'center',
                    borderRadius: 12,
                    padding: '2px 10px',
                    backgroundColor: isDarkModeOn ? "white" : "black",
                    color: isDarkModeOn ? "black" : "white"
                }} onClick={handleShow}>
                Share
            </button>

            {/* Share Popup Modal */}
            <Modal show={show} onHide={handleClose} backdrop={false} centered style={{zIndex:50}}>
                <Modal.Header closeButton>
                    <Modal.Title>Share this video</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="d-flex justify-content-around mb-3 ">
                        <FacebookShareButton url={shareUrl} quote="Check out this video!">
                            <FacebookIcon size={35} round />
                        </FacebookShareButton>

                        <TwitterShareButton url={shareUrl} title="Check out this video!">
                            <TwitterIcon size={35} round />
                        </TwitterShareButton>

                        <WhatsappShareButton url={shareUrl}>
                            <WhatsappIcon size={35} round />
                        </WhatsappShareButton>

                        <EmailShareButton url={shareUrl}>
                            <EmailIcon size={35} round />
                        </EmailShareButton>

                        <LinkedinShareButton url={shareUrl}>
                            <LinkedinIcon size={35} round />
                        </LinkedinShareButton>

                        <RedditShareButton url={shareUrl}>
                            <RedditIcon size={35} round />
                        </RedditShareButton>

                        <TelegramShareButton url={shareUrl}>
                            <TelegramIcon size={35} round />
                        </TelegramShareButton>
                    </div>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" value={shareUrl} readOnly />
                        <button variant="outline-dark" onClick={copyToClipboard}>
                            Copy Link
                        </button>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ShareButton
