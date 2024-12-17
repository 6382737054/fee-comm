import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AllocationForm = () => {
  const [forms, setForms] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
        const token = loginResponse?.output?.token;
        if (!token) throw new Error('No authentication token found');
        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };
        const [formsResponse, sectionsResponse] = await Promise.all([
          api.get('/getpendingforms', { headers }),
          api.get('/getUserNamesByUserType', { params: { userType: 'Section' }, headers })
        ]);
        if (formsResponse.data?.results) setForms(formsResponse.data.results);
        if (sectionsResponse.data?.results) setSections(sectionsResponse.data.results);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSectionChange = (e) => {
    const section = sections.find(s => s.userName === e.target.value);
    if (section) {
      setSelectedSection(section.userName);
      setSelectedSectionId(section.id);
    } else {
      setSelectedSection('');
      setSelectedSectionId('');
    }
  };

  const handleFormSelect = (form) => setSelectedForm(form);

  const handleAllocation = async () => {
    if (!selectedSectionId || !selectedForm) {
      setError('Please select both a form and a section.');
      return;
    }
    setLoading(true);
    try {
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
      const token = loginResponse?.output?.token;
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }
      const response = await api.put(`/allocateFeeForm?id=${selectedForm.id}`,
        { allocatedTo: selectedSectionId },
        { headers: { 'Authorization': token, 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        setSuccess(true);
        setError(null);
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to allocate form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Form Allocation Dashboard</h1>
              <p className="text-blue-100 mt-1">Manage and assign forms to sections</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-sm text-white">Total Forms: {forms.length}</span>
              </div>
            </div>
          </div>

          {(error || success) && (
            <div className="px-8 pt-6">
              {error && (
                <div className="flex items-center bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center bg-green-50 border-l-4 border-green-500 px-4 py-3 rounded">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-green-700">Form allocated successfully! Redirecting...</p>
                </div>
              )}
            </div>
          )}

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Available Forms</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12"></th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">School</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">UDISE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {forms.map((form) => (
                        <tr 
                          key={form.id}
                          onClick={() => handleFormSelect(form)}
                          className={`cursor-pointer transition-colors duration-150 ${
                            selectedForm?.id === form.id 
                              ? 'bg-blue-50 hover:bg-blue-100' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <input
                                type="radio"
                                checked={selectedForm?.id === form.id}
                                onChange={() => handleFormSelect(form)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{new Date(form.formDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{form.schoolName}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{form.udiseCode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 h-fit">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Section Assignment</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Section</label>
                    <select
                      value={selectedSection}
                      onChange={handleSectionChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      <option value="">Choose a section</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.userName}>{section.userName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selection Summary</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Form: {selectedForm ? selectedForm.schoolName : 'Not selected'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Section: {selectedSection || 'Not selected'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleAllocation}
                    disabled={loading || !selectedSection || !selectedForm}
                    className={`w-full px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 
                      ${loading || !selectedSection || !selectedForm
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : 'Allocate Form'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationForm;