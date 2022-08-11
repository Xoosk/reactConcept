import axios from "axios";
import { useEffect, useState } from "react";
import "./styles.css";

// https://randomuser.me/api/?results=20

export default function App() {
  const [user, setUser] = useState([]);
  const [order, setOrder] = useState("asc");
  const [inputValue, setInputValue] = useState();
  const [tableData1, setTableData1] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  useEffect(() => {
    console.log("componentdidmount");
    fetchdata().then((res) => setUser(res.data.results));
    getLocation();
  }, []);

  useEffect(() => {
    // console.log("useEffect");
    if (tableData.length < 1 || tableHeader.length < 1) getLocation();
  }, [tableData, tableHeader]);

  const fetchdata = () => {
    return axios.get("https://randomuser.me/api/?results=20");
  };

  const getLocation = () => {
    let locArr = [];
    user.map((data, i) => {
      let rowData = {};
      locArr.push(flattenArr(data.location, rowData));
    });
    // console.log(locArr);
    let formattedData = [];
    locArr.map((el) => formattedData.push(Object.values(el)));
    setTableData(formattedData);
    setTableData1(formattedData);
    // console.log(formattedData);
    if (locArr[0]) {
      // console.log("keys ", Object.keys(locArr[0]));
      setTableHeader(Object.keys(locArr[0]));
    }
  };

  const flattenArr = (item, rowData) => {
    for (const el in item) {
      if (typeof item[el] !== "object") {
        rowData[el] = item[el];
      }
      if (typeof item[el] === "object") {
        flattenArr(item[el], rowData);
      }
    }
    return rowData;
  };

  const sortData = (field) => {
    console.log(field);

    let formattedData = [...tableData];
    let idx = tableHeader.map((el, i) => {
      return el === field ? i : -1;
    });
    idx = idx.sort()[idx.length - 1];
    if (order === "asc")
      formattedData.sort((a, b) => {
        return a[idx] > b[idx] ? 1 : -1;
      });
    else if (order === "des")
      formattedData.sort((a, b) => {
        return a[idx] > b[idx] ? -1 : 1;
      });
    else {
      formattedData = [...tableData1];
    }
    setOrder(!order);
    order === "asc"
      ? setOrder("des")
      : order === "des"
      ? setOrder("unsort")
      : setOrder("asc");

    setTableData(formattedData);
    console.log(tableData);
  };

  const searchTableData = (data) => {
    console.log(tableData1);
    const newTableData = [...tableData1];
    const filteredTableData = [];
    for (let row of newTableData) {
      for (let val of row) {
        if (val.toString().toLowerCase().includes(data)) {
          console.log(val);
          filteredTableData.push(row);
          break;
        }
        // if (val == data) console.log(val);
      }
    }
    setTableData(filteredTableData);
    console.log(filteredTableData);
  };

  return (
    <div className="App">
      <label>
        Enter text to search{"   "}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            searchTableData(e.target.value);
          }}
        ></input>
        <br />
        <br />
      </label>
      <table style={{ width: 500 }}>
        <thead style={{ fontWeight: 600 }}>
          <tr key={1}>
            {tableHeader.map((el, i) => (
              <td key={i} id={el} onClick={(e) => sortData(e.target.id)}>
                {el}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i}>
              {row.map((el, j) => (
                <td key={j}>{el}</td>
              ))}
            </tr>
          ))}
          {/* {tableData.map((row) => (
            <tr>
            {row.map((el)=>{
              <td>{el}</td>
            })}
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}
