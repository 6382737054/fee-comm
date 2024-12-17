
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Account6Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const localityType = localStorage.getItem('localityType') || 'Panchayat';
  const childrenCount = localStorage.getItem('totalStudentStrength') || 0;
  const accountsItoVTotal = parseFloat(localStorage.getItem('accountsItoVTotalAllowed')) || 0;

  const getDevelopmentFundPercentage = (locality) => {
    switch (locality) {
      case 'Municipality':
        return 12.5;
      case 'Corporation':
        return 15;
      case 'Minority':
        return 15;
      default:  // Panchayat
        return 10;
    }
  };
  

  const [form, setForm] = useState({
    developmentFund: { 
      percentage: getDevelopmentFundPercentage(localityType), 
      allowed: 0,
      reason: ''
    },
    minority: { 
      expenditure: '', 
      allowed: '',
      reason: ''
    },
    infrastructure: { 
      percentage: 7, 
      allowed: 0,
      reason: ''
    },
    unexpected: { 
      expenditure: 750, 
      allowed: '',
      reason: ''
    }
  });

  const [totals, setTotals] = useState({
    account6TotalAllowed: 0,
    grandTotalAllowed: 0,
    meanValue: 0
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setInitialLoading(true);
        const feeFormId = localStorage.getItem('feeFormId');
        const allocatedTo = loginResponse?.output?.data?.id;
        
        const headers = {
          'Authorization': loginResponse?.output?.token,
          'Content-Type': 'application/json'
        };

        const response = await api.get('/getAllocatedFormByFeeForm', {
          params: { feeformId: feeFormId, allocatedTo: allocatedTo },
          headers
        });

        if (response.data?.results) {
            const data = response.data.results;
            const devFundPercentage = getDevelopmentFundPercentage(localityType);
            const devFundAllowed = (accountsItoVTotal * (devFundPercentage/100));

            setForm({
                developmentFund: {
                  percentage: devFundPercentage,
                  allowed: devFundAllowed,
                  reason: data.account6DevelopmentFundReason || ''
                },
            minority: {
              expenditure: data.account6MinorityExpenditure || '',
              allowed: data.account6MinorityAllowed || '',
              reason: data.account6MinorityReason || ''
            },
            infrastructure: {
              percentage: data.account6InfrastructureExpenditure || 7,
              allowed: (accountsItoVTotal * (7/100)),
              reason: data.account6InfrastructureReason || ''
            },
            unexpected: {
              expenditure: 750,
              allowed: data.account6UnexpectedExpendituresAllowed || '',
              reason: data.account6UnexpectedExpendituresReason || ''
            }
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchFormData();
  }, [loginResponse?.output?.token, loginResponse?.output?.data?.id, localityType, accountsItoVTotal]);

  useEffect(() => {
    const totalAllowed = Object.values(form).reduce((sum, item) => sum + (parseFloat(item.allowed) || 0), 0);
    const grandTotal = accountsItoVTotal + totalAllowed;
    const mean = grandTotal / (parseInt(childrenCount) || 1);

    setTotals({
      account6TotalAllowed: totalAllowed,
      grandTotalAllowed: grandTotal,
      meanValue: mean,
      grandTotalAllowed: grandTotal
    });
    localStorage.setItem('grandTotalAllowed(I-VI)', grandTotal.toFixed(2));
  }, [form, accountsItoVTotal, childrenCount]);

  const handleInfraPercentageChange = (value) => {
    const percentage = Math.min(Math.max(parseFloat(value) || 7, 7), 10);
    const allowed = (accountsItoVTotal * (percentage/100));

    setForm(prev => ({
      ...prev,
      infrastructure: {
        ...prev.infrastructure,
        percentage,
        allowed
      }
    }));
  };

  const handleMinorityChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const allowed = (accountsItoVTotal * (percentage/100));
    
    setForm(prev => ({
      ...prev,
      minority: {
        ...prev.minority,
        expenditure: percentage,
        allowed: allowed
      }
    }));
  };
  const handleUnexpectedAllowedChange = (value) => {
    setForm(prev => ({
      ...prev,
      unexpected: {
        ...prev.unexpected,
        expenditure: 750,
        allowed: value
      }
    }));
  };

  const handleReasonChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        reason: value
      }
    }));
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const feeFormId = localStorage.getItem('feeFormId');
      const allocatedTo = loginResponse?.output?.data?.id;
      
      const payload = {
        account6DevelopmentFundPercentage: form.developmentFund.percentage,
        account6DevelopmentFundAmount: form.developmentFund.allowed,
        account6MinorityPercentage: parseFloat(form.minority.expenditure) || 0,
        account6MinorityAmount: parseFloat(form.minority.allowed) || 0,
        account6InfrastructurePercentage: form.infrastructure.percentage,
        account6InfrastructureAmount: form.infrastructure.allowed,
        account6UnexpectedExpendituresPercentage: form.unexpected.expenditure,
        account6UnexpectedExpendituresAmount: parseFloat(form.unexpected.allowed) || 0,
        account6NumberOfChildren: parseInt(childrenCount),
        account6MeanValue: totals.meanValue,
        account6Total: totals.account6TotalAllowed,
        account1to6Total: totals.grandTotalAllowed,
        account6: "Completed"
      };
  
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };
  
      await api.put(
        `/editAllocateForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`,
        payload,
        { headers }
      );
  
      navigate('/account7');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-4 flex items-center">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-900">Account VI - Futuristic Development</h1>
          </div>
          <div className="p-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">HEAD OF EXPENDITURE</th>
                  <th className="border border-gray-300 px-4 py-2">Expenditure</th>
                  <th className="border border-gray-300 px-4 py-2">Allowed</th>
                 
                </tr>
              </thead>
              <tbody>
              <tr>
  <td className="border border-gray-300 px-4 py-2">
    Development fund
    <div className="ml-4 text-sm">
      {localityType} {form.developmentFund.percentage}%
      {localityType === 'Minority' && 
        <div>(For Christian Catholic minority school irrespective of location)</div>
      }
    </div>
  </td>
  <td className="border border-gray-300 px-4 py-2 text-center">
    {form.developmentFund.percentage}%
  </td>
  <td className="border border-gray-300 px-4 py-2 text-center">
    {form.developmentFund.allowed.toFixed(2)}
  </td>
  <td className="border border-gray-300 px-4 py-2" contentEditable
    onBlur={(e) => handleReasonChange('developmentFund', e.target.textContent)}>
    {form.developmentFund.reason}
  </td>
</tr>

<tr>
  <td className="border border-gray-300 px-4 py-2">
    Minority Catholic school -<br/>
    Corporate school<br/>
    Development Fund (10%)
  </td>
  {/* <td className="border border-gray-300 px-4 py-2 text-center">
  <input
    type="number"
    value={form.minority.expenditure}
    onChange={(e) => handleMinorityChange(e.target.value)}
    className="w-20 px-2 py-1 text-center border rounded-md"
  />%
</td>
  <td className="border border-gray-300 px-4 py-2 text-center">
    {form.minority.allowed}
  </td>
  <td className="border border-gray-300 px-4 py-2" contentEditable
    onBlur={(e) => handleReasonChange('minority', e.target.textContent)}>
    {form.minority.reason}
  </td> */}
</tr>

<tr>
  <td className="border border-gray-300 px-4 py-2">
    Infrastructure Grading<br/>
    (7% to 10%) Additional income
  </td>
  <td className="border border-gray-300 px-4 py-2 text-center">
    <input
      type="number"
      min="7"
      max="10"
      value={form.infrastructure.percentage}
      onChange={(e) => handleInfraPercentageChange(e.target.value)}
      className="w-20 px-2 py-1 text-center border rounded-md"
    />%
  </td>
  <td className="border border-gray-300 px-4 py-2 text-center">
    {form.infrastructure.allowed.toFixed(2)}
  </td>
  <td className="border border-gray-300 px-4 py-2" contentEditable
    onBlur={(e) => handleReasonChange('infrastructure', e.target.textContent)}>
    {form.infrastructure.reason}
  </td>
</tr>

<tr>
  <td className="border border-gray-300 px-4 py-2">
    Unexpected expenditures,<br/>
    which cannot be included<br/>
    in any of the above heads.<br/>
    (If a fixed amount Rs.750/-<br/>
    or Rs.1000/-) is not<br/>
    allowed already
  </td>
  <td className="border border-gray-300 px-4 py-2 text-center">750</td>
  <td className="border border-gray-300 px-4 py-2 text-center">
    <input
      type="number"
      value={form.unexpected.allowed}
      onChange={(e) => handleUnexpectedAllowedChange(e.target.value)}
      className="w-20 px-2 py-1 text-center border rounded-md"
    />
  </td>
  <td className="border border-gray-300 px-4 py-2" contentEditable
    onBlur={(e) => handleReasonChange('unexpected', e.target.textContent)}>
    {form.unexpected.reason}
  </td>
</tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Total</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {totals.account6TotalAllowed.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Grand Total Account I - VI</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {totals.grandTotalAllowed.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Number of children</td>
                  <td className="border border-gray-300 px-4 py-2 text-center" colSpan="3">
                    {childrenCount}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Mean value</td>
                  <td className="border border-gray-300 px-4 py-2 text-center" colSpan="3">
                    {totals.meanValue.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Account6Form;