import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";
import "./Components.css";
import { STATUSES } from "./../constants.js";

export default function TrackingDetails({ status,kycId }) {
  const statuses = [
    { title: STATUSES.SUBMITTED, done: true },
    { title: STATUSES.UNDER_REVIEW, done: status !== STATUSES.SUBMITTED },
    { title: STATUSES.REVIEWED, done: status !== STATUSES.UNDER_REVIEW && status !== STATUSES.SUBMITTED },
    { title: STATUSES.VERIFIED, done: status === STATUSES.VERIFIED },
  ];
 console.log(statuses)
  return (
    <>
      <Container className="py-5 ">
        <Row className="justify-content-center align-items-center">
          <Col>
            <Card
              className="card-stepper"
              style={{ borderRadius: "10px" }}
            >
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex flex-column">
                    <span className="lead fw-normal">
                      Your application is {status}
                    </span>
                    <span className="text-muted small">
                      Kyc Id : {kycId}
                    </span>
                  </div>
                  
                </div>

                <hr className="my-4" />

                <div className="d-flex flex-row justify-content-between align-items-center align-content-center">
                  {statuses.map(({ title, done,index }) => (
                
                    <>
                    {title !=="Verified" ?(<>
                      <span className={`dot ${done ? "bg-success" : "bg-primary"}`}></span>
                      <hr className={`flex-fill track-line ${done ? "bg-success" : "bg-primary"}`} />
                      </>)
                      :
                      (<>
                      <span className="d-flex justify-content-center align-items-center big-dot dot bg-primary">
                            <CheckCircleFill className={` ${done ? "green-color" : "white-color"}`} />
                        </span>
                      </>)}
                    </>
                  ))}
                  
                </div>

                <div className="d-flex flex-row justify-content-between align-items-center">
                  {statuses.map(({ title }, index) => (
                    <div key={index} className="d-flex flex-column align-items-center">
                      <span className={status === title ? "fw-bold" : ""}>{title}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
