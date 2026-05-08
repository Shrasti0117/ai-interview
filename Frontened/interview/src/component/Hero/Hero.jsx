import React from 'react'
import './Hero.css'
import hero_img from '../../assests/hero.jpg'
import { useNavigate } from 'react-router-dom';



const Hero = () => {

  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/interview-rounds");
  };

  return (
    <div className="hero">
       <section className="hero-section">
        <div className="hero-left">
          <h2>
            Master Your <span className="highlight">Engineering</span> Interview
            Skills
          </h2>
          <p>
            Practice with AI-powered interviews across HR, Technical, and Group
            Discussion rounds. Progress through beginner to advanced levels in
            all major engineering subjects.
          </p>

          <div className="button-group">
            <button className="btn-primary-1" onClick={handleStart}>Start Practicing</button>
            <button className="btn-secondary-1">Watch Demo</button>
          </div>

          <div className="stats">
            <div className="stat">
              <h3>3</h3>
              <p>Interview Rounds</p>
            </div>
            <div className="stat">
              <h3>8</h3>
              <p>Core Subjects</p>
            </div>
            <div className="stat">
              <h3>3</h3>
              <p>Difficulty Levels</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <img src={hero_img} alt="Interview Preparation" />
        </div>
      </section>
      </div>
  )
}

export default Hero
