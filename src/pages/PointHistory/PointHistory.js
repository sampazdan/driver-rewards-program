import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import * as authtools from '../../authtools'
import Loading from '../../components/Loading/loading'
import axios from 'axios'

//fuckin change this
const CURRENT_SPONSOR = 'testsponsor'

const PointHistory = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true)


  const points = [250, 350, 500, 100, 300];

  console.log(authtools.getAuthHeader())
  useEffect(() => {
    try {
      setLoading(true);
      authtools.getUser().then((response) => {
        console.log("AT GETDATA for PH = " + JSON.stringify(response.data));
        processUserData(response.data.user);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  const processUserData = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return <Loading />;
  }



  const transactions = user.transactionHistory;
  console.log('TRANS         ' + JSON.stringify(transactions));
  var showPoints = user.points;


  return (

      <div>
        <h1 style={{ textAlign: 'center' }}>Point History for {user.username}</h1>
        <table style={{ margin: '0 auto' }}>
          <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Description</th>
            <th style={{ textAlign: 'center' }}>Amount</th>
            <th></th>
            <th style={{ textAlign: 'right' }}>
              &nbsp; &nbsp; Date
            </th>
          </tr>
          </thead>
          <tbody>

          {transactions.map((transaction, index) => (
              <tr
                  key={index}
                  style={{ color: transaction.pointChange > 0 ? 'green' : 'red' }}
              >
                <td>{transaction.description}</td>
                <td style={{ textAlign: 'center' }}>{transaction.pointChange}</td>
                <td></td>
                <td style={{ textAlign: 'center' }}> {transaction.date}</td>
              </tr>

          ))}
          </tbody>
        </table>
      </div>
  );
};

export default PointHistory;