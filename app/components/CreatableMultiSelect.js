import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

export default function CreatableMultiSelect({ setFieldValue, values }) {
  // get usergroups for usergroup dropdown list

  const [useroptions, setUserOptions] = useState([]);

  ////////////////////////////////////////////////////////
  /* When select an option -> add on to whatever existing options
  onChangeHandler is triggered when you select an option. 
  It will take in params of whatever options that is selected (*but not save to field value), including the option you select e.g. [{value:”abc”, label:”cde”}].
  Update the field value */
  ///////////////////////////////////////////////////////////
  const onChangeHandler = (selectedValues) => {
    const fieldValArr = selectedValues.map((item) => item.value);
    setFieldValue("usergroup", fieldValArr);
    console.log("values", values);
    console.log("selectedValues", selectedValues);
  };

  // Get options that are selected
  const getValue = () => {
    if (useroptions) {
      const selectedOptions = useroptions.filter((option) => {
        // console.log("***********************");
        // console.log("option", option);
        // console.log("values.usergroup", values.usergroup);
        return values.usergroup.indexOf(option.value) >= 0;
      });

      // console.log("selectedOptions", selectedOptions);
      return selectedOptions;
    }
  };

  // Fetch usergroups to populate as options
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

  return (
    <CreatableSelect
      isMulti
      options={useroptions}
      onChange={onChangeHandler}
      value={getValue()}
    />
  );
}
