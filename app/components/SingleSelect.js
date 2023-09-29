import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import StateContext from "../../Context/StateContext";

export default function SingleSelect({
  setFieldValue,
  values,
  fieldName,
  defaultValue,
}) {
  const [useroptions, setUserOptions] = useState();
  const redState = useContext(StateContext);

  ////////////////////////////////////////////////////////
  /* When select an option -> add on to whatever existing options
  onChangeHandler is triggered when you select an option. 
  It will take in params of whatever options that is selected (*but not save to field value), including the option you select e.g. [{value:”abc”, label:”cde”}].
  Update the field value */
  ///////////////////////////////////////////////////////////
  const onChangeHandler = (selectedValues) => {
    console.log(
      `selectedValues ${JSON.stringify(selectedValues)} fieldName ${fieldName}`
    );
    setFieldValue(fieldName, selectedValues.value);
  };

  //////////////////////////////////////////////////////
  // On render/re-render e.g. onChangeHandler
  // Convert the value in arr [“abc”] to object based on options [{value:”abc”, label:”cde”}]
  //////////////////////////////////////////////////////
  const getValue = () => {
    const selectedOptions = [];
    if (useroptions && values[fieldName] instanceof Array) {
      const hashmap = {};

      useroptions.forEach((opt) => {
        if (!hashmap[opt.value]) {
          hashmap[opt.value] = opt.label;
        }
      });
      values[fieldName].forEach((val) => {
        if (hashmap[val]) {
          selectedOptions.push({ value: val, label: hashmap[val] });
        } else {
          // console.log("val", val);

          selectedOptions.push({ value: val, label: val });
        }
      });
    }
    return selectedOptions;
  };

  const getValue2 = () => {
    let fieldVal = "";

    if (useroptions) {
      console.log("getVal values[fieldName]", values[fieldName]);
      fieldVal = useroptions.filter((option) => {
        return option.value === values[fieldName];
      });
    }
    return fieldVal;
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
      value={getValue2()}
      onChange={onChangeHandler}
      defaultValue={defaultValue.value}
      // value={() => {
      //   return useroptions
      //     ? useroptions.find((option) => option.value === values[fieldName])
      //     : "";
      // }}
    />
  );
}
