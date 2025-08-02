'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BASEURL_PROD } from '../../../src/constants';
import ClientHeader from '../../components/ClientHeader';
import ClientFooter from '../../components/ClientFooter';

const WorkshopRevenue = () => {
  const { workshopId } = useParams();
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <strong>Tickets Sold:</strong> {totalTickets}
        </div>
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <strong>Total Capacity:</strong> {totalCapacity}
        </div>
      </div>

      <h3 style={{textTransform:'none'}}>Revenue Breakdown</h3>
      
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