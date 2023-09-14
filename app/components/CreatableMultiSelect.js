import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

export default function CreatableMultiSelect({ setFieldValue, values }) {
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
  };

  //////////////////////////////////////////////////////
  // On render/re-render e.g. onChangeHandler
  // Convert the value in arr [“abc”] to object based on options [{value:”abc”, label:”cde”}]
  //////////////////////////////////////////////////////
  const getValue = () => {
    const selectedOptions = [];
    if (useroptions && values.usergroup instanceof Array) {
      const hashmap = {};

      useroptions.forEach((opt) => {
        if (!hashmap[opt.value]) {
          hashmap[opt.value] = opt.label;
        }
      });
      console.log(hashmap);
      values.usergroup.forEach((val) => {
        if (hashmap[val]) {
          selectedOptions.push({ value: val, label: hashmap[val] });
        } else {
          console.log("val", val);
          selectedOptions.push({ value: val, label: val });
          addNewUserGroup(val);
        }
      });
      console.log(selectedOptions);
      // const selectedOptions = useroptions.map((option) => {
      //   // console.log("***********************");
      //   // console.log("option", option);
      //   // console.log("values.usergroup", values.usergroup);
      //   return values.usergroup.indexOf(option.value) >= 0;
      // });
    }
    // TODO no options error
    return selectedOptions;
  };

  const addNewUserGroup = async (newUserGroup) => {
    const token = localStorage.getItem("token");

    try {
      console.log("try");
      const res = await axios.post(
        "http://localhost:8080/usergroups",
        { usergroup: newUserGroup },
        {
          headers: { Authorization: `Basic ${token}` },
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
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
      // onCreateOption={addNewUserGroup}
      value={getValue()}
    />
  );
}