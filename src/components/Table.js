import React, { useEffect, useState } from "react";
import { sortData } from "../utils";
import "./styles/Table.css";
function Table({ countries, column = "cases" }) {
  const [sortedCountries, setSortedCountries] = useState([]);
  useEffect(() => {
    const sorted = sortData(countries, column);
    setSortedCountries(sorted);
  }, [countries]);
  return (
    <div className="table">
      {sortedCountries?.map((country) => (
        <tr key={country.country}>
          <td>{country.country}</td>
          <td>
            <strong>{country[column]}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
