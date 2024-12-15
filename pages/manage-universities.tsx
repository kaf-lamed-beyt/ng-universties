import { useState, useEffect } from 'react';
import Head from 'next/head';
import type { University } from './api/universities';
import styles from '@/styles/ManageUniversities.module.css';

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export default function ManageUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<University> | null>(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities');
      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setFormData(university);
    setCurrentStep(1);
  };

  const handleNewUniversity = () => {
    setSelectedUniversity(null);
    setFormData({
      name: '',
      acronym: '',
      location: { city: '', state: '' },
      founded: new Date().getFullYear(),
      website: '',
      faculties: [{ name: '', departments: [''] }]
    });
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      const method = selectedUniversity ? 'PATCH' : 'POST';
      const body = selectedUniversity 
        ? { 
            universityName: selectedUniversity.name, 
            updates: formData 
          }
        : formData;

      const response = await fetch('/api/universities', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save university');
      }

      await fetchUniversities();
      setSelectedUniversity(null);
      setFormData(null);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error saving university:', error);
      alert(error instanceof Error ? error.message : 'Failed to save university');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Manage Universities</title>
      </Head>

      <nav className={styles.nav}>
        <h1>University Management</h1>
        <button onClick={handleNewUniversity} className={styles.addButton}>
          Add New University
        </button>
      </nav>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <h2>Universities</h2>
          <div className={styles.universityList}>
            {universities.map((uni) => (
              <button
                key={uni.acronym}
                className={`${styles.universityItem} ${selectedUniversity?.acronym === uni.acronym ? styles.active : ''}`}
                onClick={() => handleUniversitySelect(uni)}
              >
                <strong>{uni.acronym}</strong>
                <span>{uni.name}</span>
              </button>
            ))}
          </div>
        </div>

        {formData && (
          <div className={styles.editor}>
            <div className={styles.steps}>
              <div className={styles['tab-pills']}>
                <button 
                  className={currentStep === 1 ? styles.activeStep : ''}
                  onClick={() => setCurrentStep(1)}
                >
                  Basic Info
                </button>
                <button 
                  className={currentStep === 2 ? styles.activeStep : ''}
                  onClick={() => setCurrentStep(2)}
                >
                  Location
                </button>
                <button 
                  className={currentStep === 3 ? styles.activeStep : ''}
                  onClick={() => setCurrentStep(3)}
                >
                  Faculties
                </button>
              </div>
            </div>

            <div className={`${styles.formContent} tabs`}>
              {currentStep === 1 && (
                <BasicInfoForm 
                  data={formData} 
                  onChange={setFormData} 
                />
              )}
              {currentStep === 2 && (
                <LocationForm 
                  data={formData} 
                  onChange={setFormData} 
                />
              )}
              {currentStep === 3 && (
                <FacultiesForm 
                  data={formData} 
                  onChange={setFormData} 
                />
              )}
            </div>

            <div className={`${styles.actions} ${styles['pagination-pills']}`}>
              <button 
                onClick={() => currentStep > 1 && setCurrentStep(step => step - 1)}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              {currentStep < 3 ? (
                <button 
                  onClick={() => setCurrentStep(step => step + 1)}
                  className={styles.next}
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className={styles.submit}
                >
                  Save University
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Form Components
function BasicInfoForm({ data, onChange }: { 
  data: Partial<University>, 
  onChange: (data: Partial<University>) => void 
}) {
  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label>University Name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
      <div className={styles.field}>
        <label>Acronym</label>
        <input
          type="text"
          value={data.acronym}
          onChange={(e) => onChange({ ...data, acronym: e.target.value.toUpperCase() })}
        />
      </div>
      <div className={styles.field}>
        <label>Founded Year</label>
        <input
          type="number"
          value={data.founded}
          onChange={(e) => onChange({ ...data, founded: parseInt(e.target.value) })}
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>
      <div className={styles.field}>
        <label>Website</label>
        <input
          type="url"
          value={data.website}
          onChange={(e) => onChange({ ...data, website: e.target.value })}
          placeholder="https://university.edu.ng"
        />
      </div>
    </div>
  );
}

function LocationForm({ data, onChange }: { 
  data: Partial<University>, 
  onChange: (data: Partial<University>) => void 
}) {
  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label>City</label>
        <input
          type="text"
          value={data.location?.city}
          onChange={(e) => onChange({
            ...data,
            location: { city: data.location?.city || '', state: e.target.value }
          })}
        />
      </div>
      <div className={styles.field}>
        <label>State</label>
        <input
          type="text"
          value={data.location?.state}
          onChange={(e) => onChange({
            ...data,
            location: { city: data.location?.city || '', state: e.target.value }
          })}
        />
      </div>
    </div>
  );
}

function FacultiesForm({ data, onChange }: { 
  data: Partial<University>, 
  onChange: (data: Partial<University>) => void 
}) {
  const addFaculty = () => {
    onChange({
      ...data,
      faculties: [...(data.faculties || []), { name: '', departments: [''] }]
    });
  };

  const addDepartment = (facultyIndex: number) => {
    const newFaculties = [...(data.faculties || [])];
    newFaculties[facultyIndex].departments.push('');
    onChange({ ...data, faculties: newFaculties });
  };

  return (
    <div className={styles.form}>
      {data.faculties?.map((faculty, fIndex) => (
        <div key={fIndex} className={styles.faculty}>
          <div className={styles.field}>
            <label>Faculty Name</label>
            <input
              type="text"
              value={faculty.name}
              onChange={(e) => {
                const newFaculties = [...(data.faculties || [])];
                newFaculties[fIndex].name = e.target.value;
                onChange({ ...data, faculties: newFaculties });
              }}
            />
          </div>
          
          <div className={styles.departments}>
            <label>Departments</label>
            {faculty.departments.map((dept, dIndex) => (
              <input
                key={dIndex}
                type="text"
                value={dept}
                onChange={(e) => {
                  const newFaculties = [...(data.faculties || [])];
                  newFaculties[fIndex].departments[dIndex] = e.target.value;
                  onChange({ ...data, faculties: newFaculties });
                }}
              />
            ))}
            <button 
              onClick={() => addDepartment(fIndex)}
              className={styles.addButton}
            >
              Add Department
            </button>
          </div>
        </div>
      ))}
      <button 
        onClick={addFaculty}
        className={styles.addButton}
      >
        Add Faculty
      </button>
    </div>
  );
} 