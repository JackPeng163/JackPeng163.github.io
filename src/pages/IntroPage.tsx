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
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { suggestions } from "../assets/suggestions";
import { Suggestion } from "../assets/interfaces";

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const [radioValue, setRadioValue] = useState("1");
  const [decision, setDecision] = useState<Suggestion>({
    decision: "",
    criteria: [],
    options: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSuggestions = suggestions
    .filter((suggestion) =>
      suggestion.decision
        .toLowerCase()
        .includes(decision.decision.toLowerCase())
    )
    .slice(0, 10); // Show only 8 suggestions

  const handleDecision = (value: Suggestion) => {
    setDecision(value);
    setShowDropdown(
      value.decision.length > 0 || filteredSuggestions.length > 0
    );
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setDecision(suggestion);
    setShowDropdown(false);
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
              {["Home", "About", "Github", "Contact"].map((name, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={
                    radioValue === `${idx + 1}` ? "info" : "outline-info"
                  }
                  name="radio"
                  value={`${idx + 1}`}
                  checked={radioValue === `${idx + 1}`}
                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                  {name}
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
            <Dropdown
              show={showDropdown}
              onToggle={() => setShowDropdown(false)}
            >
              <Row>
                <InputGroup>
                  <Col xl={10}>
                    <Form.Control
                      type="text"
                      placeholder="Select or Input your decision"
                      aria-label="Decision Input"
                      value={decision.decision}
                      onChange={(e) =>
                        handleDecision({
                          decision: e.target.value,
                          criteria: [],
                          options: [],
                        })
                      }
                      onClick={() => setShowDropdown(true)}
                      className="mb-3"
                      style={{ color: "black" }}
                    />

                    <Dropdown.Menu
                      className="w-100"
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      {filteredSuggestions.map((suggestion, idx) => (
                        <Dropdown.Item
                          key={idx}
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          {suggestion.decision}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Col>
                  <Col xl={2}>
                    <Button
                      className="w-100"
                      variant="primary"
                      onClick={handleNextPage}
                    >
                      Get started
                    </Button>
                  </Col>
                </InputGroup>
              </Row>
            </Dropdown>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default IntroPage;
