import React, { useEffect, useState, useContext } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { toast } from "react-toastify";
import StateContext from "../../Context/StateContext";

export default function CreatableMultiSelect({ setFieldValue, values }) {
  const [useroptions, setUserOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const redState = useContext(StateContext);

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
    if (
      isLoading === false &&
      useroptions &&
      values.usergroup instanceof Array
    ) {
      const hashmap = {};

      useroptions.forEach((opt) => {
        if (!hashmap[opt.value]) {
          hashmap[opt.value] = opt.label;
        }
      });
      values.usergroup.forEach((val) => {
        if (hashmap[val]) {
          selectedOptions.push({ value: val, label: hashmap[val] });
        } else {
          // console.log("val", val);
          if (val !== "") {
            selectedOptions.push({ value: val, label: val });
            if (redState.isAdmin) {
              addNewUserGroup(val);
            }
          }
        }
      });
    }
    return selectedOptions;
  };

  const addNewUserGroup = async (newUserGroup) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:8080/usergroups",
        { usergroup: newUserGroup },
        {
          headers: { Authorization: `Basic ${token}` },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(
        "Unable to create new usergroup222, " + error?.response?.data
      );
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

        res.data.forEach((user) => {
          let usergrpObj = {
            value: user.usergroup,
            label: user.usergroup,
          };
          usergrpArr.push(usergrpObj);
        });
        setUserOptions(usergrpArr);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to retrieve usergroups, " + err?.response?.data);
      });
  }, []);

  return (
    <CreatableSelect
      isMulti
      isDisabled={!redState.isAdmin}
      options={useroptions}
      onChange={onChangeHandler}
      // onCreateOption={addNewUserGroup}
      value={getValue()}
      isLoading={isLoading} // not necessarily
    />
  );
}
