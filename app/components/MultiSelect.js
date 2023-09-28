import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import StateContext from "../../Context/StateContext";

export default function MultiSelect({
  setFieldValue,
  values,
  fieldName,
  defaultValue,
}) {
  const [useroptions, setUserOptions] = useState([]);
  const redState = useContext(StateContext);

  ////////////////////////////////////////////////////////
  /* When select an option -> add on to whatever existing options
  onChangeHandler is triggered when you select an option. 
  It will take in params of whatever options that is selected (*but not save to field value), including the option you select e.g. [{value:”abc”, label:”cde”}].
  Update the field value */
  ///////////////////////////////////////////////////////////
  const onChangeHandler = (selectedValues) => {
    console.log("here");
    const fieldValArr = selectedValues.map((item) => {
      console.log("selected options", item);

      return item.value;
    });
    setFieldValue(fieldName, fieldValArr);
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
      isMulti
      options={useroptions}
      onChange={onChangeHandler}
      defaultValue={defaultValue.value}
      value={getValue()}
    />
  );
}
