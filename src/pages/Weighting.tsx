import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Table,
  Form,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";
import { ItemList as itemListType, Item } from "../assets/interfaces";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./InputPage.css";
import { calculateConsistency } from "../assets/calculateConsistency";
import {
  calculateSingleResult,
  calculateFinalResult,
} from "../assets/calculateAHP";
import { BarColors, BorderColors } from "../assets/barColors";

const Weighting: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const decision = location.state?.decision ?? "No decision provided";

  const itemList: itemListType = location.state?.itemList ?? {
    criteria: [],
    options: [],
  };

  const criteriaNumber = itemList.criteria.length;
  const optionsNumber = itemList.options.length;

  const [criteriaWeights, setCriteriaWeights] = useState<number[][]>(
    Array(criteriaNumber).fill(Array(criteriaNumber).fill(1))
  );

  const [optionsWeights, setOptionsWeights] = useState<
    { item: Item; weights: number[][] }[]
  >(
    itemList.criteria.map((criterion) => ({
      item: criterion,
      weights: Array(optionsNumber).fill(Array(optionsNumber).fill(1)),
    }))
  );

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string[]>([]);

  useEffect(() => {
    const newAlertMessage: string[] = [];

    // Check if Criteria consistency exceeds the threshold
    if (calculateConsistency(criteriaWeights) > 0.1) {
      newAlertMessage.push("Criteria");
    }

    // Check if any item in the criteria exceeds the threshold
    itemList.criteria.forEach((item: Item) => {
      if (calculateConsistency(optionsWeights[item.id].weights) > 0.1) {
        newAlertMessage.push(item.name);
      }
    });

    // Update the alert message and showAlert state
    if (newAlertMessage.length > 0) {
      setAlertMessage(newAlertMessage);
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [criteriaWeights, optionsWeights, itemList.criteria]);

  console.log("decision", location.state);
  console.log("itemList", itemList);
  console.log("optionsWeights", optionsWeights);
  console.log("criteriaWeights", criteriaWeights);

  const handleCriteriaWeightChange = (
    item1: Item,
    item2: Item,
    value: number
  ) => {
    // Validate the input value: must be positive and non-zero
    const checkedValue = value > 0 ? value : 1;

    const newWeights = criteriaWeights.map((row, i) =>
      row.map((weight, j) => {
        if (i === item1.id && j === item2.id) {
          return checkedValue;
        } else if (i === item2.id && j === item1.id) {
          return 1 / checkedValue;
        } else {
          return weight;
        }
      })
    );

    setCriteriaWeights(newWeights);
  };

  const handleOptionsWeightChange = (
    criterion: Item,
    item1: Item,
    item2: Item,
    value: number
  ) => {
    const checkedValue = value > 0 ? value : 1;

    const newWeights = optionsWeights[criterion.id].weights.map((row, i) =>
      row.map((weight, j) => {
        if (i === item1.id && j === item2.id) {
          return checkedValue;
        } else if (i === item2.id && j === item1.id) {
          return 1 / checkedValue;
        } else {
          return weight;
        }
      })
    );

    setOptionsWeights(
      optionsWeights.map((form, i) =>
        i === criterion.id ? { item: criterion, weights: newWeights } : form
      )
    );
  };

  const formatNumber = (num: number) => {
    return parseFloat(num.toFixed(2));
  };

  const tabs = [
    {
      name: "Criteria",
      html: itemList.criteria.map((item1: Item) => (
        <tr key={item1.id}>
          <td>
            {item1.name === "" ? "Criterion " + (item1.id + 1) : item1.name}
          </td>
          {itemList.criteria.map((item2: Item) => (
            <td key={item2.id}>
              {item1.id === item2.id ? (
                <Form.Control value="1" disabled />
              ) : (
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={formatNumber(criteriaWeights[item1.id][item2.id])}
                  onChange={(e) =>
                    handleCriteriaWeightChange(
                      item1,
                      item2,
                      parseFloat(e.target.value)
                    )
                  }
                  onClick={() => handleFormControlClick(item1, item2)}
                />
              )}
            </td>
          ))}
        </tr>
      )),
      consistency: calculateConsistency(criteriaWeights),
    },
    ...itemList.criteria.map((criterion: Item) => ({
      name:
        criterion.name === ""
          ? "Criterion " + (criterion.id + 1)
          : criterion.name,
      html: itemList.options.map((item1: Item) => (
        <tr key={item1.id}>
          <td>{item1.name === "" ? "Option " + (item1.id + 1) : item1.name}</td>
          {itemList.options.map((item2: Item) => (
            <td key={item2.id}>
              {item1.id === item2.id ? (
                <Form.Control value="1" disabled />
              ) : (
                <Form.Control
                  type="number"
                  value={formatNumber(
                    optionsWeights.find((form) => form.item.id === criterion.id)
                      ?.weights[item1.id][item2.id] || 1
                  )}
                  onChange={(e) =>
                    handleOptionsWeightChange(
                      criterion,
                      item1,
                      item2,
                      parseFloat(e.target.value)
                    )
                  }
                  onClick={() => handleFormControlClick(item1, item2)}
                />
              )}
            </td>
          ))}
        </tr>
      )),
      consistency: calculateConsistency(optionsWeights[criterion.id].weights),
    })),
  ];

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const criteriaData = {
    labels: itemList.criteria.map((criterion) =>
      criterion.name === "" ? `Criterion ${criterion.id + 1}` : criterion.name
    ),
    datasets: [
      {
        label: "Criterion Weight",
        data: calculateSingleResult(criteriaWeights),
        backgroundColor: BarColors.slice(0, itemList.criteria.length),
        borderColor: BorderColors.slice(0, itemList.criteria.length),
        borderWidth: 1,
      },
    ],
  };

  const criteriaOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Criteria Weights",
      },
    },
  };

  const optionsData = {
    labels: itemList.options.map((option) =>
      option.name === "" ? `Option ${option.id + 1}` : option.name
    ),
    datasets: itemList.criteria.map((criterion, index) => ({
      label:
        criterion.name === ""
          ? `Criterion ${criterion.id + 1}`
          : criterion.name,
      data: calculateSingleResult(optionsWeights[index].weights),
      backgroundColor: BarColors[index],
      borderColor: BorderColors[index],
      borderWidth: 1,
    })),
  };

  const optionsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Option's Weights by Criterion",
      },
    },
  };

  const criteriaResults = optionsWeights.map((form) => ({
    criterionId: form.item.id,
    optionResults: calculateSingleResult(form.weights),
  }));

  const finalResults = calculateFinalResult(
    criteriaResults,
    calculateSingleResult(criteriaWeights)
  );

  const finalData = {
    labels: itemList.options.map((option) =>
      option.name === "" ? `Option ${option.id + 1}` : option.name
    ),
    datasets: [
      {
        label: "Final Weighted Score",
        data: finalResults,
        backgroundColor: BarColors.slice(0, itemList.options.length),
        borderColor: BorderColors.slice(0, itemList.options.length),
        borderWidth: 1,
      },
    ],
  };

  const resultChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Final Results",
      },
    },
  };

  const [hoverItem1, setHoverItem1] = useState("");
  const [hoverItem2, setHoverItem2] = useState("");
  const [titleDisplay, setTitleDisplay] = useState(false);
  const handleFormControlClick = (item1: Item, item2: Item) => {
    setHoverItem1(item1.name);
    setHoverItem2(item2.name);
    setTitleDisplay(true);
  };

  return (
    <div className="page-container">
      <Container>
        <Row className="mb-3">
          <Col xl={8}>
            <Card>
              <Card.Body>
                <Tabs
                  defaultActiveKey="Criteria"
                  id="weighting-tabs"
                  onClick={() => setTitleDisplay(false)}
                >
                  {tabs.map((tab, index) => (
                    <Tab key={index} eventKey={tab.name} title={tab.name}>
                      {titleDisplay ? (
                        <h3>
                          The importance of {hoverItem1} over {hoverItem2}
                        </h3>
                      ) : (
                        <h3>Pairwise Comparisons</h3>
                      )}
                      <ul>
                        <li>1 = Equal</li>
                        <li>3 = Moderate</li>
                        <li>5 = Strong</li>
                        <li>7 = Very Strong</li>
                        <li>9 = Extreme</li>
                      </ul>
                      <Table>
                        <thead>
                          <tr>
                            <th>{tab.name}</th>
                            {tab.name === "Criteria"
                              ? itemList.criteria.map((item: Item) => (
                                  <th key={item.id}>
                                    {item.name === ""
                                      ? "Criterion " + (item.id + 1)
                                      : item.name}
                                  </th>
                                ))
                              : itemList.options.map((item: Item) => (
                                  <th key={item.id}>
                                    {item.name === ""
                                      ? "Option " + (item.id + 1)
                                      : item.name}
                                  </th>
                                ))}
                          </tr>
                        </thead>
                        <tbody>{tab.html}</tbody>
                      </Table>
                      <p
                        style={{
                          color:
                            formatNumber(tab.consistency) > 0.1
                              ? "red"
                              : "black",
                        }}
                      >
                        Consistency: {formatNumber(tab.consistency)}
                      </p>
                    </Tab>
                  ))}
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4}>
            <Row className="mb-3">
              <Card>
                <Card.Body>
                  <Bar options={criteriaOptions} data={criteriaData} />
                </Card.Body>
              </Card>
            </Row>
            <Row>
              <Card>
                <Card.Body>
                  <Bar options={optionsChartOptions} data={optionsData} />
                </Card.Body>
              </Card>
            </Row>
          </Col>
        </Row>
        {showAlert ? (
          <Row>
            <Col>
              <Alert variant="danger">
                <Alert.Heading>
                  Error: The following items' consistency rate is over 0.1
                </Alert.Heading>
                <ul>
                  {alertMessage.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </Alert>
            </Col>
          </Row>
        ) : (
          <></>
        )}
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Bar options={resultChartOptions} data={finalData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Weighting;
