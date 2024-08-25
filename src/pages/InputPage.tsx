import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Card,
  ListGroup,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import { motion, useAnimation, Reorder } from "framer-motion";
import { faL, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "../assets/interfaces";
import "./InputPage.css";

const InputPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const decision = location.state?.decision ?? {
    message: "No decision provided",
  };

  const [criteriaSuggestions, setCriteriaSuggestions] = useState<string[]>(
    location.state?.decision.criteria
  );
  const [optionsSuggestions, setOptionsSuggestions] = useState<string[]>(
    location.state?.decision.options
  );
  const [criteria, setCriteria] = useState<Item[]>([]);
  const [criterionIdCounter, setCriterionIdCounter] = useState(0);
  const [options, setOptions] = useState<Item[]>([]);
  const [optionIdCounter, setOptionIdCounter] = useState(0);

  const [alertShow, setAlertShow] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleCriterionSuggestion = (name: string) => {
    const newCriteriaSuggestions = criteriaSuggestions.filter(
      (criterion) => criterion !== name
    );
    setCriteriaSuggestions(newCriteriaSuggestions);
    handleAddCriterion(name);
  };

  const handleAddCriterion = (name: string) => {
    const newCriterion: Item = {
      id: criterionIdCounter,
      name: name,
    };
    setCriteria([...criteria, newCriterion]);
    setCriterionIdCounter(criterionIdCounter + 1);
  };

  const handleCriterionChange = (id: number, name: string) => {
    setCriteria(
      criteria.map((criterion) =>
        criterion.id === id ? { ...criterion, name } : criterion
      )
    );
  };

  const handleRemoveCriterion = (id: number) => {
    const newCriteria = criteria.filter((criterion) => criterion.id !== id);
    setCriteria(newCriteria);
  };

  const handleOptionSuggestion = (name: string) => {
    const newOptionSuggestions = optionsSuggestions.filter(
      (option) => option !== name
    );
    setOptionsSuggestions(newOptionSuggestions);
    handleAddOption(name);
  };

  const handleAddOption = (name: string) => {
    const newOption: Item = {
      id: optionIdCounter,
      name: name,
    };
    setOptions([...options, newOption]);
    setOptionIdCounter(optionIdCounter + 1);
  };

  const handleOptionChange = (id: number, name: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, name } : option))
    );
  };

  const handleRemoveOption = (id: number) => {
    const newOptions = options.filter((option) => option.id !== id);
    setOptions(newOptions);
  };

  const handleNextPage = () => {
    if (criteria.length === 0) {
      setMessage("one criterion");
      setAlertShow(true);
    } else if (options.length < 2) {
      setMessage("two options");
      setAlertShow(true);
    } else {
      setAlertShow(false);
      criteria.forEach((criterion) => {
        for (let i in criterion)
          if (criterion[i] === "") {
            criterion[i] = "Criterion " + (criterion.id + 1);
          }
      });
      options.forEach((option) => {
        for (let i in option)
          if (option[i] === "") {
            option[i] = "Option " + (option.id + 1);
          }
      });
      navigate("/weighting", {
        state: {
          decision: decision,
          itemList: { criteria: criteria, options: options },
        },
      });
    }
  };

  return (
    <div className="page-container">
      <Container className="my-5">
        <Row>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="title text-center"
          >
            Welcome to Decision Copilot
          </motion.h1>
        </Row>
        <Row>
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className=""
          >
            In this page, define your criteria and options for decision:{" "}
            <strong>{decision.decision}</strong>
          </motion.h4>
        </Row>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Row>
            <Col>
              <Card style={{ minHeight: "100%" }}>
                <Card.Header>Criteria</Card.Header>
                <Card.Body>
                  <Card.Title>
                    Add your <strong>Criteria</strong> here!
                  </Card.Title>
                  <Card.Text>
                    This card helps you define and organize{" "}
                    <strong>criteria</strong> for the AHP process. Add, reorder,
                    or remove criteria as needed. Use suggested buttons if you
                    need inspiration to start.
                  </Card.Text>
                  {criteriaSuggestions.map((criterion, index) => (
                    <Button
                      variant="info"
                      style={{ maxHeight: "250px" }}
                      onClick={() => handleCriterionSuggestion(criterion)}
                      className="mb-2 me-2"
                    >
                      {criterion}
                    </Button>
                  ))}
                  <Row>
                    <Col>
                      <Button
                        onClick={() => handleAddCriterion("")}
                        variant="primary"
                      >
                        Add Your Own Criterion
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>
                    <Reorder.Group
                      axis="y"
                      values={criteria}
                      onReorder={setCriteria}
                      className="fixed-size-container"
                      style={{ height: "250px" }}
                    >
                      {criteria.length > 0 ? (
                        criteria.map((criterion) => (
                          <Reorder.Item
                            key={criterion.id}
                            value={criterion}
                            className="reorder-item shadow-sm p-2 mb-2 bg-light rounded d-flex justify-content-between align-items-center"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Enter criterion name"
                              className="mr-3"
                              value={criterion.name}
                              onChange={(e) =>
                                handleCriterionChange(
                                  criterion.id,
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleRemoveCriterion(criterion.id)
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </Reorder.Item>
                        ))
                      ) : (
                        <p className="text-center text-muted">
                          No criteria added yet.
                        </p>
                      )}
                    </Reorder.Group>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col>
              <Card style={{ minHeight: "100%" }}>
                <Card.Header>Options</Card.Header>
                <Card.Body>
                  <Card.Title>
                    Add your <strong>Options</strong> here!
                  </Card.Title>
                  <Card.Text>
                    This card helps you define and organize{" "}
                    <strong>options (alternatives)</strong> for the AHP process.
                    Add, reorder, or remove criteria as needed. Use suggested
                    buttons if you need inspiration to start.
                  </Card.Text>
                  {optionsSuggestions.map((option, index) => (
                    <Button
                      variant="info"
                      onClick={() => handleOptionSuggestion(option)}
                      className="mb-2 me-2"
                    >
                      {option}
                    </Button>
                  ))}
                  <Row>
                    <Col>
                      <Button
                        onClick={() => handleAddOption("")}
                        variant="primary"
                      >
                        Add Your Own Option
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>
                    <Reorder.Group
                      axis="y"
                      values={options}
                      onReorder={setOptions}
                      className="fixed-size-container"
                      style={{ height: "250px" }}
                    >
                      {options.length > 0 ? (
                        options.map((option) => (
                          <Reorder.Item
                            key={option.id}
                            value={option}
                            className="reorder-item shadow-sm p-2 mb-2 bg-light rounded d-flex justify-content-between align-items-center"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Enter option name"
                              className="mr-3"
                              value={option.name}
                              onChange={(e) =>
                                handleOptionChange(option.id, e.target.value)
                              }
                            />
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveOption(option.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </Reorder.Item>
                        ))
                      ) : (
                        <p className="text-center text-muted">
                          No option added yet.
                        </p>
                      )}
                    </Reorder.Group>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4 align-items-center">
            <Col xs={12} md={8} xl={6} className="d-flex justify-content-start">
              <Alert
                show={alertShow}
                key="danger"
                variant="danger"
                onClose={() => setAlertShow(false)}
                dismissible
                className="w-100"
              >
                Please enter at least <strong>{message}</strong> before
                proceeding.
              </Alert>
            </Col>
            <Col
              xs={12}
              md={4}
              xl={6}
              className="d-flex justify-content-end mt-md-0"
            >
              <Button
                onClick={handleNextPage}
                variant="primary"
                className="px-4 py-2"
              >
                Next Page
              </Button>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default InputPage;
