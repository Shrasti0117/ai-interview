import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward, faPercent, faClock, faList, faMoneyBill, faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import './aptitude1.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const topics = [
  { id: 1, title: "SpeedDistance", desc: "Problems involving speed, time, and distance calculations", questions: 6, level: "Medium", icon: faForward },
  { id: 2, title: "Percentage", desc: "Percentage calculations and applications", questions: 5, level: "Easy", icon: faPercent },
  { id: 3, title: "WorkTime", desc: "Work efficiency and time management problems", questions: 3, level: "Medium", icon: faClock },
  { id: 4, title: "NumberSeries", desc: "Pattern recognition and sequence problems", questions: 4, level: "Hard", icon: faList },
  { id: 5, title: "ProfitLoss", desc: "Business mathematics and profit calculations", questions: 4, level: "Medium", icon: faMoneyBill },
  { id: 6, title: "RatioProportion", desc: "Ratio, proportion, and comparison problems", questions: 5, level: "Easy", icon: faBalanceScale },
];

export default function Aptitude1 () {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleTopic = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const totalQuestions = selected.reduce(
    (sum, id) => sum + topics.find((t) => t.id === id).questions,
    0
  );

  const getQuestions = async () => {
    if (selected.length === 0) return alert("Please select at least one topic");

    let allQuestions = [];
    try {
      for (const id of selected) {
        const topicTitle = topics.find(t => t.id === id).title;
        const res = await axios.get(`http://localhost:5001/api/questions?topic=${topicTitle}`);
        allQuestions = [...allQuestions, ...res.data];
      }

      const selectedTitles = selected.map(id => topics.find(t => t.id === id).title);
      navigate("/aptitude2", { state: { questions: allQuestions, topics: selectedTitles } });

    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to fetch questions from server");
    }
  };

  return (
    <div className="aptitude1">
      <div className="select-topics-page">
        <div className="select-topic">
          <h2>Select Test Topics</h2>
          <p>
            Choose the topics you want to be tested on. You can select multiple
            topics to create a customized aptitude test.
          </p>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="selected-count">
            <span>{selected.length}</span> Topics Selected
          </div>
          <div>
            <span>{totalQuestions}</span> Total Questions
          </div>
          <div>
            <span>{totalQuestions * 2}</span> Estimated Time (min)
          </div>
        </div>

        {/* Topics */}
        <div className="topics-grid">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`topic-card ${selected.includes(topic.id) ? "selected" : ""}`}
            >
              <FontAwesomeIcon icon={topic.icon} className="topic-icon" />
              <h4>{topic.title}</h4>
              <p>{topic.desc}</p>
              <div className="topic-meta">
                <span>{topic.questions} questions</span>
                <span className={`level ${topic.level.toLowerCase()}`}>
                  {topic.level}
                </span>
              </div>
              <input
                type="checkbox"
                checked={selected.includes(topic.id)}
                onChange={() => toggleTopic(topic.id)}
              />
            </div>
          ))}
        </div>


        <button onClick={getQuestions}>Start Test</button>
      </div>
    </div>
  );
}
