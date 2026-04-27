import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faChevronRight, faBook } from "@fortawesome/free-solid-svg-icons";
import "./Content.css";

const API_URL = "http://localhost:5001/api/admin";

const Content = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Form states
  const [newSubject, setNewSubject] = useState({ title: "", icon: "faBook", color: "#e0edff", iconColor: "#2563eb" });
  const [newQuestion, setNewQuestion] = useState({ questionText: "", difficulty: "Medium" });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuestions(selectedSubject._id);
    }
  }, [selectedSubject]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/subjects`, getAuthHeader());
      setSubjects(res.data.data);
      if (res.data.data.length > 0 && !selectedSubject) {
        setSelectedSubject(res.data.data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching subjects", err);
      setLoading(false);
    }
  };

  const fetchQuestions = async (subjectId) => {
    try {
      const res = await axios.get(`${API_URL}/questions/${subjectId}`, getAuthHeader());
      setQuestions(res.data.data);
    } catch (err) {
      console.error("Error fetching questions", err);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/subjects`, newSubject, getAuthHeader());
      setShowSubjectModal(false);
      fetchSubjects();
    } catch (err) {
      alert("Error adding subject");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("Delete this subject and all its questions?")) {
      try {
        await axios.delete(`${API_URL}/subjects/${id}`, getAuthHeader());
        fetchSubjects();
        if (selectedSubject?._id === id) setSelectedSubject(null);
      } catch (err) {
        alert("Error deleting subject");
      }
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await axios.put(`${API_URL}/questions/${editingQuestion._id}`, newQuestion, getAuthHeader());
      } else {
        await axios.post(`${API_URL}/questions`, { ...newQuestion, subjectId: selectedSubject._id }, getAuthHeader());
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      setNewQuestion({ questionText: "", difficulty: "Medium" });
      fetchQuestions(selectedSubject._id);
    } catch (err) {
      alert("Error saving question");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Delete this question?")) {
      try {
        await axios.delete(`${API_URL}/questions/${id}`, getAuthHeader());
        fetchQuestions(selectedSubject._id);
      } catch (err) {
        alert("Error deleting question");
      }
    }
  };

  if (loading) return <div className="loading">Loading content...</div>;

  return (
    <div className="content-container">
      <div className="content-header">
        <h1>Content Management</h1>
        <button className="add-btn" onClick={() => setShowSubjectModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Subject
        </button>
      </div>

      <div className="management-layout">
        <div className="subjects-list">
          <h3>Subjects</h3>
          {subjects.map((sub) => (
            <div
              key={sub._id}
              className={`subject-item ${selectedSubject?._id === sub._id ? "active" : ""}`}
              onClick={() => setSelectedSubject(sub)}
            >
              <div className="subject-info">
                <FontAwesomeIcon icon={faBook} style={{ color: sub.iconColor }} />
                <span>{sub.title}</span>
              </div>
              <div className="action-btns">
                 <button className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteSubject(sub._id); }}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <FontAwesomeIcon icon={faChevronRight} className="chevron" />
              </div>
            </div>
          ))}
        </div>

        <div className="questions-section">
          <div className="section-header">
            <h3>Questions for {selectedSubject?.title}</h3>
            {selectedSubject && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="icon-btn delete-btn" style={{ padding: '8px 12px', border: '1px solid #fee2e2' }} onClick={() => handleDeleteSubject(selectedSubject._id)}>
                  <FontAwesomeIcon icon={faTrash} /> Delete Subject
                </button>
                <button className="add-btn" onClick={() => setShowQuestionModal(true)}>
                  <FontAwesomeIcon icon={faPlus} /> Add Question
                </button>
              </div>
            )}
          </div>

          <div className="questions-list">
            {questions.length === 0 ? (
              <p className="no-data">No questions found for this subject.</p>
            ) : (
              questions.map((q) => (
                <div key={q._id} className="question-card">
                  <div className="question-content">
                    <p className="question-text">{q.questionText}</p>
                    <div className="question-meta">
                      <span className={`difficulty-badge difficulty-${q.difficulty}`}>{q.difficulty}</span>
                    </div>
                  </div>
                  <div className="action-btns">
                    <button className="icon-btn edit-btn" onClick={() => { setEditingQuestion(q); setNewQuestion({ questionText: q.questionText, difficulty: q.difficulty }); setShowQuestionModal(true); }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDeleteQuestion(q._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Subject</h2>
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Subject Title</label>
                <input type="text" placeholder="e.g. Advanced Networking" value={newSubject.title} onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })} required />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div>
                  <label>Brand Color</label>
                  <input type="color" value={newSubject.iconColor} onChange={(e) => setNewSubject({ ...newSubject, iconColor: e.target.value })} />
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '20px' }}>This color will represent your subject across the platform.</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowSubjectModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Add Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingQuestion ? "Edit Question" : "Add New Question"}</h2>
            <form onSubmit={handleAddQuestion}>
              <div className="form-group">
                <label>Question Text</label>
                <textarea rows="4" value={newQuestion.questionText} onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select value={newQuestion.difficulty} onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => { setShowQuestionModal(false); setEditingQuestion(null); }}>Cancel</button>
                <button type="submit" className="submit-btn">{editingQuestion ? "Save Changes" : "Add Question"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
