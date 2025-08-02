'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BASEURL_PROD } from '../../../src/constants';
import ClientHeader from '../../components/ClientHeader';
import ClientFooter from '../../components/ClientFooter';

const COMMISSION_PERCENTAGE = 0.1;

const WorkshopRevenue = () => {
  const { workshopId } = useParams();
  const router = useRouter();
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    console.log(userInfoString);
    if (userInfoString === null) {
      router.push('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const url = `${BASEURL_PROD}payments/workshop_revenue/${workshopId}`;
        console.log(url)
        const response = await fetch(url);
        //console.log(response);
        const data = await response.json();
        
        if (data.success) {
          setRevenueData(data.data);
        } else {
          setError(data.message || 'Failed to fetch revenue data');
        }
      } catch (err) {
        setError('Error fetching revenue data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (workshopId) {
      fetchRevenueData();
    }
  }, [workshopId]);

  const calculateTotals = (workshopData) => {
    let totalRevenue = 0;
    let totalTickets = 0;
    let totalCapacity = 0;

    Object.values(workshopData).forEach(variant => {
      Object.values(variant).forEach(subvariant => {
        if (typeof subvariant === 'object' && subvariant.price !== undefined) {
          totalRevenue += subvariant.subtotal;
          totalTickets += subvariant.quantity;
          totalCapacity += subvariant.capacity;
        }
      });
    });

    return { totalRevenue, totalTickets, totalCapacity };
  };

  const downloadCSV = () => {
    if (!workshopData) return;

    // Create CSV content
    let csvContent = "Variant,Variant ID,Subvariant,Subvariant ID,Price,Capacity,Sold,Revenue\n";
    
    Object.entries(workshopData).forEach(([variantId, variant]) => {
      const variantDescription = variant.variant_description;
      const subvariants = Object.entries(variant).filter(([key, value]) => 
        typeof value === 'object' && value.price !== undefined
      );

      subvariants.forEach(([subvariantId, subvariant]) => {
        csvContent += `"${variantDescription}","${variantId}","${subvariant.subvariant_description}","${subvariantId}",${subvariant.price},${subvariant.capacity},${subvariant.quantity},${subvariant.subtotal}\n`;
      });
    });

    // Add summary row
    csvContent += `\nSummary\n`;
    csvContent += `Tickets Sold,,,,,,${totalTickets}\n`;
    csvContent += `Total Capacity,,,,,${totalCapacity}\n`;
    csvContent += `Total Revenue,,,,,,,${totalRevenue}\n`;
    csvContent += `Commission (10%),,,,,,,${(totalRevenue * COMMISSION_PERCENTAGE).toFixed(2)}\n`;
    csvContent += `Total Earnings,,,,,,,${(totalRevenue * (1 - COMMISSION_PERCENTAGE)).toFixed(2)}\n`;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `workshop_revenue_${workshopId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading revenue data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!revenueData || !revenueData[workshopId]) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No revenue data found for this workshop.</p>
      </div>
    );
  }

  const workshopData = revenueData[workshopId];
  const { totalRevenue, totalTickets, totalCapacity } = calculateTotals(workshopData);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ClientHeader />
        <main className='py-1 flex-grow-1' style={{ width: '100%' }}>

        
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif'}}>
      <h2 style={{textTransform:'none'}}>Workshop Revenue Dashboard</h2>
      <p>Workshop ID: {workshopId}</p>
      <div style={{ margin: '20px 0', display: 'flex', gap: '20px' }}>
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <strong>Total Revenue:</strong> ₹{totalRevenue.toLocaleString()}
        </div>
          <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
           <strong>Commission:</strong> ₹{(totalRevenue * COMMISSION_PERCENTAGE).toLocaleString()}
         </div>
         <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
           <strong>Total Earnings:</strong> ₹{(totalRevenue * (1 - COMMISSION_PERCENTAGE)).toLocaleString()}
         </div>
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <strong>Tickets Sold:</strong> {totalTickets}
        </div>
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <strong>Total Capacity:</strong> {totalCapacity}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{textTransform:'none'}}>Revenue Breakdown</h3>
        <button 
          onClick={downloadCSV}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Download CSV
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Variant</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Subvariant</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Price</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Capacity</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Sold</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(workshopData).map(([variantId, variant]) => {
            const variantDescription = variant.variant_description;
            const subvariants = Object.entries(variant).filter(([key, value]) => 
              typeof value === 'object' && value.price !== undefined
            );

            return subvariants.map(([subvariantId, subvariant], index) => (
              <tr key={`${variantId}-${subvariantId}`}>
                {index === 0 && (
                  <td 
                    rowSpan={subvariants.length} 
                    style={{ border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' }}
                  >
                    <strong>{variantDescription}</strong><br/>
                    <small>ID: {variantId}</small>
                  </td>
                )}
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <strong>{subvariant.subvariant_description}</strong><br/>
                  <small>ID: {subvariantId}</small>
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  ₹{subvariant.price.toLocaleString()}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {subvariant.capacity}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {subvariant.quantity}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <strong>₹{subvariant.subtotal.toLocaleString()}</strong>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
        <p>Data last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
    </main>
    <ClientFooter />
    </div>
  );
};

export default WorkshopRevenue; 