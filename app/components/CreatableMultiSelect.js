import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

export default function CreatableMultiSelect() {
  // get usergroups for usergroup dropdown list

  const [useroptions, setUserOptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/usergroups", {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        let user = {
          value: res.data.username,
          label: res.data.username,
        };
        let userArr = [];
        userArr.push(user);
        console.log(userArr);
        setUserOptions(userArr);
      })
      .catch((err) => console.log(err));
  }, []);

  return <CreatableSelect isMulti options={useroptions} />;
}
