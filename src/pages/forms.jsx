import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, ChevronLeft, Filter, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IndividualFeeCommitteeForm from '../components/induvidual-form';
import api from '../api/api';

const FormsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewType, setViewType] = useState('Individual');
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    status: ''
  });

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const token = loginResponse?.output?.token;
  const userType = userData.userType;

  useEffect(() => {
    if (token) {
      const queryParams = {};
      if (filters.fromDate) queryParams.fromDate = filters.fromDate;
      if (filters.toDate) queryParams.toDate = filters.toDate;
      if (filters.status) queryParams.status = filters.status;
      fetchForms(queryParams);
    }
  }, [filters, token]);

  const fetchForms = async (queryParams = {}) => {
    try {
      setLoading(true);
      const headers = { 'Authorization': loginResponse?.output?.token };
      let response;
      
      if (userType === 'Section') {
        response = await api.get('/getAllFormsBySection', {
          params: {
            section: loginResponse.output.data.id,
            ...queryParams
          },
          headers
        });
      } else if (userType === 'Report') {
        response = await api.get('/getAllFormsByFilter', {
          params: queryParams,
          headers
        });
      } else {
        response = await api.get('/getAllForms', {
          params: queryParams,
          headers
        });
      }
  
      console.log('API Response:', response.data); // Let's see what we're getting
  
      if (response?.data?.results) {
        // Direct access to results array which contains full form data
        setForms(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (form) => {
    if (userType === 'Section') {
      navigate(`/individual-section-form/${form.id}`, { state: { formData: form } });
    } else {
      setShowForm(true);
      setViewType('Individual');
    }
  };

  const renderTableHeaders = () => {
    if (userType === 'Report') {
      return (
        <tr>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Details</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Fee Structure</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      );
    }
    return (
      <tr>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal Name</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locality</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated To</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        {userType === 'Section' && (
          <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        )}
      </tr>
    );
  };

  const renderTableRow = (form) => {
    if (userType === 'Report') {
      const formData = form;  // Since we're already getting the individual form object
      return (
        <tr key={formData.id} className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
            {new Date(formData.formDate).toLocaleDateString()}
          </td>
          <td className="px-4 py-3 text-sm text-gray-900">
            <div className="font-medium">{formData.schoolName}</div>
            <div className="text-gray-500">{formData.locality}, {formData.localityType}</div>
            <div className="text-gray-500">Classes: {formData.classesFunctioning}</div>
          </td>
          <td className="px-4 py-3 text-sm text-gray-900">
            <div>{formData.correspondantOrPrincipalName}</div>
            <div className="text-gray-500">{formData.mobileNumber1}</div>
            <div className="text-gray-500">{formData.email}</div>
          </td>
          <td className="px-4 py-3 text-sm">
            <div className="space-y-1">
              {formData.allocateformReference && (
                <>
                  <div>LKG: ₹{formData.allocateformReference.proposedFeeLkg || 'N/A'}</div>
                  <div>UKG: ₹{formData.allocateformReference.proposedFeeUkg || 'N/A'}</div>
                  <div>First: ₹{formData.allocateformReference.proposedFeeFirst || 'N/A'}</div>
                  <div>Second: ₹{formData.allocateformReference.proposedFeeSecond || 'N/A'}</div>
                  <div>Third: ₹{formData.allocateformReference.proposedFeeThird || 'N/A'}</div>
                  <div>Fourth: ₹{formData.allocateformReference.proposedFeeFour || 'N/A'}</div>
                  <div>Fifth: ₹{formData.allocateformReference.proposedFeeFive || 'N/A'}</div>
                  <div>Sixth: ₹{formData.allocateformReference.proposedFeeSix || 'N/A'}</div>
                  <div>Seventh: ₹{formData.allocateformReference.proposedFeeSeven || 'N/A'}</div>
                  <div>Eighth: ₹{formData.allocateformReference.proposedFeeEight || 'N/A'}</div>
                  <div>Ninth: ₹{formData.allocateformReference.proposedFeeNine || 'N/A'}</div>
                  <div>Tenth: ₹{formData.allocateformReference.proposedFeeTen || 'N/A'}</div>
                  <div>Eleventh: ₹{formData.allocateformReference.proposedFeeEleven || 'N/A'}</div>
                  <div>Twelfth: ₹{formData.allocateformReference.proposedFeeTwelve || 'N/A'}</div>
                </>
              )}
            </div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              formData.status === 'Completed' 
                ? 'bg-green-100 text-green-800' 
                : formData.status === 'Pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
            }`}>
              {formData.status}
            </span>
          </td>
        </tr>
      );
    }
    return (
      <tr key={form.id} className="hover:bg-gray-50">
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{new Date(form.formDate).toLocaleDateString()}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{form.correspondantOrPrincipal}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{form.schoolName}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{form.correspondantOrPrincipalName}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          <div>{form.mobileNumber1}</div>
          <div className="text-xs text-gray-400">{form.email}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{form.classesFunctioning}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          <div>{form.localityType}</div>
          <div className="text-xs text-gray-400">{form.locality}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          {form.allocatedToSection?.userName}
          <div className="text-xs text-gray-400">{form.allocatedToSection?.userType}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${form.status === 'Completed' ? 'bg-green-100 text-green-800' : form.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
            {form.status}
          </span>
        </td>
        {userType === 'Section' && (
          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
            {form.status && form.status.trim() === 'Completed' ? (
              <span className="text-gray-400 px-3 py-1">Completed</span>
            ) : (
              <button onClick={() => handleEdit(form)} className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors">
                Edit
              </button>
            )}
          </td>
        )}
      </tr>
    );
  };

  if (userType !== 'Admin' && userType !== 'Section' && userType !== 'Report') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl text-gray-600">Access Restricted</h2>
          <p className="mt-2 text-gray-500">Only authorized users can access this section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {!showForm ? (
          <div className="space-y-4">
            {userType === 'Admin' && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
                <div className="flex-grow w-full sm:w-auto">
                  <button onClick={() => setShowForm(true)} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>New Form</span>
                  </button>
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input type="date" value={filters.fromDate} onChange={(e) => setFilters(prev => ({...prev, fromDate: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input type="date" value={filters.toDate} onChange={(e) => setFilters(prev => ({...prev, toDate: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={filters.status} onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="">All Status</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Allocated">Allocated</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading forms...</p>
                  </div>
                ) : forms.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        {renderTableHeaders()}
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {forms.map((form) => renderTableRow(form))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No forms found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button onClick={() => setShowForm(false)} className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back
                </button>
              </div>
            </div>
            <div className="p-4">
              <IndividualFeeCommitteeForm formType={viewType} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default FormsPage;