import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

export default function SingleSelectPlan({
  setFieldValue,
  values,
  fieldName,
  App_Acronym,
  defaultValue,
}) {
  const [planOptions, setPlanOptions] = useState();

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

    if (planOptions) {
      console.log("getVal values[fieldName]", values[fieldName]);
      fieldVal = planOptions.filter((option) => {
        return option.value === values[fieldName];
      });
      // faulty default value that doesn't register value when submit
      //if (values[fieldName] !== "") {
      // fieldVal = setPlanOptions.filter((option) => {
      //   return option.value === values[fieldName];
      // });
      // } else {
      //   fieldVal = defaultValue;
      // }
    }
    return fieldVal;
  };

  // Fetch plan name to populate as options
  useEffect(() => {
    const token = localStorage.getItem("token");
    const params = { Plan_app_Acronym: App_Acronym };

    axios
      .post("http://localhost:8080/plans", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        console.log("plans res", res);
        let planArr = [];

        res.data.forEach((plan) => {
          let planObj = {
            value: plan.Plan_MVP_name,
            label: plan.Plan_MVP_name,
          };
          planArr.push(planObj);
        });
        setPlanOptions(planArr);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to retrieve usergroups, " + err?.response?.data);
      });
  }, []);

  return (
    <Select
      options={planOptions}
      value={getValue()}
      onChange={onChangeHandler}
      // defaultValue={defaultValue}
    />
  );
}
