
'use client'

import { useState } from 'react'

export default function ResumeTailor() {
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [tailoredResume, setTailoredResume] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTailor = async () => {
    setLoading(true)
    setTailoredResume('')

    const response = await fetch('/api/tailor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resume, jobDescription }),
    })

    const data = await response.json()
    setTailoredResume(data.tailoredResume)
    setLoading(false)
  }

  return (
    <div>
      <div>
        <label htmlFor="resume">Your Resume</label>
        <textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="jobDescription">Job Description</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>
      <button onClick={handleTailor} disabled={loading}>
        {loading ? 'Tailoring...' : 'Tailor Your Resume'}
      </button>
      {tailoredResume && (
        <div>
          <h2>Tailored Resume</h2>
          <pre>{tailoredResume}</pre>
        </div>
      )}
    </div>
  )
}
