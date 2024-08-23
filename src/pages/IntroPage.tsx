import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  ButtonGroup,
  Button,
  ToggleButton,
  Container,
} from "react-bootstrap";
import { motion } from "framer-motion";

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const [radioValue, setRadioValue] = useState("1");
  const radios = [
    { name: "Home", value: "1" },
    { name: "About", value: "2" },
    { name: "Github", value: "3" },
    { name: "Contact", value: "4" },
  ];
  const [decision, setDecision] = useState("");

  const handleDecision = (value: string) => {
    setDecision(value);
  };

  const handleNextPage = () => {
    navigate("/input-page", { state: { decision: decision } });
  };

  return (
    <div className="page-container text-center">
      <Container>
        <Row className="justify-content-center mb-3">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-100"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0)",
              opacity: 1,
            }}
          >
            <ButtonGroup className="bg-white rounded shadow-sm">
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={radioValue === radio.value ? "info" : "outline-info"}
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </motion.div>
        </Row>
        <Row className="justify-content-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center title"
          >
            Decision Copilot
          </motion.h1>
        </Row>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Row className="justify-content-center">
            <Col xs={12} md={8}>
              <p className="h5 mb-4" style={{ color: "black" }}>
                More rational, more precise, and more insightful. Decision
                Copilot will structure and simplify complex decision-making for
                you.
              </p>
            </Col>
          </Row>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Row className="justify-content-center">
            <Col xs={0} md={3}></Col>
            <Col xs={12} md={4}>
              <Form.Control
                type="text"
                placeholder="Select or Input your decision"
                aria-label="Decision Input"
                value={decision}
                onChange={(e) => handleDecision(e.target.value)}
                className="mb-3"
                style={{ color: "black" }}
              />
            </Col>
            <Col xs={6} md={2}>
              <Button
                className="w-100"
                variant="primary"
                onClick={handleNextPage}
              >
                Get started
              </Button>
            </Col>
            <Col xs={0} md={3}></Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

    
export default IntroPage;