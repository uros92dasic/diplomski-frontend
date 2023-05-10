import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import * as c3 from 'c3';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [chart, setChart] = useState<c3.ChartAPI | null>(null);

    useEffect(() => {
        (
            async () => {
                const generatedChart = c3.generate({
                    bindto: '#chart',
                    data: {
                        x: 'x',
                        columns: [
                            ['x'],
                            ['Sales'],
                        ],
                        types: {
                            Sales: 'bar'
                        }
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%d. %B %Y.'
                            }
                        }
                    },
                });

                setChart(generatedChart);
            }
        )()
    }, []);

    useEffect(() => {
        if (chart) {
            loadData();
        }
    }, [selectedDate, chart]);

    const loadData = async () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // getMonth() returns 0-indexed month

        const { data } = await axios.get(`orders/chart/${year}/${month}`);

        chart?.load({
            columns: [
                ['x', ...data.map((result: any) => result.date)],
                ['Sales', ...data.map((result: any) => result.total)]
            ]
        });
    };

    return (
        <Wrapper>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <h2 style={{ marginRight: '16px' }}>Daily Sales</h2>
                <div>
                    <label>Choose Month and Year:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date) => setSelectedDate(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                    />
                </div>
            </div>
            <div id="chart"></div>
        </Wrapper>
    );


}

export default Dashboard;
