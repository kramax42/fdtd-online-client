import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ArgumentAxis, ValueAxis, Chart, LineSeries } from '@devexpress/dx-react-chart-material-ui';

import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import { Button, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import { DataChartType } from 'types/lab1';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: '1rem',
  },
  condition: {
    width: '100%',
  },
  paper: {
    margin: '1rem',
    padding: '1rem',
  },
  title: {
    textAlign: 'center',
    width: '100%',
  },
}));

export default function Lab1() {
  const classes = useStyles();

  const [tau, setTau] = useState<number>(10);
  const [lambda, setLambda] = useState<number>(1);
  const [n1, setN1] = useState<number>(1);

  const [step, setStep] = useState<number>(0);
  const [simulation, setSimulation] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);

  const [dataChart, setDataChart] = useState<DataChartType>([]);

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const eventSource = new EventSource(`http://localhost:5000/connect`);

    eventSource.onopen = function () {
      console.log('Event: open');
    };

    eventSource.onerror = function () {
      console.log('Event: error');
    };

    setPause(false);
    setSimulation(true);

    eventSource.onmessage = function (event) {
      let { dataX, dataY, step, col } = JSON.parse(event.data);

      setStep(step || 0);

      let tmpDataChart = [];
      for (let j = 0; j < col; j++) {
        tmpDataChart.push({
          argument: dataX[j],
          value: dataY[j],
        });
      }
      setDataChart(tmpDataChart);
      setStep((step) => step + 1);
    };
  };

  const sendConditions = (reload = true) => {
    setPause(false);
    (async function () {
      await axios.post('http://localhost:5000/nextLayer', {
        lambda,
        tau,
        n1,
        reload,
        type: '2D',
      });
    })();
  };

  const pauseDataReceiving = () => {
    (async function () {
      await axios.get('http://localhost:5000/pause/lab1');
    })();
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container justify="space-between">
            <TextField
              value={lambda}
              label="Длина волны, мкм"
              variant="outlined"
              onChange={(e) => setLambda(+e.target.value)}
            />
            <TextField
              label="Показатель преломления"
              variant="outlined"
              value={n1}
              onChange={(e) => setN1(+e.target.value)}
            />
            <TextField
              label="Длительн. импульса, фс"
              variant="outlined"
              value={tau}
              onChange={(e) => setTau(+e.target.value)}
            />
            <Button
              onClick={async (e) => {
                e.preventDefault();
                if (simulation) {
                  if (!pause) {
                    pauseDataReceiving();
                  } else {
                    sendConditions(false);
                  }
                  setPause((pause) => !pause);
                }
              }}
              variant="contained"
              color="primary"
            >
              {pause ? 'Продолжить' : 'Пауза'}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                sendConditions();
              }}
              variant="contained"
              color="primary"
            >
              СТАРТ
            </Button>
            <TextField
              label="Номер шага"
              value={step}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Chart data={dataChart}>
            <ArgumentAxis />
            <ValueAxis />
            <LineSeries valueField="value" argumentField="argument" />
          </Chart>
        </Paper>
      </div>
    </React.Fragment>
  );
}