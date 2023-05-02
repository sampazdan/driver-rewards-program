import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import React, {useState} from 'react';
import {
    Chart as ChartJS,
    LineElement, CategoryScale, LinearScale, PointElement
} from 'chart.js'

ChartJS.register(
    LineElement, CategoryScale, LinearScale, PointElement
)



function Graph() {
    const [datestate, setdatestate] = useState();
    var showdate=new Date();
    var displaytoday = (showdate.getMonth() + 1) + '/' + showdate.getDate();
    var displayOne = (showdate.getMonth() + 1) + '/' + (showdate.getDate() - 1);
    var displayTwo = (showdate.getMonth() + 1) + '/' + (showdate.getDate() - 2);
    var displayThree = (showdate.getMonth() + 1) + '/' + (showdate.getDate() - 3);
    var displayFour = (showdate.getMonth() + 1) + '/' + (showdate.getDate() - 4);
    var displayFive = (showdate.getMonth() + 1) + '/' + (showdate.getDate() - 5);
    var displaySix = (showdate.getMonth() + 1) + '/' + (showdate.getDate() - 6);
    var pdate;
    if (datestate == "Year"){
        pdate = 'year';
        displaytoday = (showdate.getMonth()) + '/' + showdate.getFullYear();
        displayOne = 'Mid ' + (showdate.getMonth()) + '/' + showdate.getFullYear();
        displayTwo = (showdate.getMonth() - 1) + '/' + showdate.getFullYear();
        displayThree = 'Mid ' + (showdate.getMonth() - 1) + '/' + showdate.getFullYear();
        displayFour = (showdate.getMonth() - 2) + '/' + showdate.getFullYear(); 
        displayFive = 'Mid ' + (showdate.getMonth() - 2) + '/' + showdate.getFullYear(); 
    }
    else if(datestate == "Month"){
        pdate = 'month';
        displaytoday = showdate.getMonth() + '/' + '28';
        displayOne = showdate.getMonth() + '/' + '21';
        displayTwo = showdate.getMonth() + '/' + '14';
        displayThree = showdate.getMonth() + '/' + '7';
    }
    else{
        pdate = 'week'
    }
    const data = {
        labels: [displaySix, displayFive, displayFour, displayThree, displayTwo, displayOne, displaytoday],
        datasets: [{
            data: [100, 130, 166, 175, 190, 210, 240]
        }]
    };
    const monthData = {
        labels: [displayThree, displayTwo, displayOne, displaytoday],
        datasets: [{
            data: [166, 175, 190, 210]
        }]
    };
    const threeData = {
        labels: [displayFive, displayFour, displayThree, displayTwo, displayOne, displaytoday],
        datasets: [{
            data: [300, 220, 175, 190, 210, 230]
        }]
    };
    
    const options = {};
    if (datestate == "Year"){
        return (
            <div>
                
                <select
                 className="custom-select"
                 onChange={(e) =>{
                    const selecteddate = e.target.value;
                    setdatestate(selecteddate);
                 }} 
                 >
                    <option value="Week">Past 7 Days</option>
                    <option value="Month">Last Month</option>
                    <option value="Year">Last 3 Months</option>
    
                </select>
                This iiis {pdate}
                
                <Line data={threeData} options={options}></Line>
            </div>
        );
        
    }
    else if (datestate == "Month"){
        return (
            <div>
                <Link to="/PointHistory" className="link">
                View Full History
              </Link>
                <select
                 className="custom-select"
                 onChange={(e) =>{
                    const selecteddate = e.target.value;
                    setdatestate(selecteddate);
                 }} 
                 >
                    <option value="Week">Past 7 Days</option>
                    <option value="Month">Last Month</option>
                    <option value="Year">Last 3 Months</option>
    
                </select>
                This is {pdate}
                
                <Line data={monthData} options={options}></Line>
            </div>
        );

    }
    else{
        return (
            <div>
                <Link to="/PointHistory" className="link">
                View Full History
              </Link>
                <select
                 className="custom-select"
                 onChange={(e) =>{
                    const selecteddate = e.target.value;
                    setdatestate(selecteddate);
                 }} 
                 >
                    <option value="Week">Past 7 Days</option>
                    <option value="Month">Last Month</option>
                    <option value="Year">Last 3 Months</option>
    
                </select>
                This is {pdate}
                
                <Line data={data} options={options}></Line>
            </div>
        );

    }
    
}

export default Graph;