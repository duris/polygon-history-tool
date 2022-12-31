import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [startState, setStartState] = useState({
    date: 20221215,
    hour: 0,
    min: 0,
    sec: 0,
    timeofday: 'AM',
  })

  const [endDate, setEndDate] = useState({
    date: 20221215,
    hour: 0,
    min: 0,
    sec: 0,
    timeofday: 'AM',
  })

  const [mainTicker, setMainTicker] = useState('')

  const [stockData, setStockData] = useState({
    ticker: 'AMAM',
    start: 1671219000000000000,
    end: 1671219000000000000,
    trades: {results:''}
  })

  

  // useEffect(() => {
    
  //   const getData = async () => {
  //     const response = await fetch('https://api.polygon.io/v3/trades/AMAM?timestamp=2022-12-15&order=desc&limit=50000&sort=timestamp&apiKey=5c_YkQFuVWi6SQeNppNP2pF5SK22VcAV')
  //     const data = await response.json()
  //     const {trades, ...rest} = stockData
  //     // setStockData({trades: data, ...rest})
  //     console.log(stockData.ticker)
  //   }
  //   getData()

  // },[])


  useEffect(() => {

    
    const {start, end, ...rest} = stockData
    
    
    let selectedDate = new Date(startState.date)    
    let endingDate = new Date(endDate.date)
    endingDate.setDate(selectedDate.getDate() + 1)
    selectedDate.setDate(selectedDate.getDate() + 1)
    let hours = Number(startState.hour)
    let endingHours = Number(endDate.hour)
    if(endDate.timeofday === "PM" && endingHours<12){
      endingHours += 12
    }
    if(startState.timeofday === "PM" && hours<12){
      hours += 12
    }
    endingDate.setHours(endingHours)
    endingDate.setMinutes(endDate.min)
    endingDate.setSeconds(endDate.sec)
    selectedDate.setHours(hours)
    selectedDate.setMinutes(startState.min)
    selectedDate.setSeconds(startState.sec)
    
    // setMainTicker(stockData.ticker)
    setStockData({start: selectedDate.getTime() * 1000000, end: endingDate.getTime() * 1000000, ...rest})

    console.log(stockData.ticker)

  }, [startState, endDate])


  const getFilteredData = async (ticker, start, end) => {
    const response = await fetch(`https://api.polygon.io/v3/trades/${ticker}?timestamp.gt=${start}&timestamp.lt=${end}&order=asc&limit=50000&sort=timestamp&apiKey=5c_YkQFuVWi6SQeNppNP2pF5SK22VcAV`)
    const data = await response.json()
    const {trades, ...rest} = stockData
    setStockData({trades: data, ...rest})    
    console.log(data)
  }



  
  // const getStockData = async () => {
  //   const response = await fetch('https://api.polygon.io/v3/trades/AMAM?timestamp=2022-12-15&order=desc&limit=50000&sort=timestamp&apiKey=5c_YkQFuVWi6SQeNppNP2pF5SK22VcAV')
  //   const data = await response.json()
  //   return(data)
  // }


  
  
  let begin = 0
  let end = 0

  const getCurrentTimestamp = () => {
    // Try to re-create 1671134420284223000
    //                  1671049498939223000
    //                  1671049642380223000
    const date = Date.now()
    const yesteryDay = new Date(date)
    yesteryDay.setDate(yesteryDay.getDate() - 1)
    yesteryDay.setMinutes(yesteryDay.getMinutes()-60)
    const yesteryDayMinusFifteenMin = new Date(yesteryDay)
    yesteryDayMinusFifteenMin.setMinutes(yesteryDay.getMinutes() - 15)
    end = yesteryDay.getTime()*1000000
    begin = yesteryDayMinusFifteenMin.getTime()*1000000
    // console.log(yesteryDay.getTime()*1000000, yesteryDayMinusFifteenMin.getTime()*1000000)

  }

  // getCurrentTimestamp()
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const handleSubmit = (e) => {
    e.preventDefault()


    console.log(stockData.start, stockData.end, stockData.ticker)
    getFilteredData(stockData.ticker, stockData.start, stockData.end)

  }

  const results = stockData.trades.results

  console.log(results.length)

  if(results.length === 50000){
    console.log('Call API Again')
  } 

  const playTimestamps = (timestamps) => {
    for (let i = 1; i < timestamps.length; i++) {
      const timeout = timestamps[i] - timestamps[i - 1];
      setTimeout(() => {
        console.log(timestamps[i])
      }, timeout);
    }
  };
  
  const timestamps = [
    1500000000000,
    1500000010000,
    1500000020000,
    1500000030000,
    1500000032000,
    1500000034000,
    1500000036000,
  ];

  const TimestampPlayer = () => {
    useEffect(() => {
      
      playTimestamps(timestamps);
    }, [timestamps]);
  
    return <div>Playing back timestamps...</div>;
  };

  const convertTimestamp = (ts) => {

    
    const getDate = new Date(ts/1000000)
    // console.log(ts/1000000)
    let secString = ''
    if(getDate.getSeconds() < 10){
      secString = '0'+getDate.getSeconds()
    }
    let timeString =  `${getDate.getHours()}:${getDate.getMinutes()}:${secString.length===0?getDate.getSeconds():secString}:${getDate.getMilliseconds()}`
    return(
      <div>
        {timeString}
      </div>
    )
  }


  const downloadFile = () => {
    const myData = {data: 'hello marry'}// I am assuming that "this.state.myData"
                                   // is an object and I wrote it to file as
                                   // json
  
    // create file in browser
    const fileName = stockData.ticker;
    const json = JSON.stringify(stockData.trades, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
  
    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
  
    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  return (
    <div className="App">
      <button onClick={downloadFile}>Download file</button>
      <form>
        <input type="text" id="ticker" placeholder='Ticker' onChange={(e) => {
          const {ticker, ...rest} = stockData
          
          setStockData({ticker:e.target.value, ...rest})
          // setMainTicker(e.target.value)/
        }} />
        <div className='selectorWrap'>
        <div>
        <label>Start</label>
        <input type="date" id="startdate" onChange={(e) => {
          const {date, ...rest} = startState
          setStartState({date:e.target.value, ...rest})
        }}/>             
        <br/>
        <label>Hour</label>
        <input className='hms' type="number" id="hour" onChange={(e) => {
          const {hour, timeofday, ...rest} = startState
          setStartState({hour:e.target.value, ...rest})
          
        }}/>
        <br/>

        <label>Min</label>
        <input className='hms' type="number" id="min" onChange={(e) => {
          const {min, ...rest} = startState         
          setStartState({min:e.target.value, ...rest})
        }}/>
        <br/>

        <label>Sec</label>
        <input className='hms' type="number" id="sec" onChange={(e) => {
          const {sec, ...rest} = startState
          setStartState({sec:e.target.value, ...rest})
        }}/>
        
        <select name="timeofday" id="timeofday" onChange={(e) => {
          const {timeofday, ...rest} = startState
          setStartState({timeofday:e.target.value, ...rest})
        }}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>     
        </select>
        </div>
        <div className=''>
          <label htmlFor="enddate">End</label>
          <input type="date" id="enddate" onChange={(e) => {
            const {date, ...rest} = endDate
            setEndDate({date:e.target.value, ...rest})
          }}/>     
        <br/>
          
          <label>Hour</label>
          <input className='hms' max={12} min={1} type="number" id="hour" onChange={(e) => {
            const {hour, ...rest} = endDate
            setEndDate({hour:e.target.value, ...rest})
          }}/>
        <br/>

          <label>Min</label>
          <input className='hms' type="number" id="min" onChange={(e) => {
            const {min, ...rest} = endDate         
            setEndDate({min:e.target.value, ...rest})
          }}/>
        <br/>

          <label>Sec</label>
          <input className='hms' type="number" id="sec" onChange={(e) => {
            const {sec, ...rest} = endDate
            setEndDate({sec:e.target.value, ...rest})
          }}/>
        
          
          <select name="timeofday" id="timeofday" onChange={(e) => {
            const {timeofday, ...rest} = endDate
            setEndDate({timeofday:e.target.value, ...rest})
          }}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>     
          </select>
        </div>
        </div>
        <button onClick={handleSubmit}>Get Trades</button>
      </form>
      <div className='resultsCount'>
      {stockData.trades.results.length + ' Trades'}
      </div>
      <div className='tradeBox'>
      {/* {results.length>0?
      results.map((entry) => 
        <div key={entry.sequence_number} className='resultEntry'>
          <div>${entry.price}</div>
          <div>{convertTimestamp(entry.sip_timestamp)}</div>
        </div>
      ):<div>Loading...</div>} */}
      {/* <TimestampPlayer/> */}
      </div>
    </div>
  );
}

export default App;
