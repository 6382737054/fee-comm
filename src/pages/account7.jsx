import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Account7Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');

  const [form, setForm] = useState({
    studentStrength: {
      "LKG": { strength: '', fee: '', income: '' },
      "UKG": { strength: '', fee: '', income: '' },
      "I": { strength: '', fee: '', income: '' },
      "II": { strength: '', fee: '', income: '' },
      "III": { strength: '', fee: '', income: '' },
      "IV": { strength: '', fee: '', income: '' },
      "V": { strength: '', fee: '', income: '' },
      "VI": { strength: '', fee: '', income: '' },
      "VII": { strength: '', fee: '', income: '' },
      "VIII": { strength: '', fee: '', income: '' },
      "IX": { strength: '', fee: '', income: '' },
      "X": { strength: '', fee: '', income: '' },
      "XI": { strength: '', fee: '', income: '' },
      "XII": { strength: '', fee: '', income: '' }
    },
    futureFees: {
      "LKG": { fee2025: '', fee2026: '' },
      "UKG": { fee2025: '', fee2026: '' },
      "I": { fee2025: '', fee2026: '' },
      "II": { fee2025: '', fee2026: '' },
      "III": { fee2025: '', fee2026: '' },
      "IV": { fee2025: '', fee2026: '' },
      "V": { fee2025: '', fee2026: '' },
      "VI": { fee2025: '', fee2026: '' },
      "VII": { fee2025: '', fee2026: '' },
      "VIII": { fee2025: '', fee2026: '' },
      "IX": { fee2025: '', fee2026: '' },
      "X": { fee2025: '', fee2026: '' },
      "XI": { fee2025: '', fee2026: '' },
      "XII": { fee2025: '', fee2026: '' }
    },
    previousFees: {
      "LKG": { proposed: '', previous: '' },
      "UKG": { proposed: '', previous: '' },
      "I": { proposed: '', previous: '' },
      "II": { proposed: '', previous: '' },
      "III": { proposed: '', previous: '' },
      "IV": { proposed: '', previous: '' },
      "V": { proposed: '', previous: '' },
      "VI": { proposed: '', previous: '' },
      "VII": { proposed: '', previous: '' },
      "VIII": { proposed: '', previous: '' },
      "IX": { proposed: '', previous: '' },
      "X": { proposed: '', previous: '' },
      "XI": { proposed: '', previous: '' },
      "XII": { proposed: '', previous: '' }
    }
  });

  const [totals, setTotals] = useState({
    totalStudents: 0,
    totalIncome: 0,
    totalExpenses: parseFloat(localStorage.getItem('grandTotalAllowed(I-VI)')) || '',
    difference: 0
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
            const newForm = {
              studentStrength: {
                "LKG": { 
                  strength: data.currentYearLkgStrength,
                  fee: data.currentYearLkgFee,
                  income: data.currentYearLkgIncome
                },
                "UKG": { 
                  strength: data.currentYearUkgStrength,
                  fee: data.currentYearUkgFee,
                  income: data.currentYearUkgIncome
                },
                "I": { 
                  strength: data.currentYearFirstStrength,
                  fee: data.currentYearFirstFee,
                  income: data.currentYearFirstIncome
                },
                "II": { 
                  strength: data.currentYearSecondStrength,
                  fee: data.currentYearSecondFee,
                  income: data.currentYearSecondIncome
                },
                "III": { 
                  strength: data.currentYearThirdStrength,
                  fee: data.currentYearThirdFee,
                  income: data.currentYearThirdIncome
                },
                "IV": { 
                  strength: data.currentYearFourStrength,
                  fee: data.currentYearFourFee,
                  income: data.currentYearFourIncome
                },
                "V": { 
                  strength: data.currentYearFiveStrength,
                  fee: data.currentYearFiveFee,
                  income: data.currentYearFiveIncome
                },
                "VI": { 
                  strength: data.currentYearSixStrength,
                  fee: data.currentYearSixFee,
                  income: data.currentYearSixIncome
                },
                "VII": { 
                  strength: data.currentYearSevenStrength,
                  fee: data.currentYearSevenFee,
                  income: data.currentYearSevenIncome
                },
                "VIII": { 
                  strength: data.currentYearEightStrength,
                  fee: data.currentYearEightFee,
                  income: data.currentYearEightIncome
                },
                "IX": { 
                  strength: data.currentYearNineStrength,
                  fee: data.currentYearNineFee,
                  income: data.currentYearNineIncome
                },
                "X": { 
                  strength: data.currentYearTenStrength,
                  fee: data.currentYearTenFee,
                  income: data.currentYearTenIncome
                },
                "XI": { 
                  strength: data.currentYearElevenStrength,
                  fee: data.currentYearElevenFee,
                  income: data.currentYearElevenIncome
                },
                "XII": { 
                  strength: data.currentYearTwelveStrength,
                  fee: data.currentYearTwelveFee,
                  income: data.currentYearTwelveIncome
                }
              },
              futureFees: {
                "LKG": { 
                  fee2025: data.futureYear1LkgFee,
                  fee2026: data.futureYear2LkgFee
                },
                "UKG": { 
                  fee2025: data.futureYear1UkgFee,
                  fee2026: data.futureYear2UkgFee
                },
                "I": { 
                  fee2025: data.futureYear1FirstFee,
                  fee2026: data.futureYear2FirstFee
                },
                "II": { 
                  fee2025: data.futureYear1SecondFee,
                  fee2026: data.futureYear2SecondFee
                },
                "III": { 
                  fee2025: data.futureYear1ThirdFee,
                  fee2026: data.futureYear2ThirdFee
                },
                "IV": { 
                  fee2025: data.futureYear1FourFee,
                  fee2026: data.futureYear2FourFee
                },
                "V": { 
                  fee2025: data.futureYear1FiveFee,
                  fee2026: data.futureYear2FiveFee
                },
                "VI": { 
                  fee2025: data.futureYear1SixFee,
                  fee2026: data.futureYear2SixFee
                },
                "VII": { 
                  fee2025: data.futureYear1SevenFee,
                  fee2026: data.futureYear2SevenFee
                },
                "VIII": { 
                  fee2025: data.futureYear1EightFee,
                  fee2026: data.futureYear2EightFee
                },
                "IX": { 
                  fee2025: data.futureYear1NineFee,
                  fee2026: data.futureYear2NineFee
                },
                "X": { 
                  fee2025: data.futureYear1TenFee,
                  fee2026: data.futureYear2TenFee
                },
                "XI": { 
                  fee2025: data.futureYear1ElevenFee,
                  fee2026: data.futureYear2ElevenFee
                },
                "XII": { 
                  fee2025: data.futureYear1TwelveFee,
                  fee2026: data.futureYear2TwelveFee
                }
              },
              previousFees: {
                "LKG": { 
                  proposed: data.proposedFeeLkg,
                  previous: data.previousOrderFeeLkg
                },
                "UKG": { 
                  proposed: data.proposedFeeUkg,
                  previous: data.previousOrderFeeUkg
                },
                "I": { 
                  proposed: data.proposedFeeFirst,
                  previous: data.previousOrderFeeFirst
                },
                "II": { 
                  proposed: data.proposedFeeSecond,
                  previous: data.previousOrderFeeSecond
                },
                "III": { 
                  proposed: data.proposedFeeThird,
                  previous: data.previousOrderFeeThird
                },
                "IV": { 
                  proposed: data.proposedFeeFour,
                  previous: data.previousOrderFeeFour
                },
                "V": { 
                  proposed: data.proposedFeeFive,
                  previous: data.previousOrderFeeFive
                },
                "VI": { 
                  proposed: data.proposedFeeSix,
                  previous: data.previousOrderFeeSix
                },
                "VII": { 
                  proposed: data.proposedFeeSeven,
                  previous: data.previousOrderFeeSeven
                },
                "VIII": { 
                  proposed: data.proposedFeeEight,
                  previous: data.previousOrderFeeEight
                },
                "IX": { 
                  proposed: data.proposedFeeNine,
                  previous: data.previousOrderFeeNine
                },
                "X": { 
                  proposed: data.proposedFeeTen,
                  previous: data.previousOrderFeeTen
                },
                "XI": { 
                  proposed: data.proposedFeeEleven,
                  previous: data.previousOrderFeeEleven
                },
                "XII": { 
                  proposed: data.proposedFeeTwelve,
                  previous: data.previousOrderFeeTwelve
                }
              }
            };
          
            setForm(newForm);
            calculateTotals(newForm.studentStrength);
          }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchFormData();
  }, [loginResponse?.output?.token, loginResponse?.output?.data?.id]);

  const calculateTotals = (studentStrength) => {
    let totalStudents = 0;
    let totalIncome = 0;
  
    Object.values(studentStrength).forEach(values => {
      totalStudents += values.strength ? parseInt(values.strength) : 0;
      totalIncome += values.income ? parseInt(values.income) : 0;
    });
  
    const totalExpenses = parseFloat(localStorage.getItem('grandTotalAllowed(I-VI)')) || '';
  
    setTotals({
      totalStudents,
      totalIncome,
      totalExpenses,
      difference: totalIncome ? (totalIncome - totalExpenses) : ''
    });
  };
const handleStrengthChange = (className, value) => {
    const updatedForm = {
        ...form,
        studentStrength: {
            ...form.studentStrength,
            [className]: {
                ...form.studentStrength[className],
                strength: value
            }
        }
    };

    setForm(updatedForm);
    calculateTotals(updatedForm.studentStrength);
};

const handleFeeChange = (className, value) => {
    const updatedForm = {
        ...form,
        studentStrength: {
            ...form.studentStrength,
            [className]: {
                ...form.studentStrength[className],
                fee: value
            }
        }
    };

    setForm(updatedForm);
    calculateTotals(updatedForm.studentStrength);
};
  const handleIncomeChange = (className, value) => {
    const updatedForm = {
        ...form,
        studentStrength: {
            ...form.studentStrength,
            [className]: {
                ...form.studentStrength[className],
                income: value === '' ? '' : value
            }
        }
    };

    setForm(updatedForm);
    calculateTotals(updatedForm.studentStrength);
};

  const handleFutureFeeChange = (className, year, value) => {
    const feeValue = parseInt(value) || '';
    
    setForm(prev => ({
      ...prev,
      futureFees: {
        ...prev.futureFees,
        [className]: {
          ...prev.futureFees[className],
          [year]: feeValue
        }
      }
    }));
  };

  const handlePreviousFeeChange = (className, field, value) => {
    const feeValue = parseInt(value) || '';
    
    setForm(prev => ({
      ...prev,
      previousFees: {
        ...prev.previousFees,
        [className]: {
          ...prev.previousFees[className],
          [field]: feeValue
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const feeFormId = localStorage.getItem('feeFormId');
      const allocatedTo = loginResponse?.output?.data?.id;

      const payload = {
        currentYearLkgStrength: form.studentStrength.LKG.strength,
        currentYearLkgFee: form.studentStrength.LKG.fee,
        currentYearLkgIncome: form.studentStrength.LKG.income,
        currentYearUkgStrength: form.studentStrength.UKG.strength,
        currentYearUkgFee: form.studentStrength.UKG.fee,
        currentYearUkgIncome: form.studentStrength.UKG.income,
        currentYearFirstStrength: form.studentStrength.I.strength,
        currentYearFirstFee: form.studentStrength.I.fee,
        currentYearFirstIncome: form.studentStrength.I.income,
        currentYearSecondStrength: form.studentStrength.II.strength,
        currentYearSecondFee: form.studentStrength.II.fee,
        currentYearSecondIncome: form.studentStrength.II.income,
        currentYearThirdStrength: form.studentStrength.III.strength,
        currentYearThirdFee: form.studentStrength.III.fee,
        currentYearThirdIncome: form.studentStrength.III.income,
        currentYearFourStrength: form.studentStrength.IV.strength,
        currentYearFourFee: form.studentStrength.IV.fee,
        currentYearFourIncome: form.studentStrength.IV.income,
        currentYearFiveStrength: form.studentStrength.V.strength,
        currentYearFiveFee: form.studentStrength.V.fee,
        currentYearFiveIncome: form.studentStrength.V.income,
        currentYearSixStrength: form.studentStrength.VI.strength,
        currentYearSixFee: form.studentStrength.VI.fee,
        currentYearSixIncome: form.studentStrength.VI.income,
        currentYearSevenStrength: form.studentStrength.VII.strength,
        currentYearSevenFee: form.studentStrength.VII.fee,
        currentYearSevenIncome: form.studentStrength.VII.income,
        currentYearEightStrength: form.studentStrength.VIII.strength,
        currentYearEightFee: form.studentStrength.VIII.fee,
        currentYearEightIncome: form.studentStrength.VIII.income,
        currentYearNineStrength: form.studentStrength.IX.strength,
        currentYearNineFee: form.studentStrength.IX.fee,
        currentYearNineIncome: form.studentStrength.IX.income,
        currentYearTenStrength: form.studentStrength.X.strength,
        currentYearTenFee: form.studentStrength.X.fee,
        currentYearTenIncome: form.studentStrength.X.income,
        currentYearElevenStrength: form.studentStrength.XI.strength,
        currentYearElevenFee: form.studentStrength.XI.fee,
        currentYearElevenIncome: form.studentStrength.XI.income,
        currentYearTwelveStrength: form.studentStrength.XII.strength,
        currentYearTwelveFee: form.studentStrength.XII.fee,
        currentYearTwelveIncome: form.studentStrength.XII.income,
        currentYearTotalIncome: totals.totalIncome,
        currentYearTotalExpenses: totals.totalExpenses,
        currentYearDifference: totals.difference,

        // Future Fees
        futureYear1LkgFee: form.futureFees.LKG.fee2025,
        futureYear2LkgFee: form.futureFees.LKG.fee2026,
        futureYear1UkgFee: form.futureFees.UKG.fee2025,
        futureYear2UkgFee: form.futureFees.UKG.fee2026,
        futureYear1FirstFee: form.futureFees.I.fee2025,
        futureYear2FirstFee: form.futureFees.I.fee2026,
        futureYear1SecondFee: form.futureFees.II.fee2025,
        futureYear2SecondFee: form.futureFees.II.fee2026,
        futureYear1ThirdFee: form.futureFees.III.fee2025,
        futureYear2ThirdFee: form.futureFees.III.fee2026,
        futureYear1FourFee: form.futureFees.IV.fee2025,
        futureYear2FourFee: form.futureFees.IV.fee2026,
        futureYear1FiveFee: form.futureFees.V.fee2025,
        futureYear2FiveFee: form.futureFees.V.fee2026,
        futureYear1SixFee: form.futureFees.VI.fee2025,
        futureYear2SixFee: form.futureFees.VI.fee2026,
        futureYear1SevenFee: form.futureFees.VII.fee2025,
        futureYear2SevenFee: form.futureFees.VII.fee2026,
        futureYear1EightFee: form.futureFees.VIII.fee2025,
        futureYear2EightFee: form.futureFees.VIII.fee2026,
        futureYear1NineFee: form.futureFees.IX.fee2025,
        futureYear2NineFee: form.futureFees.IX.fee2026,
        futureYear1TenFee: form.futureFees.X.fee2025,
        futureYear2TenFee: form.futureFees.X.fee2026,
        futureYear1ElevenFee: form.futureFees.XI.fee2025,
        futureYear2ElevenFee: form.futureFees.XI.fee2026,
        futureYear1TwelveFee: form.futureFees.XII.fee2025,
        futureYear2TwelveFee: form.futureFees.XII.fee2026,

        // Previous Fees
        proposedFeeLkg: form.previousFees.LKG.proposed,
        previousOrderFeeLkg: form.previousFees.LKG.previous,
        proposedFeeUkg: form.previousFees.UKG.proposed,
        previousOrderFeeUkg: form.previousFees.UKG.previous,
        proposedFeeFirst: form.previousFees.I.proposed,
        previousOrderFeeFirst: form.previousFees.I.previous,
        proposedFeeSecond: form.previousFees.II.proposed,
        previousOrderFeeSecond: form.previousFees.II.previous,
        proposedFeeThird: form.previousFees.III.proposed,
        previousOrderFeeThird: form.previousFees.III.previous,
        proposedFeeFour: form.previousFees.IV.proposed,
        previousOrderFeeFour: form.previousFees.IV.previous,
        proposedFeeFive: form.previousFees.V.proposed,
        previousOrderFeeFive: form.previousFees.V.previous,
        proposedFeeSix: form.previousFees.VI.proposed,
        previousOrderFeeSix: form.previousFees.VI.previous,
        proposedFeeSeven: form.previousFees.VII.proposed,
        previousOrderFeeSeven: form.previousFees.VII.previous,
        proposedFeeEight: form.previousFees.VIII.proposed,
        previousOrderFeeEight: form.previousFees.VIII.previous,
        proposedFeeNine: form.previousFees.IX.proposed,
        previousOrderFeeNine: form.previousFees.IX.previous,
        proposedFeeTen: form.previousFees.X.proposed,
        previousOrderFeeTen: form.previousFees.X.previous,
        proposedFeeEleven: form.previousFees.XI.proposed,
        previousOrderFeeEleven: form.previousFees.XI.previous,
        proposedFeeTwelve: form.previousFees.XII.proposed,
        previousOrderFeeTwelve: form.previousFees.XII.previous,

        AttendedBy: loginResponse?.output?.data?.name || '',
        account7: "Completed",
        status: "Completed"
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

      navigate('/home');
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
            <h1 className="ml-4 text-lg font-semibold text-gray-900">2024-25 Fee Structure</h1>
          </div>
          <div className="p-6">
            {/* Current Year Section */}
            <table className="w-full border-collapse border border-gray-300 mb-8">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2">Class</th>
                  <th className="border border-gray-300 px-4 py-2">Student's strength</th>
                  <th className="border border-gray-300 px-4 py-2">2024-25 Fee Rs.</th>
                  <th className="border border-gray-300 px-4 py-2">Income</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(form.studentStrength).map(([className, values]) => (
                  <tr key={className}>
                    <td className="border border-gray-300 px-4 py-2">{className}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.strength}
                        onChange={(e) => handleStrengthChange(className, e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.fee}
                        onChange={(e) => handleFeeChange(className, e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.income}
                        onChange={(e) => handleIncomeChange(className, e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border border-gray-300 px-4 py-2">Total</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalStudents}</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalIncome}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Total Income</td>
                  <td className="border border-gray-300 px-4 py-2" colSpan="3">{totals.totalIncome}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Total Expenses</td>
                  <td className="border border-gray-300 px-4 py-2" colSpan="3">{totals.totalExpenses}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Difference</td>
                  <td className="border border-gray-300 px-4 py-2" colSpan="3">{totals.difference}</td>
                </tr>
              </tbody>
            </table>

            {/* Future Fee Structure Section */}
            <h2 className="text-lg font-semibold mb-4">Fee Structure for 2025-26 to 2026-27</h2>
            <table className="w-full border-collapse border border-gray-300 mb-8">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2">Class</th>
                  <th className="border border-gray-300 px-4 py-2">2025-26 Fee (Rs.)</th>
                  <th className="border border-gray-300 px-4 py-2">2026-27 Fee (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(form.futureFees).map(([className, values]) => (
                  <tr key={className}>
                    <td className="border border-gray-300 px-4 py-2">{className}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.fee2025}
                        onChange={(e) => handleFutureFeeChange(className, 'fee2025', e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.fee2026}
                        onChange={(e) => handleFutureFeeChange(className, 'fee2026', e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Previous Year Fee Section */}
            <h2 className="text-lg font-semibold mb-4">Previous Year Details</h2>
            <table className="w-full border-collapse border border-gray-300 mb-8">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2">Class</th>
                  <th className="border border-gray-300 px-4 py-2">Proposed Fee 2023-24</th>
                  <th className="border border-gray-300 px-4 py-2">Previous Year Order Fee - 2022-2023</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(form.previousFees).map(([className, values]) => (
                  <tr key={className}>
                    <td className="border border-gray-300 px-4 py-2">{className}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.proposed}
                        onChange={(e) => handlePreviousFeeChange(className, 'proposed', e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.previous}
                        onChange={(e) => handlePreviousFeeChange(className, 'previous', e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account7Form;