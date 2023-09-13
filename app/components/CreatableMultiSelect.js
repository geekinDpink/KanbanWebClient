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
        let usergrpArr = [];

        res.data.map((user) => {
          let usergrpObj = {
            value: user.usergroup,
            label: user.usergroup,
          };
          usergrpArr.push(usergrpObj);
        });
        setUserOptions(usergrpArr);
      })
      .catch((err) => console.log(err));
  }, []);

  return <CreatableSelect isMulti options={useroptions} />;
}
