import React, { useEffect, useState, useContext } from "react";import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

export default function SingleSelect({
  setFieldValue,
  values,
  fieldName,
  defaultValue,
}) {
  const [useroptions, setUserOptions] = useState();

  ////////////////////////////////////////////////////////
  /* Triggered when you select an option. 
  param selectedValue is the option selected, which comes in the form {value: "a", label;"a"}, field value is string
  */
  ///////////////////////////////////////////////////////////
  const onChangeHandler = (selectedValues) => {
    setFieldValue(fieldName, selectedValues.value);
  };

  //////////////////////////////////////////////////////
  // Takes in {value: "a", label;"a"}
  //////////////////////////////////////////////////////
  const getValue = () => {
    let fieldVal = "";

    if (useroptions) {
      console.log("getVal values[fieldName]", values[fieldName]);
      fieldVal = useroptions.filter((option) => {
        return option.value === values[fieldName];
      });
      // faulty default value that doesn't register value when submit
      //if (values[fieldName] !== "") {
      // fieldVal = useroptions.filter((option) => {
      //   return option.value === values[fieldName];
      // });
      // } else {
      //   fieldVal = defaultValue;
      // }
    }
    return fieldVal;
  };

  // Fetch usergroups to populate as options
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:8080/plans", {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        let usergrpArr = [];

        res.data.forEach((user) => {
          let usergrpObj = {
            value: user.usergroup,
            label: user.usergroup,
          };
          usergrpArr.push(usergrpObj);
        });
        setUserOptions(usergrpArr);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to retrieve usergroups, " + err?.response?.data);
      });
  }, []);

  return (
    <Select
      options={useroptions}
      value={getValue()}
      onChange={onChangeHandler}
      // defaultValue={defaultValue}
    />
  );
}
